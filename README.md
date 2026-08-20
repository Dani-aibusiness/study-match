# StudyMatch

A peer-tutoring marketplace. Students who are stuck on specific coursework
get matched with peer tutors offering flexible, gig-based time.

## This week's scope — student intake flow

This week ships the "generative core": a live `/core` page where a student
uploads a photo of their homework or types a description of what they're
stuck on. The submission is classified by AI into **subject, topic, level,
and urgency**, saved to Supabase, and paired with a simple **rule-based**
(non-AI) suggested tutor type. A `/dashboard` page lists past submissions.

**Out of scope this week:**
- A real live-matching engine (connecting to an actual available tutor)
- Tutor-facing supply-side flow (tutors listing availability)
- Authentication / accounts
- Payments

## Getting started

### Requirements

- [Node.js](https://nodejs.org) 18+
- A free [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com) (for classification)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from
  Supabase Dashboard → Project Settings → API
- `ANTHROPIC_API_KEY` — from console.anthropic.com (server-side only,
  never exposed to the browser)

### 3. Set up the database

In the Supabase SQL editor, run the migration in
`supabase/migrations/0001_create_submissions.sql`. This creates the
`submissions` table with public read/insert policies (no auth yet).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy

Deploys to [Vercel](https://vercel.com). Add the same three environment
variables in the Vercel dashboard (Project Settings → Environment
Variables) — make sure `ANTHROPIC_API_KEY` is added WITHOUT the
`NEXT_PUBLIC_` prefix so it stays server-side only.

## Tech stack

- [Next.js 14 (App Router)](https://nextjs.org) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres)
- [Anthropic API](https://docs.claude.com) (classification)
- [Vercel](https://vercel.com) for deployment
