# 🚀 LinkDeck.in

> A modern Linktree-style SaaS for creators to manage, customize, and share their links with a production-ready full-stack architecture.

---

# 🧠 Overview

**LinkDeck.in** is a creator-focused link management platform where users can:

- Create a public profile → `linkdeck.in/username`
- Add, edit, and organize links
- Create collections/groups for links
- Drag and reorder links & collections
- Toggle visibility of links
- Customize profile themes
- See a real-time phone preview
- Track profile analytics and link clicks
- Manage account/security settings

---

# ⚙️ Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- dnd-kit
- Sonner

## Backend

- Next.js Server Actions
- Next.js API Routes

## Database

- PostgreSQL
- Prisma ORM v7

## Caching / Infra

- Redis
- ioredis
- Docker

## Authentication

- NextAuth
- Google OAuth
- GitHub OAuth
- Credentials Auth
- Email OTP Verification

---

# ✨ Features

## 🔐 Authentication

- Email OTP authentication
- Google login
- GitHub login
- Secure session handling

---

## 👤 Public Profiles

- Public profile pages → `/username`
- User bio & profile image
- Social icons
- Custom themes
- Responsive mobile-first design

---

## 🔗 Link Management

- Add / edit / delete links
- Drag & drop link reordering
- Toggle visibility
- Collections/groups support
- Move links between collections
- Optimistic UI updates

---

## 🎨 Theme System

- Multiple default themes
- User customization support
- Glassmorphism UI
- Real-time preview system
- Phone-style preview rendering

---

## 📊 Insights & Analytics

- Profile view tracking
- Link click tracking
- CTR calculation
- Activity charts
- Top performing links
- Recent activity feed

---

## ⚙️ Account Settings

- Account overview
- Public profile URL management
- Password change system
- OTP-based password reset
- Account security section

---

# 🏗️ Current Project Status

## ✅ Completed

### Core Infrastructure

- Docker setup (Postgres + Redis)
- Prisma ORM setup
- PostgreSQL database integration
- Redis integration
- Environment configuration

### Authentication System

- NextAuth integration
- Google OAuth
- GitHub OAuth
- Email OTP flow
- Session management

### Dashboard System

- Full dashboard UI completed
- Link management system
- Collection management system
- Drag & drop functionality
- Real-time preview system
- Theme customization system
- Account settings page
- Insights/analytics dashboard

### Public Profile System

- Dynamic `/[username]` profile pages
- Responsive rendering
- Theme rendering system
- Social icons support
- Collections rendering

### Analytics System

- Profile view tracking
- Link click tracking
- CTR analytics
- Activity charts
- Recent activity tracking

---

## 🚧 Remaining Pages

- Landing page
- Features page
- Explore page
- Learn page
- Help page

---

## ⏳ Planned Features

- Deployment (Vercel + Neon + Upstash)
- Rate limiting
- Redis caching optimizations
- CI/CD pipeline
- SEO improvements
- Advanced analytics
- Custom domains

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/TakshilCodes/linkdeck.git
cd linkdeck
```

---

## 2. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/linkdeck"

REDIS_URL="redis://127.0.0.1:6379"

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## 3. Start Docker services

```bash
docker-compose up -d
```

---

## 4. Run Prisma migrations

```bash
npx prisma migrate dev
```

---

## 5. Generate Prisma client

```bash
npx prisma generate
```

---

## 6. Start development server

```bash
npm run dev
```

---

# 🧪 Development Status

LinkDeck.in is currently under active development.

The core product architecture, dashboard system, authentication flow, analytics system, and public profile rendering are already completed.

Current focus is on:
- marketing pages
- polishing UX
- optimization
- deployment preparation

---

# 📌 Author

## Takshil Pandya

Full-stack developer focused on building scalable SaaS products, modern web applications, and production-ready systems.

GitHub:
`https://github.com/TakshilCodes`

---

# ⚠️ Note

This project is actively evolving.

Features, architecture, and implementation details may continue to improve over time.