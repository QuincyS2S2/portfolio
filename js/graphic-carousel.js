/* =========================================================
   그래픽 갤러리 캐러셀 (Swiper)
   - 그래픽 파트 4개 카드(편집/패키지/배너/AI)가 공용 모달(#modal-graphic)을 연다.
   - 카드의 data-graphic 값으로 해당 카테고리 이미지 세트를 슬라이드로 로드.
   - 이미지 목록은 img/그래픽/ 폴더 기준(파일명 그대로; 브라우저가 URL 인코딩).
   - slides 항목:
       · 문자열            → 이미지 1장 슬라이드
       · { grid, cols, rowH } → 작은/여러 이미지를 한 슬라이드에 그리드로 묶음
         (cols=열 수, rowH=셀 높이px). 넘기는 횟수를 줄여줌.
   - 모달 열기 자체는 기존 공용 로직(data-modal-open="modal-graphic")이 처리한다.
   ========================================================= */
(function () {
  var DIR = 'img/그래픽/';

  var BANNER_H = [
    '배너 광고 01 (가로).png',
    '배너 광고 02 (가로).png',
    '배너 광고 03 (가로).png',
    '배너 광고 04 (가로).png',
    '배너 광고 05(가로).png',
    '배너 광고 가로 1.png',
    '배너 광고 가로 2.png',
    '배너 광고 가로 3.png',
  ];
  var BANNER_V = [
    '배너 광고 세로 1.png',
    '배너 광고 세로 2.png',
    '배너 광고 세로 3.png',
    '배너 광고 세로 4.png',
    '배너 광고 세로 5.png',
  ];
  var AI_SMALL = [
    'AI 생성물 물체 01.png',
    'AI 생성물 물체 02.png',
    'AI 생성물 캐릭터 01.png',
    'AI 생성물 캐릭터 02.png',
    'AI 생성물 캐릭터 03.png',
    'AI 생성물 캐릭터 04.png',
    'AI 생성물 캐릭터 05.png',
    'AI 생성물 캐릭터 06.png',
    'AI 생성물 캐릭터 07.png',
    'AI 생성물 캐릭터 08.png',
    'AI 생성물 캐릭터 09.png',
    'AI 생성물 캐릭터 10.png',
  ];

  var SETS = {
    edit: {
      title: '편집 디자인',
      slides: [
        '01 - 편집 디자인 (1).png',
        '02 - 편집 디자인 (2).png',
        '03 - 편집 디자인 (3).png',
      ],
    },
    package: {
      title: '제품 패키지 디자인',
      slides: [
        '제품 디자인 1.png',
        '제품 디자인 2.png',
        '제품 디자인 03 (상세 페이지).png',
      ],
    },
    banner: {
      title: '배너 광고물',
      slides: [
        // 가로 배너 8장 → 3열 그리드 한 슬라이드
        { grid: BANNER_H, cols: 3, rowH: 165 },
        // 세로 배너 5장 → 3열 그리드 한 슬라이드(세로라 셀 높이 넉넉히)
        { grid: BANNER_V, cols: 3, rowH: 245 },
      ],
    },
    ai: {
      title: 'AI 생성물',
      slides: [
        // 큰 이미지는 개별 슬라이드
        'AI 생성 이미지 01.png',
        'AI 생성 이미지 02.png',
        'AI 생성 이미지 03.png',
        'AI 생성 이미지 04.png',
        // 작은 소품(물체·캐릭터) 12장 → 4열 그리드 한 슬라이드
        { grid: AI_SMALL, cols: 4, rowH: 168 },
      ],
    },
  };

  var swiper = null;

  function makeImg(name, alt) {
    var img = document.createElement('img');
    // 직접 lazy 로드: 실제 경로는 data-src 에 보관, 필요할 때만 src 지정
    img.dataset.src = DIR + name;
    img.alt = alt;
    return img;
  }

  function buildSlides(set) {
    var wrap = document.querySelector('#graphic-swiper .swiper-wrapper');
    if (!wrap) return;
    wrap.innerHTML = '';
    set.slides.forEach(function (entry, i) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';

      if (entry && entry.grid) {
        // 작은/여러 이미지 묶음 → 그리드 슬라이드
        slide.classList.add('is-grid');
        var grid = document.createElement('div');
        grid.className = 'graphic-grid-slide';
        if (entry.cols) grid.style.setProperty('--cols', entry.cols);
        if (entry.rowH) grid.style.setProperty('--rowH', entry.rowH + 'px');
        entry.grid.forEach(function (name, j) {
          var cell = document.createElement('div');
          cell.className = 'ggs-cell';
          cell.appendChild(makeImg(name, set.title + ' ' + (j + 1)));
          grid.appendChild(cell);
        });
        slide.appendChild(grid);
      } else {
        // 단일 이미지 슬라이드
        var img = makeImg(entry, set.title + ' ' + (i + 1));
        // 로드 후 비율 감지: 세로로 매우 길면(예: 상세 페이지) 폭맞춤+세로스크롤 모드로
        img.addEventListener('load', function () {
          if (this.naturalWidth && this.naturalHeight / this.naturalWidth > 2.5) {
            slide.classList.add('is-tall');
          }
        });
        slide.appendChild(img);
      }

      wrap.appendChild(slide);
    });
  }

  // 지정한 슬라이드 안의 아직 안 불러온 이미지 로드
  function loadSlide(slideEl) {
    if (!slideEl) return;
    slideEl.querySelectorAll('img[data-src]').forEach(function (img) {
      if (!img.getAttribute('src')) img.src = img.dataset.src;
    });
  }

  // 현재 슬라이드 기준 앞뒤 1장씩 미리 로드 (가로 캐러셀에서 native lazy 미동작 대응)
  function loadAround(index) {
    var slides = document.querySelectorAll('#graphic-swiper .swiper-slide');
    [index - 1, index, index + 1].forEach(function (j) { loadSlide(slides[j]); });
  }

  function initSwiper() {
    if (swiper) { swiper.destroy(true, true); swiper = null; }   // 카테고리 전환 시 새로 생성
    swiper = new Swiper('#graphic-swiper', {
      grabCursor: true,
      spaceBetween: 24,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '#graphic-prev', nextEl: '#graphic-next' },
      pagination: { el: '#graphic-frac', type: 'fraction' },
      on: {
        init: function () { loadAround(0); },
        slideChange: function () { loadAround(this.activeIndex); },
      },
    });
  }

  function openSet(key) {
    var set = SETS[key];
    if (!set) return;
    var titleEl = document.getElementById('modal-graphic-title');
    if (titleEl) titleEl.textContent = set.title;
    buildSlides(set);
    // 모달이 표시(openModal)된 다음 프레임에 Swiper 초기화(숨김 상태 측정 오류 방지)
    setTimeout(initSwiper, 0);
  }

  // 마우스 휠로 캐러셀 넘기기 (일일이 클릭하지 않아도 스르륵 전환)
  // - 현재 슬라이드가 세로로 스크롤 가능한 경우(긴 이미지·넘치는 그리드) 스크롤에 먼저 양보,
  //   위/아래 끝에 닿으면 다음/이전 슬라이드로 넘어감.
  function bindWheel() {
    var stage = document.getElementById('graphic-swiper');
    if (!stage) return;
    var locked = false;
    stage.addEventListener('wheel', function (e) {
      if (!swiper) return;
      var delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      var active = swiper.slides[swiper.activeIndex];
      if (active) {
        var canScrollUp = active.scrollTop > 0;
        var canScrollDown = active.scrollTop + active.clientHeight < active.scrollHeight - 1;
        if ((delta < 0 && canScrollUp) || (delta > 0 && canScrollDown)) return;  // 내부 스크롤 우선
      }

      e.preventDefault();
      if (locked) return;
      if (delta > 0) swiper.slideNext();
      else swiper.slidePrev();
      locked = true;
      setTimeout(function () { locked = false; }, 420);
    }, { passive: false });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-graphic]').forEach(function (card) {
      card.addEventListener('click', function () {
        openSet(card.dataset.graphic);
      });
    });
    bindWheel();
  });
})();
