# LinkDeck.in

LinkDeck.in is a creator-focused Linktree-style SaaS. It lets users build one polished public page for links, socials, projects, resources, and collections, then manage that page from a dashboard with live preview, customization, and basic insights.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL
- NextAuth
- Redis / Upstash Redis
- Zustand
- dnd-kit
- Sonner

## Current Product Scope

Implemented:

- Email, Google, GitHub, and credentials authentication
- OTP verification and password reset flows
- Dashboard link and collection management
- Drag and drop board ordering
- Public profile pages at `/[username]`
- Theme and design customization
- Social icons
- Profile image uploads
- Basic analytics for profile views and link clicks
- Account and security settings
- Learn/help content surfaces
- Landing page work in progress

Not currently advertised as product-ready:

- Pricing
- Payments
- Public explore/discovery
- Custom domains
- Advanced analytics

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in the required values:

```env
DATABASE_URL=
REDIS_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=dev

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

Emailjs_ServiceId=
Emailjs_TemplateId=
Emailjs_PublicId=
Emailjs_PrivateId=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

3. Run database migrations and generate Prisma output:

```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the development server:

```bash
npm run dev
```

5. Before shipping changes, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Production Notes

- Keep `.env` files private. Only `.env.example` should be committed.
- Use strong `NEXTAUTH_SECRET` values in every deployed environment.
- Configure production Redis/Upstash before relying on rate limits.
- Configure Cloudinary upload credentials before enabling profile image uploads.
- OTPs are hashed before storage and expire after 10 minutes.
- Server-side title fetching validates URLs, blocks private/local targets, uses a timeout, and limits response size.
- Uploads validate size, MIME type, extension, and image signatures.
- Profile views and link clicks are intentionally basic analytics, not advanced attribution.

## Local-Only Load Tests

The `load-tests/` folder is intentionally ignored by Git. Keep private test scripts, auth cookies, tokens, API keys, trip/profile IDs, and real user data out of commits.