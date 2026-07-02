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


/* =========================================================
   사이트 팝업 모달 ("목업 보기")
   ---------------------------------------------------------
   ▶ 새 프로젝트 / 서브 페이지를 추가하는 법 — JS는 여기만 만지면 됩니다.

   1) 카드의 "목업 보기" 버튼에 data-modal-open="modal-이름" 을 달기
        예) <button class="btn" data-modal-open="modal-danawa"> … </button>
   2) 같은 id 를 가진 모달 박스를 HTML 에 복붙 (다나와 모달을 통째로 복사 → id 만 변경)
   3) 아래 MODAL_PAGES 에 "modal-이름": [ …페이지 ] 한 묶음만 추가

   규칙(자동 처리):
   - 페이지가 1개면  → 썸네일 줄(strip)은 자동으로 숨겨집니다.
   - 페이지가 2~4개면 → 썸네일이 자동으로 깔리고, 클릭하면 화면이 바뀝니다.
   - thumb 를 생략하면  → full(원본) 이미지를 썸네일로 그대로 재사용합니다.
   - 파일명에 공백/한글이 있어도 그대로 적으면 됩니다(브라우저가 알아서 처리).
   ========================================================= */
(function () {

  /* ── 프로젝트별 페이지 목록 (여기만 편집) ───────────────────────── */
  const MODAL_PAGES = {
    'modal-danawa': [
      { label: 'Main',  full: 'img/modal/danawa/damawa main.png',
        thumb: 'img/modal/thum-modal/danawa01.png' },
      // 서브 페이지가 생기면 아래처럼 한 줄씩 추가 (최대 4개까지 깔끔히 정렬됨)
      // { label: 'Sub 1', full: 'img/modal/danawa/danawa sub 01.png' },
    ],

    'modal-anaider': [
      { label: 'Main',  full: 'img/modal/Anaider-Aquarium/Anaider-Aquarium main.png',
        thumb: 'img/modal/thum-modal/Anaider-Aquarium01.png' },
    ],

    'modal-kej': [
      { label: 'Main',  full: 'img/modal/KEJ/KEJ main.png',
        thumb: 'img/modal/thum-modal/KEJ01.png' },
      { label: 'Sub 1', full: 'img/modal/KEJ/KEJ sub 01.png',
        thumb: 'img/modal/thum-modal/KEJ02.png' },
      { label: 'Sub 2', full: 'img/modal/KEJ/KEJ sub 02.png',
        thumb: 'img/modal/thum-modal/KEJ03.png' },
    ],

    // ── 이후 프로젝트(IKOKA·약쏙·해독제 등)는 목업 이미지가 준비되면
    //    모달 HTML 을 복붙(다나와 모달 복사 → id 변경)한 뒤 여기 한 묶음 추가 ──
    // 'modal-ikoka': [
    //   { label: 'Main', full: 'img/modal/ikoka/main.png' },
    // ],
  };
  /* ──────────────────────────────────────────────────────────────── */


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

  // 설정(MODAL_PAGES) 기준으로 화면 이미지 + 썸네일을 자동 생성
  function buildModal(modalId, pages) {
    const modal = document.getElementById(modalId);
    if (!modal || !pages || !pages.length) return;
    const screen = modal.querySelector('.popup-screen');
    const thumbs = modal.querySelector('.popup-thumbs');
    if (!screen) return;

    // 각 페이지에 고유 id 부여 (page-0, page-1 …)
    pages.forEach((p, i) => { p._id = 'page-' + i; });
    screen.dataset.active = pages[0]._id;

    // 화면 이미지 생성 (첫 장만 보이게)
    screen.innerHTML = '';
    pages.forEach((p, i) => {
      const img = document.createElement('img');
      img.className = 'ps-img';
      img.dataset.page = p._id;
      img.src = p.full;
      img.alt = (p.label ? p.label + ' ' : '') + '페이지';
      if (i !== 0) img.hidden = true;
      screen.appendChild(img);
    });

    // 썸네일 strip: 페이지가 2개 이상일 때만 생성
    if (!thumbs) return;
    if (pages.length <= 1) { thumbs.hidden = true; thumbs.innerHTML = ''; return; }
    thumbs.hidden = false;
    thumbs.innerHTML = '';
    pages.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'popup-thumb' + (i === 0 ? ' active' : '');
      btn.dataset.page = p._id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', (p.label || ('페이지 ' + (i + 1))) + ' 보기');
      btn.innerHTML = `<img src="${p.thumb || p.full}" alt="" loading="lazy">`;
      thumbs.appendChild(btn);
    });
  }

  // 페이지 전환 (썸네일 strip · Main/Sub 토글 공통)
  function setPage(modal, pageId) {
    const screen = modal.querySelector('.popup-screen');
    if (!screen || !pageId || screen.dataset.active === pageId) return;
    screen.querySelectorAll('.ps-img').forEach(img => {
      img.hidden = (img.dataset.page !== pageId);
    });
    screen.dataset.active = pageId;
    // 컨트롤(썸네일/세그먼트) active 상태 동기화
    modal.querySelectorAll('.popup-thumb, .popup-toggle .seg').forEach(ctrl => {
      const on = ctrl.dataset.page === pageId;
      ctrl.classList.toggle('active', on);
      if (ctrl.hasAttribute('role')) ctrl.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    jumpAndReveal(screen);
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

  /* ── 초기화 ── */

  // 설정에 등록된 모달의 이미지/썸네일을 미리 생성
  Object.entries(MODAL_PAGES).forEach(([id, pages]) => buildModal(id, pages));

  // 열기 트리거 (목업 보기 버튼, 스타벅스 카드 등)
  document.querySelectorAll('[data-modal-open]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.modalOpen));
  });

  // 닫기: X 버튼 / 배경 클릭
  document.querySelectorAll('.site-modal [data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.site-modal')));
  });

  // Esc 로 닫기
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
      screen.classList.remove('auto', 'fast');   // 기본 상태(맨 위)로 되감기
    });
  });

  // 페이지 전환 — 썸네일 strip 방식 (다나와 등, 기본)
  document.querySelectorAll('.site-modal .popup-thumbs').forEach(thumbs => {
    const modal = thumbs.closest('.site-modal');
    thumbs.addEventListener('click', (e) => {
      const btn = e.target.closest('.popup-thumb');
      if (btn) setPage(modal, btn.dataset.page);
    });
  });

  // 페이지 전환 — Main/Sub 토글 방식 (스타벅스 등, 하위 호환)
  document.querySelectorAll('.site-modal .popup-toggle').forEach(toggle => {
    const modal = toggle.closest('.site-modal');
    toggle.querySelectorAll('.seg').forEach(seg => {
      seg.addEventListener('click', () => setPage(modal, seg.dataset.page));
    });
  });

})();
