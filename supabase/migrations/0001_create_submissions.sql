-- Week scope: single "submissions" table, no auth yet.
-- Policies are permissive (public read/insert) because there's no user
-- login this week — tighten these once auth is introduced.

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  raw_text text,
  subject text not null,
  topic text not null,
  level text not null check (level in ('elementary', 'middle_school', 'high_school', 'college', 'graduate')),
  urgency text not null check (urgency in ('low', 'medium', 'high')),
  summary text not null,
  suggested_tutor_label text not null,
  suggested_tutor_description text not null,
  created_at timestamptz not null default now()
);

alter table submissions enable row level security;

create policy "Public can insert submissions"
  on submissions for insert
  to anon
  with check (true);

create policy "Public can read submissions"
  on submissions for select
  to anon
  using (true);
