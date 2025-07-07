import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface ChatRequest {
  message: string
  sessionId?: string
  conversationHistory?: ChatMessage[]
  action?: string
}

interface FastAPIRequest {
  message: string
  system_prompt: string
  conversation_history: Array<{
    timestamp: number
    user: string
    bot: string
  }>
  university_context: Record<string, string>
  session_id: string
}

interface FastAPIResponse {
  response?: string
  message?: string
  provider?: string
  model?: string
  error?: string
  success?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, sessionId, conversationHistory = [], action } = body

    // Handle different actions
    if (action === 'health') {
      return handleHealthCheck()
    }

    if (action === 'new-conversation') {
      return handleNewConversation()
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || `utm_${Date.now()}_${uuidv4()}`

    // Convert Next.js conversation history to FastAPI format
    const fastAPIHistory = conversationHistory
      .slice(-10) // Limit to last 10 messages for context
      .map(msg => ({
        timestamp: Math.floor(msg.timestamp.getTime ? msg.timestamp.getTime() / 1000 : Date.now() / 1000),
        user: msg.type === 'user' ? msg.content : '',
        bot: msg.type === 'assistant' ? msg.content : ''
      }))
      .filter(msg => msg.user || msg.bot)

    const fastAPIBaseUrl = process.env.API_BASE_URL || 'http://localhost:5200'
    
    try {
      // Call FastAPI backend
      const fastAPIPayload: FastAPIRequest = {
        message: message.trim(),
        system_prompt: getSystemPrompt(),
        conversation_history: fastAPIHistory,
        university_context: getUniversityKnowledge(),
        session_id: currentSessionId
      }

      console.log('Calling FastAPI:', fastAPIBaseUrl + '/api/chat')
      
      const response = await fetch(`${fastAPIBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY || ''}`,
        },
        body: JSON.stringify(fastAPIPayload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FastAPI error: ${response.status} - ${errorText}`)
        throw new Error(`FastAPI error: ${response.status}`)
      }

      const data: FastAPIResponse = await response.json()
      
      return NextResponse.json({
        message: data.response || data.message || '抱歉，我無法處理您的請求。',
        conversation_id: currentSessionId,
        provider: data.provider || 'fastapi',
        model: data.model || 'unknown',
        ai_powered: true,
        timestamp: new Date().toISOString(),
        success: true
      })

    } catch (apiError) {
      console.error('FastAPI error:', apiError)
      
      // Fallback response when FastAPI is unavailable
      const fallbackResponse = generateFallbackResponse(message.trim())
      
      return NextResponse.json({
        message: fallbackResponse.message,
        conversation_id: currentSessionId,
        provider: fallbackResponse.provider,
        model: fallbackResponse.model,
        ai_powered: false,
        timestamp: new Date().toISOString(),
        fallback: true,
        error: 'FastAPI service unavailable'
      })
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

function handleHealthCheck() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Chat API is working',
    version: process.env.APP_VERSION || '2024/2025',
    fastapi_url: process.env.API_BASE_URL || 'http://localhost:5200'
  })
}

function handleNewConversation() {
  const conversationId = `utm_${Date.now()}_${uuidv4()}`
  
  return NextResponse.json({
    success: true,
    conversation_id: conversationId,
    message: 'New conversation started',
    timestamp: new Date().toISOString()
  })
}

function getSystemPrompt(): string {
  return `你是澳門旅遊大學的學生助理Rose🌹。請用繁體中文回答關於大學規定的問題。

你的職責：
- 幫助學生了解大學手冊內容
- 提供準確的政策和規定信息
- 用友善、專業的語調回應
- 在不確定時建議聯繫相關部門

重要聯繫方式：
- 教務部：8598-2012
- 電郵：enrolment@utm.edu.mo

回答格式要求：
- 使用清晰的結構（標題、要點）
- 包含相關的聯繫信息
- 保持回答簡潔但全面
- 使用適當的emoji圖標

如果問題超出大學手冊範圍，請禮貌地重定向到適當的部門。`
}

function getUniversityKnowledge(): Record<string, string> {
  return {
    "課程轉讀": "學生可申請轉讀其他課程，需符合目標課程入學要求，在指定時間內提交申請表格和相關文件。",
    "畢業要求": "學士學位需120-130學分，GPA達2.0以上，完成所有必修和選修科目。",
    "學術誠信": "嚴禁抄襲、作弊等不誠實行為，違者將面臨警告、記過或開除等處分。",
    "補考規定": "因特殊情況缺考可申請補考，需在考試後一週內提供證明文件申請。",
    "學費繳納": "每學期開學前繳納，逾期將影響註冊和考試資格。",
    "學生宿舍": "新生可在入學時申請，在校生需在指定期間申請，按時間順序分配。",
    "圖書館": "提供圖書借閱、電子資料庫、學習空間等服務，週一至週日開放。",
    "評估方法": "包括考試、作業、專題報告、實習評估等多種形式，具體比重由各科目決定。",
    "學術不誠實": "包括但不限於抄襲、代考、偽造文件等行為，將依情節嚴重程度給予相應處分。",
    "學分轉移": "經審核認可的其他院校學分可申請轉移，但需符合本校課程要求。"
  }
}

function generateFallbackResponse(message: string): { message: string; provider: string; model: string } {
  const lowerMessage = message.toLowerCase()
  const knowledge = getUniversityKnowledge()
  
  // Enhanced keyword matching
  for (const [topic, info] of Object.entries(knowledge)) {
    if (lowerMessage.includes(topic.toLowerCase()) || 
        (topic === '課程轉讀' && (lowerMessage.includes('轉讀') || lowerMessage.includes('轉系'))) ||
        (topic === '畢業要求' && (lowerMessage.includes('畢業') || lowerMessage.includes('學分'))) ||
        (topic === '學術誠信' && (lowerMessage.includes('誠信') || lowerMessage.includes('抄襲'))) ||
        (topic === '補考規定' && (lowerMessage.includes('補考') || lowerMessage.includes('缺考'))) ||
        (topic === '學費繳納' && (lowerMessage.includes('學費') || lowerMessage.includes('繳費'))) ||
        (topic === '學生宿舍' && (lowerMessage.includes('宿舍') || lowerMessage.includes('住宿'))) ||
        (topic === '圖書館' && lowerMessage.includes('圖書')) ||
        (topic === '評估方法' && (lowerMessage.includes('評估') || lowerMessage.includes('考試')))
    ) {
      return {
        message: `## 📚 ${topic}\n\n${info}\n\n**如需詳細信息，請聯繫：**\n📞 教務部：8598-2012\n📧 電郵：enrolment@utm.edu.mo`,
        provider: 'local_fallback',
        model: 'keyword_matching'
      }
    }
  }
  
  // Default fallback response
  return {
    message: `## 🤖 學生助理 Rose\n\n您好！關於您的問題，建議您聯繫相關部門獲取準確信息：\n\n📞 **教務部：** 8598-2012\n📧 **電郵：** enrolment@utm.edu.mo\n🌐 **網站：** www.utm.edu.mo\n\n我可以幫您解答關於課程轉讀、畢業要求、學術誠信、補考規定、學費繳納、學生宿舍、圖書館服務等問題。\n\n請嘗試問我具體的問題，例如：\n• "如何申請課程轉讀？"\n• "畢業需要多少學分？"\n• "補考有什麼規定？"`,
    provider: 'local_fallback',
    model: 'default_response'
  }
}