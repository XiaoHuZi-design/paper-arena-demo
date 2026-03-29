'use client'

import { useState } from 'react'
import Link from 'next/link'

const agents = [
  {
    id: 'yolo',
    name: 'YOLO',
    domain: 'CV',
    emoji: '🎯',
    gradient: 'from-[#ff6b35] to-[#ff2d95]',
    color: '#ff6b35',
    traits: ['激进派', '速度至上', '简洁直接'],
  },
  {
    id: 'bert',
    name: 'BERT',
    domain: 'NLP',
    emoji: '📖',
    gradient: 'from-[#00d4ff] to-[#00ff88]',
    color: '#00d4ff',
    traits: ['深思熟虑', '双向理解', '全能'],
  },
  {
    id: 'gpt',
    name: 'GPT',
    domain: 'NLP',
    emoji: '✍️',
    gradient: 'from-[#00ff88] to-[#b44aff]',
    color: '#00ff88',
    traits: ['创造性强', '对话流畅', '规模化'],
  },
  {
    id: 'gan',
    name: 'GAN',
    domain: 'CV',
    emoji: '🎨',
    gradient: 'from-[#b44aff] to-[#ff2d95]',
    color: '#b44aff',
    traits: ['对抗性', '创造性', '博弈论'],
  },
]

export default function Battle() {
  const [selected, setSelected] = useState<string[]>([])
  const [battleStarted, setBattleStarted] = useState(false)
  const [battleRound, setBattleRound] = useState(0)
  const [loading, setLoading] = useState(false)

  const toggleAgent = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id))
    } else if (selected.length < 3) {
      setSelected([...selected, id])
    }
  }

  const startBattle = () => {
    if (selected.length >= 2) {
      setLoading(true)
      // Simulate AI generating battle
      setTimeout(() => {
        setBattleStarted(true)
        setBattleRound(0)
        setLoading(false)
      }, 1500)
    }
  }

  const getSelectedAgents = () => agents.filter((a) => selected.includes(a.id))

  if (battleStarted) {
    return (
      <div className="page-enter">
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Battle Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-[#ff2d95]">BATTLE</span>
                <span className="text-white">_</span>
                <span className="text-[#00d4ff]">ARENA</span>
              </h1>
            </div>

            {/* VS Display */}
            <div className="flex items-center justify-center gap-8 mb-12">
              {getSelectedAgents().map((agent, i) => (
                <div key={agent.id} className="text-center">
                  <div
                    className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-6xl mb-4 mx-auto`}
                  >
                    {agent.emoji}
                  </div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Orbitron', color: agent.color }}>
                    {agent.name}
                  </h3>
                  <p className="text-xs text-[#8888aa]">{agent.domain}</p>
                </div>
              ))}
            </div>

            {/* VS Badge */}
            <div className="battle-vs mb-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff2d95] to-[#b44aff] flex items-center justify-center mx-auto">
                <span className="text-3xl font-black" style={{ fontFamily: 'Orbitron' }}>VS</span>
              </div>
            </div>

            {/* Battle Content - Simplified for demo */}
            <div className="space-y-6 mb-12">
              {getSelectedAgents().map((agent, i) => (
                <div
                  key={agent.id}
                  className="glow-border rounded-2xl p-6"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl flex-shrink-0`}
                    >
                      {agent.emoji}
                    </div>
                    <div>
                      <span className="font-bold" style={{ color: agent.color }}>{agent.name}:</span>
                      <p className="text-[#aaaacc] mt-2 leading-relaxed">
                        {agent.id === 'yolo' && "我，YOLO，代表实时检测的最高效率！端到端设计，无需复杂流程，速度就是一切！"}
                        {agent.id === 'bert' && "我 BERT 的双向注意力机制能捕捉最丰富的上下文信息，理解深度无可匹敌！"}
                        {agent.id === 'gpt' && "规模化是我的核心理念，大模型涌现的能力可以应对任何语言任务！"}
                        {agent.id === 'gan' && "生成与判别的对抗学习让我能创造出以假乱真的内容，这就是创造力的极致！"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="glow-border rounded-2xl p-8 text-center bg-gradient-to-br from-[#b44aff]/10 to-transparent">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-[#b44aff]">裁判总结</span>
              </h3>
              <p className="text-[#8888aa] leading-relaxed">
                每篇论文都有其独特价值——YOLO 速度快、BERT 理解深、GPT 能力全、GAN 创造强。
                选择取决于具体场景需求，没有绝对的王者。
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setBattleStarted(false)
                  setSelected([])
                }}
                className="btn-secondary flex-1"
              >
                重新选择
              </button>
              <Link href="/explore" className="btn-primary flex-1 text-center">
                探索更多角色
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Orbitron' }}>
              <span className="text-[#ff2d95]">BATTLE</span>
              <span className="text-white">_</span>
              <span className="text-[#00d4ff]">ARENA</span>
            </h1>
            <p className="text-[#8888aa]">选择 2-3 篇论文，让它们 Battle 辩论</p>
          </div>

          {/* Selection Info */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#12121a] border border-[rgba(180,74,255,0.2)]">
              <span className="text-[#8888aa]">已选择:</span>
              <span className="text-[#b44aff] font-bold">{selected.length}/3</span>
              {selected.length < 2 && (
                <span className="text-xs text-[#ff2d95]">至少选择2篇</span>
              )}
            </div>
          </div>

          {/* Agent Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {agents.map((agent) => {
              const isSelected = selected.includes(agent.id)
              return (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`character-card text-left p-6 transition-all ${
                    isSelected ? 'ring-2 ring-[#b44aff]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-3xl transition-transform ${
                        isSelected ? 'scale-110' : ''
                      }`}
                    >
                      {agent.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold" style={{ fontFamily: 'Orbitron', color: agent.color }}>
                          {agent.name}
                        </h3>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#b44aff] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#8888aa] mb-2">{agent.domain}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.traits.slice(0, 2).map((trait) => (
                          <span key={trait} className="text-xs px-2 py-0.5 rounded bg-[#12121a] text-[#8888aa]">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Start Button */}
          <button
            onClick={startBattle}
            disabled={selected.length < 2 || loading}
            className="btn-primary w-full !py-4 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成辩论中...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                开始 Battle
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-8 p-4 rounded-xl bg-[#12121a]/50 border border-[rgba(180,74,255,0.1)] text-center">
            <p className="text-xs text-[#8888aa]">
              <span className="text-[#00d4ff]">Battle 规则:</span>
              选中的论文角色将以对抗形式进行辩论，展示各自优势并攻击对方弱点
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
