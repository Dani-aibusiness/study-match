-- Week 6: Integrated venture (tester feedback + dashboard stats)
-- Run this entire file in Supabase SQL Editor -> New query -> Run

-- 1. Real tester feedback, entered through the form on /demo.
--    Public can INSERT only. Rows are shown on /dashboard through the
--    function below, so nothing else about the table is exposed.
create table if not exists public.tester_feedback (
  id uuid primary key default gen_random_uuid(),
  tester_name text not null check (char_length(tester_name) between 1 and 40),
  completed_task boolean not null,
  clarity integer not null check (clarity between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 500),
  created_at timestamptz not null default now()
);

alter table public.tester_feedback enable row level security;

drop policy if exists "Public insert access on tester_feedback" on public.tester_feedback;
create policy "Public insert access on tester_feedback"
  on public.tester_feedback for insert with check (true);

-- 2. One function that returns ONLY counts and a short list of recent rows.
--    chat_sessions stays unreadable with the public key (transcripts are
--    never returned). security definer lets the function read it for us.
create or replace function public.dashboard_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'submissions',        (select count(*) from public.submissions),
    'competitors',        (select count(*) from public.competitors),
    'pricing_scenarios',  (select count(*) from public.pricing_scenarios),
    'headline_votes',     (select count(*) from public.headline_votes),
    'chat_sessions',      (select count(*) from public.chat_sessions),
    'chat_escalated',     (select count(*) from public.chat_sessions where outcome = 'escalated'),
    'chat_needs_review',  (select count(*) from public.chat_sessions where needs_human_review),
    'chat_guardrail_hits',(select coalesce(sum(guardrail_count), 0) from public.chat_sessions),
    'chat_up',            (select count(*) from public.chat_feedback where rating = 'up'),
    'chat_down',          (select count(*) from public.chat_feedback where rating = 'down'),
    'tester_count',       (select count(*) from public.tester_feedback),
    'tester_completed',   (select count(*) from public.tester_feedback where completed_task),
    'tester_avg_clarity', (select round(avg(clarity)::numeric, 2) from public.tester_feedback),
    'recent_chats', (
      select coalesce(jsonb_agg(c), '[]'::jsonb) from (
        select tester_label, subject, urgency, outcome, needs_human_review, created_at
        from public.chat_sessions order by created_at desc limit 8
      ) c
    ),
    'recent_testers', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select tester_name, completed_task, clarity, comment, created_at
        from public.tester_feedback order by created_at desc limit 20
      ) t
    )
  );
$$;

grant execute on function public.dashboard_stats() to anon, authenticated;
