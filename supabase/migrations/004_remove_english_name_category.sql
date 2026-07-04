-- 英語名・カテゴリ列を削除（投稿簡素化）
-- 実行順: 001 → 002 → 003 → この 004

drop index if exists public.facilities_category_idx;

alter table public.parrots drop column if exists english_name;

alter table public.facilities drop column if exists category;

-- 住所は投稿時任意のため NULL 可に
alter table public.facilities alter column address drop not null;
