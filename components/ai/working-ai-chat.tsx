'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface WorkingAIChatProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkingAIChat({ isOpen, onClose }: WorkingAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your FlowLink AI assistant. I'm here to help you with:\n\n🚀 **Payment Links** - Create instant crypto payment links with QR codes\n🛡️ **Compliance** - KYC verification and sanctions screening\n🏦 **Smart Vaults** - Deploy compliant vaults with policy rules\n💰 **Payroll** - Automated crypto payroll processing\n🔗 **Multi-chain** - Support for Ethereum, Polygon, Arbitrum, Optimism\n\nI can answer questions about our platform, help you navigate features, and guide you through setting up crypto payments. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('Sending message to AI:', userMessage.content)
      
      // Call Claude API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10)
        }),
      })

      console.log('AI Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('AI API Error:', errorText)
        throw new Error(`Failed to get AI response: ${response.status}`)
      }

      const data = await response.json()
      console.log('AI Response data:', data)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't process that request.",
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I'm having trouble connecting right now. Error: ${error.message}. Please try again in a moment.`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] flex flex-col bg-gradient-to-br from-slate-900/95 to-emerald-950/95 border border-emerald-500/20 backdrop-blur-xl rounded-xl">
        {/* Header */}
        <div className="flex flex-row items-center justify-between space-y-0 pb-4 p-6 border-b border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">FlowLink AI Assistant</h2>
              <p className="text-sm text-emerald-400">Your intelligent crypto payment guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 p-2 rounded-lg transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                    : 'bg-slate-800/50 text-white border border-emerald-500/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">🤖</span>
                  )}
                  {message.role === 'user' && (
                    <span className="text-white mt-0.5 flex-shrink-0">👤</span>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-emerald-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 text-white border border-emerald-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">🤖</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-emerald-500/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about FlowLink..."
              className="flex-1 bg-slate-800/50 border border-emerald-500/20 text-white placeholder:text-gray-400 focus:border-emerald-500 rounded-lg px-3 py-2 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Ask about payment links, compliance, payroll, or anything FlowLink-related
          </p>
        </div>
      </div>
    </div>
  )
}
