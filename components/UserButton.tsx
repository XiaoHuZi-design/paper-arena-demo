'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function UserButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    setMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#12121a] animate-pulse" />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="nav-link text-sm font-medium">
          登录
        </Link>
        <Link href="/register" className="btn-primary !py-2 !px-5 text-sm">
          注册
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b44aff] to-[#00d4ff] flex items-center justify-center text-sm font-bold">
          {user.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-56 glow-border rounded-xl overflow-hidden z-50">
            <div className="p-4 border-b border-[rgba(180,74,255,0.1)]">
              <p className="font-medium truncate">{user.email}</p>
              <p className="text-xs text-[#8888aa] mt-1">已登录</p>
            </div>
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#12121a] transition text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人主页
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#12121a] transition text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                上传论文
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#12121a] transition text-sm text-[#ff2d95]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
