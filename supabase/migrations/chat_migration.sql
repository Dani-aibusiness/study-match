-- Week 5: Public Chatbot / Guided Assistant
-- Run this entire file in Supabase SQL Editor -> New query -> Run

-- One row per finished chat. Public visitors can only INSERT (not read or edit),
-- so other people's chats are not exposed through the public key.
create table if not exists public.chat_sessions (
  id uuid primary key,
  tester_label text,
  subject text not null,
  stuck_summary text not null check (char_length(stuck_summary) <= 200),
  urgency text not null,
  outcome text not null check (outcome in ('answered', 'escalated', 'checkpoint_declined')),
  needs_human_review boolean not null default false,
  guardrail_count integer not null default 0,
  transcript jsonb not null check (jsonb_array_length(transcript) <= 60),
  created_at timestamptz not null default now()
);

alter table public.chat_sessions enable row level security;

create policy "Public insert access on chat_sessions"
  on public.chat_sessions for insert with check (true);

-- One row per thumbs up/down. Public can read (for the summary counts) and insert.
create table if not exists public.chat_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  rating text not null check (rating in ('up', 'down')),
  comment text check (comment is null or char_length(comment) <= 500),
  created_at timestamptz not null default now()
);

alter table public.chat_feedback enable row level security;

create policy "Public read access on chat_feedback"
  on public.chat_feedback for select using (true);

create policy "Public insert access on chat_feedback"
  on public.chat_feedback for insert with check (true);
