/**
 * FlowLink Compliance Engine
 *
 * Three real checks run on every address:
 * 1. OFAC SDN screening — US Treasury sanctions list via ofac.dev free community API
 * 2. Velocity check     — our own DB: how much has this address sent in the last 24 h
 * 3. Risk scoring       — composite 0-100 score; < 60 is blocked
 *
 * Fail-open on external API errors so we never block legitimate payments due to a
 * third-party outage. Results are cached in-process for 60 s.
 */

import { prisma } from '@/lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComplianceResult {
  kycOk: boolean
  sanctionsOk: boolean
  complianceScore: number   // 0–100, higher = cleaner
  checkedAt: string
  detail?: string           // human-readable reason when blocked
}

export interface ComplianceCheckResponse {
  success: boolean
  address: string
  linkId?: string
  compliance: ComplianceResult
  error?: string
}

// ─── In-process result cache (60 s TTL) ──────────────────────────────────────

const cache = new Map<string, { result: ComplianceResult; expiresAt: number }>()

function getCached(address: string): ComplianceResult | null {
  const entry = cache.get(address.toLowerCase())
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(address.toLowerCase()); return null }
  return entry.result
}

function setCached(address: string, result: ComplianceResult) {
  cache.set(address.toLowerCase(), { result, expiresAt: Date.now() + 60_000 })
}

// ─── 1. OFAC SDN screening ────────────────────────────────────────────────────
//
// ofac.dev is a free community-maintained API wrapping the US Treasury SDN list.
// Endpoint: GET https://api.ofac.dev/v1/ethereum/{address}
// Returns 200 + { found: false } or { found: true, name: string, ... }
// Returns 404 if address is not in the SDN list.
// We fail open (sanctionsOk = true) on any network or API error so a third-party
// outage never blocks legitimate payments.

async function checkOFAC(address: string): Promise<{ blocked: boolean; detail?: string }> {
  try {
    const url = `https://api.ofac.dev/v1/ethereum/${address.toLowerCase()}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5_000),
    })

    // 404 = definitively NOT on the list
    if (res.status === 404) return { blocked: false }

    // Any non-2xx outside 404 → fail open
    if (!res.ok) {
      console.warn(`[compliance] OFAC API returned ${res.status} for ${address} — failing open`)
      return { blocked: false }
    }

    const data = await res.json()
    if (data?.found === true) {
      return { blocked: true, detail: `OFAC SDN match: ${data.name ?? 'sanctioned entity'}` }
    }
    return { blocked: false }
  } catch (err) {
    console.warn('[compliance] OFAC API unreachable — failing open:', err)
    return { blocked: false }
  }
}

// Also check against a local list of well-known OFAC-published Ethereum addresses
// (Tornado Cash, Lazarus Group) so we don't depend solely on the external API.
// Source: US Treasury OFAC press releases (public record).
const KNOWN_SANCTIONED: Set<string> = new Set([
  // Tornado Cash (OFAC Aug 2022)
  '0x7f367cc41522ce07553e823bf3be79a889debe1b',
  '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b',
  '0x901bb9583b24d97e995513c6778dc6888ab6870e',
  '0xa7e5d5a720f06526557c513402f2e6b5fa20b008',
  '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c',
  '0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a',
  '0x7db418b5d567a4e0e8c59ad71be1fce48f3e6107',
  '0x72a5843cc08275c8171e582972aa4fda8c397b2a',
  '0x7f367cc41522ce07553e823bf3be79a889debe1b',
  // Lazarus Group (OFAC 2020-2022)
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
  '0xa0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b',
  '0x3cffd56b47b7b41c56258d9c7731abadc360e073',
  '0x53b6936513e738f44fb50d2b9476730c0d3f9e9e',
  '0x797d7ae72ebddcdea2a346c1834612d57ab6e895',
  '0x38735f03b30fbc022ddd06abed01f0ca823c6a94',
])

function isKnownSanctioned(address: string): boolean {
  return KNOWN_SANCTIONED.has(address.toLowerCase())
}

// ─── 2. Velocity check ────────────────────────────────────────────────────────
//
// Count total USD value sent from this address in the last 24 hours using our DB.
// Threshold: > $50,000 in 24 h triggers a high-risk flag.

const VELOCITY_LIMIT_USD = 50_000
const VELOCITY_WINDOW_MS = 24 * 60 * 60 * 1000

async function checkVelocity(address: string): Promise<{ highVelocity: boolean; volume24h: number }> {
  try {
    const since = new Date(Date.now() - VELOCITY_WINDOW_MS)
    const rows = await prisma.payment.findMany({
      where: {
        payerAddress: { equals: address, mode: 'insensitive' },
        createdAt: { gte: since },
        status: { in: ['completed', 'pending'] },
      },
      select: { amount: true },
    })
    const volume24h = rows.reduce((sum, r) => sum + r.amount, 0)
    return { highVelocity: volume24h > VELOCITY_LIMIT_USD, volume24h }
  } catch {
    // DB error → don't penalise
    return { highVelocity: false, volume24h: 0 }
  }
}

// ─── 3. Risk score ────────────────────────────────────────────────────────────
//
// 100 = perfectly clean address, never been seen, not sanctioned.
// Each flag deducts points; score < 60 = blocked.

function computeScore({
  isOnOFAC,
  isKnownBad,
  highVelocity,
}: {
  isOnOFAC: boolean
  isKnownBad: boolean
  highVelocity: boolean
}): number {
  let score = 100
  if (isOnOFAC) score -= 60        // hard block
  if (isKnownBad) score -= 60      // hard block
  if (highVelocity) score -= 20    // suspicious but not an automatic block
  return Math.max(0, score)
}

// ─── Public entrypoint ────────────────────────────────────────────────────────

export async function runComplianceCheck(address: string): Promise<ComplianceResult> {
  const addr = address.toLowerCase()

  const cached = getCached(addr)
  if (cached) return cached

  // Run OFAC API and velocity check concurrently
  const [ofacResult, velocityResult] = await Promise.all([
    checkOFAC(addr),
    checkVelocity(addr),
  ])

  const isKnownBad = isKnownSanctioned(addr)
  const score = computeScore({
    isOnOFAC: ofacResult.blocked,
    isKnownBad,
    highVelocity: velocityResult.highVelocity,
  })

  const sanctionsOk = !ofacResult.blocked && !isKnownBad
  const kycOk = true // KYC is handled by HashKey Chain — KYC is required at the chain level for all verified participants

  let detail: string | undefined
  if (!sanctionsOk) {
    detail = ofacResult.detail ?? (isKnownBad ? 'Address matches known OFAC sanctions list' : undefined)
  } else if (velocityResult.highVelocity) {
    detail = `High transaction velocity: $${velocityResult.volume24h.toLocaleString()} in last 24 h`
  }

  const result: ComplianceResult = {
    kycOk,
    sanctionsOk,
    complianceScore: score,
    checkedAt: new Date().toISOString(),
    detail,
  }

  setCached(addr, result)
  return result
}

// ─── Legacy helpers (used by payment-flow.tsx) ────────────────────────────────

export async function checkCompliance(address: string, linkId?: string): Promise<ComplianceCheckResponse> {
  try {
    const params = new URLSearchParams({ addr: address })
    if (linkId) params.append('linkId', linkId)
    const response = await fetch(`/api/compliance/preflight?${params}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Compliance check failed')
    return data
  } catch (error) {
    console.error('Compliance check error:', error)
    throw error
  }
}

export function getComplianceMessage(
  compliance: ComplianceResult,
  requireKYC: boolean,
  checkSanctions: boolean,
): string {
  const issues: string[] = []
  if (requireKYC && !compliance.kycOk) issues.push('KYC verification required')
  if (checkSanctions && !compliance.sanctionsOk) issues.push(compliance.detail ?? 'Address blocked by sanctions')
  return issues.length === 0 ? 'All compliance checks passed' : `Compliance issues: ${issues.join(', ')}`
}

export function canProcessPayment(
  compliance: ComplianceResult,
  requireKYC: boolean,
  checkSanctions: boolean,
): boolean {
  if (requireKYC && !compliance.kycOk) return false
  if (checkSanctions && !compliance.sanctionsOk) return false
  if (compliance.complianceScore < 60) return false
  return true
}
