import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '澳門旅遊大學學士學位課程手冊 2024/2025',
  description: 'Macao University of Tourism Bachelor Degree Program Handbook',
  keywords: ['澳門旅遊大學', 'Macao University of Tourism', '學士學位', 'Bachelor Degree', '課程手冊', 'Handbook'],
  authors: [{ name: 'Macao University of Tourism' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#003366',
  openGraph: {
    title: '澳門旅遊大學學士學位課程手冊',
    description: 'Macao University of Tourism Bachelor Degree Program Handbook 2024/2025',
    type: 'website',
    locale: 'zh_TW',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#003366" />
        <meta name="theme-color" content="#003366" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}