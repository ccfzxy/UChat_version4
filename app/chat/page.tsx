'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface ApiResponse {
  message?: string
  conversation_id?: string
  provider?: string
  model?: string
  ai_powered?: boolean
  fallback?: boolean
  error?: string
  success?: boolean
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initializeChat()
    checkConnection()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  const initializeChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'new-conversation'
        }),
      })

      const data = await response.json()

      if (data.success) {
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
          sessionId: data.conversation_id,
          isConnected: true
        }))
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      const errorMessage: Message = {
        id: 'init_error',
        type: 'system',
        content: '抱歉，聊天服務初始化失敗。請刷新頁面重試，或聯繫技術支援。',
        timestamp: new Date()
      }

      setChatState(prev => ({
        ...prev,
        messages: [errorMessage],
        isConnected: false
      }))
    }
  }

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'health'
        }),
      })

      if (response.ok) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      setConnectionStatus('disconnected')
    }
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

    // Add user message to chat
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }))

    setInputValue('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: chatState.sessionId,
          conversationHistory: chatState.messages.slice(-10) // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: data.message || '抱歉，我暫時無法處理您的請求。請稍後再試。',
        timestamp: new Date(),
        provider: data.provider,
        model: data.model
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        sessionId: data.conversation_id || prev.sessionId
      }))

      // Update connection status based on response
      if (data.ai_powered) {
        setConnectionStatus('connected')
      } else if (data.fallback) {
        setConnectionStatus('disconnected')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'system',
        content: '抱歉，發生了錯誤。請檢查網絡連接並重試。如果問題持續，請聯繫技術支援：8598-2012',
        timestamp: new Date()
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }))

      setConnectionStatus('disconnected')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />
      case 'assistant':
        return <Bot className="w-5 h-5" />
      case 'system':
        return <MessageCircle className="w-5 h-5" />
    }
  }

  const getMessageStyles = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'message-user ml-auto max-w-[80%] bg-gradient-to-br from-blue-100 to-blue-200'
      case 'assistant':
        return 'message-ai mr-auto max-w-[80%] bg-white'
      case 'system':
        return 'message-system mx-auto max-w-[90%] bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500'
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-orange-600'
      case 'checking':
        return 'text-blue-600'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'AI 助理線上'
      case 'disconnected':
        return '離線模式'
      case 'checking':
        return '檢查中...'
    }
  }

  const formatMessageContent = (content: string) => {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/## (.*)/g, '<h3 class="text-lg font-bold text-primary-700 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/📞 (.*)/g, '<span class="flex items-center gap-2 text-blue-600"><span class="text-lg">📞</span>$1</span>')
      .replace(/📧 (.*)/g, '<span class="flex items-center gap-2 text-blue-600"><span class="text-lg">📧</span>$1</span>')
      .replace(/🌐 (.*)/g, '<span class="flex items-center gap-2 text-blue-600"><span class="text-lg">🌐</span>$1</span>')
      .replace(/• (.*)/g, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      {/* Header */}
      <motion.header 
        className="glass border-b border-white/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-primary-700 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-primary-700 text-xl font-bold">
                🎓 澳門旅遊大學助理 - Rose
              </h1>
              <p className="text-primary-500 text-sm">
                課程手冊智能助理
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 text-sm ${getConnectionStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'disconnected' ? 'bg-orange-500' : 'bg-blue-500'
            }`}></div>
            <span>{getConnectionStatusText()}</span>
          </div>
        </div>
      </motion.header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {chatState.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`p-4 rounded-2xl shadow-sm ${getMessageStyles(message.type)}`}>
                    <div className="text-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {message.timestamp.toLocaleTimeString('zh-TW', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.provider && message.provider !== 'system' && (
                        <span className="flex items-center gap-1">
                          {message.provider === 'local_fallback' ? (
                            <AlertCircle className="w-3 h-3 text-orange-500" />
                          ) : (
                            <Bot className="w-3 h-3 text-green-500" />
                          )}
                          <span className="text-xs">
                            {message.provider === 'fastapi' ? 'AI' : 
                             message.provider === 'local_fallback' ? '離線' : 
                             message.provider}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {chatState.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-primary-500" />
                    <span className="text-gray-600">Rose 正在思考中...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div 
            className="border-t border-white/20 p-4 glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="在此輸入您關於大學規定的問題..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none text-base"
                  disabled={chatState.isLoading}
                />
              </div>
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatState.isLoading}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "如何申請課程轉讀？",
                "畢業需要多少學分？",
                "補考有什麼規定？",
                "學費什麼時候繳納？",
                "如何申請宿舍？"
              ].map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-1 text-sm bg-white/50 hover:bg-white/70 text-primary-700 rounded-full transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connection Status Toast */}
      <AnimatePresence>
        {connectionStatus === 'disconnected' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-orange-100 border border-orange-300 text-orange-800 p-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <div className="font-semibold">離線模式</div>
                <div className="text-sm">AI服務暫時不可用，使用基本回應</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatPage`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : message.type === 'assistant'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {getMessageIcon(message.type)}
                  </div>
                  
                  <div className={'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Bot, User, Loader } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  sessionId: string | null
}

const ChatPage = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    sessionId: null
  })
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize chat with welcome message
    initializeChat()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom()
  }, [chatState.messages])

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'system',
      content: '歡迎使用澳門旅遊大學學士學位課程手冊助理！我可以幫助您找到相關的課程信息、規章制度和大學服務。請隨時提問！',
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [welcomeMessage],
      sessionId: generateSessionId()
    }))
  }

  const generateSessionId = (): string => {
    return `utm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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

    // Add user message to chat
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }))

    setInputValue('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: chatState.sessionId,
          conversationHistory: chatState.messages.slice(-10) // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: data.response || '抱歉，我暫時無法處理您的請求。請稍後再試。',
        timestamp: new Date()
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'system',
        content: '抱歉，發生了錯誤。請檢查網絡連接並重試。如果問題持續，請聯繫技術支援。',
        timestamp: new Date()
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />
      case 'assistant':
        return <Bot className="w-5 h-5" />
      case 'system':
        return <Bot className="w-5 h-5" />
    }
  }

  const getMessageStyles = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'message-user ml-auto max-w-[80%]'
      case 'assistant':
        return 'message-ai mr-auto max-w-[80%]'
      case 'system':
        return 'message-system mx-auto max-w-[90%]'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      {/* Header */}
      <motion.header 
        className="glass border-b border-white/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-primary-700 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-primary-700 text-xl font-bold">
                澳門旅遊大學助理
              </h1>
              <p className="text-primary-500 text-sm">
                課程手冊智能助理
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>線上</span>
          </div>
        </div>
      </motion.header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {chatState.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getMessageIcon(message.type)}
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm ${getMessageStyles(message.type)}`}>
                    <div className="text-gray-800 whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {chatState.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-primary-500" />
                    <span className="text-gray-600">正在思考中...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div 
            className="border-t border-white/20 p-4 glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="輸入您的問題..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                  disabled={chatState.isLoading}
                />
              </div>
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatState.isLoading}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
