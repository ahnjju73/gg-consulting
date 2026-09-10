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
| 사이트 설정 | 학원명, 로고(텍스트/이미지), 히어로 카피, 철학 문구, 연락처, 사업자 정보, 입학성과·후기 섹션 노출 여부 |
| 통계 숫자 | 히어로 영역 3개 + 입학성과 밴드 4개 숫자/라벨 |
| 네 가지 원칙 | "네 가지 약속" 카드 (추가/삭제 가능, 4개 고정 아님) |
| 프로그램 트랙 | 입시 컨설팅 / 시험 준비 트랙과 각 트랙의 불릿 항목 |
| 강사진 | 이름/역할(여러 개 가능)/소개/사진 (사진 없으면 이니셜 아바타, 사진은 업로드 후 원 안에서 위치·확대 조정 가능) |
| 학부모 후기 | 여러 개 등록 가능, 순서대로 표시 |
| 팝업 공지 | 공지·입학성과 이미지를 방문 시 팝업으로 표시. 클릭/닫기로 즉시 닫힘, "24시간 동안 보지 않기"는 방문자 브라우저에 24시간 저장됨. 여러 개 활성화하면 순서대로 하나씩 표시. 모바일은 화면 너비에 맞춰, PC는 최대 420px 고정폭으로 표시 |

저장하면 홈페이지에 바로 반영됩니다 (별도 배포/빌드 없이).

사진/이미지가 있는 항목(로고, 강사 사진, 팝업 이미지)은 **사진을 새로
교체하거나 항목 자체를 삭제하면 Storage(`media` 버킷)에 있던 예전 파일도
함께 삭제됩니다.** 그래서 오래된 파일이 계속 쌓여서 용량을 차지하는 일이
없습니다. (반대로 텍스트만 수정하고 사진은 그대로 둔 저장에서는 기존
사진을 건드리지 않습니다.)

### 강사진 사진 크롭

강사진에서 "사진 선택 & 크롭"으로 사진을 올리면, 저장하기 전에 원형
미리보기 안에서 **드래그로 위치 조정, 슬라이더로 확대**를 할 수 있습니다.
홈페이지의 강사 아바타가 원형이라 사진마다 얼굴 위치가 다르면 자동으로
어색하게 잘릴 수 있는데, 이 화면에서 실제로 보일 부분을 미리 보면서 직접
맞출 수 있습니다. "완료"를 누르면 그 상태로 480×480 정사각형 이미지가
만들어져 저장 시 업로드됩니다 — 원본 사진은 서버로 전송되지 않고, 이미
크롭된 결과만 올라갑니다.

**로고 이미지를 올리면 헤더·푸터의 텍스트 로고("GOLDEN GATE")가 사라지고
그 자리에 이미지가 대신 표시됩니다** (카카오톡 등 링크 공유 미리보기에도
이 이미지가 쓰입니다 — 아래 참고). 이미지를 지우고 다시 텍스트 로고로
되돌리려면 사이트 설정에서 "로고 이미지 삭제하고 텍스트 로고로 되돌리기"를
체크한 뒤 저장하세요.

사이트 설정의 **"섹션 노출 설정"**에서 "입학성과(합격률)" / "학부모 후기"
섹션을 홈페이지에 표시할지 켜고 끌 수 있습니다. 아직 실제 데이터가 아닌
샘플(placeholder) 콘텐츠이기 때문에 **기본값은 꺼짐(숨김)**입니다 — 실제
합격 실적/후기로 채워 넣은 뒤 켜주세요.

### 카카오톡/소셜 공유 시 미리보기 이미지

링크를 카카오톡 등에 공유하면 로고 이미지(설정에서 업로드한 것, 없으면
기본 브랜드 이미지 `public/og-default.png`)가 미리보기로 표시되도록
`openGraph`/`twitter` 메타데이터를 설정해뒀습니다. 커스텀 도메인을 연결한
뒤에는 `.env` 또는 Vercel 환경변수에 `NEXT_PUBLIC_SITE_URL`(예:
`https://www.goldengateconsulting.co.kr`)을 설정해주세요 — 설정하지 않으면
Vercel이 자동으로 제공하는 배포 도메인(`VERCEL_URL`)을 대신 사용하므로,
당장은 아무 설정 없이도 정상 동작합니다.

카카오톡은 링크별로 미리보기를 한 번 스크랩해두면 페이지 내용이 바뀌어도
자동으로 다시 가져가지 않습니다. 로고를 바꾼 뒤에도 미리보기가 안 바뀌면
[카카오 디버거](https://developers.kakao.com/) (카카오 계정 로그인 → 도구 →
디버거 도구)에 사이트 주소를 넣고 "디버그" → "캐시초기화"를 눌러주세요.

### 다크 테마 고정 & 로고 크기

이 사이트는 방문자의 기기/브라우저가 라이트 모드든 다크 모드든 **항상
어두운 다크 테마로만** 보이도록 고정돼 있습니다 (`app/globals.css`의
`:root`가 다크 팔레트 고정, `prefers-color-scheme`를 더 이상 따르지
않음). 로고 이미지를 흰색(밝은 색) 계열 하나만 준비해두면 되는 이유가
이것 때문입니다 — 배경이 라이트 모드로 바뀌어 로고가 안 보이게 되는 일이
없습니다. 로고 이미지는 관리자 → 사이트 설정에서 **밝은/흰색 계열, 가로로
긴 형태**(아이콘+글자가 한 줄)로 올리는 것을 권장합니다.

헤더·푸터의 로고 표시 크기도 키웠습니다 (헤더 1.9rem → 2.6rem, 푸터
1.4rem → 2rem, 모바일도 비례해서 확대). 그래도 로고가 잘 안 보이면
`app/globals.css`의 `.logo img.logo-mark-full` / `.foot-row .logo
img.logo-mark-full` 쪽 `height` 값을 조절하면 됩니다.

나중에 라이트 모드를 다시 쓰고 싶다면, `app/globals.css`의 `:root` 값을
라이트 팔레트로 되돌리고 다크 팔레트는 `@media (prefers-color-scheme:
dark)` 블록 안에 다시 넣어주면 됩니다 (이전 버전 코드 참고).

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

새로 추가된 테이블(`popups` 등)이 있는 최신 `supabase/schema.sql`을 아직
프로덕션 Supabase 프로젝트에 실행하지 않았다면, 배포 전에 SQL Editor에서
다시 한번 실행해주세요 (재실행해도 안전합니다).

### 관리자 페이지에서 저장 시 500 에러가 날 때

1. **가장 흔한 원인 — DB에 테이블이 없음**: 방금 추가된 기능(예: 팝업
   공지)을 쓰려면 `supabase/schema.sql`을 프로덕션 Supabase 프로젝트에서
   다시 실행해야 합니다. 최신 코드는 배포했지만 스키마를 안 돌렸다면
   해당 테이블이 없어서 저장이 실패합니다.
2. **이미지가 너무 큼**: 관리자 페이지의 이미지 업로드(로고/강사 사진/
   팝업 이미지)는 Server Action을 통해 전송되는데, Next.js 기본 제한은
   1MB이고 Vercel의 Node.js 서버리스 함수 자체도 요청 하나당 4.5MB를
   넘길 수 없습니다. 이 프로젝트는 `next.config.ts`에서 4MB로 올려뒀지만,
   그보다 큰 사진(특히 캡처 이미지)은 압축하거나 크기를 줄여서
   올려주세요.
3. **정확한 원인 확인**: Vercel 대시보드 → 해당 프로젝트 → **Deployments**
   → 배포 클릭 → **Functions**(또는 **Logs**) 탭에서 실제 에러 메시지를
   확인할 수 있습니다. 브라우저 네트워크 탭의 "500"만으로는 원인이 안
   보이니, 이 로그의 에러 문구를 알려주시면 더 정확히 진단할 수 있어요.

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
