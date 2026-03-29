import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, generateBattle, generatePaperAgent } from '@/lib/minimax'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    switch (type) {
      case 'chat': {
        const { paperInfo, messages } = data
        const response = await generateResponse({ paperInfo, messages })
        return NextResponse.json({ success: true, response })
      }

      case 'battle': {
        const { papers, topic } = data
        const result = await generateBattle({ papers, topic })
        return NextResponse.json({ success: true, result })
      }

      case 'generate-agent': {
        const { title, abstract, authors, year } = data
        const agent = await generatePaperAgent({ title, abstract, authors, year })
        return NextResponse.json({ success: true, agent })
      }

      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}
