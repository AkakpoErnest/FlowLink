import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    // Convert history to Claude format
    const conversationHistory = history?.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })) || []

    // Create system prompt for FlowLink AI assistant
    const systemPrompt = `You are FlowLink AI, a helpful assistant for a crypto payments platform. FlowLink specializes in:

- Compliant crypto payments with built-in KYC verification
- Instant payment links with QR codes
- Smart vaults with customizable policy rules
- Payroll automation for crypto payments
- Multi-chain support (Ethereum, Polygon, etc.)
- Enterprise-grade security and compliance

Key features:
- 99.7% compliance rate with automated screening
- Real-time sanctions screening
- Bank-grade encryption and audit trails
- SOC 2 compliant infrastructure

When users ask questions:
1. Be helpful and informative about crypto payments, compliance, and FlowLink features
2. Provide accurate information about blockchain technology, DeFi, and crypto regulations
3. If asked about specific technical implementation, provide general guidance while noting they should consult with their compliance team
4. Be encouraging about the benefits of compliant crypto payments
5. Keep responses concise but comprehensive
6. If you don't know something specific about FlowLink, say so and offer to help with what you do know

Always maintain a professional, friendly tone that reflects FlowLink's innovative yet compliant approach to crypto payments.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ]
    })

    const aiMessage = response.content[0]
    
    if (aiMessage.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    return NextResponse.json({ 
      message: aiMessage.text 
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    // Handle specific Anthropic API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'AI service authentication failed' }, { status: 500 })
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ error: 'AI service is temporarily unavailable. Please try again in a moment.' }, { status: 429 })
      }
    }

    return NextResponse.json({ 
      error: 'Failed to process your request. Please try again.' 
    }, { status: 500 })
  }
}



