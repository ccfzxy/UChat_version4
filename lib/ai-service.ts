// lib/ai-service.ts - AI Service converted from FastAPI app.py
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

// Types matching the original FastAPI models
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface ConversationHistory {
  timestamp: number
  user: string
  bot: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string
  model?: string
  provider?: string
  context?: string
  handbook_context?: HandbookItem[]
}

export interface ChatResponse {
  response: string
  regulations: Regulation[]
  faqs: FAQ[]
  conversation_id: string
  success: boolean
}

export interface HandbookItem {
  section: string
  content: string
  score: number
}

export interface Regulation {
  title: string
  excerpt: string
  link: string
  category: string
}

export interface FAQ {
  question: string
  answer: string
  category: string
}

export interface SearchResult {
  section: string
  content: string
  score: number
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not found in environment variables')
}

// University handbook content processor
class HandbookProcessor {
  private content: Record<string, string[]> = {}
  private isLoaded = false

  constructor() {
    this.loadHandbookContent()
  }

  private loadHandbookContent() {
    try {
      // University handbook content (converted from Python version)
      this.content = {
        '第一部分 – 一般資訊': [
          '歡迎加入澳門旅遊大學！我們致力於為您提供優質的旅遊教育。',
          '平等機會政策確保所有學生享有公平的學習環境。',
          '校曆表包含重要的學期日期和公眾假期安排。',
          '教務部負責學術事務管理和學生服務。',
          '課程概覽提供各學士學位課程的詳細信息。',
          '課程規章規定了學習要求和學術標準。'
        ],
        '評估或考核': [
          '評估方法包括考試、作業、專題報告和實習評估。',
          '學生有責任按時完成所有評估要求。',
          '考試期間允許使用指定的輔助器材。',
          '考試中的不當行為將面臨嚴重後果。',
          '教師需按時呈交學生成績。',
          '補考機會提供給因特殊情況缺考的學生。',
          '評估時間表在每學期開始前公布。'
        ],
        '學術誠信與紀律': [
          '學業不誠實行為包括抄襲、作弊和偽造。',
          '大學提供學習支援服務幫助學生成功。',
          '學生紀律守則規定了行為標準和處分程序。'
        ],
        '大學部門與服務': [
          '行政部門為學生提供各種服務和支援。',
          '圖書館提供豐富的學習資源和研究支援。',
          '學生宿舍為在校學生提供住宿服務。'
        ],
        '收費與雜項': [
          '學費需在每學期開始前繳納。',
          '各種雜費包括註冊費、實驗費等。'
        ],
        '學士學位課程規條': [
          '學年分為兩個學期，每學期約16週。',
          '修讀年期通常為四年，需完成120-130學分。',
          '畢業資格要求完成所有必修和選修科目。',
          '畢業榮譽根據累積GPA確定。',
          '實習是某些課程的必修要求。',
          '班級編制按照學年和專業劃分。',
          '選修科目需符合課程要求。',
          '課程轉讀需符合相關條件和程序。',
          '校長榮譽榜表彰優秀學生。',
          '課程考察提供實地學習機會。',
          '第四學年需完成畢業論文或報告。'
        ],
        '附錄': [
          '全球旅遊倫理規範指導行業實踐。',
          '研究道德準則確保研究的倫理性。',
          'AI工具使用指引規範學術寫作中的人工智能應用。'
        ]
      }

      this.isLoaded = true
      console.log(`Handbook loaded with ${Object.keys(this.content).length} sections`)
      
    } catch (error) {
      console.error('Error loading handbook content:', error)
      this.isLoaded = false
    }
  }

  private isSectionHeader(text: string): boolean {
    const headerPatterns = [
      /^\d+\.\s/,  // Numbered sections
      /^第[一二三四五六七八九十\d]+部分/,  // Parts
      /^第[一二三四五六七八九十\d]+章/,   // Chapters
      /^附錄[一二三四五六七八九十\d]*/,   // Appendices
      /^\d+\.\d+\s/,  // Subsections
    ]
    
    return headerPatterns.some(pattern => pattern.test(text))
  }

  searchContent(query: string, limit: number = 10): SearchResult[] {
    if (!this.isLoaded) {
      console.warn('Handbook content not loaded')
      return []
    }

    const results: SearchResult[] = []
    const queryTerms = this.extractKeywords(query)
    
    for (const [section, lines] of Object.entries(this.content)) {
      for (const line of lines) {
        const score = this.calculateRelevanceScore(line, queryTerms)
        
        if (score > 0.1) { // Lower threshold for better results
          results.push({
            section,
            content: line,
            score
          })
        }
      }
    }
    
    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  private extractKeywords(query: string): string[] {
    // Common stop words to ignore (simplified for JavaScript)
    const stopWords = new Set([
      '的', '是', '在', '有', '和', '我', '你', '他', '她', '它', '們',
      '這', '那', '什麼', '怎麼', '為什麼', '如何', '可以', '需要', '應該'
    ])
    
    // Simple word segmentation for Chinese text
    // In a real implementation, you might want to use a library like nodejieba
    const words = query.split(/[\s，。！？；：、（）【】「」""'']+/)
      .filter(word => word.length > 1 && !stopWords.has(word))
    
    return words
  }

  private calculateRelevanceScore(content: string, queryTerms: string[]): number {
    if (content.length === 0) return 0
    
    let score = 0
    for (const term of queryTerms) {
      const regex = new RegExp(term, 'gi')
      const matches = content.match(regex)
      if (matches) {
        score += (matches.length * term.length) / content.length
      }
    }
    
    return score
  }

  getAllSections(): string[] {
    return Object.keys(this.content)
  }

  getSectionContent(sectionName: string): string[] | null {
    // Find section by partial name match
    for (const [section, content] of Object.entries(this.content)) {
      if (section.toLowerCase().includes(sectionName.toLowerCase())) {
        return content
      }
    }
    return null
  }
}

// Global handbook processor instance
export const handbookProcessor = new HandbookProcessor()

// Conversation manager
class ConversationManager {
  private conversations: Map<string, {
    id: string
    created_at: Date
    messages: Array<{
      role: string
      content: string
      timestamp: Date
    }>
  }> = new Map()

  createConversation(): string {
    const conversationId = uuidv4()
    this.conversations.set(conversationId, {
      id: conversationId,
      created_at: new Date(),
      messages: []
    })
    return conversationId
  }

  addMessage(conversationId: string, role: string, content: string) {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.messages.push({
        role,
        content,
        timestamp: new Date()
      })
    }
  }

  getConversationHistory(conversationId: string): ChatMessage[] {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return []
    
    return conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }))
  }

  // Clean up old conversations (optional)
  cleanup() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [id, conversation] of this.conversations.entries()) {
      if (conversation.created_at < oneHourAgo) {
        this.conversations.delete(id)
      }
    }
  }
}

// Global conversation manager instance
export const conversationManager = new ConversationManager()

// System prompt generator
export function createSystemPrompt(handbookContext?: HandbookItem[]): string {
  let basePrompt = `你是澳門旅遊大學的智能助手Rose🌹，專門回答有關大學手冊的問題。你的任務是：

1. 根據提供的大學手冊內容回答學生的問題
2. 提供準確、有用的信息
3. 用繁體中文回答（除非用戶用其他語言詢問）
4. 如果手冊中沒有相關信息，請誠實說明
5. 保持友善和專業的語調
6. 提供具體的規章制度和聯絡信息（如適用）

大學基本信息：
- 名稱：澳門旅遊大學 (Institute for Tourism Studies, Macao)
- 教務部電話：8598-2012
- 教務部電郵：enrolment@utm.edu.mo
- 網站：www.utm.edu.mo`

  if (handbookContext && handbookContext.length > 0) {
    basePrompt += '\n\n以下是與用戶問題相關的手冊內容：\n'
    handbookContext.slice(0, 5).forEach(item => {
      basePrompt += `\n[${item.section}]\n${item.content}\n`
    })
  }

  return basePrompt
}

// AI response generator
export async function getAIResponse(
  message: string, 
  conversationId: string, 
  handbookContext?: HandbookItem[]
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Get conversation history
    const messages = conversationManager.getConversationHistory(conversationId)
    
    // Add system prompt
    const systemPrompt = createSystemPrompt(handbookContext)
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: message }
    ]
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      max_tokens: 1500,
      temperature: 0.1,
      top_p: 0.9
    })
    
    const aiResponse = response.choices[0]?.message?.content || ''
    
    // Store messages in conversation history
    conversationManager.addMessage(conversationId, 'user', message)
    conversationManager.addMessage(conversationId, 'assistant', aiResponse)
    
    return aiResponse
    
  } catch (error) {
    console.error('Error getting AI response:', error)
    throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Extract regulations from handbook context
export function extractRegulationsFromContext(handbookContext: HandbookItem[]): Regulation[] {
  return handbookContext.slice(0, 3).map(item => ({
    title: item.section,
    excerpt: item.content.length > 100 
      ? item.content.substring(0, 100) + '...' 
      : item.content,
    link: '#',
    category: 'handbook'
  }))
}

// University knowledge base (for fallback responses)
export const universityKnowledge: Record<string, string> = {
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

// Generate fallback response when AI is not available
export function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Search in university knowledge base
  for (const [topic, info] of Object.entries(universityKnowledge)) {
    if (lowerMessage.includes(topic.toLowerCase())) {
      return `## 📚 ${topic}\n\n${info}\n\n**如需詳細信息，請聯繫：**\n📞 教務部：8598-2012\n📧 電郵：enrolment@utm.edu.mo`
    }
  }
  
  // Default fallback response
  return `## 🤖 學生助理 Rose\n\n您好！關於您的問題，建議您聯繫相關部門獲取準確信息：\n\n📞 **教務部：** 8598-2012\n📧 **電郵：** enrolment@utm.edu.mo\n🌐 **網站：** www.utm.edu.mo\n\n我可以幫您解答關於課程轉讀、畢業要求、學術誠信、補考規定等問題。\n\n請嘗試問我具體的問題，例如：\n• "如何申請課程轉讀？"\n• "畢業需要多少學分？"\n• "補考有什麼規定？"`
}

// Health check function
export function getHealthStatus() {
  return {
    status: 'healthy',
    message: 'University Handbook AI Service is running',
    timestamp: new Date().toISOString(),
    services: {
      handbook_processor: handbookProcessor ? 'online' : 'offline',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
      conversation_manager: 'online'
    }
  }
}
