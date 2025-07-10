import { NextRequest, NextResponse } from 'next/server'
import { 
  getAIResponse, 
  handbookProcessor, 
  conversationManager, 
  extractRegulationsFromContext,
  generateFallbackResponse,
  createSystemPrompt,
  getHealthStatus,
  type ChatRequest as ServiceChatRequest,
  type ChatResponse as ServiceChatResponse,
  type HandbookItem
} from '@/lib/ai-service'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system' | 'bot'
  content: string
  timestamp: Date
}

interface ChatRequest {
  message: string
  sessionId?: string
  conversationHistory?: ChatMessage[]
  action?: string
  conversation_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, sessionId, conversationHistory = [], action } = body

    console.log('Chat API received:', { action, message: message?.substring(0, 50) })

    // Handle different actions
    switch (action) {
      case 'health':
        return handleHealthCheck()
      
      case 'new-conversation':
        return handleNewConversation()
      
      case 'chat':
      default:
        return handleChatRequest(body)
    }

  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: '抱歉，服務暫時不可用。請稍後再試。',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}

async function handleHealthCheck() {
  try {
    const healthStatus = getHealthStatus()
    
    return NextResponse.json({
      ...healthStatus,
      version: process.env.APP_VERSION || '2024/2025',
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      success: false
    }, { status: 500 })
  }
}

async function handleNewConversation() {
  try {
    const conversationId = conversationManager.createConversation()
    
    return NextResponse.json({
      success: true,
      conversation_id: conversationId,
      message: 'New conversation created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('New conversation error:', error)
    
    return NextResponse.json({
      error: 'Failed to create conversation',
      success: false
    }, { status: 500 })
  }
}

async function handleChatRequest(body: ChatRequest) {
  try {
    const { message, sessionId, conversation_id } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Use provided session ID or create new one
    const currentSessionId = sessionId || conversation_id || conversationManager.createConversation()

    console.log('Processing chat request:', {
      sessionId: currentSessionId,
      messageLength: message.length
    })

    // Search handbook for relevant content
    const handbookContext: HandbookItem[] = handbookProcessor.searchContent(message.trim(), 5)
    
    console.log('Found handbook context:', {
      items: handbookContext.length,
      sections: handbookContext.map(item => item.section)
    })

    try {
      // Try to get AI response
      const aiResponse = await getAIResponse(message.trim(), currentSessionId, handbookContext)
      
      // Extract regulations from context
      const regulations = extractRegulationsFromContext(handbookContext)
      
      console.log('AI response generated successfully')

      return NextResponse.json({
        message: aiResponse,
        conversation_id: currentSessionId,
        regulations,
        faqs: [], // Can be populated later if needed
        provider: 'openai',
        model: 'gpt-4o',
        ai_powered: true,
        success: true,
        timestamp: new Date().toISOString()
      })

    } catch (aiError) {
      console.error('AI service error, using fallback:', aiError)
      
      // Generate fallback response
      const fallbackResponse = generateFallbackResponse(message.trim())
      
      return NextResponse.json({
        message: fallbackResponse,
        conversation_id: currentSessionId,
        regulations: [],
        faqs: [],
        provider: 'local_fallback',
        model: 'handbook_knowledge',
        ai_powered: false,
        success: true,
        fallback: true,
        timestamp: new Date().toISOString(),
        error: 'AI service temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('Chat request error:', error)
    
    return NextResponse.json({
      error: 'Failed to process chat request',
      message: '抱歉，處理您的請求時出現錯誤。請稍後再試。',
      success: false
    }, { status: 500 })
  }
}

// Also handle GET requests for health checks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'health') {
    return handleHealthCheck()
  }

  return NextResponse.json({
    message: 'University Handbook Chat API',
    version: process.env.APP_VERSION || '2024/2025',
    endpoints: {
      'POST /api/chat': 'Send chat messages',
      'GET /api/chat?action=health': 'Health check'
    }
  })
}
