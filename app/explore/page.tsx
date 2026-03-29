'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient, getPaperAgents } from '@/lib/supabase/client'

// Default demo agents for when database is empty
const defaultAgents = [
  {
    id: 'demo-yolo',
    name: 'YOLO',
    paper_id: 'demo-1',
    domain: 'Computer Vision',
    emoji: '🎯',
    gradient: 'from-[#ff6b35] to-[#ff2d95]',
    color: '#ff6b35',
    personality: ['激进派', '速度至上', '简洁直接'],
    skills: [{ name: '实时检测', description: '每秒45帧' }],
    weaknesses: [{ name: '小目标', description: '密集场景易漏检' }],
  },
  {
    id: 'demo-bert',
    name: 'BERT',
    paper_id: 'demo-2',
    domain: 'NLP',
    emoji: '📖',
    gradient: 'from-[#00d4ff] to-[#00ff88]',
    color: '#00d4ff',
    personality: ['深思熟虑', '双向理解', '全能'],
    skills: [{ name: '注意力机制', description: '捕捉上下文' }],
    weaknesses: [{ name: '计算量大', description: '推理速度慢' }],
  },
  {
    id: 'demo-gpt',
    name: 'GPT',
    paper_id: 'demo-3',
    domain: 'NLP',
    emoji: '✍️',
    gradient: 'from-[#00ff88] to-[#b44aff]',
    color: '#00ff88',
    personality: ['创造性强', '对话流畅', '规模化'],
    skills: [{ name: '文本生成', description: '自然流畅' }],
    weaknesses: [{ name: '幻觉', description: '可能生成虚假信息' }],
  },
]

export default function Explore() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const supabase = createClient()
        const data = await getPaperAgents(supabase)
        if (data && data.length > 0) {
          // Map database agents to display format
          const mappedAgents = data.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            paper_id: agent.paper_id,
            domain: agent.domain || 'General',
            emoji: agent.emoji || '📄',
            gradient: agent.gradient || 'from-[#b44aff] to-[#00d4ff]',
            color: '#b44aff',
            personality: agent.personality || [],
            skills: agent.skills || [],
            weaknesses: agent.weaknesses || [],
          }))
          setAgents(mappedAgents)
        } else {
          // Use demo agents if database is empty
          setAgents(defaultAgents)
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
        setAgents(defaultAgents)
      }
      setLoading(false)
    }
    fetchAgents()
  }, [])

  const domains = ['全部', 'Computer Vision', 'NLP', 'General']

  const filteredAgents = agents.filter((agent) => {
    const matchesDomain = selectedDomain === '全部' || agent.domain === selectedDomain
    const matchesSearch =
      searchQuery === '' ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.paper_id && agent.paper_id.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDomain && matchesSearch
  })

  return (
    <div className="page-enter">
      {/* Header */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#b44aff]/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Orbitron' }}
            >
              <span className="text-white">PAPER</span>
              <span className="text-[#b44aff]">_</span>
              <span className="text-[#00d4ff]">AGENTS</span>
            </h1>
            <p className="text-[#8888aa] text-lg">
              {loading ? '加载中...' : `共 ${agents.length} 个角色`}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索角色..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cyber pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8888aa]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Domain Filter */}
          <div className="flex gap-3 justify-center flex-wrap">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDomain === domain
                    ? 'bg-[#b44aff] text-white shadow-[0_0_20px_rgba(180,74,255,0.3)]'
                    : 'bg-[#12121a] text-[#8888aa] hover:text-white border border-[rgba(180,74,255,0.2)]'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#b44aff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8888aa] text-lg mb-4">没有找到匹配的角色</p>
              <Link href="/upload" className="btn-primary inline-block">
                上传第一篇论文
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent, index) => (
                <Link
                  key={agent.id}
                  href={agent.id.startsWith('demo-') ? '#' : `/agent/${agent.id}`}
                  onClick={(e) => {
                    if (agent.id.startsWith('demo-')) {
                      e.preventDefault()
                      alert('这是一个演示角色，请上传真实论文创建角色')
                    }
                  }}
                  className="character-card block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`h-40 bg-gradient-to-br ${agent.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl opacity-50">{agent.emoji}</span>
                    </div>
                    <div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${agent.color}20`,
                        border: `1px solid ${agent.color}50`,
                        color: agent.color,
                      }}
                    >
                      {agent.domain}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'Orbitron', color: agent.color }}
                      >
                        {agent.name}
                      </h3>
                      {agent.id.startsWith('demo-') && (
                        <span className="text-xs px-2 py-1 rounded bg-[#ff6b35]/20 text-[#ff6b35]">
                          演示
                        </span>
                      )}
                    </div>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.personality.slice(0, 3).map((trait: string) => (
                        <span
                          key={trait}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: 'rgba(180,74,255,0.1)',
                            color: '#b44aff',
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {agent.skills.slice(0, 2).map((skill: any) => (
                        <span key={skill.name} className="skill-tag">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
