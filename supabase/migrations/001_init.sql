-- Supabase migration: tasks table + RLS
-- Run this with `supabase db push` or via SQL editor

-- Ensure pgcrypto extension is available for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  title text not null,
  completed boolean default false not null,
  inserted_at timestamptz default now() not null
);

-- Optional: create index
create index if not exists idx_tasks_user on public.tasks (user_id);

-- Enable RLS and policies so users only access their own tasks
alter table public.tasks enable row level security;

-- Policy: allow authenticated users to select their own tasks
create policy "Users can select their tasks" on public.tasks
  for select using (auth.uid() = user_id);

-- Policy: allow authenticated users to insert tasks for themselves
create policy "Users can insert their tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

-- Policy: allow authenticated users to update their tasks
create policy "Users can update their tasks" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Policy: allow authenticated users to delete their tasks
create policy "Users can delete their tasks" on public.tasks
  for delete using (auth.uid() = user_id);
