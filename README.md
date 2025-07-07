# 澳門旅遊大學學士學位課程手冊 - Next.js版本

這是澳門旅遊大學學士學位課程手冊的現代化Next.js版本，提供了智能聊天助理功能和響應式設計。

## 功能特點

- 🚀 **現代化技術棧**: Next.js 14 + TypeScript + Tailwind CSS
- 🤖 **AI聊天助理**: 智能回答課程相關問題
- 📱 **響應式設計**: 適配桌面和移動設備
- 🎨 **美觀界面**: 玻璃態設計風格和流暢動畫
- 🔒 **安全性**: 內置安全標頭和輸入驗證
- 🌐 **多語言支持**: 繁體中文為主，支持雙語
- ⚡ **高性能**: 服務端渲染和靜態生成優化

## 系統要求

- Node.js 18.17 或更高版本
- npm, yarn, 或 pnpm 包管理器
- 現代瀏覽器支持

## 安裝步驟

### 1. 克隆項目

```bash
git clone <repository-url>
cd utm-handbook-nextjs
```

### 2. 安裝依賴

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 準備資源文件

將以下文件放置在 `public` 目錄下：
- `chaticon_1.jpg` - WhatsApp聊天圖標
- `chaticon_2.jpg` - AI助理聊天圖標
- `favicon.ico` - 網站圖標

### 4. 啟動開發服務器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 5. 項目結構

```
utm-handbook-nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── health/        # 健康檢查
│   │   └── chat/          # 聊天API
│   ├── chat/              # 聊天頁面
│   ├── pages/             # 靜態頁面 (待實現)
│   ├── globals.css        # 全局樣式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首頁
├── components/            # React 組件
│   ├── StatusIndicator.tsx
│   └── ChatIcons.tsx
├── public/                # 靜態資源
├── .env                   # 環境變量模板
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── package.json           # 項目依賴
└── README.md              # 項目說明
```

## 主要組件說明

### 1. 首頁 (`app/page.tsx`)
- 展示大學手冊目錄結構
- 玻璃態設計風格
- 響應式網格布局
- 動畫效果

### 2. 聊天界面 (`app/chat/page.tsx`)
- 實時聊天功能
- 消息歷史記錄
- 加載狀態指示
- 自動滾動

### 3. API路由
- `/api/health` - 健康檢查和狀態監控
- `/api/chat` - 聊天消息處理

### 4. 可重用組件
- `StatusIndicator` - 狀態指示器
- `ChatIcons` - 浮動聊天圖標

## 開發指南

### 添加新頁面

1. 在 `app` 目錄下創建新的路由文件夾
2. 添加 `page.tsx` 文件
3. 使用共同的設計模式和樣式

示例：
```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-6">
        <h1>新頁面</h1>
      </div>
    </div>
  )
}
```

### 自定義樣式

項目使用 Tailwind CSS，主要顏色變量定義在 `tailwind.config.js` 中：

```javascript
colors: {
  primary: {
    50: '#f0f7ff',
    500: '#0099cc',
    700: '#003366',
  }
}
```

### API集成

聊天功能通過 `/api/chat` 路由與外部AI服務集成。如需修改AI提示詞或行為，編輯 `app/api/chat/route.ts` 中的 `getSystemPrompt()` 函數。

## 部署指南

### 1. 生產構建

```bash
npm run build
npm start
```

### 2. 環境變量

確保在生產環境中設置所有必要的環境變量：

```.env
NODE_ENV=production
API_BASE_URL=https://your-api-server.com
API_KEY=your_production_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Vercel部署

項目已配置為可直接部署到Vercel：

```bash
npm install -g vercel
vercel
```

### 4. Docker部署

創建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

構建和運行：

```bash
docker build -t utm-handbook .
docker run -p 3000:3000 utm-handbook
```

## API參考

### 健康檢查 API

```http
POST /api/health
```

響應：
```json
{
  "status": "ok",
  "timestamp": "2024-07-07T10:00:00.000Z",
  "version": "2024/2025",
  "services": {
    "nextjs": "online",
    "externalApi": "online"
  }
}
```

### 聊天 API

```http
POST /api/chat
Content-Type: application/json

{
  "message": "用戶問題",
  "sessionId": "session_id",
  "conversationHistory": []
}
```

響應：
```json
{
  "response": "AI回應",
  "sessionId": "session_id",
  "timestamp": "2024-07-07T10:00:00.000Z",
  "model": "gpt-4o"
}
```

## 故障排除

### 常見問題

1. **API連接失敗**
   - 檢查 `API_BASE_URL` 環境變量
   - 確認外部API服務正在運行
   - 檢查防火牆和網絡設置

2. **樣式不正確**
   - 確認Tailwind CSS正確安裝
   - 檢查 `globals.css` 是否正確導入
   - 清除瀏覽器緩存

3. **圖片不顯示**
   - 確認圖片文件在 `public` 目錄下
   - 檢查文件名和路徑是否正確
   - 驗證圖片格式和大小

### 調試模式

啟用調試模式：

```env
DEBUG_MODE=true
NODE_ENV=development
```

查看詳細錯誤信息和API調用日誌。

## 性能優化

### 1. 圖片優化

使用Next.js Image組件自動優化：

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="描述"
  width={100}
  height={100}
  priority // 對於首屏重要圖片
/>
```

### 2. 代碼分割

Next.js自動進行代碼分割。對於大型組件，可以使用動態導入：

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>加載中...</p>
})
```

### 3. 緩存策略

在 `next.config.js` 中配置緩存：

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate=59'
          }
        ]
      }
    ]
  }
}
```

## 安全考慮

### 1. 輸入驗證

所有用戶輸入都應該進行驗證：

```typescript
if (!message || typeof message !== 'string' || message.trim().length === 0) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
}
```

### 2. 速率限制

考慮添加速率限制中間件：

```typescript
// 簡單的內存速率限制示例
const rateLimitMap = new Map()

function rateLimit(identifier: string, limit: number = 10) {
  const now = Date.now()
  const windowMs = 60000 // 1分鐘
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  const current = rateLimitMap.get(identifier)
  if (now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  return true
}
```

### 3. 環境變量保護

確保敏感信息不會暴露到客戶端：

- 以 `NEXT_PUBLIC_` 開頭的變量會暴露到客戶端
- API密鑰等敏感信息不應使用 `NEXT_PUBLIC_` 前綴

## 貢獻指南

### 1. 代碼風格

- 使用TypeScript進行類型安全
- 遵循ESLint規則
- 使用Prettier格式化代碼

### 2. 提交規範

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修復bug"
git commit -m "docs: 更新文檔"
git commit -m "style: 代碼格式調整"
git commit -m "refactor: 代碼重構"
```

### 3. 測試

運行測試（如果配置）：

```bash
npm run test
npm run test:e2e
```

## 聯繫信息

- **技術支援**: [技術團隊聯繫方式]
- **項目維護**: [維護團隊聯繫方式]
- **大學聯繫**: 
  - 電話：8598-2012
  - 電郵：enrolment@utm.edu.mo
  - 網站：www.utm.edu.mo

## 許可證

本項目使用 [許可證類型] 許可證。詳情請查看 LICENSE 文件。
