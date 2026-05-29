export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { generateNonce } from "siwe"

export async function GET() {
  const nonce = generateNonce()
  const res = NextResponse.json({ nonce })
  // Bind the nonce to this browser so the SIWE signature can be checked against a
  // server-issued, time-limited value (defeats signature replay). httpOnly so JS
  // can't read it; the SIWE message still carries the same nonce for siwe.verify().
  res.cookies.set("siwe-nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  })
  return res
}
