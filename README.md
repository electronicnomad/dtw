# Design Thinking Workshop (DTW) 프레젠테이션 & 퍼실리테이터 마스터 가이드

현장 퍼실리테이터가 Design Thinking Workshop을 전문적으로 진행할 수 있도록 설계된 **실전 진행자용 듀얼 인터랙티브 프레젠테이션 및 종합 툴킷**입니다.

처음 워크숍에 참여하는 비디자이너 실무자들을 위해 **단 하나의 관통형 실무 시나리오(Single-Threaded Case Study)**와 **5단계 실물 예시(Sample Deliverables)**가 탑재되어 있으며, 별도의 빌드 과정이나 백엔드 의존성 없이 웹 브라우저만으로 즉시 구동됩니다.

---

## 1. 프로젝트 구조

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages 자동 배포 워크플로우
├── server/
│   ├── index.html                # 메인 프레젠테이션 및 진행자 뷰 (29 슬라이드)
│   ├── guide_workshop_facilitation.html  # 실전 워크숍 진행자 통합 운영 가이드 (HTML)
│   ├── guide_workshop_facilitation.md    # 실전 워크숍 진행자 통합 운영 가이드 (Markdown)
│   ├── guide_dschool_bootleg.html        # 스탠퍼드 d.school 38종 부트레그 툴킷 (HTML)
│   ├── guide_ideou_framework.html        # IDEO U 디자인 씽킹 마스터 가이드 (HTML)
│   ├── guide_ideou_framework.md          # IDEO U 디자인 씽킹 마스터 가이드 (Markdown)
│   ├── export_presentation.py            # Headless Chrome 기반 PPTX/PDF 자동 추출기
│   ├── export_slides/                    # 16:9 4K 슬라이드 캡처 이미지 (29장)
│   ├── design-thinking-process.png       # 5단계 프로세스 다이어그램
│   ├── dtw-actions.jpg                   # 팀 활동 키 비주얼
│   ├── dtw-logo.jpg                      # DTW 로고
│   ├── dtw_presentation.pptx            # 16:9 와이드스크린 PowerPoint 문서
│   └── dtw_presentation.pdf             # 고해상도 PDF 발표 문서
├── dtw_presentation.pptx         # 루트 배포용 PowerPoint 프레젠테이션
├── dtw_presentation.pdf          # 루트 배포용 PDF 프레젠테이션 문서
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
* **듀얼 뷰(Dual View) 실시간 동기화:**
  * 프로젝터 화면(참가자 뷰)과 발표자 모니터(진행자 뷰)를 분리하여 운용할 수 있습니다.
  * 브라우저의 `BroadcastChannel` API를 기반으로 별도 네트워크 설정 없이 슬라이드 넘김 및 타이머가 두 화면 간에 즉시 동기화됩니다.
* **진행자 전용 지원 시스템 (Presenter View):**
  * 슬라이드별 구어체 진행 멘트(Verbatim Narration)
  * 완벽주의 해체 및 갈등 중재 팁(Coaching & Troubleshooting)
  * 현장 물품 및 산출물 점검 체크리스트
  * 현재 슬라이드 및 다음 슬라이드 미리보기
* **통합 워크숍 인터랙티브 타이머:**
  * 활동 권장 시간 프리셋 (3분, 5분, 10분, 15분, 20분, 30분)
  * 참가자 화면 대형 온스크린 카운트다운 위젯 (`T` 키)
  * 1분 미만 잔여 시 시각적 긴급 경고 애니메이션
* **전체 슬라이드 조망 (Overview Grid):**
  * `O` 키를 눌러 29개 전체 슬라이드를 한눈에 보고 원하는 단계로 즉시 점프 가능

---

## 3. 슬라이드 구성 체계 (총 29개 슬라이드)

1. **오프닝 & 그라운드 룰 / 환경 준비 (슬라이드 1 ~ 6)**
   - 01: 디자인 씽킹 워크숍 인트로 표지 (DTW 로고 키 비주얼)
   - 02: 워크숍 개요 및 핵심 3대 가치 (인간 중심, 행동 지향, 반복 진화)
   - 03: 창의적 협업을 위한 5가지 그라운드 룰 (판단 유예, 양에 집중 등)
   - 04: Design Thinking 5단계 프로세스 전체 맵
   - 05: 디자인 씽킹의 본질: 인피니티 루프 프레임워크 (지속적 순환과 반복)
   - 06: 디자인 씽킹 실전 액션 및 팀 상호작용 가이드
2. **Stage 1. Empathize (공감, 슬라이드 7 ~ 10)**
   - 07: 공감의 3대 접근법 (관찰, 인터뷰, 몰입)
   - 08: 공감 인터뷰 황금률 (Why 파고들기, 유도 질문 금지)
   - 09: [실습] 페르소나 및 4분면 공감 맵 작성 (30분)
   - 10: **[실전 예시] 3년 차 마케팅 기획자 김지호 매니저의 페르소나 & 4분면 공감 맵 (슬라이드 10)**
3. **Stage 2. Define (문제 정의, 슬라이드 11 ~ 14)**
   - 11: 현상(Fact)과 인사이트(Insight)의 명확한 분리
   - 12: POV(Point of View) 공식 및 HMW(How Might We) 질문법
   - 13: [실습] 핵심 POV 문장 및 단일 HMW 질문 확정 (20분)
   - 14: **[실전 예시] 김지호 매니저의 Fact vs Insight 분리 및 최종 POV/HMW 문장 (슬라이드 14)**
4. **Stage 3. Ideate (아이디어 발상, 슬라이드 15 ~ 18)**
   - 15: 브레인스토밍 핵심 규칙 (판단 유예, 엉뚱한 발상 환영)
   - 16: 발산(Crazy 8s)과 수렴(Impact vs Effort 2x2 매트릭스) 기법
   - 17: [실습] Crazy 8s 스케치 및 핵심 솔루션 1개 선정 (30분)
   - 18: **[실전 예시] Crazy 8s 8칸 아이디어 손스케치 & 2x2 매트릭스 선별 결과 (슬라이드 18)**
5. **Stage 4. Prototype (시각화 및 구현, 슬라이드 19 ~ 22)**
   - 19: 저충실도(Low-Fi) 프로토타입 철학과 가설 검증 원칙
   - 20: 상황별 형태 (페이퍼 와이어프레임, 스토리보드, 롤플레잉)
   - 21: [실습] 30분 초고속 실물 프로토타입 제작 (30분)
   - 22: **[실전 예시] A4 용지 3장과 포스트잇으로 20분 만에 만든 페이퍼 모바일 목업 (슬라이드 22)**
6. **Stage 5. Test (테스트 및 피드백, 슬라이드 23 ~ 26)**
   - 23: 테스트 황금률: Show, Don't Tell (설명하지 말고 관찰하라)
   - 24: 피드백 캡처 그리드 4분면 (+Likes, -Criticisms, ?Questions, !Ideas)
   - 25: [실습] 크로스 팀 상호 교차 테스트 (25분)
   - 26: **[실전 예시] 실제 동료가 손가락으로 누르고 남긴 피드백 캡처 그리드 (슬라이드 26)**
7. **클로징 & 현업 실행 (슬라이드 27 ~ 29)**
   - 27: 3분 스토리텔링 피칭 가이드
   - 28: I Like, I Wish, What If 회고
   - 29: 워크숍 이후 1주일 스프린트 액션 플랜 (사내 혁신 후속 조치)

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
이 저장소에는 GitHub Actions 워크플로우([.github/workflows/deploy.yml](.github/workflows/deploy.yml))가 포함되어 있습니다.
1. 저장소를 GitHub에 Push합니다.
2. GitHub 저장소의 **Settings > Pages** 메뉴로 이동합니다.
3. **Build and deployment > Source**를 **GitHub Actions**로 설정합니다.
4. `main` 또는 `master` 브랜치에 Push되면 자동으로 웹 프레젠테이션 사이트가 배포됩니다.

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

---

## 6. 참고자료 및 레퍼런스 가이드 문서 안내

워크숍을 준비하고 진행할 때 활용할 수 있도록, 글로벌 혁신 교육 기관들의 공식 가이드라인을 한국어로 종합 정리한 단독 HTML/Markdown 레퍼런스 문서를 함께 제공합니다:

1. **[실전 워크숍 진행자 통합 운영 가이드](server/guide_workshop_facilitation.html) ([Markdown 버전](server/guide_workshop_facilitation.md))**
   * **주요 내용:** 1일 완성 표준 타임테이블(09:00~16:45 9단계), 핵심 3대 역할(퍼실리테이터, 디사이더, 코어 팀), 3대 아이스브레이킹 게임, 4분면 공감 맵(Says/Thinks/Does/Feels), POV/HMW 공식, 최악의 아이디어 기법(Worst Possible Idea), 사용자 여정 맵(User Journey Map), 피드백 캡처 그리드(+/-/?/!) 및 임원 돌발 행동 중재 노하우 수록.
2. **[스탠퍼드 d.school Design Thinking 툴킷 완벽 해설서](server/guide_dschool_bootleg.html)**
   * **주요 내용:** 스탠퍼드 d.school 38개 핵심 도구(공감 8선, 정의 8선, 발상 6선, 프로토타입 8선, 테스트 8선) 전수 수록. 도구별 목적, 구체적 실행법, 초심자 퍼실리테이션 팁 및 모드별 실시간 필터링 기능 탑재.
3. **[IDEO U 디자인 씽킹 마스터 실전 운영 가이드](server/guide_ideou_framework.html) ([Markdown 버전](server/guide_ideou_framework.md))**
   * **주요 내용:** 혁신의 3대 렌즈(DVF), 5대 크리에이티브 마인드셋, Brendan Boyle의 우주 탐사 시각화 웜업(1분), 이종 산업 유추 탐색(Analogous Inspiration: 세포라 사례), 고객 여정 맵 및 Build-to-Think 신속 프로토타이핑 4대 기법 완벽 정리.

---

## 7. 프레젠테이션 파일 다운로드 (PowerPoint / Google Slides / PDF)

웹 발표자료의 상단 메뉴 바와 하단 카운터를 제외한 클린 16:9 프레젠테이션 파일이 생성되어 있습니다:

* **[PowerPoint 프레젠테이션 (`dtw_presentation.pptx`)](dtw_presentation.pptx)** (16:9 와이드스크린, 29슬라이드 완비)
* **[PDF 프레젠테이션 문서 (`dtw_presentation.pdf`)](dtw_presentation.pdf)** (16:9 고해상도 29페이지 완비)

### Google Slides 및 Microsoft PowerPoint 활용 방법
1. **Microsoft PowerPoint:** `dtw_presentation.pptx` 파일을 열어 슬라이드 쇼(F5)를 진행합니다.
2. **Google Slides:** Google Drive에 `dtw_presentation.pptx`를 업로드 후 'Google 프레젠테이션으로 열기'를 선택하거나, **파일 > 슬라이드 가져오기**를 통해 가져올 수 있습니다.
3. **슬라이드 수정 후 재추출:** 슬라이드 HTML을 수정한 후 `python3 server/export_presentation.py`를 실행하면 최신 화면이 반영된 PPTX와 PDF가 자동 생성됩니다.

---

## 8. 라이선스

이 프로젝트는 [MIT License](LICENSE)에 따라 자유롭게 사용, 수정 및 배포할 수 있습니다.
