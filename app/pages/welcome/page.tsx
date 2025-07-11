'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home, Users, Calendar, Phone, Mail, MapPin } from 'lucide-react'

export default function WelcomePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回首頁</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-4 h-4" />
                <span>一般資訊</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              澳門旅遊大學學士學位課程手冊 2024/2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              🎓 歡迎加入澳門旅遊大學！
            </h1>
            <p className="text-xl text-gray-600">
              Welcome to Macao University of Tourism
            </p>
          </div>

          {/* Welcome Message */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                親愛的新同學：
              </h2>
              <p className="text-gray-700 leading-relaxed">
                恭喜您成功入讀澳門旅遊大學！我們非常高興歡迎您加入我們的大學家庭。
                作為澳門首屈一指的旅遊教育機構，我們致力於為您提供優質的教育環境和豐富的學習體驗。
              </p>
            </div>

            {/* University Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                關於澳門旅遊大學
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">我們的使命</h3>
                  <p className="text-gray-700">
                    培養具有國際視野和專業技能的旅遊業人才，為澳門及大中華地區的旅遊業發展作出貢獻。
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">我們的願景</h3>
                  <p className="text-gray-700">
                    成為亞太地區領先的旅遊教育機構，培育具備創新思維和全球競爭力的旅遊專業人才。
                  </p>
                </div>
              </div>
            </section>

            {/* Academic Programs */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                學士學位課程
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: '旅遊企業管理', desc: '培養旅遊業管理人才' },
                  { title: '酒店管理', desc: '專業酒店營運管理' },
                  { title: '旅遊零售及市場推廣', desc: '旅遊市場營銷專才' },
                  { title: '會展管理', desc: '會議展覽業專業人才' },
                  { title: '文化遺產管理', desc: '文化旅遊專業管理' },
                  { title: '智慧旅遊', desc: '科技與旅遊結合' }
                ].map((program, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveSection(activeSection === program.title ? null : program.title)}
                  >
                    <h3 className="font-semibold text-blue-800 mb-2">{program.title}</h3>
                    <p className="text-sm text-gray-600">{program.desc}</p>
                    {activeSection === program.title && (
                      <div className="mt-3 text-xs text-gray-500 border-t pt-3">
                        更多詳情請參考課程手冊相關章節
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Important Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                重要信息
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-3">新生須知</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    請詳細閱讀本手冊內容，了解課程規定和大學政策
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    按時參加新生註冊和迎新活動
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    如有任何疑問，請聯繫教務部或學生事務處
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    保持學術誠信，遵守大學規章制度
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                聯繫我們
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">聯繫方式</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>電話：8598-2012</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>電郵：enrolment@utm.edu.mo</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>地址：澳門望廈山</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">辦公時間</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>星期一至五：上午9時至下午6時</p>
                    <p>星期六：上午9時至下午1時</p>
                    <p>星期日及公眾假期：休息</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回目錄
            </Link>
            <Link 
              href="/pages/equal-opportunity"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              下一頁：平等機會政策
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
