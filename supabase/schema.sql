-- Paper Arena Database Schema
-- Run this in Supabase Dashboard -> SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Papers table
CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors TEXT,
  abstract TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paper Agents table (the character generated from paper)
CREATE TABLE IF NOT EXISTS paper_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📄',
  gradient TEXT DEFAULT 'from-[#b44aff] to-[#00d4ff]',
  domain TEXT,
  personality TEXT[] DEFAULT '{}',
  skills JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  system_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_agent_id UUID REFERENCES paper_agents(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battles table
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_agent_ids UUID[] DEFAULT '{}',
  topic TEXT,
  rounds JSONB DEFAULT '[]',
  conclusion TEXT,
  winner_id UUID REFERENCES paper_agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Papers: users can only see their own papers (for now)
CREATE POLICY "Users can only see own papers" ON papers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own papers" ON papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own papers" ON papers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own papers" ON papers
  FOR DELETE USING (auth.uid() = user_id);

-- Paper Agents: public read, auth write
CREATE POLICY "Anyone can view paper agents" ON paper_agents
  FOR SELECT USING (true);

CREATE POLICY "Auth users can insert paper agents" ON paper_agents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Conversations: users can only see own conversations
CREATE POLICY "Users can only see own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Battles: public read, auth insert
CREATE POLICY "Anyone can view battles" ON battles
  FOR SELECT USING (true);

CREATE POLICY "Auth users can insert battles" ON battles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_agents_paper_id ON paper_agents(paper_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_paper_agent_id ON conversations(paper_agent_id);
CREATE INDEX IF NOT EXISTS idx_battles_user_id ON battles(user_id);

-- Function to auto-create paper_agent when paper is inserted
CREATE OR REPLACE FUNCTION create_paper_agent()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO paper_agents (paper_id, name, domain)
  VALUES (NEW.id, NEW.title, 'General');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create agent on paper insert
DROP TRIGGER IF EXISTS on_paper_insert ON papers;
CREATE TRIGGER on_paper_insert
  AFTER INSERT ON papers
  FOR EACH ROW EXECUTE FUNCTION create_paper_agent();
