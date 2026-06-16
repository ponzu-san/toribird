-- toribird カタログ（施設・図鑑）の初期スキーマ
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行してください

-- 鳥種マスター（図鑑）
create table if not exists public.parrots (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  english_name text not null,
  habitat text not null,
  description text not null,
  image_url text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 施設マスター
create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name text not null,
  prefecture text not null,
  address text not null,
  category text not null,
  website text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 施設と鳥種の関連（多対多）
create table if not exists public.facility_parrots (
  facility_id uuid not null references public.facilities(id) on delete cascade,
  parrot_id uuid not null references public.parrots(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (facility_id, parrot_id)
);

create index if not exists facilities_prefecture_idx on public.facilities(prefecture);
create index if not exists facilities_category_idx on public.facilities(category);
create index if not exists parrots_status_idx on public.parrots(status);
create index if not exists facilities_status_idx on public.facilities(status);

-- updated_at 自動更新
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists parrots_set_updated_at on public.parrots;
create trigger parrots_set_updated_at
  before update on public.parrots
  for each row execute function public.set_updated_at();

drop trigger if exists facilities_set_updated_at on public.facilities;
create trigger facilities_set_updated_at
  before update on public.facilities
  for each row execute function public.set_updated_at();

-- 将来の管理者用（Phase 2 以降で使用）
create table if not exists public.admin_users (
  user_id uuid primary key,
  email text not null,
  created_at timestamptz not null default now()
);

-- RLS 有効化
alter table public.parrots enable row level security;
alter table public.facilities enable row level security;
alter table public.facility_parrots enable row level security;
alter table public.admin_users enable row level security;

-- 公開データは誰でも読める
drop policy if exists "public read published parrots" on public.parrots;
create policy "public read published parrots"
  on public.parrots for select
  using (status = 'published');

drop policy if exists "public read published facilities" on public.facilities;
create policy "public read published facilities"
  on public.facilities for select
  using (status = 'published');

drop policy if exists "public read facility_parrots" on public.facility_parrots;
create policy "public read facility_parrots"
  on public.facility_parrots for select
  using (
    exists (
      select 1 from public.facilities f
      where f.id = facility_id and f.status = 'published'
    )
    and exists (
      select 1 from public.parrots p
      where p.id = parrot_id and p.status = 'published'
    )
  );

-- admin_users はサービスロール経由のみ（ポリシーなし = クライアントから不可）
