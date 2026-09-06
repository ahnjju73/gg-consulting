-- GoldenGate Consulting — Supabase schema + seed data
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / guarded inserts throughout.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- site_settings: one singleton row holding every "global" text field on the
-- site (hero copy, philosophy quote, contact details, footer legal info).
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  academy_name text not null default 'GoldenGate Consulting',
  logo_text_main text not null default 'GOLDEN',
  logo_text_accent text not null default 'GATE',
  since_year text not null default '2013',
  hero_title_line1 text not null default '미국 명문대로 이어지는',
  hero_title_line2 text not null default '가장 확실한 다리',
  hero_description text not null default '입시 컨설팅과 시험 준비를 한 곳에서. 골든게이트는 에세이·활동·성적 관리부터 Digital SAT·AP까지, 아이비리그 입학사정관 출신 컨설턴트와 전문 강사진이 학생 한 명의 여정을 처음부터 끝까지 설계합니다.',
  philosophy_quote text not null default '"컨설턴트가 아니라, 설계자가 되어야 합니다." 골든게이트는 성적표 한 줄이 아니라 학생의 다음 10년을 봅니다. 흔들리지 않는 기준과 데이터로, 각 학생만의 다리를 놓습니다.',
  philosophy_author text not null default '서지원 · GoldenGate Consulting 대표 (전 미국 사립대학 입학사정관)',
  phone text default '02-1234-5678',
  email text default 'info@goldengateconsulting.co.kr',
  address text default '서울특별시 강남구 삼성로 000, 5층',
  business_hours text default '평일 10:00 – 22:00 · 주말 예약 상담 가능',
  business_reg_no text default '000-00-00000 (샘플)',
  academy_license_no text default '제0000호 (샘플)',
  representative_name text default '서지원',
  logo_url text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- stats: the small numbered call-outs. group_name splits the hero strip
-- (3 items) from the results band further down the page (4 items).
-- ---------------------------------------------------------------------------
create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('hero', 'results')),
  label text not null,
  value text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into stats (group_name, label, value, sort_order)
select * from (values
  ('hero', '년간의 컨설팅 노하우', '13', 1),
  ('hero', 'Top 30 대학 합격 사례', '200+', 2),
  ('hero', '컨설턴트 1인당 학생 비율', '1:3', 3),
  ('results', '목표 대학군 합격률', '96%', 1),
  ('results', 'SAT 평균 최종 점수', '1,450', 2),
  ('results', 'Top 30 합격 누적', '200+', 3),
  ('results', '강남 원장 운영 경력', '13yr', 4)
) as seed(group_name, label, value, sort_order)
where not exists (select 1 from stats);

-- ---------------------------------------------------------------------------
-- pillars: the four commitments grid.
-- ---------------------------------------------------------------------------
create table if not exists pillars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into pillars (title, description, sort_order)
select * from (values
  ('학생 중심 설계', '정형화된 커리큘럼이 아닌, 학생의 강점과 목표 대학에 맞춘 개별 로드맵을 처음부터 새로 그립니다.', 1),
  ('검증된 전문성', '입학사정관 출신, 만점 강사진으로만 구성. 이론이 아닌 실전 경험으로 지도합니다.', 2),
  ('데이터 기반 관리', '모의고사 오답, 에세이 피드백, 활동 이력을 하나의 대시보드로 추적하고 매달 리포트합니다.', 3),
  ('끝까지 책임지는 관리', '원서 접수, 인터뷰 준비, 등록까지 — 합격 발표 이후의 절차까지 함께합니다.', 4)
) as seed(title, description, sort_order)
where not exists (select 1 from pillars);

-- ---------------------------------------------------------------------------
-- tracks: the two program tracks (Consulting / Test Prep). `items` is a
-- JSON array of bullet strings edited as newline-separated text in the admin.
-- ---------------------------------------------------------------------------
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  eyebrow text not null default 'TRACK',
  title text not null,
  lead text not null,
  color text not null default 'gold' check (color in ('gold', 'bay')),
  items jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into tracks (slug, eyebrow, title, lead, color, items, sort_order)
values
  (
    'consulting', 'TRACK 01', '입시 컨설팅',
    '에세이부터 포지셔닝까지, 지원자를 하나의 서사로 완성합니다.',
    'gold',
    '["대학 리스트 빌딩 & 전공 포지셔닝", "Common App / Supplement 에세이 첨삭", "과외활동 & 여름 프로그램 설계", "인터뷰 모의훈련 & 원서 접수 관리", "학부모 대상 월간 진행 리포트"]'::jsonb,
    1
  ),
  (
    'test-prep', 'TRACK 02', '시험 준비',
    'Digital SAT · AP · 내신관리로 숫자를 만듭니다.',
    'bay',
    '["Digital SAT Reading·Writing / Math", "AP 전 과목 심화반 & 5월 시험 대비", "내신 성적 관리 & 학교 시험 코칭", "주간 모의고사 & 오답 분석 리포트", "주말 집중반 (2026 Fall 개강)"]'::jsonb,
    2
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- faculty: instructor cards. avatar_url points into the `media` storage
-- bucket; leave null to fall back to a monogram in the UI. `roles` is a JSON
-- array of strings (one instructor can hold multiple roles/tags) — edited in
-- the admin as one role per line, the same pattern as tracks.items.
-- ---------------------------------------------------------------------------
create table if not exists faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roles jsonb not null default '[]'::jsonb,
  university text,
  bio text,
  avatar_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Migrate installs created before `roles` existed, which have a single
-- `role text` column instead. Safe to run repeatedly and safe on fresh
-- installs (the IF EXISTS check simply skips).
alter table faculty add column if not exists roles jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'faculty' and column_name = 'role'
  ) then
    update faculty
      set roles = jsonb_build_array(role)
      where jsonb_array_length(roles) = 0 and role is not null and role <> '';
    alter table faculty drop column role;
  end if;
end $$;

-- Migrate installs created before `university` existed. Optional field —
-- left null it simply doesn't render on the card.
alter table faculty add column if not exists university text;

insert into faculty (name, roles, university, bio, sort_order)
select * from (values
  ('서지원 원장', '["前 미국 사립대 입학사정관", "입시 컨설팅 총괄"]'::jsonb, 'Harvard University', '15년간 입학사정관·컨설턴트로 활동하며 Ivy League 합격생 다수 배출.', 1),
  ('김민준 컨설턴트', '["에세이 · 활동 설계"]'::jsonb, 'University of Pennsylvania', 'Common App 에세이 전문. 매년 60명 이상의 학생 원서를 지도.', 2),
  ('이하나 강사', '["Digital SAT · Reading/Writing"]'::jsonb, null, 'SAT 만점 획득. College Board 공식 기준에 맞춘 커리큘럼 개발.', 3),
  ('박도현 강사', '["AP · Math 심화", "내신 관리"]'::jsonb, 'Columbia University', 'AP Calculus BC, Physics C 전문. 10년 이상 이과 계열 지도 경력.', 4)
) as seed(name, roles, university, bio, sort_order)
where not exists (select 1 from faculty);

-- ---------------------------------------------------------------------------
-- popups: announcement / exam-result images shown as an on-load popup on the
-- public site. `active` toggles visibility without deleting history; several
-- rows can be active at once and are shown one after another (queue), each
-- dismissible by clicking the image or the buttons below it.
-- ---------------------------------------------------------------------------
create table if not exists popups (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  link_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into testimonials (quote, author, sort_order)
select * from (values
  ('딸의 에세이 방향을 세 번이나 다시 잡아준 곳입니다. 성적만 관리해주는 학원이 아니라, 아이가 어떤 이야기를 하고 싶은지부터 함께 고민해줬어요. 결과보다 그 과정이 믿음직했습니다.', '2025 합격생 학부모 · 익명 후기 (샘플)', 1)
) as seed(quote, author, sort_order)
where not exists (select 1 from testimonials);

-- ---------------------------------------------------------------------------
-- Row Level Security: the public site reads with the anon key, so every
-- table allows public SELECT. There are no INSERT/UPDATE/DELETE policies for
-- anon/authenticated — all writes go through the admin panel's Server
-- Actions, which use the service-role key on the server and bypass RLS
-- entirely. This is what keeps the anon key safe to ship to the browser
-- even though the admin panel itself has no login yet (see README).
-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
alter table stats enable row level security;
alter table pillars enable row level security;
alter table tracks enable row level security;
alter table faculty enable row level security;
alter table testimonials enable row level security;
alter table popups enable row level security;

drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings for select using (true);

drop policy if exists "public read stats" on stats;
create policy "public read stats" on stats for select using (true);

drop policy if exists "public read pillars" on pillars;
create policy "public read pillars" on pillars for select using (true);

drop policy if exists "public read tracks" on tracks;
create policy "public read tracks" on tracks for select using (true);

drop policy if exists "public read faculty" on faculty;
create policy "public read faculty" on faculty for select using (true);

drop policy if exists "public read testimonials" on testimonials;
create policy "public read testimonials" on testimonials for select using (true);

drop policy if exists "public read popups" on popups;
create policy "public read popups" on popups for select using (true);

-- ---------------------------------------------------------------------------
-- Storage: a public "media" bucket for the logo + faculty photos uploaded
-- from the admin panel. Uploads go through the service-role key server-side,
-- so — same as above — no public write policy is needed, only public read.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
