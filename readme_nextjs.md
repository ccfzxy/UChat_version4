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

### 3. 環境配置

複製環境變量模板：

```bash
cp .env.example .env.local
```

編輯 `.env.local` 文件，配置以下變量：

```env
# API Configuration
API_BASE_URL=http://localhost:5200
API_KEY=your_api_key_here
DEFAULT_MODEL=gpt-4o
DEFAULT_PROVIDER=openai

# Application Configuration
APP_NAME=澳門旅遊大學學士學位課程手冊
APP_VERSION=2024/2025
CONTACT_PHONE=8598-2012
CONTACT_EMAIL=enrolment@utm.edu.mo

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 準備資源文件

將以下文件放置在 `public` 目錄下：
- `chaticon_1.jpg` - WhatsApp聊天圖標
- `chaticon_2.jpg` - AI助理聊天圖標
- `favicon.ico` - 網站圖標

### 5. 啟動開發服務器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 項目結構

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
├── .env.example           # 環境變量模板
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
        <h1>新頁面</h