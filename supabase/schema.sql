-- Hypertension onboarding questionnaire — raw response storage.
-- Run this in the Supabase SQL editor (or via `supabase db push`) for your project.
-- Scoring/profile columns are intentionally omitted; a later migration can add
-- computed columns or a separate table once the scoring module is defined.

create extension if not exists pgcrypto;

create table if not exists public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Raw answers keyed by question ID exactly as defined in src/data/questions.ts,
  -- e.g. {"q1": "45_54", "q7": 3, "q6": ["diabetes", "heart_condition"], ...}
  answers jsonb not null
);

alter table public.questionnaire_responses enable row level security;

-- This is an anonymous, unauthenticated onboarding flow, so the anon role
-- needs insert access. No select/update/delete policy is granted to anon,
-- so submitted rows can't be read or altered from the client.
create policy "Allow anonymous submissions"
  on public.questionnaire_responses
  for insert
  to anon
  with check (true);
