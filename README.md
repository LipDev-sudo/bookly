# Bookly

> Lightweight booking & client management for service businesses.
> Built by [LipDev](https://lipdev-portfolio.vercel.app) with Next.js 16, Supabase and Stripe.

A portfolio-grade SaaS demo: barbershops, salons, personal trainers and any
small service business can sign up, manage clients and services, schedule
appointments, and (in test mode) upgrade to a Pro plan via Stripe.

---

## Stack

| Layer       | Choice                                  |
| ----------- | --------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)      |
| Language    | TypeScript                              |
| Styling     | Tailwind CSS v4                         |
| UI          | lucide-react icons, custom components   |
| Auth + DB   | Supabase (Postgres + RLS)               |
| Payments    | Stripe (test mode)                      |
| Charts      | Recharts                                |
| Forms       | react-hook-form + zod                   |
| Theming     | next-themes (dark mode)                 |

---

## Project structure

```
src/
├── app/
│   ├── (auth)/              ← login, signup, server actions
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   └── actions.ts
│   ├── dashboard/           ← protected app
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx             ← landing page
│   └── globals.css
├── components/
│   └── theme-provider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts        ← browser client
│   │   ├── server.ts        ← server client + admin client
│   │   └── middleware.ts    ← session refresh helper
│   ├── stripe.ts            ← server-side Stripe client
│   └── utils.ts             ← cn(), formatters
└── proxy.ts                 ← Next.js 16 proxy (replaces middleware)

supabase/
└── schema.sql               ← run this in Supabase SQL Editor
```

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the template and fill in your own keys:

```bash
cp .env.example .env.local
```

You will need:

- A **Supabase** project — https://supabase.com/dashboard
- A **Stripe** account in test mode — https://dashboard.stripe.com/test/apikeys

See [`.env.example`](./.env.example) for the full list.

### 3. Run the database migrations

1. Open your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Click **Run**

This creates the `businesses`, `clients`, `services` and `appointments` tables,
sets up Row Level Security so each user only sees their own data, and adds a
trigger that auto-creates a business on signup.

### 4. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000.

---

## Features

### Shipped

- ✅ Landing page with dark mode
- ✅ Email/password auth via Supabase + Server Actions
- ✅ Protected `/dashboard` route via Next.js proxy
- ✅ Multi-tenant: every signup creates a business, RLS isolates data
- ✅ Dashboard skeleton with live counts from the database

### Roadmap

- ⏳ Clients CRUD page
- ⏳ Services CRUD page
- ⏳ Calendar view for appointments (drag-to-create)
- ⏳ Revenue chart (Recharts)
- ⏳ Stripe Checkout for Pro upgrade
- ⏳ Webhook handler to flip `businesses.plan` to `pro`
- ⏳ Demo Mode (one-click login with seeded data)
- ⏳ Bilingual PT/EN toggle

---

## Security notes

- `.env.local` is gitignored — never commit it.
- The Supabase **secret** key (`sb_secret_...`) bypasses RLS. Keep it server-only.
- The Stripe **secret** key (`sk_test_...`) must never leak to the browser.
- Test mode means no real money moves. Cards like `4242 4242 4242 4242` work.
- Rotate keys if they ever leak: Supabase → Settings → API Keys → Regenerate.

---

## License

MIT — feel free to fork as a learning reference.
