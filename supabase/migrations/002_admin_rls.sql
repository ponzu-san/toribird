-- Phase 2: 管理者認証用 RLS ポリシー
-- 001_catalog.sql 実行後に SQL Editor で実行してください

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- 管理者は全ステータスのデータを閲覧・編集可能
drop policy if exists "admin read all parrots" on public.parrots;
create policy "admin read all parrots"
  on public.parrots for select
  using (public.is_admin());

drop policy if exists "admin insert parrots" on public.parrots;
create policy "admin insert parrots"
  on public.parrots for insert
  with check (public.is_admin());

drop policy if exists "admin update parrots" on public.parrots;
create policy "admin update parrots"
  on public.parrots for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete parrots" on public.parrots;
create policy "admin delete parrots"
  on public.parrots for delete
  using (public.is_admin());

drop policy if exists "admin read all facilities" on public.facilities;
create policy "admin read all facilities"
  on public.facilities for select
  using (public.is_admin());

drop policy if exists "admin insert facilities" on public.facilities;
create policy "admin insert facilities"
  on public.facilities for insert
  with check (public.is_admin());

drop policy if exists "admin update facilities" on public.facilities;
create policy "admin update facilities"
  on public.facilities for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete facilities" on public.facilities;
create policy "admin delete facilities"
  on public.facilities for delete
  using (public.is_admin());

drop policy if exists "admin read all facility_parrots" on public.facility_parrots;
create policy "admin read all facility_parrots"
  on public.facility_parrots for select
  using (public.is_admin());

drop policy if exists "admin insert facility_parrots" on public.facility_parrots;
create policy "admin insert facility_parrots"
  on public.facility_parrots for insert
  with check (public.is_admin());

drop policy if exists "admin delete facility_parrots" on public.facility_parrots;
create policy "admin delete facility_parrots"
  on public.facility_parrots for delete
  using (public.is_admin());

-- ログイン済みユーザーが自分の管理者登録を確認できる
drop policy if exists "users read own admin record" on public.admin_users;
create policy "users read own admin record"
  on public.admin_users for select
  using (user_id = auth.uid());

-- 初回管理者の登録例（Supabase Auth でユーザーを作成後、UUID とメールを差し替えて実行）:
-- insert into public.admin_users (user_id, email)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com');
