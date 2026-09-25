-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- 1. Create comments table
create table if not exists public.comments (
    id uuid primary key default gen_random_uuid(),
    task_id uuid not null references public.tasks(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for efficient lookup
create index if not exists idx_comments_task_id on public.comments(task_id);
create index if not exists idx_comments_user_id on public.comments(user_id);
create index if not exists idx_comments_created_at on public.comments(created_at);

-- 3. Enable Row Level Security (RLS)
alter table public.comments enable row level security;

-- 4. RLS Policies
-- Allow all authenticated users to read comments
create policy "Authenticated users can read comments"
    on public.comments for select
    to authenticated
    using (true);

-- Allow authenticated users to insert their own comments
create policy "Authenticated users can create comments"
    on public.comments for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Allow users to delete their own comments
create policy "Users can delete their own comments"
    on public.comments for delete
    to authenticated
    using (auth.uid() = user_id);

-- Allow users to update their own comments
create policy "Users can update their own comments"
    on public.comments for update
    to authenticated
    using (auth.uid() = user_id);
