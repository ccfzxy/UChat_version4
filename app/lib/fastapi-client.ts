// lib/fastapi-client.ts - FastAPI Integration Helper

export interface FastAPIMessage {
  timestamp: number
  user: string
  bot: string
}

export interface FastAPIRequest {
  message: string
  system_prompt: string
  conversation_history: FastAPIMessage[]
  university_context: Record<string, string>
  session_id: string
  provider?: string
  model?: string
  temperature?: number
  max_tokens?: number
}

export interface FastAPIResponse {
  response?: string
  message?: string
  provider?: string
  model?: string
  error?: string
  success?: boolean
  ai_powered?: boolean
  tokens_used?: number
  processing_time?: number
}

export interface FastAPIHealthResponse {
  status: string
  timestamp: string
  version?: string
  provider?: string
  model?: string
  services?: {
    ai_service: string
    database?: string
    redis?: string
  }
}

export class FastAPIClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number

  constructor(baseUrl: string = 'http://localhost:5200', apiKey?: string, timeout: number = 30000) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = apiKey
    this.timeout = timeout
  }

  /**
   * Send a chat message to FastAPI backend
   */
  async sendMessage(request: FastAPIRequest): Promise<FastAPIResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`FastAPI error: ${response.status} - ${errorText}`)
      }

      const data: FastAPIResponse = await response.json()
      return data

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send message to FastAPI: ${error.message}`)
      }
      throw new Error('Unknown error occurred while sending message to FastAPI')
    }
  }

  /**
   * Check FastAPI health status
   */
  async checkHealth(): Promise<FastAPIHealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // Shorter timeout for health check
      })

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }

      const data: FastAPIHealthResponse = await response.json()
      return data

    } catch (error) {
      throw new Error(`FastAPI health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get available models from FastAPI
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`)
      }

      const data = await response.json()
      return data.models || []

    } catch (error) {
      console.warn('Could not fetch available models:', error)
      return []
    }
  }

  /**
   * Create a new conversation session
   */
  async createSession(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`)
      }

      const data = await response.json()
      return data.session_id || `fallback_${Date.now()}`

    } catch (error) {
      console.warn('Could not create session, using fallback:', error)
      return `fallback_${Date.now()}`
    }
  }

  /**
   * Set new base URL (useful for dynamic configuration)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '')
  }

  /**
   * Set API key
   */
  setApiKey(key: string): void {
    this.apiKey = key
  }

  /**
   * Get current configuration
   */
  getConfig(): { baseUrl: string; hasApiKey: boolean; timeout: number } {
    return {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      timeout: this.timeout
    }
  }
}

// Singleton instance for use across the application
export const fastAPIClient = new FastAPIClient(
  process.env.API_BASE_URL || 'http://localhost:5200',
  process.env.API_KEY,
  parseInt(process.env.API_TIMEOUT || '30000')
)

// Utility functions for data transformation
export const transformConversationHistory = (messages: any[]): FastAPIMessage[] => {
  const pairs: FastAPIMessage[] = []
  
  for (let i = 0; i < messages.length - 1; i += 2) {
    const userMsg = messages[i]
    const botMsg = messages[i + 1]
    
    if (userMsg?.type === 'user' && botMsg?.type === 'assistant') {
      pairs.push({
        timestamp: Math.floor(userMsg.timestamp.getTime ? userMsg.timestamp.getTime() / 1000 : Date.now() / 1000),
        user: userMsg.content,
        bot: botMsg.content
      })
    }
  }
  
  return pairs
}

export const getUniversityContextData = (): Record<string, string> => {
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
    "學分轉移": "經審核認可的其他院校學分可申請轉移，但需符合本校課程要求。",
    "實習規定": "第三或第四學年需完成相關實習，由學校安排或學生自行聯繫實習單位。",
    "論文要求": "第四學年需完成畢業論文或專題報告，須通過指導老師和評審委員會審核。"
  }
}

export const getSystemPromptForFastAPI = (): string => {
  return `你是澳門旅遊大學的學生助理Rose🌹。請用繁體中文回答關於大學規定的問題。

你的職責：
- 幫助學生了解大學手冊內容
- 提供準確的政策和規定信息
- 用友善、專業的語調回應
- 在不確定時建議聯繫相關部門

重要聯繫方式：
- 教務部：8598-2012
- 電郵：enrolment@utm.edu.mo
- 網站：www.utm.edu.mo

回答格式要求：
- 使用清晰的結構（標題、要點）
- 包含相關的聯繫信息
- 保持回答簡潔但全面
- 使用適當的emoji圖標
- 用markdown格式化重要信息

如果問題超出大學手冊範圍，請禮貌地重定向到適當的部門。

請確保回答準確、有幫助，並保持友善的語調。`
}

// Error handling utilities
export class FastAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'FastAPIError'
  }
}

export const handleFastAPIError = (error: unknown): string => {
  if (error instanceof FastAPIError) {
    if (error.statusCode === 503) {
      return '抱歉，AI服務暫時不可用。請稍後再試或聯繫技術支援。'
    }
    if (error.statusCode === 429) {
      return '請求過於頻繁，請稍後再試。'
    }
    if (error.statusCode === 400) {
      return '請求格式有誤，請重新輸入您的問題。'
    }
    return `服務錯誤：${error.message}`
  }
  
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return '請求超時，請檢查網絡連接後重試。'
    }
    if (error.message.includes('fetch')) {
      return '無法連接到服務器，請檢查網絡連接。'
    }
    return `錯誤：${error.message}`
  }
  
  return '發生未知錯誤，請聯繫技術支援。'
}