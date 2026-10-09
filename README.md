# Design Thinking Workshop (DTW) 프레젠테이션 & 퍼실리테이터 마스터 가이드

현장 퍼실리테이터가 Design Thinking Workshop을 전문적으로 진행할 수 있도록 설계된 **실전 진행자용 듀얼 인터랙티브 프레젠테이션 및 종합 툴킷**입니다.

처음 워크숍에 참여하는 비디자이너 실무자들을 위해 **단 하나의 관통형 실무 시나리오(Single-Threaded Case Study)**와 **5단계 실물 예시(Sample Deliverables)**가 탑재되어 있으며, 별도의 빌드 과정이나 백엔드 의존성 없이 웹 브라우저만으로 즉시 구동됩니다.

---

## 1. 프로젝트 구조

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages 자동 배포 워크플로우 (Actions 기반)
├── server/
│   ├── index.html                # 메인 프레젠테이션 및 진행자 뷰 (31 슬라이드)
│   ├── worksheets/               # A4 1장 출력용 실전 워크시트 (8종 + 인덱스)
│   │   ├── index.html            # 워크시트 종합 인덱스 및 일괄 인쇄 안내
│   │   ├── 01_empathy_map.html   # 1단계: 4분면 공감 맵 (A4 가로)
│   │   ├── 02_pov_hmw.html       # 2단계: POV 및 HMW 정의 (A4 세로)
│   │   ├── 03_crazy8s.html       # 3단계: Crazy 8s 8분 손스케치 (A4 가로)
│   │   ├── 04_idea_matrix.html   # 3단계: Impact vs Effort 2x2 매트릭스 (A4 가로)
│   │   ├── 05_storyboard.html    # 4단계: 3컷 스토리보드 (A4 가로)
│   │   ├── 06_feedback_grid.html # 5단계: 피드백 캡처 그리드 (A4 가로)
│   │   ├── 07_retrospective.html # 회고: I Like, I Wish, What If (A4 세로)
│   │   └── 08_action_sprint.html # 후속: 1주일 스프린트 실행 계획서 (A4 세로)
│   ├── guide_workshop_facilitation.html  # 실전 워크숍 진행자 통합 운영 가이드 (HTML)
│   ├── guide_workshop_facilitation.md    # 실전 워크숍 진행자 통합 운영 가이드 (Markdown)
│   ├── guide_dschool_bootleg.html        # 스탠퍼드 d.school 38종 부트레그 툴킷 해설서 (HTML)
│   ├── guide_ideou_framework.html        # IDEO U 디자인 씽킹 마스터 가이드 (HTML)
│   ├── guide_ideou_framework.md          # IDEO U 디자인 씽킹 마스터 가이드 (Markdown)
│   ├── export_presentation.py            # Headless Chrome 기반 PPTX/PDF 자동 추출기
│   ├── export_slides/                    # 16:9 1080p 슬라이드 캡처 이미지 (31장)
│   ├── design-thinking-process.png       # 5단계 프로세스 다이어그램
│   ├── dtw-actions.jpg                   # 팀 활동 키 비주얼
│   ├── dtw-logo.jpg                      # DTW 로고
│   ├── dtw_presentation.pptx            # 16:9 와이드스크린 PowerPoint 발표 문서
│   ├── dtw_presentation.pdf             # 고해상도 PDF 발표 문서
│   └── README.md                         # 서버 디렉터리 안내
├── NOTICE.md                     # 제3자 저작권, 라이선스 범위 및 출처 안내
├── server.sh                     # 로컬 실행 스크립트 (Python HTTP Server)
├── .gitignore                    # Git 관리 제외 파일 정의
├── LICENSE                       # MIT License
└── README.md                     # 프로젝트 안내 문서
```

---

## 2. 주요 특징 및 핵심 기능

* **밝은 실내 및 프로젝터 환경에 최적화된 고대비 라이트 테마 (High-Contrast Light Theme):**
  * 밝은 세미나룸, 회의실, 빔 프로젝터 환경에서 색 바램(wash out) 없이 선명하게 보이도록 고대비 테마(`--bg-slate: #f8fafc`, 카드: `#ffffff`, 텍스트: `#0f172a`)가 적용되어 있습니다.
* **초심자를 위한 5단계 관통형 실무 예시 (Single-Threaded Case Study):**
  * "타 부서 업무 협조 요청 및 진행 현황 확인 병목"이라는 사내 협업 문제를 설정하여, 1단계 공감부터 5단계 테스트까지 일관되게 연결되는 실물 산출물 예시를 제시합니다.
* **듀얼 뷰(Dual View) 실시간 양방향 동기화:**
  * 프로젝터 화면(참가자 뷰)과 발표자 모니터(진행자 뷰)를 분리하여 운용할 수 있습니다.
  * 브라우저의 `BroadcastChannel` API를 기반으로 별도 네트워크 설정 없이 슬라이드 넘김 및 타이머가 두 화면 간에 즉시 동기화됩니다.
* **진행자 전용 지원 시스템 (Presenter View):**
  * 슬라이드별 구어체 진행 멘트(Verbatim Narration)
  * 완벽주의 해체 및 갈등 중재 팁(Coaching & Troubleshooting)
  * 현장 물품 및 산출물 점검 체크리스트
  * 슬라이드별 권장 타이머 원클릭 가동 및 직접 제어 패널
  * 현재 슬라이드 및 다음 슬라이드 미리보기
* **통합 워크숍 인터랙티브 타이머:**
  * 활동별 맞춤 권장 시간 자동 세팅 (또는 3분, 5분, 10분, 15분, 20분, 30분 프리셋)
  * 참가자 화면 대형 온스크린 카운트다운 위젯 (`T` 키)
  * 1분 미만 잔여 시 시각적 긴급 경고 애니메이션
* **반응형 16:9 슬라이드 캔버스:**
  * 화면 해상도에 맞춰 1920x1080 16:9 비율이 자동으로 스케일링되어 어떤 프로젝터나 모니터에서도 내용이 잘리거나 넘치지 않습니다.
* **A4 1장 출력 최적화 실전 워크시트 (8종):**
  * 브라우저 인쇄(`Ctrl+P` / `Cmd+P`) 시 정확히 A4 1장에 맞춰 출력되도록 여백과 레이아웃이 설계되어 있습니다.
* **검색엔진 노출 방지 (SEO & Noindex):**
  * 비공개 사내 교육 또는 폐쇄형 배포를 위해 모든 웹 페이지에 `<meta name="robots" content="noindex, nofollow, noarchive">`가 적용되어 있어 구글, 네이버 등 검색 결과에 페이지가 인덱싱되지 않습니다.

---

## 3. 슬라이드 구성 체계 (총 31개 슬라이드)

1. **오프닝 & 그라운드 룰 / 환경 준비 (슬라이드 1 ~ 7)**
   - 01: 디자인 씽킹 워크숍 인트로 표지 (DTW 로고 키 비주얼)
   - 02: Design Thinking Workshop이란? (다학제 팀, 심층 공감, 실습 중심 공동 창출)
   - 03: 워크숍 개요 및 핵심 3대 가치 (인간 중심, 행동 지향, 반복 진화)
   - 04: 창의적 협업을 위한 4가지 그라운드 룰 (판단 유예, 양에 집중 등)
   - 05: Design Thinking 5단계 프로세스 전체 맵
   - 06: 디자인 씽킹의 본질: 인피니티 루프 프레임워크 (지속적 순환과 반복)
   - 07: 디자인 씽킹 실전 액션 및 팀 상호작용 가이드
2. **Stage 1. Empathize (공감, 슬라이드 8 ~ 11)**
   - 08: 공감의 3대 접근법 (관찰, 인터뷰, 몰입)
   - 09: 공감 인터뷰 황금률 (Why 파고들기, 유도 질문 금지)
   - 10: [실습] 페르소나 및 4분면 공감 맵 작성 (30분)
   - 11: **[실전 예시] 3년 차 마케팅 기획자 김지호 매니저의 페르소나 & 4분면 공감 맵 (슬라이드 11)**
3. **Stage 2. Define (문제 정의, 슬라이드 12 ~ 15)**
   - 12: 현상(Fact)과 인사이트(Insight)의 명확한 분리
   - 13: POV(Point of View) 공식 및 HMW(How Might We) 질문법
   - 14: [실습] 핵심 POV 문장 및 단일 HMW 질문 확정 (20분)
   - 15: **[실전 예시] 김지호 매니저의 Fact vs Insight 분리 및 최종 POV/HMW 문장 (슬라이드 15)**
4. **Stage 3. Ideate (아이디어 발상, 슬라이드 16 ~ 19)**
   - 16: 브레인스토밍 핵심 규칙 (판단 유예, 엉뚱한 발상 환영)
   - 17: 발산(Crazy 8s)과 수렴(Impact vs Effort 2x2 매트릭스) 기법
   - 18: [실습] Crazy 8s 스케치 및 핵심 솔루션 1개 선정 (30분)
   - 19: **[실전 예시] Crazy 8s 8칸 아이디어 손스케치 & 2x2 매트릭스 선별 결과 (슬라이드 19)**
5. **Stage 4. Prototype (시각화 및 구현, 슬라이드 20 ~ 23)**
   - 20: 저충실도(Low-Fi) 프로토타입 철학과 가설 검증 원칙
   - 21: 상황별 형태 (페이퍼 와이어프레임, 스토리보드, 롤플레잉)
   - 22: [실습] 30분 초고속 실물 프로토타입 제작 (30분)
   - 23: **[실전 예시] A4 용지 3장과 포스트잇으로 20분 만에 만든 페이퍼 모바일 목업 (슬라이드 23)**
6. **Stage 5. Test (테스트 및 피드백, 슬라이드 24 ~ 27)**
   - 24: 테스트 황금률: Show, Don't Tell (설명하지 말고 관찰하라)
   - 25: 피드백 캡처 그리드 4분면 (+Likes, -Criticisms, ?Questions, !Ideas)
   - 26: [실습] 크로스 팀 상호 교차 테스트 (25분)
   - 27: **[실전 예시] 실제 동료가 손가락으로 누르고 남긴 피드백 캡처 그리드 (슬라이드 27)**
7. **클로징 & 현업 실행 (슬라이드 28 ~ 31)**
   - 28: 3분 스토리텔링 피칭 가이드
   - 29: I Like, I Wish, What If 회고
   - 30: 워크숍 이후 1주일 스프린트 액션 플랜 (사내 혁신 후속 조치)
   - 31: 웹 프레젠테이션 링크 및 저작권 안내 (`electronicnomad.net/dtw`)

---

## 4. 실행 및 배포 방법

### 1) 로컬 브라우저에서 직접 열기
* [server/index.html](server/index.html) 파일을 웹 브라우저(Chrome 권장)로 열어 즉시 사용합니다.

### 2) 로컬 웹 서버 실행 (권장)
```bash
./server.sh
# 또는
python3 -m http.server 8080 --directory server
```
서버 실행 후 브라우저에서 `http://localhost:8080`으로 접속합니다.

### 3) GitHub Pages 배포
이 저장소에는 GitHub Actions 배포 워크플로우([.github/workflows/deploy.yml](.github/workflows/deploy.yml))가 탑재되어 있습니다.

* **배포 URL:** `https://electronicnomad.net/dtw` (또는 `https://electronicnomad.github.io/dtw/`)
* **배포 경로:** 저장소 루트의 `server/` 디렉터리가 정적 호스팅 타깃입니다.
* **배포 트리거:** `main` 브랜치에 코드가 푸시되면 자동으로 빌드 아티팩트가 생성되어 배포됩니다.

### 4) 듀얼 모니터 세팅 (프로젝터 + 발표자 노트북)
1. 노트북을 프로젝터나 외부 모니터에 연결하고 디스플레이 설정을 **"화면 확장"**으로 지정합니다.
2. 메인 브라우저 창을 프로젝터 화면으로 이동시킨 후 `F` 키를 눌러 전체화면으로 전환합니다.
3. 상단의 **"진행자 뷰"** 버튼을 클릭하거나 `P` 키를 눌러 팝업 창을 엽니다.
4. 진행자 화면에서 슬라이드를 넘기거나 타이머를 조작하면 프로젝터 화면이 실시간으로 동기화됩니다.

---

## 5. 키보드 단축키 안내

| 단축키 | 기능 설명 |
| :--- | :--- |
| `Space` / `→` / `PgDn` / `L` | 다음 슬라이드로 이동 |
| `←` / `PgUp` / `H` | 이전 슬라이드로 이동 |
| `Home` / `End` | 첫 번째 / 마지막 슬라이드로 즉시 이동 |
| `P` | 진행자 전용 창(Presenter View) 열기 |
| `T` | 참가자 화면용 온스크린 타이머 토글 |
| `O` | 전체 슬라이드 조망(Overview Grid) 토글 |
| `F` | 전체화면 모드 토글 |
| `Esc` | 오버뷰 또는 팝업 모달 닫기 |
| `?` | 단축키 안내 창 토글 |

*(주의: `Cmd+L`, `Ctrl+F` 등 브라우저 기본 기능 및 입력 폼 조작 시에는 단축키 동작이 방해되지 않도록 처리되어 있습니다.)*

---

## 6. 워크시트 및 레퍼런스 가이드 문서 안내

### 1) 실전 인쇄용 A4 워크시트 (`server/worksheets/`)
모든 워크시트는 데스크톱 브라우저에서 인쇄할 때 깔끔하게 A4 1장으로 출력되도록 최적화되어 있습니다:
* [종합 인덱스 (워크시트 목록 및 일괄 인쇄 안내)](server/worksheets/index.html)
* [01. 페르소나 & 4분면 공감 맵 (A4 가로)](server/worksheets/01_empathy_map.html)
* [02. POV & How Might We 정의서 (A4 세로)](server/worksheets/02_pov_hmw.html)
* [03. Crazy 8s 8분 손스케치 시트 (A4 가로)](server/worksheets/03_crazy8s.html)
* [04. Impact vs Effort 2x2 매트릭스 (A4 가로)](server/worksheets/04_idea_matrix.html)
* [05. 3컷 고객 스토리보드 (A4 가로)](server/worksheets/05_storyboard.html)
* [06. 피드백 캡처 그리드 (+ - ? !) (A4 가로)](server/worksheets/06_feedback_grid.html)
* [07. I Like, I Wish, What If 회고 시트 (A4 세로)](server/worksheets/07_retrospective.html)
* [08. 1주일 스프린트 실행 계획서 (A4 세로)](server/worksheets/08_action_sprint.html)

### 2) 레퍼런스 가이드 문서
* **[실전 워크숍 진행자 통합 운영 가이드](server/guide_workshop_facilitation.html) ([Markdown](server/guide_workshop_facilitation.md))**: 1일 타임테이블(9단계), 3대 역할(퍼실리테이터/디사이더/팀), 상황별 트러블슈팅.
* **[스탠퍼드 d.school 38종 부트레그 툴킷 해설서](server/guide_dschool_bootleg.html)**: d.school 38개 도구 한국어 요약 및 실행 팁, 실시간 모드 필터 (CC BY-NC-SA 4.0 적용).
* **[IDEO U 디자인 씽킹 마스터 가이드](server/guide_ideou_framework.html) ([Markdown](server/guide_ideou_framework.md))**: DVF 렌즈, 크리에이티브 마인드셋, Brendan Boyle 웜업, 이종 유추 탐색.

---

## 7. 프레젠테이션 파일 다운로드 (PowerPoint / PDF)

* **[PowerPoint 프레젠테이션 (`server/dtw_presentation.pptx`)](server/dtw_presentation.pptx)** (16:9 와이드스크린, 31슬라이드 완비)
* **[PDF 프레젠테이션 문서 (`server/dtw_presentation.pdf`)](server/dtw_presentation.pdf)** (16:9 고해상도 31페이지 완비)

---

## 8. 라이선스 및 제3자 권리 안내

본 프로젝트의 자체 제작 소스코드 및 문서 텍스트는 [MIT License](LICENSE)에 따라 배포됩니다.

단, 본 프로젝트에 포함된 일부 2차적 저작물 및 제3자 자료는 각 원저작자의 라이선스를 따르며 상업적 이용이 제한될 수 있습니다:
* **스탠퍼드 d.school Bootleg 툴킷 해설서 (`server/guide_dschool_bootleg.html`)**: **CC BY-NC-SA 4.0** 라이선스가 적용되는 2차적 저작물입니다. 영리 목적(유료 강의, 상업적 컨설팅 상품 판매 등)의 이용이 엄격히 금지됩니다.
* **기타 인용 및 참고 방법론**: IDEO, Facilitator.com, Google Ventures, Christopher Alexander 등의 방법론을 독자적으로 인용·요약하였습니다. 각 상표 및 원저작물의 권리는 해당 원저작자에게 있습니다.
* 세부적인 출처 표기, 원저작권 정보 및 비제휴 고지는 **[NOTICE.md](NOTICE.md)**를 반드시 확인해 주세요.
