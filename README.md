# Paper Arena - 二次元科研社区

把论文变成"角色"，让科研变得有趣。

## 🎯 核心理念

Paper Arena 是一个将学术论文拟人化的知识平台。每篇论文都会被 AI 转化成一个独特的二次元角色，拥有自己的性格、技能和弱点。

### 核心玩法

1. **📚 论文角色化** — 上传论文，AI 生成角色
2. **💬 和论文对话** — 直接向论文角色提问，快速理解内容
3. **⚔️ 论文 Battle** — 让不同论文角色辩论，促进科研碰撞

## 📸 效果预览

### 首页
![首页](home.png)

### 探索页 - 角色广场
![探索页](explore.png)

### 上传论文
![上传](upload.png)

### 辩论 Battle
![Battle](battle.png)

### 用户登录
![登录](login.png)

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 (App Router) | 前端框架 |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式 |
| Supabase | 数据库 + 认证 |
| MiniMax AI (Codeplan) | AI 对话生成 |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/XiaoHuZi-design/paper-arena-demo.git
cd paper-arena
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MiniMax AI (可选，用于生成角色)
ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic
ANTHROPIC_AUTH_TOKEN=your-token
ANTHROPIC_MODEL=MiniMax-M2.7
```

### 4. 创建 Supabase 数据库

在 [Supabase Dashboard](https://supabase.com/dashboard) SQL Editor 中执行：

```sql
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

-- Paper Agents table
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

-- Enable RLS
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can see own papers" ON papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own papers" ON papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view paper agents" ON paper_agents FOR SELECT USING (true);
CREATE POLICY "Auth can insert paper agents" ON paper_agents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can see own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view battles" ON battles FOR SELECT USING (true);
CREATE POLICY "Auth can insert battles" ON battles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 5. 配置 GitHub OAuth（可选）

1. 打开 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. Callback URL 填：`https://your-project.supabase.co/auth/v1/callback`
4. 在 Supabase Dashboard → Authentication → Providers → GitHub 填入 Client ID 和 Secret

### 6. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3847

## 📁 项目结构

```
paper-arena/
├── app/
│   ├── page.tsx              # 首页
│   ├── layout.tsx             # 布局
│   ├── globals.css           # 全局样式
│   ├── explore/              # 探索页 - 角色广场
│   ├── upload/               # 上传页 - 上传论文
│   ├── battle/               # Battle页 - 论文辩论
│   ├── agent/[id]/           # 角色详情页
│   │   ├── page.tsx         # 角色卡
│   │   └── chat/            # 对话页
│   ├── login/                # 登录页
│   ├── register/             # 注册页
│   ├── profile/              # 个人主页
│   └── auth/                 # OAuth 回调
├── components/
│   └── UserButton.tsx        # 用户菜单组件
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # 浏览器端 Supabase 客户端
│   │   ├── server.ts        # 服务端 Supabase 客户端
│   │   └── middleware.ts     # 认证中间件
│   └── minimax.ts            # MiniMax AI 封装
├── middleware.ts             # Next.js 中间件
└── package.json
```

## 🎨 设计风格

赛博朋克 + 学术风格：

- 深色背景 (`#0a0a12`)
- 霓虹发光边框
- Orbitron 科幻字体
- 角色卡 ARPG 风格设计
- 渐变色系区分不同领域

## ⚠️ 当前状态

这是一个 **MVP (最小可行产品)**，部分功能还在开发中：

| 功能 | 状态 |
|------|------|
| 用户注册/登录 | ✅ 已完成 |
| GitHub OAuth | ✅ 已完成 |
| 论文上传 | ✅ 已完成 |
| AI 生成角色 | ✅ 已完成 |
| 和论文对话 | ⚠️ UI 完成，AI 待接入 |
| 论文 Battle | ⚠️ UI 完成，AI 待接入 |

## 📝 开发日志

详见 [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
