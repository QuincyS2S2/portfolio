  const card = document.querySelector('.business-card');
  if (card) {
    card.querySelectorAll('[data-copy]').forEach(row => {
      row.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(row.dataset.copy);
          card.classList.add('show-toast');
          clearTimeout(card._t);
          card._t = setTimeout(() => card.classList.remove('show-toast'), 1200);
        } catch (e) {
          // 클립보드 차단 환경(드묾)일 땐 조용히 패스
        }
      });
    });
  }

const io = new IntersectionObserver((es) => {
     es.forEach(e => e.isIntersecting && e.target.classList.add('is-in'));
   }, { threshold: 0.12 });
   document.querySelectorAll('.main-work').forEach(el => {
     el.classList.add('reveal'); io.observe(el);
   });

/* ── nav 클릭 → 해당 파트로 부드럽게 스크롤 ──
   nav 링크의 텍스트를 섹션 id에 매핑. href="#"를 실제 앵커로 바꾸고
   클릭 시 scrollIntoView(smooth)로 이동. */
const navTargets = {
  '메인 보드': '#board',
  'Web site': '#work-danawa',
  '다나와 리디자인': '#work-danawa',
  '애나이더 수족관': '#work-anaider',
  'KEJ': '#work-kej',
  '그 외': '#work-sub',
  'Mobile': '#work-ikoka',
  'IKOKA': '#work-ikoka',
  '약쏙': '#work-yacksok',
  '해독제': '#work-hedokje',
  'Graphic': '#work-graphic',
  '편집 디자인': '#work-graphic',
  '제품 패키지 디자인': '#work-graphic',
  '배너 광고물': '#work-graphic',
  'AI 생성물': '#work-graphic',
};

document.querySelectorAll('nav a').forEach(a => {
  const key = a.textContent.trim();
  const sel = navTargets[key];
  if (!sel) return;
  a.setAttribute('href', sel);
  a.addEventListener('click', (e) => {
    const target = document.querySelector(sel);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 간단 이력 카드: 디자인 / 문학 토글 ──
   세그먼트 클릭 시 active 표시 전환 + 해당 리스트만 보이기 */
document.querySelectorAll('.history-card').forEach(card => {
  const segs = card.querySelectorAll('.seg');
  const panels = card.querySelectorAll('.history-list');
  segs.forEach(seg => {
    seg.addEventListener('click', () => {
      const key = seg.dataset.history;
      segs.forEach(s => s.classList.toggle('active', s === seg));
      panels.forEach(p => { p.hidden = (p.dataset.panel !== key); });
    });
  });
});

/* ── 사이트 팝업 모달 (스타벅스 등) ── */
(function () {
  const lockScroll = (on) => { document.body.style.overflow = on ? 'hidden' : ''; };

  // 화면을 즉시 맨 위로 점프 → 천천히 끝까지 내려가는 리빌 시작
  function jumpAndReveal(screen) {
    if (!screen) return;
    screen.classList.add('no-anim');
    screen.classList.remove('auto', 'fast');     // 즉시 맨 위로
    // 레이아웃이 확정된 다음 프레임에 화면 높이를 정확히 측정
    requestAnimationFrame(() => {
      screen.style.setProperty('--win-h', (screen.clientHeight || 405) + 'px');
      void screen.offsetWidth;                   // '맨 위' 상태 확정
      screen.classList.remove('no-anim');
      requestAnimationFrame(() => screen.classList.add('auto'));
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    jumpAndReveal(modal.querySelector('.popup-screen'));
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    const screen = modal.querySelector('.popup-screen');
    if (screen) screen.classList.remove('auto', 'fast');
  }

  // 열기 트리거 (스타벅스 카드 등)
  document.querySelectorAll('[data-modal-open]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.modalOpen));
  });

  // 닫기: X 버튼 / 배경 클릭
  document.querySelectorAll('.site-modal [data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.site-modal')));
  });

  // Esc로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.site-modal:not([hidden])').forEach(closeModal);
    }
  });

  // 화면 hover: 빠르게 내려감 / 떠나면 맨 위로 되감기
  document.querySelectorAll('.popup-screen').forEach(screen => {
    screen.addEventListener('mouseenter', () => {
      screen.classList.remove('auto');
      screen.classList.add('fast');
    });
    screen.addEventListener('mouseleave', () => {
      screen.classList.remove('auto', 'fast');   // 기본 상태(맨 위)로 0.8s 되감기
    });
  });

  // Main / Sub 전환
  document.querySelectorAll('.site-modal .popup-toggle').forEach(toggle => {
    const modal = toggle.closest('.site-modal');
    const screen = modal.querySelector('.popup-screen');
    toggle.querySelectorAll('.seg').forEach(seg => {
      seg.addEventListener('click', () => {
        const page = seg.dataset.page;
        toggle.querySelectorAll('.seg').forEach(s => s.classList.toggle('active', s === seg));
        screen.querySelectorAll('.ps-img').forEach(img => { img.hidden = (img.dataset.page !== page); });
        if (screen) screen.dataset.active = page;
        jumpAndReveal(screen);
      });
    });
  });
})();