'use client'

import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'

const ChatIcons = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
      {/* WhatsApp Chat Icon */}
      <a
        href="https://wa.me/6582242122"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-white"
        title="WhatsApp 聯繫"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* University Assistant Chat Icon */}
      <Link
        href="/chat"
        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-white"
        title="大學學生助理"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  )
}

export default ChatIcons
