# GoldenGate Consulting — Next.js + Supabase

미국 대학 입시 컨설팅 + SAT/AP 시험 준비 학원 소개 페이지. 홈페이지에 보이는
거의 모든 텍스트/이미지/목록이 Supabase에 저장되고, `/admin`에서 추가·수정·
삭제할 수 있습니다.

## 1. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com)에서 프로젝트를 생성합니다 (이미
   있다면 이 단계는 건너뛰세요).
2. Supabase 대시보드 → **SQL Editor**로 이동해 `supabase/schema.sql`의
   내용을 전체 복사해 붙여넣고 실행합니다.
   - 테이블 7개(`site_settings`, `stats`, `pillars`, `tracks`, `faculty`,
     `testimonials`, `popups`)와 샘플 데이터, RLS 정책, `media` Storage
     버킷이 한 번에 생성됩니다.
   - 이 스크립트는 여러 번 실행해도 안전합니다 (이미 있는 데이터는
     건너뜁니다).
3. Supabase 대시보드 → **Project Settings → API**에서 다음 세 값을
   복사해둡니다.
   - `Project URL`
   - `anon public` 키
   - `service_role` 키 (⚠️ 절대 공개하면 안 되는 키입니다)

## 2. 로컬 환경 설정

```bash
npm install
cp .env.local.example .env.local
```

`.env.local`을 열어 위에서 복사한 세 값을 채워 넣습니다.

```bash
npm run dev
```

- 공개 홈페이지: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin

## 3. 관리자 페이지에서 할 수 있는 것

| 메뉴 | 내용 |
| --- | --- |
| 사이트 설정 | 학원명, 로고, 히어로 카피, 철학 문구, 연락처, 사업자 정보 |
| 통계 숫자 | 히어로 영역 3개 + 입학성과 밴드 4개 숫자/라벨 |
| 네 가지 원칙 | "네 가지 약속" 카드 (추가/삭제 가능, 4개 고정 아님) |
| 프로그램 트랙 | 입시 컨설팅 / 시험 준비 트랙과 각 트랙의 불릿 항목 |
| 강사진 | 이름/역할(여러 개 가능)/소개/사진 (사진 없으면 이니셜 아바타) |
| 학부모 후기 | 여러 개 등록 가능, 순서대로 표시 |
| 팝업 공지 | 공지·입학성과 이미지를 방문 시 팝업으로 표시. 클릭/닫기로 즉시 닫힘, "24시간 동안 보지 않기"는 방문자 브라우저에 24시간 저장됨. 여러 개 활성화하면 순서대로 하나씩 표시. 모바일은 화면 너비에 맞춰, PC는 최대 420px 고정폭으로 표시 |

저장하면 홈페이지에 바로 반영됩니다 (별도 배포/빌드 없이).

## ⚠️ 4. 배포 전 반드시 읽어주세요 — 관리자 페이지 보안

요청하신 대로 **지금 버전의 `/admin`에는 로그인이 없습니다.** 로컬에서 개발
하는 동안은 문제가 없지만, 이 상태로 인터넷에 배포하면 URL만 아는 누구나
콘텐츠를 수정/삭제할 수 있습니다. 실제 배포 전에는 인증을 반드시 추가하세요.

### 나중에 인증 추가하기 (Supabase Auth 예시)

1. Supabase 대시보드 → **Authentication → Users**에서 관리자 계정을
   이메일/비밀번호로 하나 생성합니다.
2. `@supabase/ssr`은 이미 설치되어 있습니다. `middleware.ts`를 프로젝트
   루트에 추가해 `/admin` 경로를 세션 유무로 보호하세요:

```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
```

3. `/admin/login`에 이메일/비밀번호 로그인 폼을 만들고
   `supabase.auth.signInWithPassword()`를 호출하면 됩니다.
4. Server Actions(`app/admin/**/actions.ts`)에도 세션 체크를 추가하세요 —
   미들웨어는 페이지 접근만 막고, 각 액션 자체는 여전히 누구나 직접 호출할
   수 있는 엔드포인트이기 때문입니다.

이 작업이 필요하시면 말씀해주세요 — 로그인 폼과 미들웨어까지 이어서
구현해드릴게요.

## 5. 배포

Vercel에 배포하는 경우, 프로젝트 설정의 Environment Variables에
`.env.local`과 동일한 세 값을 등록하세요. `SUPABASE_SERVICE_ROLE_KEY`는
반드시 서버 전용 환경 변수로만 등록하고, 절대 `NEXT_PUBLIC_` 접두사를
붙이지 마세요.

## 프로젝트 구조

```
app/
  page.tsx                 공개 홈페이지 (Supabase에서 읽기 전용 조회)
  components/site/         홈페이지 섹션 컴포넌트 (Nav, Hero, Tracks, ...)
  admin/                   관리자 페이지 (섹션별 폴더 + actions.ts)
lib/
  supabase/public.ts        공개 사이트용 읽기 전용 클라이언트 (anon key)
  supabase/admin.ts         관리자 액션 전용 쓰기 클라이언트 (service role key)
  queries.ts                공개 사이트 데이터 조회 함수
  types.ts                  Supabase 테이블에 대응하는 TypeScript 타입
supabase/schema.sql          테이블 + RLS 정책 + 시드 데이터 + Storage 버킷
```
