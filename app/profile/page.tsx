'use client'

import { createClient, getPapers } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          avatar_url: user.user_metadata?.avatar_url,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        })

        // Fetch user's papers
        try {
          const papersData = await getPapers(supabase)
          setPapers(papersData || [])
        } catch (error) {
          console.error('Error fetching papers:', error)
        }
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#b44aff] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#8888aa] mb-4">请先登录</p>
          <Link href="/login" className="btn-primary inline-block">
            前往登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glow-border rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#b44aff] to-[#00d4ff] flex items-center justify-center text-4xl font-bold">
                {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron' }}>
                  {profile.full_name || '研究者'}
                </h1>
                <p className="text-[#8888aa]">{profile.email}</p>
                <p className="text-xs text-[#666680] mt-2">
                  注册于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glow-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-[#b44aff] mb-2" style={{ fontFamily: 'Orbitron' }}>
                {papers.length}
              </div>
              <div className="text-[#8888aa] text-sm">上传论文</div>
            </div>
            <div className="glow-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-[#00d4ff] mb-2" style={{ fontFamily: 'Orbitron' }}>
                --
              </div>
              <div className="text-[#8888aa] text-sm">对话次数</div>
            </div>
            <div className="glow-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-[#00ff88] mb-2" style={{ fontFamily: 'Orbitron' }}>
                --
              </div>
              <div className="text-[#8888aa] text-sm">参与辩论</div>
            </div>
          </div>

          {/* My Papers */}
          <div className="glow-border rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron' }}>我的论文</h2>
              <Link href="/upload" className="btn-secondary !py-2 !px-4 text-sm">
                上传新论文
              </Link>
            </div>

            {papers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#12121a] flex items-center justify-center text-3xl opacity-50">
                  📚
                </div>
                <p className="text-[#8888aa] mb-4">还没有上传任何论文</p>
                <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
                  上传第一篇论文
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper: any) => (
                  <div
                    key={paper.id}
                    className="p-4 rounded-xl bg-[#12121a] border border-[rgba(180,74,255,0.1)] hover:border-[rgba(180,74,255,0.3)] transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{paper.title}</h3>
                        <p className="text-sm text-[#8888aa] line-clamp-2">{paper.abstract}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {paper.paper_agents?.[0] && (
                            <span className="text-xs text-[#b44aff]">
                              角色: {paper.paper_agents[0].name}
                            </span>
                          )}
                          <span className="text-xs text-[#666680]">
                            {new Date(paper.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                      {paper.paper_agents?.[0] && (
                        <Link
                          href={`/agent/${paper.paper_agents[0].id}`}
                          className="ml-4 px-4 py-2 rounded-lg bg-[#b44aff]/20 text-[#b44aff] text-sm hover:bg-[#b44aff]/30 transition"
                        >
                          查看角色
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
