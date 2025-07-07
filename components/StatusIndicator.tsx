'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Loader } from 'lucide-react'

interface StatusIndicatorProps {
  status: 'checking' | 'online' | 'offline'
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (status !== 'checking') {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [status])

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader className="w-4 h-4 animate-spin" />,
          text: '檢查連接中...',
          bgColor: 'bg-blue-500',
          textColor: 'text-white'
        }
      case 'online':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'AI 助理線上',
          bgColor: 'bg-green-500',
          textColor: 'text-white'
        }
      case 'offline':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'AI 助理離線',
          bgColor: 'bg-orange-500',
          textColor: 'text-white'
        }
    }
  }

  const config = getStatusConfig()

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 fade-in">
      <div className={`${config.bgColor} ${config.textColor} px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-opacity duration-500`}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    </div>
  )
}

export default StatusIndicator