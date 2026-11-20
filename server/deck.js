/* Render narration as paragraphs. Explicit "\n\n" breaks take priority;
   otherwise chunk at sentence boundaries once a paragraph reaches ~130 chars. */
function renderScriptParagraphs(container, text) {
  container.textContent = '';
  let paragraphs;
  if (text.indexOf('\n\n') !== -1) {
    paragraphs = text.split(/\n\n+/);
  } else {
    const sentences = text.split(/(?<=[.?!])\s+/);
    paragraphs = [];
    let buf = '';
    sentences.forEach(s => {
      buf = buf ? buf + ' ' + s : s;
      if (buf.length >= 130) { paragraphs.push(buf); buf = ''; }
    });
    if (buf) {
      if (paragraphs.length && buf.length < 40) paragraphs[paragraphs.length - 1] += ' ' + buf;
      else paragraphs.push(buf);
    }
  }
  paragraphs.forEach(p => {
    const el = document.createElement('p');
    el.textContent = p;
    container.appendChild(el);
  });
}

/* ========================================================
   STATE MANAGEMENT & MULTI-WINDOW SYNCHRONIZATION
   ======================================================== */
const urlParams = new URLSearchParams(window.location.search);
const isPresenterWindow = urlParams.get('presenter') === 'true';
const isExportMode = urlParams.get('export') === 'true';
const isFileProtocol = window.location.protocol === 'file:';

let channel = null;
if (!isExportMode && typeof BroadcastChannel !== 'undefined') {
  try {
    channel = new BroadcastChannel('dtw_workshop_sync');
  } catch (_) {}
}

const totalSlides = 31;
let currentSlide = 1;

// Read initial slide: query param > hash > sessionStorage > default 1
const initialSlideParam = parseInt(urlParams.get('slide'), 10);
const hashSlide = parseInt((location.hash || '').replace('#', ''), 10);
let savedSlide = NaN;
if (!isExportMode) {
  try {
    savedSlide = parseInt(sessionStorage.getItem('dtw_current_slide') || '', 10);
  } catch (_) {}
}

if (!isNaN(initialSlideParam) && initialSlideParam >= 1 && initialSlideParam <= totalSlides) {
  currentSlide = initialSlideParam;
} else if (!isNaN(hashSlide) && hashSlide >= 1 && hashSlide <= totalSlides) {
  currentSlide = hashSlide;
} else if (!isNaN(savedSlide) && savedSlide >= 1 && savedSlide <= totalSlides) {
  currentSlide = savedSlide;
}

// Timer State (Timestamp-Based with Drift Protection)
let timerTotalSeconds = 15 * 60;
let timerRemainingSeconds = 15 * 60;
let timerEndTime = null; // null if paused; timestamp (ms) if actively counting
let timerRunning = false;
let timerInterval = null;

// Restore timer state from sessionStorage if available
try {
  const savedTimerStr = sessionStorage.getItem('dtw_timer_state');
  if (savedTimerStr) {
    const saved = JSON.parse(savedTimerStr);
    if (saved && typeof saved.total === 'number') {
      timerTotalSeconds = saved.total;
      if (saved.running && saved.endTime && saved.endTime > Date.now()) {
        timerRunning = true;
        timerEndTime = saved.endTime;
        timerRemainingSeconds = Math.max(0, Math.ceil((saved.endTime - Date.now()) / 1000));
      } else {
        timerRunning = false;
        timerEndTime = null;
        timerRemainingSeconds = Math.max(0, typeof saved.remaining === 'number' ? saved.remaining : saved.total);
      }
    }
  }
} catch (_) {}

// Phase Colors & Names (Calibrated Editorial Stage Accents)
const phaseMeta = {
  intro: { name: 'Introduction', label: '오프닝 & 그라운드 룰', color: '#1d4ed8' },
  empathize: { name: 'Stage 1: Empathize', label: '공감: 사용자 맥락 이해하기', color: '#0369a1' },
  define: { name: 'Stage 2: Define', label: '정의: 핵심 문제 정의하기', color: '#047857' },
  ideate: { name: 'Stage 3: Ideate', label: '발상: 양적 발산과 수렴', color: '#b45309' },
  prototype: { name: 'Stage 4: Prototype', label: '시각화: 생각하지 말고 만들기', color: '#be123c' },
  test: { name: 'Stage 5: Test', label: '테스트: 설득하지 말고 관찰하기', color: '#3730a3' },
  closing: { name: 'Debrief & Wrap-up', label: '회고 및 현업 실행 계획', color: '#1d4ed8' }
};

/* ========================================================
   INITIALIZATION & RESPONSIVE SCALING
   ======================================================== */
function fitSlidesToViewport() {
  if (isPresenterWindow || document.body.classList.contains('export-mode')) return;
  const viewport = document.querySelector('main.viewport');
  if (!viewport) return;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.body.classList.contains('fullscreen-active'));
  const padW = isFs ? 24 : 32;
  const padH = isFs ? 20 : 16;
  const availW = Math.max(320, viewport.clientWidth - padW);
  const availH = Math.max(200, viewport.clientHeight - padH);
  const baseW = 1360;
  const baseH = 760;
  const scale = Math.min(availW / baseW, availH / baseH);
  document.documentElement.style.setProperty('--slide-scale', scale.toFixed(4));
}

document.addEventListener('DOMContentLoaded', () => {
  if (isExportMode) {
    document.body.classList.add('export-mode');
  }
  fitSlidesToViewport();
  window.addEventListener('resize', fitSlidesToViewport);

  if (isPresenterWindow) {
    initPresenterMode();
  } else {
    initParticipantMode();
  }
  if (!isExportMode) {
    setupBroadcastSync();
  }
  updateAll(currentSlide, false);

  if (timerRunning && timerEndTime) {
    startTimerTick();
  }
  renderTimer();

  // Request sync from existing open tabs
  if (!isExportMode && channel) {
    setTimeout(() => {
      channel.postMessage({ type: 'REQUEST_SYNC' });
    }, 150);
  }
});

window.addEventListener('hashchange', () => {
  if (isPresenterWindow) return;
  const hashN = parseInt((location.hash || '').replace('#', ''), 10);
  if (!isNaN(hashN) && hashN >= 1 && hashN <= totalSlides && hashN !== currentSlide) {
    goToSlide(hashN, true);
  }
});

/* ========================================================
   PARTICIPANT / MAIN DECK LOGIC
   ======================================================== */
function initParticipantMode() {
  document.getElementById('btn-next').addEventListener('click', () => nextSlide());
  document.getElementById('btn-prev').addEventListener('click', () => prevSlide());
  
  document.getElementById('btn-timer-toggle').addEventListener('click', () => toggleOnscreenTimer());
  document.getElementById('btn-presenter-mode').addEventListener('click', () => openPresenterWindow());
  document.getElementById('btn-overview-toggle').addEventListener('click', () => toggleOverviewModal());
  document.getElementById('btn-help-toggle').addEventListener('click', () => toggleShortcutsModal());

  document.getElementById('btn-close-shortcuts').addEventListener('click', () => toggleShortcutsModal(false));
  document.getElementById('btn-close-overview').addEventListener('click', () => toggleOverviewModal(false));

  const shortcutsBackdrop = document.getElementById('shortcuts-modal');
  if (shortcutsBackdrop) {
    shortcutsBackdrop.addEventListener('click', (e) => {
      if (e.target === shortcutsBackdrop) toggleShortcutsModal(false);
    });
  }
  const overviewBackdrop = document.getElementById('overview-modal');
  if (overviewBackdrop) {
    overviewBackdrop.addEventListener('click', (e) => {
      if (e.target === overviewBackdrop) toggleOverviewModal(false);
    });
  }

  document.getElementById('btn-timer-start-pause').addEventListener('click', () => toggleTimer());
  document.getElementById('btn-timer-reset').addEventListener('click', () => resetTimer());
  const btnMinus1 = document.getElementById('btn-timer-minus1');
  if (btnMinus1) btnMinus1.addEventListener('click', () => addTimerMinutes(-1));
  const btnPlus1 = document.getElementById('btn-timer-plus1');
  if (btnPlus1) btnPlus1.addEventListener('click', () => addTimerMinutes(1));

  // Preset buttons on onscreen widget
  document.querySelectorAll('#onscreen-timer .timer-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.dataset.preset, 10);
      if (!isNaN(mins)) setTimerMinutes(mins);
    });
  });

  window.addEventListener('keydown', handleGlobalKeydown);
  renderOverviewGrid();
}

/* ========================================================
   PRESENTER WINDOW LOGIC
   ======================================================== */
function initPresenterMode() {
  document.body.classList.add('presenter-mode');
  document.getElementById('deck-container').style.display = 'none';
  document.getElementById('presenter-root').style.display = 'block';

  const fileNoticeEl = document.getElementById('p-file-protocol-notice');
  if (fileNoticeEl && isFileProtocol) {
    fileNoticeEl.hidden = false;
  }

  document.getElementById('p-btn-next').addEventListener('click', () => nextSlide());
  document.getElementById('p-btn-prev').addEventListener('click', () => prevSlide());

  document.getElementById('p-btn-timer-start-pause').addEventListener('click', () => toggleTimer());
  document.getElementById('p-btn-timer-reset').addEventListener('click', () => resetTimer());
  const pMinus1 = document.getElementById('p-btn-timer-minus1');
  if (pMinus1) pMinus1.addEventListener('click', () => addTimerMinutes(-1));
  const pPlus1 = document.getElementById('p-btn-timer-plus1');
  if (pPlus1) pPlus1.addEventListener('click', () => addTimerMinutes(1));
  const pPlus5 = document.getElementById('p-btn-timer-plus5');
  if (pPlus5) pPlus5.addEventListener('click', () => addTimerMinutes(5));

  document.querySelectorAll('#presenter-root .p-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.dataset.preset, 10);
      if (!isNaN(mins)) setTimerMinutes(mins);
    });
  });

  const applySlideBtn = document.getElementById('p-btn-timer-apply-slide');
  if (applySlideBtn) applySlideBtn.addEventListener('click', () => applySlideRecommendedTimer());

  const toggleOnscreenBtn = document.getElementById('p-btn-timer-toggle-onscreen');
  if (toggleOnscreenBtn) toggleOnscreenBtn.addEventListener('click', () => toggleOnscreenTimer());

  setInterval(() => {
    const now = new Date();
    const str = now.toTimeString().split(' ')[0];
    const clockEl = document.getElementById('p-clock');
    if (clockEl) clockEl.textContent = str;
  }, 1000);

  window.addEventListener('keydown', handleGlobalKeydown);
}

/* ========================================================
   NAVIGATION & RENDERING
   ======================================================== */
function goToSlide(n, broadcast = true) {
  if (n < 1) n = 1;
  if (n > totalSlides) n = totalSlides;
  currentSlide = n;
  if (!isPresenterWindow && history.replaceState) {
    history.replaceState(null, '', '#' + n);
  }
  try {
    sessionStorage.setItem('dtw_current_slide', String(n));
  } catch (_) {}
  updateAll(currentSlide, broadcast);
}

function nextSlide() {
  if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
}

function prevSlide() {
  if (currentSlide > 1) goToSlide(currentSlide - 1);
}

function updateAll(n, broadcast = true) {
  if (!isPresenterWindow) {
    document.querySelectorAll('.slide-wrapper').forEach(slide => slide.classList.remove('active'));
    const curSlideEl = document.getElementById(`slide-${n}`);
    if (curSlideEl) {
      curSlideEl.classList.add('active');
      const phase = curSlideEl.dataset.phase || 'intro';
      const meta = phaseMeta[phase] || phaseMeta.intro;
      
      document.documentElement.style.setProperty('--active-accent', meta.color);
      document.documentElement.style.setProperty('--active-accent-bg', `${meta.color}22`);

      document.getElementById('current-phase-tag').textContent = meta.name;
      document.getElementById('slide-theme-indicator').textContent = meta.label;
    }

    const counter = document.getElementById('slide-counter');
    if (counter) counter.textContent = `${String(n).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = `${((n - 1) / (totalSlides - 1)) * 100}%`;

    document.querySelectorAll('.overview-item').forEach(item => {
      if (parseInt(item.dataset.slide, 10) === n) {
        item.classList.add('current');
      } else {
        item.classList.remove('current');
      }
    });
  } else {
    const slidesScriptData = (typeof presenterData !== 'undefined') ? presenterData : {};
    const data = slidesScriptData[n] || { script: '내용 없음', tips: '팁 없음', checklist: '없음' };
    
    const sourceSlide = document.getElementById(`slide-${n}`);
    const phase = sourceSlide ? sourceSlide.dataset.phase : 'intro';
    const meta = phaseMeta[phase] || phaseMeta.intro;

    document.getElementById('p-phase-tag').textContent = meta.name;
    document.getElementById('p-phase-tag').style.color = meta.color;

    const titleText = sourceSlide ? sourceSlide.querySelector('.slide-title').textContent : `Slide ${n}`;
    const timeAttr = sourceSlide ? (sourceSlide.getAttribute('data-time') || '') : '';
    document.getElementById('p-slide-title').textContent = timeAttr ? `${titleText}  (권장 ${timeAttr})` : titleText;
    document.getElementById('p-slide-counter').textContent = `${String(n).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

    renderScriptParagraphs(document.getElementById('p-script-text'), data.script);
    document.getElementById('p-tip-text').textContent = data.tips;
    document.getElementById('p-checklist-text').textContent = data.checklist;

    const curPreview = document.getElementById('p-current-preview');
    if (sourceSlide) {
      const imgEl = sourceSlide.querySelector('img');
      let mediaHtml = '';
      if (imgEl) {
        mediaHtml = `
          <div style="margin-top: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #d4d4d8; border-radius: 4px; padding: 10px; width: 100%;">
            <img src="${imgEl.getAttribute('src')}" alt="${imgEl.getAttribute('alt') || 'Slide Image'}" style="max-height: 156px; max-width: 100%; object-fit: contain;" />
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #71717a; margin-top: 6px;">[시각 미디어 화면]</span>
          </div>
        `;
      }

      curPreview.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: ${meta.color}; font-weight: 700; margin-bottom: 6px;">${meta.label}</div>
        <h3 style="font-size: 1.22rem; margin-bottom: 8px; color: #09090b;">${titleText}</h3>
        <p style="font-size: 0.88rem; color: #52525b; line-height: 1.48;">${sourceSlide.querySelector('.slide-subtitle') ? sourceSlide.querySelector('.slide-subtitle').textContent : ''}</p>
        ${mediaHtml}
      `;
    }

    const nextPreview = document.getElementById('p-next-preview');
    const nextSource = document.getElementById(`slide-${n + 1}`);
    if (nextSource) {
      const nextMeta = phaseMeta[nextSource.dataset.phase] || phaseMeta.intro;
      const nextImgEl = nextSource.querySelector('img');
      let nextMediaHtml = '';
      if (nextImgEl) {
        nextMediaHtml = `
          <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px; background: #ffffff; border: 1px solid #d4d4d8; border-radius: 4px; padding: 6px 10px;">
            <img src="${nextImgEl.getAttribute('src')}" alt="" style="height: 42px; width: auto; object-fit: contain;" />
            <span style="font-size: 0.76rem; color: #71717a;">(이미지 슬라이드)</span>
          </div>
        `;
      }

      nextPreview.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: ${nextMeta.color}; font-weight: 700; margin-bottom: 4px;">다음: ${nextMeta.name}</div>
        <div style="font-size: 1.02rem; font-weight: 700; color: #09090b;">${nextSource.querySelector('.slide-title').textContent}</div>
        <p style="font-size: 0.82rem; color: #52525b; margin-top: 4px; line-height: 1.38;">${nextSource.querySelector('.slide-subtitle') ? nextSource.querySelector('.slide-subtitle').textContent : ''}</p>
        ${nextMediaHtml}
      `;
    } else {
      nextPreview.innerHTML = `<div style="color: #71717a; font-size: 0.88rem;">마지막 슬라이드입니다.</div>`;
    }
  }

  if (broadcast && channel) {
    channel.postMessage({ type: 'GOTO_SLIDE', slideIndex: n });
  }
}

/* ========================================================
   TIMER ENGINE (Timestamp-Based with Drift Protection)
   ======================================================== */
function startTimerTick() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerRunning || !timerEndTime) return;
    const now = Date.now();
    timerRemainingSeconds = Math.max(0, Math.ceil((timerEndTime - now) / 1000));
    renderTimer();
    if (timerRemainingSeconds <= 0) {
      timerRemainingSeconds = 0;
      timerRunning = false;
      timerEndTime = null;
      clearInterval(timerInterval);
      playTimerAlert();
      renderTimer();
      broadcastTimerState();
    }
  }, 250);
}

function playTimerAlert() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (_) {}
}

function broadcastTimerState() {
  if (channel) {
    channel.postMessage({
      type: 'TIMER_SYNC',
      running: timerRunning,
      remaining: timerRemainingSeconds,
      total: timerTotalSeconds,
      endTime: timerEndTime
    });
  }
  try {
    sessionStorage.setItem('dtw_timer_state', JSON.stringify({
      running: timerRunning,
      remaining: timerRemainingSeconds,
      total: timerTotalSeconds,
      endTime: timerEndTime,
      updatedAt: Date.now()
    }));
  } catch (_) {}
}

function toggleTimer(broadcast = true) {
  if (!timerRunning) {
    if (timerRemainingSeconds <= 0) {
      timerRemainingSeconds = timerTotalSeconds;
    }
    timerEndTime = Date.now() + timerRemainingSeconds * 1000;
    timerRunning = true;
    startTimerTick();
  } else {
    if (timerEndTime) {
      timerRemainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    }
    timerRunning = false;
    timerEndTime = null;
    if (timerInterval) clearInterval(timerInterval);
  }
  renderTimer();
  if (broadcast) broadcastTimerState();
}

function resetTimer(broadcast = true) {
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  timerEndTime = null;
  timerRemainingSeconds = timerTotalSeconds;
  renderTimer();
  if (broadcast) broadcastTimerState();
}

function setTimerMinutes(mins, broadcast = true) {
  const secs = mins * 60;
  timerTotalSeconds = secs;
  timerRemainingSeconds = secs;
  if (timerRunning) {
    timerEndTime = Date.now() + secs * 1000;
  }
  renderTimer();
  if (broadcast) broadcastTimerState();
}

function addTimerMinutes(mins, broadcast = true) {
  const deltaSecs = mins * 60;
  if (timerRunning && timerEndTime) {
    timerEndTime += deltaSecs * 1000;
    timerRemainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
  } else {
    timerRemainingSeconds = Math.max(0, timerRemainingSeconds + deltaSecs);
  }
  if (timerRemainingSeconds <= 0) {
    timerRemainingSeconds = 0;
    timerRunning = false;
    timerEndTime = null;
    if (timerInterval) clearInterval(timerInterval);
  }
  timerTotalSeconds = Math.max(timerTotalSeconds, timerRemainingSeconds);
  renderTimer();
  if (broadcast) broadcastTimerState();
}

function applySlideRecommendedTimer(broadcast = true) {
  const slideEl = document.getElementById(`slide-${currentSlide}`);
  if (!slideEl) return;
  const timeAttr = slideEl.getAttribute('data-time') || '';
  const match = timeAttr.match(/(\d+)\s*분/);
  if (match) {
    const mins = parseInt(match[1], 10);
    if (mins > 0) {
      setTimerMinutes(mins, broadcast);
    }
  }
}

function renderTimer() {
  const mins = Math.floor(timerRemainingSeconds / 60);
  const secs = timerRemainingSeconds % 60;
  const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const onScreenDigits = document.getElementById('timer-display');
  const onScreenBtn = document.getElementById('btn-timer-start-pause');
  if (onScreenDigits) {
    onScreenDigits.textContent = str;
    if (timerRemainingSeconds <= 60 && timerRunning) {
      onScreenDigits.classList.add('urgent');
    } else {
      onScreenDigits.classList.remove('urgent');
    }
  }
  if (onScreenBtn) onScreenBtn.textContent = timerRunning ? '정지' : '시작';

  const pDigits = document.getElementById('p-timer-display');
  const pBtn = document.getElementById('p-btn-timer-start-pause');
  if (pDigits) {
    pDigits.textContent = str;
    if (timerRemainingSeconds <= 60 && timerRunning) {
      pDigits.style.color = '#be123c';
    } else {
      pDigits.style.color = '#09090b';
    }
  }
  if (pBtn) pBtn.textContent = timerRunning ? '정지' : '시작';
}

function toggleOnscreenTimer(force, broadcast = true) {
  const widget = document.getElementById('onscreen-timer');
  const btn = document.getElementById('btn-timer-toggle');
  const pToggleBtn = document.getElementById('p-btn-timer-toggle-onscreen');
  if (!widget) return;
  const isOpen = widget.classList.contains('visible');
  const nextState = force !== undefined ? force : !isOpen;
  
  if (nextState) {
    widget.classList.add('visible');
    if (btn) btn.classList.add('active');
    if (pToggleBtn) pToggleBtn.classList.add('active');
  } else {
    widget.classList.remove('visible');
    if (btn) btn.classList.remove('active');
    if (pToggleBtn) pToggleBtn.classList.remove('active');
  }

  if (broadcast && channel) {
    channel.postMessage({ type: 'TOGGLE_ONSCREEN_TIMER', visible: nextState });
  }
}

/* ========================================================
   BROADCAST CHANNEL SYNCHRONIZATION
   ======================================================== */
function setupBroadcastSync() {
  if (!channel) return;
  channel.onmessage = (event) => {
    const msg = event.data;
    if (!msg) return;

    if (msg.type === 'GOTO_SLIDE') {
      goToSlide(msg.slideIndex, false);
    } else if (msg.type === 'REQUEST_SYNC') {
      channel.postMessage({
        type: 'SYNC_STATE',
        slideIndex: currentSlide,
        running: timerRunning,
        remaining: timerRemainingSeconds,
        total: timerTotalSeconds,
        endTime: timerEndTime
      });
    } else if (msg.type === 'SYNC_STATE') {
      goToSlide(msg.slideIndex, false);
      applyTimerSyncPayload(msg);
    } else if (msg.type === 'TIMER_SYNC') {
      applyTimerSyncPayload(msg);
    } else if (msg.type === 'TOGGLE_ONSCREEN_TIMER') {
      toggleOnscreenTimer(msg.visible, false);
    }
  };
}

function applyTimerSyncPayload(msg) {
  if (typeof msg.total === 'number') timerTotalSeconds = msg.total;
  if (msg.running && msg.endTime) {
    timerRunning = true;
    timerEndTime = msg.endTime;
    timerRemainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    startTimerTick();
  } else {
    timerRunning = false;
    timerEndTime = null;
    if (typeof msg.remaining === 'number') timerRemainingSeconds = msg.remaining;
    if (timerInterval) clearInterval(timerInterval);
  }
  renderTimer();
}

/* ========================================================
   MODALS & WINDOW OPENERS
   ======================================================== */
function openPresenterWindow() {
  const width = 1280;
  const height = 800;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  window.open(
    `${window.location.pathname}?presenter=true&slide=${currentSlide}`,
    'dtw_presenter_window',
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
}

function syncDeckInertState() {
  const deckEl = document.getElementById('deck-container');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const overviewModal = document.getElementById('overview-modal');
  if (!deckEl) return;
  const anyModalOpen = !!(
    (shortcutsModal && shortcutsModal.classList.contains('open')) ||
    (overviewModal && overviewModal.classList.contains('open'))
  );
  deckEl.inert = anyModalOpen;
}

function toggleShortcutsModal(force) {
  const modal = document.getElementById('shortcuts-modal');
  if (!modal) return;
  if (force !== undefined) {
    if (force) modal.classList.add('open');
    else modal.classList.remove('open');
  } else {
    modal.classList.toggle('open');
  }
  syncDeckInertState();
}

function toggleOverviewModal(force) {
  const modal = document.getElementById('overview-modal');
  if (!modal) return;
  if (force !== undefined) {
    if (force) modal.classList.add('open');
    else modal.classList.remove('open');
  } else {
    modal.classList.toggle('open');
  }
  syncDeckInertState();
}

function renderOverviewGrid() {
  const grid = document.getElementById('overview-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 1; i <= totalSlides; i++) {
    const slideEl = document.getElementById(`slide-${i}`);
    if (!slideEl) continue;
    const phase = slideEl.dataset.phase || 'intro';
    const meta = phaseMeta[phase] || phaseMeta.intro;
    const title = slideEl.querySelector('.slide-title') ? slideEl.querySelector('.slide-title').textContent : `Slide ${i}`;

    const item = document.createElement('div');
    item.className = 'overview-item';
    item.dataset.slide = i;
    if (i === currentSlide) item.classList.add('current');
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <span class="num">${String(i).padStart(2, '0')}</span>
        <span class="phase" style="color: ${meta.color};">${meta.name}</span>
      </div>
      <div class="title">${title}</div>
    `;

    item.addEventListener('click', () => {
      goToSlide(i);
      toggleOverviewModal(false);
    });

    grid.appendChild(item);
  }
}

/* ========================================================
   KEYBOARD SHORTCUTS HANDLER
   ======================================================== */
function handleGlobalKeydown(e) {
  // Do not intercept browser/system shortcuts (Cmd+F, Cmd+P, Cmd+L, Ctrl+P, Alt+Left, etc.)
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
    case 'l':
    case 'L':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'PageUp':
    case 'h':
    case 'H':
      e.preventDefault();
      prevSlide();
      break;
    case 'Home':
      e.preventDefault();
      goToSlide(1);
      break;
    case 'End':
      e.preventDefault();
      goToSlide(totalSlides);
      break;
    case 'p':
    case 'P':
      e.preventDefault();
      if (!isPresenterWindow) openPresenterWindow();
      break;
    case 't':
    case 'T':
      e.preventDefault();
      if (!isPresenterWindow) toggleOnscreenTimer();
      break;
    case 'o':
    case 'O':
      e.preventDefault();
      if (!isPresenterWindow) toggleOverviewModal();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case '?':
      e.preventDefault();
      if (!isPresenterWindow) toggleShortcutsModal();
      break;
    case 'Escape':
      if (!isPresenterWindow) {
        toggleShortcutsModal(false);
        toggleOverviewModal(false);
      }
      break;
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

const updateFullscreenClass = () => {
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (isFs) {
    document.body.classList.add('fullscreen-active');
  } else {
    document.body.classList.remove('fullscreen-active');
  }
  fitSlidesToViewport();
  requestAnimationFrame(fitSlidesToViewport);
};
document.addEventListener('fullscreenchange', updateFullscreenClass);
document.addEventListener('webkitfullscreenchange', updateFullscreenClass);
