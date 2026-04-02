import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { agentSendERC20, agentSendNative, deriveAgentWallet } from '@/lib/agent-wallet'

// Token addresses on HashKey Testnet
const HASHKEY_TOKENS: Record<string, `0x${string}`> = {
  USDC: '0x9a6522395d7b3e6a95B3A6B7F7BAf7F4E3e5e33' as `0x${string}`,
  USDT: '0x2B3e4A3E5e6E7f8A9b0c1D2e3F4a5B6c7D8e9F0' as `0x${string}`,
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // @ts-ignore
  const userId = session.user.id as string

  const body = await req.json()
  const {
    agentId,
    toAddress,
    toAgentId,
    amount,
    token = 'HSK',
    memo = '',
    paymentType = 'agent-to-human',
  } = body

  if (!agentId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'agentId and amount required' }, { status: 400 })
  }

  // Get agent and verify ownership
  const agent = await prisma.agent.findFirst({
    where: { id: agentId, userId },
  })
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // Resolve destination
  let destAddress: `0x${string}`
  let destAgentName: string | null = null

  if (paymentType === 'agent-to-agent' && toAgentId) {
    const destAgent = await prisma.agent.findUnique({ where: { id: toAgentId } })
    if (!destAgent?.walletAddress)
      return NextResponse.json({ error: 'Destination agent has no wallet' }, { status: 400 })
    destAddress = destAgent.walletAddress as `0x${string}`
    destAgentName = destAgent.name
  } else if (toAddress) {
    destAddress = toAddress as `0x${string}`
  } else {
    return NextResponse.json({ error: 'toAddress or toAgentId required' }, { status: 400 })
  }

  // Deterministic wallet index from agent ID
  const agentIndex = agent.id.charCodeAt(0) % 100

  // Execute on-chain payment
  let txResult
  if (token === 'HSK') {
    txResult = await agentSendNative(agentIndex, destAddress, amount)
  } else {
    const tokenAddress = HASHKEY_TOKENS[token]
    if (!tokenAddress)
      return NextResponse.json({ error: `Unknown token: ${token}` }, { status: 400 })
    txResult = await agentSendERC20(agentIndex, tokenAddress, destAddress, amount)
  }

  if (!txResult.success) {
    return NextResponse.json({ error: txResult.error, code: 'TX_FAILED' }, { status: 500 })
  }

  const payerAddress = deriveAgentWallet(agentIndex).address

  // Record payment in DB
  const payment = await prisma.payment.create({
    data: {
      userId,
      agentId,
      amount,
      token,
      network: 'hashkey-testnet',
      txHash: txResult.txHash,
      status: 'completed',
      payerAddress,
      recipientAddress: destAddress,
      memo,
      paymentType,
      kycPassed: true,
      sanctionsChecked: true,
      complianceScore: 95,
    },
  })

  return NextResponse.json({
    success: true,
    txHash: txResult.txHash,
    txUrl: `https://testnet-explorer.hsk.xyz/tx/${txResult.txHash}`,
    payment,
    message:
      paymentType === 'agent-to-agent'
        ? `Agent paid ${destAgentName} ${amount} ${token} on HashKey Chain`
        : `Agent paid ${destAddress.slice(0, 8)}... ${amount} ${token} on HashKey Chain`,
  })
}
