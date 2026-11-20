# Design Thinking Workshop (DTW) 프레젠테이션 & 진행자 가이드

조직이나 팀에서 Design Thinking Workshop을 직접 운영할 때 사용할 수 있는 **진행자용 웹 프레젠테이션과 실습 자료 모음입니다**.

처음 참여하는 실무자도 흐름을 따라갈 수 있도록 **하나의 연속 실무 사례(Single-Threaded Case Study)와** **5단계 작성 예시(Sample Deliverables)를** 담았으며, 별도 빌드 과정이나 백엔드 의존성 없이 웹 브라우저에서 바로 열 수 있습니다.

---

## 1. 프로젝트 구조

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages 자동 배포 워크플로우 (Actions 기반)
├── server/
│   ├── index.html                # 메인 프레젠테이션 및 진행자 뷰 마크업 (31 슬라이드)
│   ├── styles.css                # 프레젠테이션 및 진행자 뷰 스타일시트
│   ├── presenter-data.js         # 슬라이드별 진행자 대본·팁·체크리스트 데이터
│   ├── deck.js                   # 슬라이드 제어, 타이머 및 BroadcastChannel 동기화 로직
│   ├── worksheets/               # A3/A4 1장 출력용 실습 워크시트 (8종 + 인덱스)
│   │   ├── index.html            # 워크시트 목록 및 인쇄 안내
│   │   ├── 01_empathy_map.html   # 1단계: 페르소나 및 4분면 공감 맵 (A3 가로)
│   │   ├── 02_pov_hmw.html       # 2단계: POV 및 HMW 정의 (A4 세로)
│   │   ├── 03_crazy8s.html       # 3단계: Crazy 8s 8분 손스케치 (A4 가로)
│   │   ├── 04_idea_matrix.html   # 3단계: Impact vs Effort 2x2 매트릭스 (A3 가로)
│   │   ├── 05_storyboard.html    # 4단계: 6컷 스토리보드 (A4 가로)
│   │   ├── 06_feedback_grid.html # 5단계: 피드백 캡처 그리드 (A3 가로)
│   │   ├── 07_retrospective.html # 회고: I Like, I Wish, What If (A3 가로)
│   │   └── 08_action_sprint.html # 후속: 1주일 현업 검증 실행 계획서 (A4 세로)
│   ├── guide_workshop_facilitation.html  # 워크숍 진행자 통합 운영 가이드
│   ├── guide_dschool_bootleg.html        # 스탠퍼드 d.school 38개 방법론 가이드
│   ├── guide_ideou_framework.html        # IDEO U 디자인 씽킹 프레임워크 가이드
│   ├── export_presentation.py            # Headless Chrome 기반 PDF 변환 스크립트
│   ├── design-thinking-process.webp      # 5단계 프로세스 다이어그램
│   ├── dtw-actions.webp                  # 팀 활동 키 비주얼
│   ├── dtw-logo.webp                     # DTW 로고
│   ├── dtw_presentation.pdf              # 오프라인용 PDF 발표 문서
│   ├── robots.txt                        # 바이너리 에셋 및 AI 크롤러 수집 제한 규칙
│   └── README.md                         # 서버 디렉터리 안내
├── DESIGN.md                     # 디자인 시스템 및 UI 기준 문서
├── NOTICE.md                     # 제3자 저작권, 라이선스 범위 및 출처 안내
├── server.sh                     # 로컬 실행 스크립트 (Python HTTP Server)
├── .gitignore                    # Git 관리 제외 파일 정의
├── LICENSE                       # MIT License
└── README.md                     # 프로젝트 안내 문서
```

---

## 2. 주요 구성 및 기능

* **밝은 실내·프로젝터 환경을 고려한 라이트 테마:**
  * 밝은 회의실과 프로젝터 환경에서도 글자가 흐릿해지지 않도록 명도 대비가 높은 라이트 테마(`--bg-subtle: #fafafa`, `--bg-surface: #ffffff`, `--text-main: #18181b`)를 적용했습니다.
* **5단계 연속 실무 사례 (Single-Threaded Case Study):**
  * "타 부서 업무 협조 요청 및 진행 현황 확인 지연"이라는 조직 내 협업 문제를 바탕으로, 1단계 공감부터 5단계 테스트까지 이어지는 산출물 예시를 수록했습니다.
* **듀얼 뷰(Dual View) 실시간 동기화:**
  * 프로젝터 화면(참가자 뷰)과 발표자 모니터(진행자 뷰)를 분리해 운영할 수 있습니다.
  * 브라우저의 `BroadcastChannel` API를 사용해 별도 네트워크 설정 없이 슬라이드 이동과 타이머 상태가 두 창 사이에 동기화됩니다.
* **진행자 뷰 (Presenter View):**
  * 슬라이드별 구어체 진행 대본
  * 진행 팁 및 자주 막히는 상황 대응 메모
  * 현장 준비물 및 산출물 점검 체크리스트
  * 슬라이드별 권장 시간 원클릭 적용 및 타이머 제어 패널
  * 현재 슬라이드 및 다음 슬라이드 미리보기
* **내장 워크숍 타이머:**
  * 활동별 권장 시간 설정 (또는 3분, 5분, 10분, 15분, 20분, 30분 프리셋)
  * 참가자 화면 온스크린 카운트다운 위젯 (`T` 키)
  * 종료 1분 전 시각 알림 표시
* **반응형 16:9 슬라이드 캔버스:**
  * 화면 해상도에 맞춰 16:9 비율이 자동 조정되어 프로젝터와 모니터에서 내용이 잘리지 않습니다.
* **A3/A4 1장 인쇄용 실습 워크시트 (8종):**
  * 팀 공용 보드 4종(A3 가로)과 개인·소그룹 시트 4종(A4)이 브라우저 인쇄(`Ctrl+P` / `Cmd+P`) 시 각 1장에 맞게 출력되도록 여백과 크기를 맞추었습니다.
* **검색엔진 및 AI 크롤러 색인 제외 설정:**
  * 모든 HTML 페이지에 `robots` 및 `googlebot` 메타 태그(`noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate`)와 링크 `rel="nofollow"`를 적용했고, `server/robots.txt`로 비HTML 바이너리 문서(`.pdf`, 이미지)와 AI 학습·검색 크롤러의 수집을 차단합니다(HTML 페이지는 검색엔진이 `noindex` 태그를 읽고 색인에서 제외할 수 있도록 열람만 허용).

---

## 3. 슬라이드 구성 (총 31개 슬라이드)

1. **오프닝 & 그라운드 룰 / 환경 준비 (슬라이드 1 ~ 7)**
   - 01: 디자인 씽킹 워크숍 표지 (DTW 로고 키 비주얼)
   - 02: Design Thinking Workshop이란? (다직군 팀, 사용자 맥락 이해, 실습 중심 협업)
   - 03: 워크숍 개요 및 3가지 원칙 (인간 중심, 행동 지향, 반복을 통한 개선)
   - 04: 협업을 위한 4가지 그라운드 룰 (판단 유예, 양에 집중 등)
   - 05: Design Thinking 5단계 프로세스
   - 06: Design Thinking 인피니티 루프 프레임워크 (맥락과 형태의 순환)
   - 07: Design Thinking 실습 방식 및 팀 활동 안내
2. **Stage 1. Empathize (공감, 슬라이드 8 ~ 11)**
   - 08: Empathize: 사용자 맥락 이해하기 (관찰, 인터뷰, 직접 체험)
   - 09: 공감 인터뷰 기본 원칙 (Why 질문, 유도 질문 피하기)
   - 10: [실습] 페르소나 및 공감 맵 작성 (30분)
   - 11: **[실전 예시] 3년 차 마케팅 기획자 김지호 매니저의 페르소나 & 4분면 공감 맵 (슬라이드 11)**
3. **Stage 2. Define (문제 정의, 슬라이드 12 ~ 15)**
   - 12: Define: 핵심 문제 정의하기 (현상과 인사이트 분리)
   - 13: POV(Point of View)와 HMW(How Might We) 문장 구조
   - 14: [실습] POV 문장 및 HMW 질문 확정 (20분)
   - 15: **[실전 예시] 김지호 매니저의 Fact vs Insight 분리 및 최종 POV/HMW 문장 (슬라이드 15)**
4. **Stage 3. Ideate (아이디어 발상, 슬라이드 16 ~ 19)**
   - 16: Ideate: 양적 발산과 대안 확장하기 (판단 유예, 엉뚱한 발상 환영)
   - 17: 발산과 수렴 기법: Crazy 8s & Impact vs Effort 2x2 매트릭스
   - 18: [실습] 아이디어 발산 및 후보 솔루션 선정 (30분)
   - 19: **[실전 예시] Crazy 8s 8칸 손스케치 & 2x2 매트릭스 선정 결과 (슬라이드 19)**
5. **Stage 4. Prototype (시각화 및 구현, 슬라이드 20 ~ 23)**
   - 20: Prototype: 생각하지 말고 만들기 (저충실도 모형과 가설 검증)
   - 21: 상황별 프로토타입 형태 (페이퍼 와이어프레임, 6컷 스토리보드, 롤플레잉)
   - 22: [실습] 저충실도 프로토타입 제작 (30분)
   - 23: **[실전 예시] A4 용지 3장과 포스트잇으로 20분 만에 만든 페이퍼 모바일 목업 (슬라이드 23)**
6. **Stage 5. Test (테스트 및 피드백, 슬라이드 24 ~ 27)**
   - 24: Test: 설득하지 말고 관찰하기 (Show, Don't Tell 원칙)
   - 25: 피드백 캡처 그리드 (+Likes, -Criticisms, ?Questions, !Ideas)
   - 26: [실습] 크로스 팀 상호 테스트 (25분)
   - 27: **[실전 예시] 동료 테스트로 작성한 피드백 캡처 그리드 (슬라이드 27)**
7. **클로징 & 현업 실행 (슬라이드 28 ~ 31)**
   - 28: 최종 공유: 3분 스토리텔링 피칭
   - 29: 회고: I Like, I Wish, What If
   - 30: 워크숍 이후: 내일부터 시작하는 실행 (1주일 현업 검증 계획)
   - 31: 웹 프레젠테이션 주소 및 저작권 안내 (`electronicnomad.net/dtw`)

---

## 4. 실행 및 배포 방법

### 1) 로컬 브라우저에서 직접 열기
* [server/index.html](server/index.html) 파일을 웹 브라우저(Chrome 권장)로 열어 단일 화면 발표 자료를 바로 볼 수 있습니다.
* 단, 브라우저 보안 정책(`file://` 오리진 격리)으로 인해 `BroadcastChannel` 기반의 창 간 동기화가 제한되므로, **듀얼 모니터 진행자 뷰 실시간 동기화를 사용할 때는 아래 `2) 로컬 웹 서버 실행` 방식을 사용해 주세요.**

### 2) 로컬 웹 서버 실행 (권장)
```bash
./server.sh
# 또는
python3 -m http.server 8080 --directory server
```
서버 실행 후 브라우저에서 `http://localhost:8080`으로 접속합니다.

### 3) GitHub Pages 배포
이 저장소에는 GitHub Actions 배포 워크플로우([.github/workflows/deploy.yml](.github/workflows/deploy.yml))가 설정되어 있습니다.

* **배포 URL:** `https://electronicnomad.net/dtw` (또는 `https://electronicnomad.github.io/dtw/`)
* **배포 경로:** 저장소 루트의 `server/` 디렉터리가 정적 호스팅 대상입니다.
* **배포 트리거:** `main` 브랜치에 코드가 푸시되면 아티팩트가 생성되어 배포됩니다.

### 4) 듀얼 모니터 세팅 (프로젝터 + 발표자 노트북)
1. 노트북을 프로젝터나 외부 모니터에 연결하고 디스플레이 설정을 **"화면 확장"으로** 지정합니다.
2. 메인 브라우저 창을 프로젝터 화면으로 옮긴 뒤 `F` 키를 눌러 전체화면으로 전환합니다.
3. 상단의 **"진행자 뷰" 버튼을** 클릭하거나 `P` 키를 눌러 별도 창을 엽니다.
4. 진행자 창에서 슬라이드를 넘기거나 타이머를 조작하면 프로젝터 화면이 함께 동기화됩니다.

---

## 5. 키보드 단축키 안내

| 단축키 | 기능 설명 |
| :--- | :--- |
| `Space` / `→` / `PgDn` / `L` | 다음 슬라이드로 이동 |
| `←` / `PgUp` / `H` | 이전 슬라이드로 이동 |
| `Home` / `End` | 첫 번째 / 마지막 슬라이드로 이동 |
| `P` | 진행자 뷰(Presenter View) 열기 |
| `T` | 참가자 화면용 온스크린 타이머 토글 |
| `O` | 전체 슬라이드 조망(Overview Grid) 토글 |
| `F` | 전체화면 모드 토글 (상·하단 바 자동 숨김) |
| `Esc` | 오버뷰 또는 팝업 모달 닫기 |
| `?` | 단축키 안내 창 토글 |

*(참고: `Cmd+L`, `Ctrl+F` 등 브라우저 기본 단축키 및 입력 폼 조작 시에는 슬라이드 단축키가 개입하지 않습니다.)*

---

## 6. 워크시트 및 참고 가이드 안내

### 1) 인쇄용 실습 워크시트 (`server/worksheets/`)
모든 워크시트는 데스크톱 브라우저에서 인쇄할 때 1장으로 출력되도록 맞추어져 있습니다. 팀이 함께 포스트잇을 붙이는 공용 보드(01, 04, 06, 07)는 3x3인치 포스트잇 칸을 실제 크기로 담기 위해 **A3 가로**, 개인·소그룹 시트는 **A4입니다**. 인쇄 창에서 서식에 맞는 용지 크기를 선택하고 '배경 그래픽 포함'을 켜 주세요:
* [워크시트 목록 및 인쇄 안내](server/worksheets/index.html)
* [01. 페르소나 & 4분면 공감 맵 (A3 가로, 팀 보드)](server/worksheets/01_empathy_map.html)
* [02. POV & How Might We 정의서 (A4 세로)](server/worksheets/02_pov_hmw.html)
* [03. Crazy 8s 8분 손스케치 시트 (A4 가로)](server/worksheets/03_crazy8s.html)
* [04. Impact vs Effort 2x2 매트릭스 (A3 가로, 팀 보드)](server/worksheets/04_idea_matrix.html)
* [05. 6컷 고객 스토리보드 (A4 가로)](server/worksheets/05_storyboard.html)
* [06. 피드백 캡처 그리드 (+ - ? !) (A3 가로, 팀 보드)](server/worksheets/06_feedback_grid.html)
* [07. I Like, I Wish, What If 회고 보드 (A3 가로, 팀 보드)](server/worksheets/07_retrospective.html)
* [08. 1주일 현업 검증 실행 계획서 (A4 세로)](server/worksheets/08_action_sprint.html)

### 2) 참고 가이드 문서
* **[워크숍 진행자 통합 운영 가이드](server/guide_workshop_facilitation.html)**: 1일 타임테이블(9단계), 3가지 역할(퍼실리테이터·디사이더·팀), 상황별 대응 방법.
* **[스탠퍼드 d.school 디자인 씽킹 38개 방법론 가이드](server/guide_dschool_bootleg.html)**: d.school 38개 도구 한국어 요약 및 실행 팁, 단계별 필터 (CC BY-NC-SA 4.0 적용).
* **[IDEO U 디자인 씽킹 프레임워크 가이드](server/guide_ideou_framework.html)**: DVF 3요소, 5가지 크리에이티브 마인드셋, Brendan Boyle 웜업, 타 분야 유추 탐색.

---

## 7. 오프라인용 프레젠테이션 다운로드 (PDF)

* **[PDF 프레젠테이션 문서 (`server/dtw_presentation.pdf`)](server/dtw_presentation.pdf)** (16:9 비율, 31페이지)

---

## 8. 라이선스 및 제3자 권리 안내

저장소 내 자료는 성격에 따라 라이선스 적용 범위가 구분됩니다:

* **MIT 라이선스 적용 대상 ([LICENSE](LICENSE))**: 자체 제작 웹 프레젠테이션 코드·실무 시나리오(`server/index.html`, `server/styles.css`, `server/presenter-data.js`, `server/deck.js`, `server/dtw_presentation.pdf`, `server/export_presentation.py`, `server.sh`) 및 인쇄용 실습 워크시트 8종(`server/worksheets/*`). 내부 교육과 대고객 영업·제안 활동을 포함해 자유롭게 사용·수정·배포할 수 있습니다.
* **CC BY-NC-SA 4.0 별도 적용 (`server/guide_dschool_bootleg.html`)**: 스탠퍼드 d.school Bootleg 카드를 번역·요약한 2차적 저작물로 MIT 라이선스가 적용되지 않습니다. 유료 강의, 상업 컨설팅, 대고객 영리 영업 배포는 금지되며 비영리 학습 참고용으로만 사용할 수 있습니다.
* **외부 프레임워크 참고 요약본 및 기타 에셋 (MIT 제외)**: IDEO U(`server/guide_ideou_framework.html`) 및 Facilitator.com(`server/guide_workshop_facilitation.html`) 기반 참고 요약 문서, 오픈소스 웹폰트(`SIL OFL 1.1`), AI 생성 이미지 에셋의 세부 권리 범위와 비제휴 고지는 **[NOTICE.md](NOTICE.md)를** 확인해 주세요.
