'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Home, 
  FileText, 
  Scale, 
  Building, 
  DollarSign, 
  GraduationCap, 
  ClipboardList,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react'
import StatusIndicator from '@/components/StatusIndicator'
import ChatIcons from '@/components/ChatIcons'

interface SectionData {
  title: string
  icon: React.ReactNode
  pages: Array<{
    title: string
    href: string
  }>
  className?: string
}

const Homepage = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state immediately to show content
    setIsLoaded(true)
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'health'
        })
      })
      
      if (response.ok) {
        setApiStatus('online')
      } else {
        setApiStatus('offline')
      }
    } catch (error) {
      console.log('API check failed:', error)
      setApiStatus('offline')
    }
  }

  const sections: SectionData[] = [
    {
      title: '第一部分 – 一般資訊',
      icon: <Home className="w-6 h-6" />,
      pages: [
        { title: '1. 歡迎加入澳門旅遊大學!', href: '/pages/welcome' },
        { title: '2. 平等機會政策', href: '/pages/equal-opportunity' },
        { title: '3. 校曆表及公眾假期', href: '/pages/calendar' },
        { title: '4. 教務部', href: '/pages/academic-affairs' },
        { title: '5. 課程概覧', href: '/pages/course-overview' },
        { title: '6. 課程規章', href: '/pages/course-regulations' }
      ]
    },
    {
      title: '評估或考核',
      icon: <FileText className="w-6 h-6" />,
      pages: [
        { title: '評估方法', href: '/pages/assessment-methods' },
        { title: '責任', href: '/pages/responsibilities' },
        { title: '輔助器材的使用', href: '/pages/auxiliary-materials' },
        { title: '考試中的不當行為', href: '/pages/exam-misconduct' },
        { title: '呈交分數', href: '/pages/score-submission' },
        { title: '補考', href: '/pages/makeup-exams' },
        { title: '評估或考核時間表', href: '/pages/assessment-schedule' }
      ]
    },
    {
      title: '學術誠信與紀律',
      icon: <Scale className="w-6 h-6" />,
      pages: [
        { title: '學業不誠實行為的政策', href: '/pages/academic-dishonesty' },
        { title: '支援和優化學生學習', href: '/pages/student-support' },
        { title: '學生紀律守則', href: '/pages/discipline-code' }
      ]
    },
    {
      title: '大學部門與服務',
      icon: <Building className="w-6 h-6" />,
      pages: [
        { title: '澳門旅遊大學行政部門', href: '/pages/admin-departments' },
        { title: '澳門旅遊大學圖書館', href: '/pages/library' },
        { title: '學生宿舍', href: '/pages/dormitory' }
      ]
    },
    {
      title: '收費與雜項',
      icon: <DollarSign className="w-6 h-6" />,
      pages: [
        { title: '收費', href: '/pages/fees' },
        { title: '雜項', href: '/pages/miscellaneous' }
      ]
    },
    {
      title: '學位課程規定',
      icon: <GraduationCap className="w-6 h-6" />,
      pages: [
        { title: '學年', href: '/pages/academic-year' },
        { title: '修讀年期及畢業學分', href: '/pages/study-period' },
        { title: '畢業資格', href: '/pages/graduation-requirements' },
        { title: '畢業榮譽', href: '/pages/graduation-honors' },
        { title: '實習', href: '/pages/internship' },
        { title: '班級', href: '/pages/class-levels' },
        { title: '課程要求的選修科目', href: '/pages/elective-requirements' },
        { title: '課程轉讀申請 / 內部轉讀', href: '/pages/program-transfer' },
        { title: '校長榮譽榜', href: '/pages/deans-honor-list' },
        { title: '課程考察', href: '/pages/study-tours' },
        { title: '第四學年的論文/報告', href: '/pages/thesis-report' }
      ]
    },
    {
      title: '附錄文件',
      icon: <ClipboardList className="w-6 h-6" />,
      pages: [
        { title: '附錄一：全球旅遊倫理規範', href: '/pages/global-tourism-ethics' },
        { title: '附錄二：澳門旅遊大學研究道德準則', href: '/pages/research-ethics' },
        { title: '附錄三：有關使用人工智能（AI）文本生成工具的指引', href: '/pages/ai-guidelines' }
      ],
      className: 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500'
    }
  ]

  // Don't render until loaded to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700">
      <StatusIndicator status={apiStatus} />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 text-center shadow-xl fade-in">
          <h1 className="text-blue-900 text-4xl md:text-5xl font-bold mb-3">
            澳門旅遊大學
          </h1>
          <h2 className="text-blue-600 text-2xl md:text-3xl mb-4">
            學士學位課程手冊（中文學制）
          </h2>
          <div className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
            2024/2025
          </div>
        </header>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map((section, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              {/* Chapter Dividers */}
              {index === 5 && (
                <div className="col-span-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-5 px-6 rounded-2xl mb-6 font-bold text-xl shadow-lg">
                  第二章 – 學士學位課程規條
                </div>
              )}
              {index === 6 && (
                <div className="col-span-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-5 px-6 rounded-2xl mb-6 font-bold text-xl shadow-lg">
                  附錄
                </div>
              )}

              <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full ${section.className || ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-blue-900 text-xl font-bold">
                    {section.title}
                  </h3>
                </div>
                
                <ul className="space-y-2">
                  {section.pages.map((page, pageIndex) => (
                    <li key={pageIndex}>
                      <Link 
                        href={page.href}
                        className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:translate-x-1 hover:shadow-sm"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-white/90 py-6 fade-in bg-black/10 rounded-2xl backdrop-blur-sm">
          <p className="mb-2 font-semibold">© 2024 澳門旅遊大學 Macao University of Tourism</p>
          <p className="mb-2">www.utm.edu.mo</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>8598-2012</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>enrolment@utm.edu.mo</span>
            </div>
          </div>
        </footer>
      </div>

      <ChatIcons />
    </div>
  )
}

export default Homepage