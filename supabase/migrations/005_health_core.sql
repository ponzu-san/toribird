-- Phase 5: 健康管理コア（ユーザー・インコ・日次記録）
-- 001〜004 実行後に SQL Editor で実行してください

-- 調子
do $$
begin
  if not exists (select 1 from pg_type where typname = 'mood_type') then
    create type public.mood_type as enum ('genki', 'normal', 'low', 'vet');
  end if;
end;
$$;

-- 性別
do $$
begin
  if not exists (select 1 from pg_type where typname = 'parrot_sex') then
    create type public.parrot_sex as enum ('male', 'female', 'unknown');
  end if;
end;
$$;

-- 鳥種マスタ（プロフィール選択用。図鑑 parrots とは別）
create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  weight_min_g numeric,
  weight_max_g numeric,
  created_at timestamptz not null default now()
);

-- ユーザーのインコ
create table if not exists public.user_parrots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species_id uuid references public.species(id),
  species_custom text,
  sex public.parrot_sex,
  birthday date,
  adopted_on date,
  photo_url text,
  baseline_weight_g numeric,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_parrots_user_id_idx on public.user_parrots(user_id);

-- 日次記録
create table if not exists public.daily_records (
  id uuid primary key default gen_random_uuid(),
  parrot_id uuid not null references public.user_parrots(id) on delete cascade,
  record_date date not null,
  weight_g numeric,
  mood public.mood_type,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parrot_id, record_date)
);

create index if not exists daily_records_parrot_date_idx on public.daily_records(parrot_id, record_date desc);

-- 課金（Stripe Webhook で更新）
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at トリガー
drop trigger if exists user_parrots_set_updated_at on public.user_parrots;
create trigger user_parrots_set_updated_at
  before update on public.user_parrots
  for each row execute function public.set_updated_at();

drop trigger if exists daily_records_set_updated_at on public.daily_records;
create trigger daily_records_set_updated_at
  before update on public.daily_records
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.species enable row level security;
alter table public.user_parrots enable row level security;
alter table public.daily_records enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "anyone read species" on public.species;
create policy "anyone read species"
  on public.species for select
  using (true);

drop policy if exists "users manage own parrots" on public.user_parrots;
create policy "users manage own parrots"
  on public.user_parrots for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "users manage own records" on public.daily_records;
create policy "users manage own records"
  on public.daily_records for all
  using (
    exists (
      select 1 from public.user_parrots p
      where p.id = parrot_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.user_parrots p
      where p.id = parrot_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "users read own subscription" on public.subscriptions;
create policy "users read own subscription"
  on public.subscriptions for select
  using (user_id = auth.uid());
