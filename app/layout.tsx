import type { Metadata } from 'next'
import './globals.css'
import UserButton from '@/components/UserButton'

export const metadata: Metadata = {
  title: 'Paper Arena - 二次元科研社区',
  description: '把论文变成角色，让科研变得有趣',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a12]/80 border-b border-[rgba(180,74,255,0.15)]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#b44aff] to-[#00d4ff] flex items-center justify-center text-xl font-bold tracking-wider group-hover:shadow-[0_0_30px_rgba(180,74,255,0.5)] transition-shadow">
                PA
              </div>
              <span className="text-xl font-bold tracking-wider hidden sm:block" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-white">PAPER</span>
                <span className="text-[#b44aff]">_</span>
                <span className="text-[#00d4ff]">ARENA</span>
              </span>
            </a>
            <div className="flex items-center gap-8">
              <a href="/explore" className="nav-link text-sm font-medium tracking-wide">探索</a>
              <a href="/upload" className="nav-link text-sm font-medium tracking-wide">上传</a>
              <a href="/battle" className="nav-link text-sm font-medium tracking-wide">对战</a>
              <UserButton />
            </div>
          </div>
        </nav>
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <footer className="border-t border-[rgba(180,74,255,0.1)] py-8 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-[#8888aa] text-sm">
            <p style={{ fontFamily: 'Orbitron' }}>PAPER_ARENA v1.0</p>
            <p className="mt-2">让科研更有趣</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
