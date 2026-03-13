export interface ComplianceResult {
  kycOk: boolean
  sanctionsOk: boolean
  checkedAt: string
}

export interface ComplianceCheckResponse {
  success: boolean
  address: string
  linkId?: string
  compliance: ComplianceResult
  error?: string
}

export async function checkCompliance(address: string, linkId?: string): Promise<ComplianceCheckResponse> {
  try {
    const params = new URLSearchParams({ addr: address })
    if (linkId) {
      params.append("linkId", linkId)
    }

    const response = await fetch(`/api/compliance/preflight?${params}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Compliance check failed")
    }

    return data
  } catch (error) {
    console.error("Compliance check error:", error)
    throw error
  }
}

export function getComplianceMessage(
  compliance: ComplianceResult,
  requireKYC: boolean,
  checkSanctions: boolean,
): string {
  const issues: string[] = []

  if (requireKYC && !compliance.kycOk) {
    issues.push("KYC verification required")
  }

  if (checkSanctions && !compliance.sanctionsOk) {
    issues.push("Address blocked by sanctions")
  }

  if (issues.length === 0) {
    return "All compliance checks passed"
  }

  return `Compliance issues: ${issues.join(", ")}`
}

export function canProcessPayment(compliance: ComplianceResult, requireKYC: boolean, checkSanctions: boolean): boolean {
  if (requireKYC && !compliance.kycOk) return false
  if (checkSanctions && !compliance.sanctionsOk) return false
  return true
}
