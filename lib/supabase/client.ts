import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types
export interface Paper {
  id: string
  user_id: string
  title: string
  authors: string | null
  abstract: string
  pdf_url: string | null
  created_at: string
  updated_at: string
}

export interface PaperAgent {
  id: string
  paper_id: string
  name: string
  emoji: string
  gradient: string
  domain: string | null
  personality: string[]
  skills: { name: string; description: string }[]
  weaknesses: { name: string; description: string }[]
  system_prompt: string | null
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  paper_agent_id: string
  messages: { role: string; content: string }[]
  created_at: string
}

export interface Battle {
  id: string
  user_id: string
  paper_agent_ids: string[]
  topic: string | null
  rounds: { speaker: string; content: string; attacks: string[] }[]
  conclusion: string | null
  winner_id: string | null
  created_at: string
}

// Paper operations
export async function getPapers(supabase: ReturnType<typeof createBrowserClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('papers')
    .select('*, paper_agents(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createPaper(supabase: ReturnType<typeof createBrowserClient>, paper: {
  title: string
  authors?: string
  abstract: string
  pdf_url?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('papers')
    .insert({
      user_id: user.id,
      title: paper.title,
      authors: paper.authors || null,
      abstract: paper.abstract,
      pdf_url: paper.pdf_url || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Paper Agent operations
export async function getPaperAgents(supabase: ReturnType<typeof createBrowserClient>) {
  const { data, error } = await supabase
    .from('paper_agents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPaperAgent(supabase: ReturnType<typeof createBrowserClient>, id: string) {
  const { data, error } = await supabase
    .from('paper_agents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updatePaperAgent(
  supabase: ReturnType<typeof createBrowserClient>,
  id: string,
  updates: Partial<PaperAgent>
) {
  const { data, error } = await supabase
    .from('paper_agents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Conversation operations
export async function createConversation(
  supabase: ReturnType<typeof createBrowserClient>,
  paperAgentId: string
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      paper_agent_id: paperAgentId,
      messages: [],
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateConversation(
  supabase: ReturnType<typeof createBrowserClient>,
  id: string,
  messages: { role: string; content: string }[]
) {
  const { data, error } = await supabase
    .from('conversations')
    .update({ messages })
    .eq('id', id)

  if (error) throw error
}

// Battle operations
export async function createBattle(
  supabase: ReturnType<typeof createBrowserClient>,
  battle: {
    paper_agent_ids: string[]
    topic?: string
  }
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('battles')
    .insert({
      user_id: user.id,
      paper_agent_ids: battle.paper_agent_ids,
      topic: battle.topic || null,
      rounds: [],
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBattle(
  supabase: ReturnType<typeof createBrowserClient>,
  id: string,
  updates: Partial<Battle>
) {
  const { data, error } = await supabase
    .from('battles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
