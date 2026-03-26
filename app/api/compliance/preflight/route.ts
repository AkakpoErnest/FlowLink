import { NextResponse } from 'next/server'

// Stub endpoint — returns a passing compliance preflight check.
// Replace with real KYC / sanctions logic before going to production.
export async function GET() {
  return NextResponse.json({ kycOk: true, sanctionsChecked: true }, { status: 200 })
}
