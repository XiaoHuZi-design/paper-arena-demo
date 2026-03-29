const BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic'
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || ''
const MODEL = process.env.ANTHROPIC_MODEL || 'MiniMax-M2.7'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatOptions {
  messages: Message[]
  system?: string
  max_tokens?: number
}

export async function chat(options: ChatOptions): Promise<string> {
  const { messages, system, max_tokens = 1024 } = options

  const response = await fetch(`${BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AUTH_TOKEN,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens,
      system,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MinMax API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// 论文角色生成
export async function generatePaperAgent(paperContent: {
  title: string
  abstract: string
  authors?: string
  year?: string
}): Promise<{
  name: string
  personality: string[]
  skills: { name: string; description: string }[]
  weaknesses: { name: string; description: string }[]
  systemPrompt: string
}> {
  const systemPrompt = `你是一个论文角色化专家。根据论文信息，生成一个有趣的二次元角色设定。
要求：
1. 角色名要简短有力，体现论文核心思想
2. 性格特点要反映论文方法的特点（激进/保守/全能等）
3. 技能要体现论文的主要贡献和优势
4. 弱点要诚实指出论文的局限性
5. systemPrompt 要让AI能以这个论文角色的口吻回答问题

以JSON格式返回，包含：
- name: 角色名
- personality: 性格特点数组
- skills: 技能数组，每个技能有name和description
- weaknesses: 弱点数组，每个弱点有name和description
- systemPrompt: 系统提示词，用于让AI扮演这个角色`

  const userMessage = `请为这篇论文生成角色：
标题：${paperContent.title}
摘要：${paperContent.abstract}
${paperContent.authors ? `作者：${paperContent.authors}` : ''}
${paperContent.year ? `年份：${paperContent.year}` : ''}`

  const result = await chat({
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
    max_tokens: 2048,
  })

  // 解析JSON响应
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found in response')
  } catch {
    // 如果解析失败，返回一个默认角色
    return {
      name: paperContent.title.slice(0, 10),
      personality: ['神秘', '有待探索'],
      skills: [{ name: '待发现', description: '需要进一步分析' }],
      weaknesses: [{ name: '未知', description: '需要进一步分析' }],
      systemPrompt: `你是${paperContent.title}的角色。`,
    }
  }
}

// 对话生成
export async function generateResponse(options: {
  paperInfo: {
    title: string
    abstract: string
    personality: string[]
    skills: { name: string; description: string }[]
    weaknesses: { name: string; description: string }[]
  }
  messages: Message[]
}): Promise<string> {
  const { paperInfo, messages } = options

  const systemPrompt = `你是论文"${paperInfo.title}"的拟人化角色。

角色背景：
- 性格特点：${paperInfo.personality.join('、')}
- 核心技能：${paperInfo.skills.map((s) => `${s.name}(${s.description})`).join('、')}
- 已知弱点：${paperInfo.weaknesses.map((w) => `${w.name}(${w.description})`).join('、')}

论文摘要：${paperInfo.abstract}

请以这个角色的口吻回答问题。回答要：
1. 体现角色的性格特点
2. 简洁有趣，避免过于学术化
3. 适当使用emoji增加趣味性
4. 对于弱点要诚实承认，不要回避
5. 如果问题超出论文范围，可以礼貌地表示不了解`

  return chat({
    messages,
    system: systemPrompt,
    max_tokens: 1024,
  })
}

// 辩论生成
export async function generateBattle(options: {
  papers: {
    title: string
    abstract: string
    personality: string[]
    skills: { name: string; description: string }[]
    weaknesses: { name: string; description: string }[]
  }[]
  topic?: string
}): Promise<{
  rounds: { speaker: string; content: string; attacks: string[] }[]
  conclusion: string
}> {
  const { papers, topic } = options

  const systemPrompt = `你是一个论文辩论主持人。让多篇论文角色进行辩论。

规则：
1. 每轮每个角色发言一次
2. 角色要攻击其他角色的弱点，维护自己的优势
3. 角色要用自己的性格说话
4. 最后给出一个客观的总结

以JSON格式返回：
{
  "rounds": [
    {
      "speaker": "角色名",
      "content": "发言内容",
      "attacks": ["攻击其他角色的内容"]
    }
  ],
  "conclusion": "最终结论"
}`

  const papersInfo = papers
    .map(
      (p, i) => `论文${i + 1}: ${p.title}
性格：${p.personality.join('、')}
优势：${p.skills.map((s) => s.name).join('、')}
弱点：${p.weaknesses.map((w) => w.name).join('、')}`
    )
    .join('\n\n')

  const userMessage = `论文信息：
${papersInfo}
${topic ? `辩论主题：${topic}` : '请自由辩论各论文的优劣'}`

  const result = await chat({
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
    max_tokens: 2048,
  })

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // 解析失败，返回默认
  }

  return {
    rounds: papers.map((p) => ({
      speaker: p.title.slice(0, 10),
      content: '期待精彩的辩论！',
      attacks: [],
    })),
    conclusion: '辩论进行中...',
  }
}
