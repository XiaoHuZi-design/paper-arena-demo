'use client'

import { useState, useEffect } from 'react'
import { createClient, createPaper, getPaperAgents } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/upload')
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !abstract.trim()) return

    setUploading(true)

    try {
      // Create paper in database
      const paper = await createPaper(supabase, {
        title: title.trim(),
        abstract: abstract.trim(),
      })

      // Generate paper agent using AI
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'generate-agent',
            title: title.trim(),
            abstract: abstract.trim(),
          }),
        })

        const data = await response.json()
        if (data.success && data.agent) {
          // Update the paper agent with AI-generated data
          const supabase = createClient()
          const { error } = await supabase
            .from('paper_agents')
            .update({
              name: data.agent.name,
              emoji: getEmojiForDomain(title),
              gradient: getGradientForDomain(title),
              personality: data.agent.personality,
              skills: data.agent.skills,
              weaknesses: data.agent.weaknesses,
              system_prompt: data.agent.systemPrompt,
            })
            .eq('paper_id', paper.id)

          if (error) {
            console.error('Error updating paper agent:', error)
          }
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError)
        // Continue anyway - paper is created
      }

      alert('论文上传成功！角色已生成！')
      router.push('/explore')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || '上传失败，请重试')
    }

    setUploading(false)
  }

  const getEmojiForDomain = (title: string): string => {
    const lower = title.toLowerCase()
    if (lower.includes('vision') || lower.includes('detection') || lower.includes('yolo')) return '👁️'
    if (lower.includes('language') || lower.includes('nlp') || lower.includes('bert') || lower.includes('gpt')) return '📝'
    if (lower.includes('robot')) return '🤖'
    if (lower.includes('reinforcement') || lower.includes('rl')) return '🎮'
    if (lower.includes('gan') || lower.includes('生成')) return '🎨'
    if (lower.includes('audio') || lower.includes('speech') || lower.includes('voice')) return '🎤'
    return '📄'
  }

  const getGradientForDomain = (title: string): string => {
    const lower = title.toLowerCase()
    if (lower.includes('vision') || lower.includes('detection')) return 'from-[#ff6b35] to-[#ff2d95]'
    if (lower.includes('language') || lower.includes('nlp')) return 'from-[#00d4ff] to-[#00ff88]'
    if (lower.includes('robot')) return 'from-[#6366f1] to-[#8b5cf6]'
    if (lower.includes('reinforcement')) return 'from-[#f59e0b] to-[#ef4444]'
    if (lower.includes('gan') || lower.includes('生成')) return 'from-[#b44aff] to-[#ff2d95]'
    return 'from-[#b44aff] to-[#00d4ff]'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      // Try to extract title from filename
      const fileName = droppedFile.name.replace('.pdf', '')
      if (!title) {
        setTitle(fileName)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#b44aff] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#8888aa] mb-4">请先登录</p>
          <Link href="/login?redirect=/upload" className="btn-primary inline-block">
            前往登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Orbitron' }}>
              <span className="text-white">UPLOAD</span>
              <span className="text-[#b44aff]">_</span>
              <span className="text-[#00d4ff]">PAPER</span>
            </h1>
            <p className="text-[#8888aa]">上传论文，AI将其转化为二次元角色</p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragOver
                  ? 'border-[#b44aff] bg-[#b44aff]/5'
                  : 'border-[rgba(180,74,255,0.3)] hover:border-[#b44aff]/50'
              } ${file ? 'bg-[#00ff88]/5 border-[#00ff88]/50' : ''}`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#00ff88]/20 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#00ff88]">{file.name}</p>
                    <p className="text-xs text-[#8888aa]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="ml-4 p-2 rounded-lg hover:bg-[#12121a] transition text-[#ff2d95]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#12121a] flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <p className="text-[#8888aa] mb-2">拖拽 PDF 文件到此处</p>
                  <p className="text-xs text-[#666680] mb-4">或者</p>
                  <label className="btn-secondary inline-block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) {
                          setFile(f)
                          if (!title) {
                            setTitle(f.name.replace('.pdf', ''))
                          }
                        }
                      }}
                      className="hidden"
                    />
                    选择文件
                  </label>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-[#8888aa] mb-2">论文标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-cyber"
                placeholder="例如: You Only Look Once"
                required
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm text-[#8888aa] mb-2">论文摘要</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="input-cyber min-h-[150px] resize-y"
                placeholder="粘贴论文摘要..."
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!title.trim() || !abstract.trim() || uploading}
              className="btn-primary w-full !py-4 flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成角色中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  生成角色
                </>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 rounded-xl bg-[#12121a]/50 border border-[rgba(180,74,255,0.1)]">
            <p className="text-xs text-[#8888aa]">
              <span className="text-[#b44aff]">提示：</span>
              AI 会分析论文的标题和摘要，生成一个独特的二次元角色。
              角色会拥有基于论文方法论的性格、技能和弱点。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
