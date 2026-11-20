# Design System Specification (DESIGN.md)

Design Thinking Workshop(DTW) 웹 프레젠테이션, 진행자 참고 가이드 3종, 인쇄용 A3/A4 실습 워크시트 8종의 시각 일관성과 가독성을 유지하기 위한 디자인 기준 문서입니다.

---

## 1. 디자인 방향성 (Aesthetic Direction)

- **핵심 콘셉트:** Architectural Studio Manual & Editorial Deck
- **설계 지향점:** 장식적인 그라데이션·네온 글로우·과도한 장식 그래픽을 배제하고, 종이 인쇄물과 프로젝터 화면 양쪽에서 또렷하게 읽히는 타이포그래피·실선 그리드·여백 비례로 정보 위계를 세웁니다.
- **이원화 서피스 전략:**
  1. **라이트 스튜디오 서피스 (`server/index.html`, `server/worksheets/*`):** 밝은 회의실 프로젝터 투사와 흑백/컬러 겸용 A3·A4 인쇄에 맞춘 `#fafafa` / `#ffffff` 지면과 `#18181b` 본문 잉크 체계.
  2. **다크 레퍼런스 서피스 (`server/guide_*.html` 3종):** 진행자가 보조 모니터·태블릿에서 장시간 열람하기 편한 `#09090b` / `#121215` 다크 지면 위에, 문서 성격을 즉시 구분해 주는 **문서별 고유 테마색 3종을** 절제된 인덱스 요소로만 사용합니다.

---

## 2. 컬러 토큰 (Color Palette & Tokens)

### 2.1 라이트 스튜디오 서피스 (발표 슬라이드 & 워크시트)

| 역할 | 토큰명 | 값 | 용도 및 대비 기준 |
| --- | --- | --- | --- |
| 외부 배경 | `--bg-canvas` | `#f4f4f5` | 슬라이드 뷰포트 배경 (내보내기 모드에서는 `#fafafa`) |
| 기본 지면 | `--bg-subtle` | `#fafafa` | 카드 내부 보조 배경, 워크시트 허브 배경 |
| 주 서피스 | `--bg-surface` | `#ffffff` | 슬라이드 본체, 워크시트 인쇄 용지, 모달 표면 |
| 주 텍스트 | `--text-main` | `#18181b` | 제목 및 본문 잉크 (`#ffffff` 대비 17.7:1) |
| 보조 텍스트 | `--text-muted` | `#52525b` | 부제 및 설명 문장 (`#ffffff` 대비 7.0:1, WCAG AAA) |
| 캡션 텍스트 | `--text-dim` | `#71717a` | 메타데이터 및 보조 주석 (`#ffffff` 대비 4.6:1, WCAG AA) |
| 기본 보더 | `--border-color` | `#e4e4e7` | 구획선 및 기본 카드 테두리 |
| 강조 보더 | `--border-strong` | `#d4d4d8` | 입력 프레임, 표 헤더 하단선, 버튼 외곽선 |

#### 단계별 인덱스 포인트 (Stage Accents — 도트·상단 실선·단계 번호 한정)

| 단계 | 토큰명 | 값 | 적용 범위 |
| --- | --- | --- | --- |
| 오프닝 / 마무리 | `--accent-intro` | `#1d4ed8` | Introduction, Debrief & Wrap-up |
| 1단계 공감 | `--accent-empathize` | `#0369a1` | Stage 1: Empathize & 워크시트 01 |
| 2단계 정의 | `--accent-define` | `#047857` | Stage 2: Define & 워크시트 02 |
| 3단계 발상 | `--accent-ideate` | `#b45309` | Stage 3: Ideate & 워크시트 03, 04 |
| 4단계 프로토타입 | `--accent-prototype` | `#be123c` | Stage 4: Prototype & 워크시트 05 |
| 5단계 테스트 | `--accent-test` | `#3730a3` | Stage 5: Test & 워크시트 06, 07 |

### 2.2 다크 레퍼런스 서피스 (참고 가이드 3종)

| 역할 | 토큰명 | 값 | 용도 |
| --- | --- | --- | --- |
| 페이지 배경 | `--bg-slate` | `#09090b` | 문서 기본 배경 (`color-scheme: dark`) |
| 카드 서피스 | `--bg-surface` | `#121215` | 본문 카드, 표 헤더, 필터 바 배경 |
| 보조 서피스 | `--bg-card` | `#18181b` | 라이선스 고지, 중첩 컨테이너 배경 |
| 기본 보더 | `--border-color` | `#27272a` | 카드 및 섹션 구분 실선 |
| 미세 구분선 | `--border-light` | `rgba(255, 255, 255, 0.08)` | 상단 바 하단선 및 내부 행 구분선 |
| 주 텍스트 | `--text-main` | `#f4f4f5` | 제목 및 핵심 본문 |
| 보조 텍스트 | `--text-muted` | `#a1a1aa` | 일반 설명 문단 및 표 셀 본문 |
| 캡션 텍스트 | `--text-dim` | `#71717a` | 코드 식별자 및 푸터 메타데이터 |

#### 가이드 3종 고유 시그니처 테마색

- **진행자 운영 가이드 (`guide_workshop_facilitation.html`):** Sky Blue (`--accent: #0369a1`, `--highlight: #38bdf8`)
- **IDEO U 프레임워크 가이드 (`guide_ideou_framework.html`):** Warm Amber (`--accent: #d97706`, `--highlight: #f59e0b`)
- **스탠퍼드 d.school 38개 방법론 가이드 (`guide_dschool_bootleg.html`):** Violet (`--accent: #7c3aed`, `--highlight: #a78bfa`) 및 5개 모드 식별 도트

---

## 3. 타이포그래피 규칙 (Typography)

- **국문·본문 서체 (`--font-sans`):** `'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR', 'Malgun Gothic', sans-serif`
- **영문 코드·수치 서체 (`--font-mono`):** `'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Pretendard Variable', Pretendard, monospace`
- **조판 원칙:**
  - 국문 줄바꿈은 `word-break: keep-all`을 기본으로 하되, 긴 영문 URL은 `overflow-wrap: break-word`로 처리합니다.
  - 테두리 박스가 없는 단독 제목에는 `text-wrap: balance`를, 본문 문단에는 `text-wrap: pretty`를 적용합니다.
  - 모든 타이머, 시계, 슬라이드 카운터(`01 / 31`), 타임테이블 시각, 일련번호에는 `font-variant-numeric: tabular-nums`를 적용해 숫자 폭 흔들림을 방지합니다.
  - 본문 텍스트에는 `user-select: none`을 걸지 않으며, 버튼·툴바 크롬에만 선택 방지를 제한합니다.

---

## 4. 레이아웃 및 컴포넌트 원칙 (Layout & Components)

- **모서리 곡률 (Border Radius):** 과장된 알약형 캡슐(`9999px`)과 둥근 풍선 카드를 지양하고 `4px`(`--radius-xs`), `6px`(`--radius-sm`), `8px`(`--radius-md`), `10px`(`--radius-lg`)의 단정한 직교 비례를 유지합니다.
- **슬라이드 기준선 고정:** 16:9 슬라이드(`1360 × 760` 논리 해상도)는 상단 헤더 영역 아래에 일정한 수평 기준선을 두어 슬라이드를 넘길 때 제목과 본문 시작 위치가 흔들리지 않게 합니다.
- **실습 안내 블록 (`.activity-box`):** 굵은 점선(`2px dashed`) 대신 실선 외곽선과 상단 단계 색띠, 명확한 단계별 소요 시간 표기로 구성합니다.
- **실전 예시 산출물 (Sample Deliverables):** 인쇄 배포되는 워크시트(`01`~`08`)의 도면·종이 노트 톤과 일치시켜, 참가자가 화면 예시를 보고 손앞의 종이 양식을 직관적으로 작성할 수 있게 합니다.
- **데이터 표 (Tables):** 네 면을 모두 가두는 격자선 대신 상·하단 수평 실선(`border-top`, `border-bottom`)과 `<th scope="col">` 시맨틱 마크업으로 가독성을 높입니다.

---

## 5. 모션 및 접근성 규칙 (Motion & Accessibility)

- **전환 곡선:** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- **전환 속성 명시:** `transition: all` 사용을 금지하고 `background-color`, `border-color`, `color`, `opacity`, `transform` 중 실제로 변하는 속성만 명시합니다.
- **키보드 조작 즉각성:** 발표 중 수십 회 반복되는 화살표·스페이스바 슬라이드 이동에는 바운스나 지연 애니메이션을 넣지 않고 즉시 전환합니다.
- **비인터랙티브 요소 고정:** 클릭 동작이 없는 일반 텍스트 카드(`.feature-card`, `.info-card`, `.tool-card`)에는 hover 이동(`translateY`)을 적용하지 않습니다.
- **포커스 및 모달 접근성:** 모든 링크·버튼에 `:focus-visible` 외곽선(`outline` + `outline-offset`)을 제공하고, 커스텀 모달이 열릴 때 배경 컨테이너에 `inert` 속성을 부여합니다.
- **모션 축소 대응:** `@media (prefers-reduced-motion: reduce)` 환경에서는 전환과 점멸 애니메이션을 비활성화합니다.

---

## 6. 금지 패턴 (Banned Anti-Patterns)

1. 다색 그라데이션 배너 및 발광(glow) 아이콘 배지
2. 한 화면 안에서 고채도 원색 배경을 균등하게 나열한 카드 그리드
3. 인쇄 가독성을 해치는 형광 톤 배경 채우기 및 장식용 일러스트 남용
4. 의미 없는 캡슐형 알약 배지(`border-radius: 9999px`) 중복 배치
