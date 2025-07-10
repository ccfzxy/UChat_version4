'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, Bot, User, Loader, MessageCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  provider?: string
  model?: string
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  sessionId: string | null
  isConnected: boolean
}

const ChatPage = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    sessionId: null,
    isConnected: false
  })
  const [inputValue, setInputValue] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  const initializeChat = async () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'system',
      content: '您好！我是澳門旅遊大學的學生助理Rose 🌹。我可以幫您解答關於大學手冊、課程規定、評估方法、學術誠信等各種問題。請問有什麼可以幫到您呢？',
      timestamp: new Date(),
      provider: 'system',
      model: 'welcome'
    }

    setChatState(prev => ({
      ...prev,
      messages: [welcomeMessage],
      isConnected: true
    }))
    
    setConnectionStatus('connected')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatState.isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }))

    setInputValue('')

    // Simulate API response for testing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: `您問關於「${userMessage.content}」的問題。這是一個測試回應。請檢查API連接是否正常工作。`,
        timestamp: new Date(),
        provider: 'test',
        model: 'test-model'
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageStyles = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'ml-auto max-w-[80%] bg-blue-100'
      case 'assistant':
        return 'mr-auto max-w-[80%] bg-white'
      case 'system':
        return 'mx-auto max-w-[90%] bg-blue-50 border-l-4 border-blue-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-700 hover:text-blue-500">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-blue-700 text-xl font-bold">
                🎓 澳門旅遊大學助理 - Rose
              </h1>
              <p className="text-blue-500 text-sm">課程手冊智能助理</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>線上</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatState.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`p-4 rounded-2xl shadow-sm ${getMessageStyles(message.type)}`}>
                  <div className="text-gray-800">{message.content}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {chatState.isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-gray-600">Rose 正在思考中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white/95">
            <div className="flex items-end gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="在此輸入您關於大學規定的問題..."
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                disabled={chatState.isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatState.isLoading}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage