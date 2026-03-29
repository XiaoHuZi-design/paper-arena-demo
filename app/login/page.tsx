'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'email' | 'github'>('email')
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b44aff] rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#b44aff] to-[#00d4ff] flex items-center justify-center text-xl font-bold tracking-wider">
              PA
            </div>
            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Orbitron' }}>
              <span className="text-white">PAPER</span>
              <span className="text-[#b44aff]">_</span>
              <span className="text-[#00d4ff]">ARENA</span>
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="glow-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'Orbitron' }}>
            登录
          </h1>
          <p className="text-[#8888aa] text-center mb-8">欢迎回来</p>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setMode('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'email'
                  ? 'bg-[#b44aff] text-white'
                  : 'bg-[#12121a] text-[#8888aa] hover:text-white'
              }`}
            >
              邮箱登录
            </button>
            <button
              onClick={() => setMode('github')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'github'
                  ? 'bg-[#b44aff] text-white'
                  : 'bg-[#12121a] text-[#8888aa] hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#ff2d95]/10 border border-[#ff2d95]/30 text-[#ff2d95] text-sm">
              {error}
            </div>
          )}

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8888aa] mb-2">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-cyber"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8888aa] mb-2">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-cyber"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                使用 GitHub 登录
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-[#8888aa]">
            还没有账号？{' '}
            <Link href="/register" className="text-[#b44aff] hover:underline">
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
