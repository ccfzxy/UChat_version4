'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Phone } from 'lucide-react'

const ChatIcons = () => {
  const iconVariants = {
    hover: {
      scale: 1.1,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
      {/* WhatsApp Chat Icon */}
      <motion.a
        href="https://wa.me/6582242122"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
        variants={iconVariants}
        whileHover="hover"
        whileTap="tap"
        title="WhatsApp 聯繫"
      >
        <div className="relative w-8 h-8">
          <Image
            src="/chaticon_1.jpg"
            alt="WhatsApp"
            fill
            className="rounded-full object-cover"
            sizes="32px"
          />
        </div>
      </motion.a>

      {/* University Assistant Chat Icon */}
      <motion.div
        variants={iconVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Link
          href="/chat"
          className="w-14 h-14 bg-gradient-primary hover:opacity-90 rounded-full flex items-center justify-center shadow-lg transition-opacity duration-300"
          title="大學學生助理"
        >
          <div className="relative w-8 h-8">
            <Image
              src="/chaticon_2.jpg"
              alt="Chat Support"
              fill
              className="rounded-full object-cover"
              sizes="32px"
            />
          </div>
        </Link>
      </motion.div>
    </div>
  )
}

export default ChatIcons