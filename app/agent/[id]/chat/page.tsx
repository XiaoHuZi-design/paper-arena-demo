'use client'

import { useState } from 'react'
import Link from 'next/link'

// 模拟论文数据 - 实际应该从后端获取
const paperAgents: Record<string, any> = {
  yolo: {
    id: 'yolo',
    name: 'YOLO',
    paper: 'You Only Look Once: Unified, Real-Time Object Detection',
    abstract:
      'YOLO将目标检测重新定义为一个单一的回归问题，直接从图像像素到边界框坐标和概率。',
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
  },
  bert: {
    id: 'bert',
    name: 'BERT',
    paper: 'Bidirectional Encoder Representations from Transformers',
    abstract:
      'BERT通过在所有层中同时考虑左右上下文来预训练深层双向表示。',
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
  },
  gpt: {
    id: 'gpt',
    name: 'GPT',
    paper: 'Generative Pre-trained Transformer',
    abstract:
      'GPT通过大规模无标注文数据的预训练和微调，实现通用语言理解。',
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
  },
}

export default function Chat({ params }: { params: { id: string } }) {
  const agent = paperAgents[params.id] || paperAgents.yolo
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          paperInfo: {
            title: agent.paper,
            abstract: agent.abstract,
            personality: agent.personality,
            skills: agent.skills,
            weaknesses: agent.weaknesses,
          },
          messages: newMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: '抱歉，出了点问题...' }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([...newMessages, { role: 'assistant', content: '网络错误，请重试...' }])
    }

    setLoading(false)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/agent/${params.id}`} className="text-purple-600 hover:underline">
          ← 返回
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
          🎯
        </div>
        <h1 className="text-2xl font-bold">和 {agent.name} 对话</h1>
        <p className="text-gray-600">问任何关于这篇论文的问题</p>
      </div>

      {/* 预设问题 */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[
          '这篇论文的核心贡献是什么？',
          '方法有什么局限性？',
          '实际应用场景有哪些？',
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 对话区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 min-h-[400px] p-6">
        {messages.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-gray-400">
            <p>开始问问题吧！👇</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl text-gray-500">
                  思考中...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`问 ${agent.name} 任何问题...`}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
        >
          发送
        </button>
      </div>
    </main>
  )
}
