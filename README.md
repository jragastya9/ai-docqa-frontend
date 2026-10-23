# 🎨 LocalBiz AI — Frontend

> The Next.js 16 dashboard & marketing site for **LocalBiz AI** — a multi-tenant RAG SaaS.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-brightgreen)](https://ai-docqa-frontend-psi.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 What it does

A marketing site + full authenticated dashboard for a multi-tenant AI SaaS.

- Public landing page (hero, features, pricing, FAQ)
- Signup / login / password reset flows
- Dashboard with real-time KPIs
- Document upload & management
- Streaming chat with cited answers
- Team invites with roles
- Billing & usage metering
- Settings (branding, AI provider, security, legal)
- Super admin panel
- PWA installable, mobile-first, dark mode

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| Charts | Recharts |
| Auth | NextAuth v5 (Google) + JWT |
| State | React Query (planned) + custom store |
| PWA | Manifest + Service Worker |
| Deployment | Vercel |

---

## ✨ Features

- ✅ Landing page with dynamic OG images
- ✅ Auth (email + Google OAuth)
- ✅ Chat with SSE streaming
- ✅ Real-time notifications
- ✅ Cmd+K command palette
- ✅ Dark mode + PWA
- ✅ Settings (6 tabs)
- ✅ Analytics dashboard
- ✅ Cookie consent + legal pages
- ✅ Changelog + Roadmap + Launch pages

---

## ⚙️ Local Setup

### 1. Install

```bash
git clone https://github.com/jragastya9/ai-docqa-frontend.git
cd ai-docqa-frontend
npm install

2. Environment
Create .env.local:

env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPER_ADMIN_EMAILS=you@example.com

AUTH_SECRET=generate_with_crypto.randomBytes(32).toString('hex')
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
3. Start
bash
npm run dev
Open http://localhost:3000.

🚀 Deployment (Vercel)
Import ai-docqa-frontend repo

Framework: Next.js (auto-detected)

Environment variables: Add all from .env.local

Build: npm run build (default)

Click Deploy

After deploy, update:

NEXT_PUBLIC_SITE_URL = your Vercel URL

AUTH_URL = your Vercel URL

NEXTAUTH_URL = your Vercel URL

Google OAuth redirect URIs

📁 Project Structure
text
frontend/
├── app/
│   ├── (auth)/          Login, signup, verify
│   ├── (dashboard)/     Chat, docs, billing, settings
│   ├── legal/           Privacy, Terms, Cookies
│   ├── changelog/       Product updates
│   ├── roadmap/         Public roadmap
│   ├── share/[token]/   Public Q&A
│   └── layout.tsx       Root layout
├── components/
│   ├── ui/              shadcn primitives
│   ├── dashboard/       Sidebar, topbar, stat cards
│   ├── marketing/       Landing page sections
│   └── notifications-*.tsx
├── lib/
│   ├── api.ts           Axios instance
│   ├── {feature}-api.ts Typed API clients
│   ├── tenant-store.ts  Global tenant state
│   └── utils.ts         cn() helper
└── public/
    ├── manifest.json    PWA manifest
    ├── sw.js            Service worker
    └── icons/           App icons
📚 Documentation
See design_system.md for the complete visual language guide.

🔗 Related
Backend: ai-docqa-backend

Live Demo: ai-docqa-frontend-psi.vercel.app

📄 License
MIT © 2026 [AGASTYA]