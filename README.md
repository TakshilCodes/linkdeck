# 🚀 LinkDeck.in

> A modern Linktree-style SaaS for creators to manage and share their links — built with a production-ready full-stack architecture.

---

## 🧠 Overview

**LinkDeck.in** is a personal link management platform where users can:

* Create a public profile → `linkdeck.in/username`
* Add and manage links
* Customize themes (colors, fonts, buttons, etc.)
* See a real-time phone preview
* Remove branding with a one-time payment (₹50)

---

## ⚙️ Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Zustand (state management)

### Backend

* Next.js API Routes (monolith)

### Database

* PostgreSQL (Docker local)
* Prisma ORM (v7 with PrismaPg adapter)

### Caching / Infra

* Redis (Docker, ioredis)

---

## 🏗️ Current Status

### ✅ Completed

* Docker setup (Postgres + Redis)
* Prisma setup with custom adapter
* Database connection working
* Initial schema design (User, Theme, Customization, Links, etc.)

### 🚧 In Progress

* Auth system (OTP / Email flow)
* Dashboard UI (drag-drop, toggle, edit)
* Public profile page
* Theme system (default + customization)
* Link management system

### ⏳ Planned

* Razorpay payment integration (₹50 branding removal)
* Redis caching (public profile)
* Rate limiting
* Deployment (Neon + Upstash + Vercel)
* CI/CD pipeline

---

## 📦 Features (V1)

* 🔗 Add / edit / delete links
* 👁️ Toggle link visibility
* 🎨 Theme system (default + user customization)
* 📱 Real-time preview (phone UI)
* 👤 Public profile page
* 💳 Branding removal (one-time payment)

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/TakshilCodes/linkdeck.git
cd linkdeck
```

---

### 2. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/linkdeck"
REDIS_URL="redis://127.0.0.1:6379"

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

### 3. Start Docker services

```bash
docker-compose up -d
```

---

### 4. Run Prisma migration

```bash
npx prisma migrate dev --name init_schema
```

---

### 5. Start the app

```bash
npm run dev
```

---

## 📌 Author

**Takshil Pandya**
Full-stack developer building scalable SaaS products.

---

## ⚠️ Note

This project is currently under active development.
Features, structure, and implementation may change.

---
