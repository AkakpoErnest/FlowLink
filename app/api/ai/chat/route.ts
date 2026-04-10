import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { z } from 'zod'

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

const systemPrompt = `You are FlowLink's AI assistant for crypto compliance payments on HashKey Chain.

FlowLink specializes in:
- Compliant crypto payments with built-in KYC/AML screening
- Instant payment links with QR codes
- Compliance vaults with programmable policies
- Payroll automation for crypto payments
- AI agents that autonomously pay each other and humans on HashKey Chain (agent-to-agent, agent-to-human)
- HashKey Chain integration — a regulated blockchain for institutional finance

Platform facts:
- Built on HashKey Chain Testnet (Chain ID: 133)
- Real-time sanctions screening against OFAC, UN, and EU lists
- Compliance status tracked per payment (KYC passed, sanctions checked)
- Each AI agent has its own embedded wallet derived via BIP-44 from the master key

PAYMENT INTENT DETECTION:
When a user requests a payment (e.g. "pay 10 USDC to 0x...", "agent pay John", "send 5 HSK to agent B", "have agent X pay agent Y"), extract the payment details and respond ONLY with valid JSON:
{"action":"agent_payment","amount":<number>,"token":"<HSK|USDC|USDT>","toAddress":"<0x... or null>","toAgentName":"<agent name or null>","paymentType":"<agent-to-human|agent-to-agent>","memo":"<optional memo>"}

For all other questions, respond normally as a helpful compliance assistant. Keep responses concise but comprehensive. For specific legal advice, recommend consulting their compliance team.`

async function askClaude(message: string, history: { role: string; content: string }[]) {
  const client = new Anthropic()
  const messages = [
    ...(history?.map((msg: { role: string; content: string }) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content,
    })) ?? []),
    { role: 'user' as const, content: message },
  ]

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude')
  return block.text
}

async function askOllama(message: string, history: { role: string; content: string }[]) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })) ?? []),
    { role: 'user', content: message },
  ]

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.7, num_predict: 1000 },
    }),
  })

  if (!res.ok) throw new Error(`Ollama returned ${res.status}`)

  const data = await res.json()
  const reply = data.message?.content
  if (!reply) throw new Error('Empty response from Ollama')
  return reply
}

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(4000, 'Message too long'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(4000),
    })
  ).max(50).optional(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = chatSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { message, history } = parsed.data
    let reply: string

    if (process.env.ANTHROPIC_API_KEY) {
      reply = await askClaude(message, history ?? [])
    } else {
      reply = await askOllama(message, history ?? [])
    }

    return NextResponse.json({ message: reply })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
