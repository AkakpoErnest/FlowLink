import { NextRequest, NextResponse } from 'next/server'

const MOONSHOT_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

const systemPrompt = `You are FlowLink AI, a helpful assistant for a crypto payments compliance platform. FlowLink specializes in:

- Compliant crypto payments with built-in KYC/AML screening
- Instant payment links with QR codes
- Smart vaults with programmable compliance policies
- Payroll automation for crypto payments
- HashKey Chain integration — a regulated blockchain for institutional finance
- Multi-chain support (Ethereum, Polygon, Arbitrum, and more)

Key facts:
- 99.7% compliance screening accuracy
- Real-time sanctions screening against OFAC, UN, and EU lists
- SOC 2 Type II compliant infrastructure
- Settlements in under 1 second on HashKey Chain

When users ask questions:
1. Be helpful and informative about crypto payments, compliance, and FlowLink features
2. Provide accurate information about blockchain technology and crypto regulations
3. For specific technical or legal advice, recommend they consult their compliance team
4. Keep responses concise but comprehensive
5. If you don't know something specific, say so honestly

Always maintain a professional, friendly tone.`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.MOONSHOT_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history?.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })) ?? []),
      { role: 'user', content: message },
    ]

    const res = await fetch(MOONSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Moonshot API error:', err)
      if (res.status === 401) return NextResponse.json({ error: 'AI service authentication failed' }, { status: 500 })
      if (res.status === 429) return NextResponse.json({ error: 'AI service is temporarily unavailable. Please try again.' }, { status: 429 })
      throw new Error(`Moonshot API returned ${res.status}`)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content

    if (!reply) throw new Error('Empty response from AI')

    return NextResponse.json({ message: reply })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({ error: 'Failed to process your request. Please try again.' }, { status: 500 })
  }
}
