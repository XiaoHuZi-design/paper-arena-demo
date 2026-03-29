import Link from 'next/link'
import { createClient, getPaperAgent } from '@/lib/supabase/client'

// Demo agents for when database is empty
const demoAgents: Record<string, any> = {
  'demo-yolo': {
    id: 'demo-yolo',
    name: 'YOLO',
    paper: 'You Only Look Once: Unified, Real-Time Object Detection',
    authors: 'Joseph Redmon, et al.',
    year: '2016',
    domain: 'Computer Vision',
    emoji: '🎯',
    gradient: 'from-red-400 to-orange-400',
    color: '#ff6b35',
    personality: ['激进派', '速度至上', '简洁直接', '端到端思维'],
    skills: [
      { name: '实时检测', description: '每秒处理45帧，业界领先' },
      { name: '端到端', description: '从输入到输出一步到位' },
      { name: '高速度', description: '网络简单，计算量小' },
    ],
    weaknesses: [
      { name: '小目标', description: '密集小物体容易漏检' },
      { name: '遮挡', description: '物体重叠时效果下降' },
      { name: '多尺度', description: '对不同尺度物体适应性有限' },
    ],
    abstract: 'YOLO将目标检测重新定义为一个单一的回归问题，直接从图像像素到边界框坐标和概率。',
  },
  'demo-bert': {
    id: 'demo-bert',
    name: 'BERT',
    paper: 'Bidirectional Encoder Representations from Transformers',
    authors: 'Jacob Devlin, et al.',
    year: '2018',
    domain: 'NLP',
    emoji: '📖',
    gradient: 'from-blue-400 to-cyan-400',
    color: '#00d4ff',
    personality: ['深思熟虑', '双向理解', '全能', '学术派'],
    skills: [
      { name: '双向编码', description: '同时理解左右上下文' },
      { name: '注意力机制', description: '捕捉词语间深层关系' },
      { name: '迁移学习', description: '预训练+微调范式' },
    ],
    weaknesses: [
      { name: '计算量大', description: '参数量大，推理慢' },
      { name: '长文本', description: '对超长文本处理有限' },
      { name: '实时性', description: '不适合实时应用' },
    ],
    abstract: 'BERT通过在所有层中同时考虑左右上下文来预训练深层双向表示。',
  },
  'demo-gpt': {
    id: 'demo-gpt',
    name: 'GPT',
    paper: 'Generative Pre-trained Transformer',
    authors: 'Alec Radford, et al.',
    year: '2018',
    domain: 'NLP',
    emoji: '✍️',
    gradient: 'from-green-400 to-emerald-400',
    color: '#00ff88',
    personality: ['创造性强', '对话流畅', '规模化', '涌现能力'],
    skills: [
      { name: '文本生成', description: '流畅自然的文本产出' },
      { name: '上下文学习', description: 'few-shot学习能力' },
      { name: '规模化', description: '模型越大能力越强' },
    ],
    weaknesses: [
      { name: '幻觉', description: '可能生成虚假信息' },
      { name: '实时知识', description: '知识截止日期限制' },
      { name: '推理成本', description: '大模型推理代价高' },
    ],
    abstract: 'GPT通过大规模无标注文数据的预训练和微调，实现通用语言理解。',
  },
}

async function getAgent(id: string) {
  // Check if it's a demo agent
  if (id.startsWith('demo-')) {
    return demoAgents[id] || demoAgents['demo-yolo']
  }

  try {
    const supabase = createClient()
    const agent = await getPaperAgent(supabase, id)
    if (agent) {
      return {
        ...agent,
        color: '#b44aff',
        gradient: agent.gradient || 'from-[#b44aff] to-[#00d4ff]',
        year: '2024',
        paper: agent.paper_id,
        abstract: '论文摘要',
      }
    }
  } catch (error) {
    console.error('Error fetching agent:', error)
  }

  // Fallback to demo
  return demoAgents['demo-yolo']
}

export default async function AgentDetail({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-[#b44aff] hover:text-white mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回广场
      </Link>

      {/* Agent Card */}
      <div className="bg-[#12121a] rounded-2xl overflow-hidden mb-8">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${agent.gradient} p-8 relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-5xl">
              {agent.emoji}
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Orbitron' }}>
                {agent.name}
              </h1>
              <p className="opacity-90">
                {agent.domain} · {agent.year}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Paper Info */}
          {agent.paper && (
            <div className="mb-8 pb-8 border-b border-[rgba(180,74,255,0.1)]">
              <h2 className="text-sm font-semibold text-[#8888aa] mb-2">论文</h2>
              <p className="font-medium mb-2">{agent.paper}</p>
              {agent.authors && (
                <p className="text-sm text-[#8888aa]">{agent.authors}</p>
              )}
            </div>
          )}

          {/* Personality */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#b44aff] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#b44aff] rounded-full" />
              性格特点
            </h2>
            <div className="flex flex-wrap gap-2">
              {(agent.personality || []).map((trait: string) => (
                <span
                  key={trait}
                  className="px-4 py-2 bg-[#b44aff]/10 text-[#b44aff] rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#00ff88] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00ff88] rounded-full" />
              技能
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(agent.skills || []).map((skill: any) => (
                <div
                  key={skill.name}
                  className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl p-4"
                >
                  <h3 className="font-bold text-[#00ff88] mb-1">{skill.name}</h3>
                  <p className="text-sm text-[#8888aa]">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#ff6b35] mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#ff6b35] rounded-full" />
              弱点
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(agent.weaknesses || []).map((weak: any) => (
                <div
                  key={weak.name}
                  className="bg-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-xl p-4"
                >
                  <h3 className="font-bold text-[#ff6b35] mb-1">{weak.name}</h3>
                  <p className="text-sm text-[#8888aa]">{weak.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract */}
          {agent.abstract && (
            <div className="bg-[#12121a] rounded-xl p-4 border border-[rgba(180,74,255,0.1)]">
              <h2 className="text-sm font-semibold text-[#8888aa] mb-2">论文摘要</h2>
              <p className="text-[#aaaacc] leading-relaxed">{agent.abstract}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href={agent.id.startsWith('demo-') ? '#' : `/agent/${agent.id}/chat`}
          onClick={(e) => agent.id.startsWith('demo-') && e.preventDefault()}
          className={`flex-1 py-4 text-center rounded-xl font-medium transition ${
            agent.id.startsWith('demo-')
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#b44aff] to-[#00d4ff] text-white hover:shadow-lg'
          }`}
        >
          💬 和 {agent.name} 对话
        </Link>
        <Link
          href="/battle"
          className="flex-1 py-4 bg-transparent border-2 border-[#b44aff] text-[#b44aff] rounded-xl font-medium text-center hover:bg-[#b44aff]/10 transition"
        >
          ⚔️ 让 {agent.name} 辩论
        </Link>
      </div>
    </main>
  )
}
