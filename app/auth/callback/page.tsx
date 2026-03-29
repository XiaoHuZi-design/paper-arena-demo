'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    // The OAuth callback is handled by middleware
    // Just redirect to home after a short delay
    const timer = setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-[#b44aff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#8888aa]">登录中...</p>
      </div>
    </div>
  )
}
