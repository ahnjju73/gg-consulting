-- GoldenGate Consulting — 대기 중인 Supabase 마이그레이션
-- (학년별 가이드 탭 + 2027 겨울방학 특강 메뉴/카테고리/수업 목록 기능)
-- Supabase 대시보드 → SQL Editor에 그대로 붙여넣고 실행하세요.
-- 전부 재실행해도 안전합니다 (이미 적용된 부분이 있어도 에러 없이 통과).

-- ---------------------------------------------------------------------------
-- site_settings: 겨울방학 특강 메뉴 이름 / 노출 여부
-- ---------------------------------------------------------------------------
alter table site_settings add column if not exists winter_camp_title text not null default '2027 겨울방학 특강';
alter table site_settings add column if not exists winter_camp_nav_visible boolean not null default true;

-- ---------------------------------------------------------------------------
-- grade_stages: /curriculum 페이지의 "학년별 가이드" 탭 섹션
-- ---------------------------------------------------------------------------
create table if not exists grade_stages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  grade_tag text not null,
  title text not null,
  description text not null,
  items jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into grade_stages (slug, grade_tag, title, description, items, sort_order)
values
  (
    'early', '저학년', '국제학교 준비반',
    '국제학교 입학을 목표로 하는 저학년 학생을 위한 수업입니다. 트랙 구분 없이 별도로 진행됩니다.',
    '["북클럽 — 매주 원서를 함께 읽고 토론하며 독해력과 표현력을 키웁니다.", "영어 — 읽기·듣기·말하기·쓰기를 고르게 다지며 국제학교 입학 시험을 준비합니다.", "수학 — 또래 대비 심화 개념을 익혀 레벨테스트에 대비합니다.", "지원 시기에 맞춰 포트폴리오와 인터뷰까지 함께 준비합니다."]'::jsonb,
    1
  ),
  (
    'foundation', '9–10학년', '기초 다지기',
    '9–10학년, 내신과 시험 기초를 함께 쌓아 11학년 이후 입시 집중기를 준비하는 단계입니다.',
    '["내신 전 과목 관리 — 수학·과학·영어·인문 전 과목 성적을 체계적으로 관리합니다.", "Digital SAT 기초 — Reading·Writing·Math 기본기를 다집니다.", "AP·IB 기초 — 향후 심화 과목 선택을 위한 기초 과정을 시작합니다.", "학년이 올라가며 자연스럽게 아래 두 트랙(입시 컨설팅·시험 준비)으로 이어집니다."]'::jsonb,
    2
  ),
  (
    'intensive', '11–12학년', '입시 집중',
    '11–12학년, Digital SAT·AP·IB 심화 과정과 대학 입시 컨설팅을 함께 진행하는 단계입니다.',
    '["Digital SAT 심화 — 실전 모의고사와 오답 분석으로 목표 점수를 완성합니다.", "AP·IB 심화 — Calculus(AB/BC)·Computer Science A·Statistics 중심, 필요 과목은 전문 강사 매칭으로 전 과목 대응합니다.", "입시 컨설팅 — 대학 리스트 빌딩, 에세이 첨삭, 인터뷰 모의훈련을 함께 진행합니다.", "학부모 대상 월간 진행 리포트로 두 트랙의 진행 상황을 공유합니다."]'::jsonb,
    3
  )
on conflict (slug) do nothing;

alter table grade_stages enable row level security;

drop policy if exists "public read grade_stages" on grade_stages;
create policy "public read grade_stages" on grade_stages for select using (true);

-- ---------------------------------------------------------------------------
-- winter_camp_categories: 수업을 묶는 카테고리 (영어/수학/컴퓨터/바이오 등).
-- 고정된 목록이 아니라 admin에서 자유롭게 추가/수정/삭제합니다.
-- ---------------------------------------------------------------------------
create table if not exists winter_camp_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table winter_camp_categories enable row level security;

drop policy if exists "public read winter_camp_categories" on winter_camp_categories;
create policy "public read winter_camp_categories" on winter_camp_categories for select using (true);

-- ---------------------------------------------------------------------------
-- winter_camp_courses: /winter-camp 페이지의 수업 목록. category_id로
-- 카테고리에 소속되고(카테고리를 지워도 수업은 "기타"로 이동), sessions_count/
-- total_hours로 "N회 · N시간"을 표시합니다. 둘 다 선택 입력입니다.
-- ---------------------------------------------------------------------------
create table if not exists winter_camp_courses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references winter_camp_categories(id) on delete set null,
  course_name text not null,
  teacher_name text not null,
  sessions_count int,
  total_hours int,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table winter_camp_courses add column if not exists category_id uuid references winter_camp_categories(id) on delete set null;
alter table winter_camp_courses add column if not exists sessions_count int;
alter table winter_camp_courses add column if not exists total_hours int;

alter table winter_camp_courses enable row level security;

drop policy if exists "public read winter_camp_courses" on winter_camp_courses;
create policy "public read winter_camp_courses" on winter_camp_courses for select using (true);
