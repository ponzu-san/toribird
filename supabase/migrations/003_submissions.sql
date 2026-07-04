-- Phase 3: ユーザー投稿（提案）と承認フロー用スキーマ
-- 実行順:
--   1) 001_catalog.sql
--   2) 002_admin_rls.sql
--   3) この 003_submissions.sql

-- 投稿種別
do $$
begin
  if not exists (select 1 from pg_type where typname = 'submission_type') then
    create type public.submission_type as enum (
      'parrot_create',
      'parrot_update',
      'facility_create',
      'facility_update',
      'facility_parrot_report'
    );
  end if;
end;
$$;

-- 審査ステータス
do $$
begin
  if not exists (select 1 from pg_type where typname = 'submission_status') then
    create type public.submission_status as enum (
      'pending',
      'approved',
      'rejected'
    );
  end if;
end;
$$;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type public.submission_type not null,
  status public.submission_status not null default 'pending',
  target_id uuid, -- update 系投稿時の既存レコードID
  payload jsonb not null, -- 投稿本文（提案データ）
  submitter_name text,
  submitter_contact text,
  submitter_note text,
  reviewer_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists submissions_status_idx on public.submissions(status);
create index if not exists submissions_type_idx on public.submissions(type);
create index if not exists submissions_created_at_idx on public.submissions(created_at desc);

-- 投稿に紐づく画像（Phase 4 で Storage 連携する想定）
create table if not exists public.submission_images (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists submission_images_submission_id_idx on public.submission_images(submission_id);

-- updated_at トリガー
drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.submissions enable row level security;
alter table public.submission_images enable row level security;

-- 誰でも投稿可能（ログイン不要）
drop policy if exists "anyone can create submissions" on public.submissions;
create policy "anyone can create submissions"
  on public.submissions for insert
  with check (status = 'pending');

-- 管理者は submissions を閲覧・更新・削除可能
drop policy if exists "admin read submissions" on public.submissions;
create policy "admin read submissions"
  on public.submissions for select
  using (public.is_admin());

drop policy if exists "admin update submissions" on public.submissions;
create policy "admin update submissions"
  on public.submissions for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete submissions" on public.submissions;
create policy "admin delete submissions"
  on public.submissions for delete
  using (public.is_admin());

-- 画像は当面管理者のみ閲覧（公開フロー実装後に調整）
drop policy if exists "admin read submission images" on public.submission_images;
create policy "admin read submission images"
  on public.submission_images for select
  using (public.is_admin());

-- 投稿時の画像追加（将来、署名URLアップロード後に insert する想定）
drop policy if exists "anyone can create submission images" on public.submission_images;
create policy "anyone can create submission images"
  on public.submission_images for insert
  with check (
    exists (
      select 1
      from public.submissions s
      where s.id = submission_id
        and s.status = 'pending'
    )
  );

drop policy if exists "admin delete submission images" on public.submission_images;
create policy "admin delete submission images"
  on public.submission_images for delete
  using (public.is_admin());

