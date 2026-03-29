import Link from 'next/link'

export default function Home() {
  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(180,74,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(180,74,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'gridMove 20s linear infinite',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b44aff] rounded-full opacity-10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Main title */}
          <div className="mb-8" style={{ fontFamily: 'Orbitron' }}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-4">
              <span className="text-white">PAPER</span>
              <span className="text-[#b44aff]">_</span>
              <span className="text-[#00d4ff]">ARENA</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#8888aa] tracking-widest">
              二次元科研社区 · 拟人化知识平台
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#aaaacc] max-w-2xl mx-auto mb-12 leading-relaxed">
            把论文变成<span className="text-[#b44aff] font-bold">「角色」</span>
            ，和它们对话快速理解学术研究
            <br />
            让不同论文<span className="text-[#00d4ff] font-bold">Battle辩论</span>
            ，促进科研碰撞
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/explore" className="btn-primary text-lg group">
              <span className="flex items-center gap-2">
                开始探索
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link href="/battle" className="btn-secondary text-lg">
              观看对战
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { num: '128', label: '论文角色' },
              { num: '1.2K', label: '对话次数' },
              { num: '89', label: '辩论场次' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: 'Orbitron' }}
                >
                  {stat.num}
                </div>
                <div className="text-sm text-[#8888aa] tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#8888aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-16">
            <span className="text-sm text-[#b44aff] tracking-widest mb-4 block">HOW IT WORKS</span>
            <span className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Orbitron' }}>
              核心玩法
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glow-border rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#b44aff]/20 to-[#00d4ff]/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Orbitron' }}>角色生成</h3>
              <p className="text-[#8888aa] leading-relaxed">
                每篇论文变成独特的二次元角色，拥有性格、技能和弱点，让知识活起来
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glow-border rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#00ff88]/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Orbitron' }}>论文对话</h3>
              <p className="text-[#8888aa] leading-relaxed">
                直接向论文角色提问，用轻松的方式快速理解复杂的学术内容
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glow-border rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#ff2d95]/20 to-[#ff6b35]/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                ⚔️
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Orbitron' }}>论文对战</h3>
              <p className="text-[#8888aa] leading-relaxed">
                挑选多篇论文，让它们以角色身份Battle辩论，碰撞出科研火花
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Character Showcase */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b44aff]/5 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-center mb-4">
            <span className="text-sm text-[#00d4ff] tracking-widest mb-4 block">CHARACTERS</span>
            <span className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Orbitron' }}>
              角色图鉴
            </span>
          </h2>
          <p className="text-center text-[#8888aa] mb-16">和论文角色对话，快速理解学术前沿</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* YOLO Card */}
            <div className="character-card">
              <div className="h-48 bg-gradient-to-br from-[#ff6b35]/20 to-[#ff2d95]/20 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl animate-pulse">🎯</div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#ff6b35]/20 border border-[#ff6b35]/30 text-[#ff6b35] text-xs font-bold">
                  CV
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron' }}>YOLO</h3>
                  <span className="text-xs text-[#8888aa]">2016</span>
                </div>
                <p className="text-sm text-[#8888aa] mb-4">You Only Look Once · 实时目标检测</p>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#b44aff] font-bold">性格</span>
                    <p className="text-sm text-[#aaaacc]">激进派 · 速度至上 · 简洁直接</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="skill-tag">实时检测</span>
                    <span className="skill-tag">端到端</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BERT Card */}
            <div className="character-card">
              <div className="h-48 bg-gradient-to-br from-[#00d4ff]/20 to-[#00ff88]/20 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl animate-pulse">📖</div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/30 text-[#00d4ff] text-xs font-bold">
                  NLP
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron' }}>BERT</h3>
                  <span className="text-xs text-[#8888aa]">2018</span>
                </div>
                <p className="text-sm text-[#8888aa] mb-4">Bidirectional Encoder · 双向Transformer</p>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#b44aff] font-bold">性格</span>
                    <p className="text-sm text-[#aaaacc]">深思熟虑 · 双向理解 · 全能</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="skill-tag">注意力机制</span>
                    <span className="skill-tag">迁移学习</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GPT Card */}
            <div className="character-card">
              <div className="h-48 bg-gradient-to-br from-[#00ff88]/20 to-[#b44aff]/20 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl animate-pulse">✍️</div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold">
                  NLP
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron' }}>GPT</h3>
                  <span className="text-xs text-[#8888aa]">2018</span>
                </div>
                <p className="text-sm text-[#8888aa] mb-4">Generative Pre-trained · 大语言模型</p>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#b44aff] font-bold">性格</span>
                    <p className="text-sm text-[#aaaacc]">创造性强 · 对话流畅 · 规模化</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="skill-tag">文本生成</span>
                    <span className="skill-tag">上下文学习</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/explore" className="btn-secondary inline-flex items-center gap-2">
              查看更多角色
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glow-border rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#b44aff]/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Orbitron' }}>
              准备好加入了吗？
            </h2>
            <p className="text-[#8888aa] text-lg mb-8 max-w-xl mx-auto">
              上传你的第一篇论文，生成专属角色，开始有趣的学术探索之旅
            </p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
              上传论文
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
