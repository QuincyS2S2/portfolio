/* =========================================================
   해독제 모바일 프로토타입 캐러셀 (Swiper)
   - 슬라이드 이미지 목록은 아래 IMAGES 배열(자동 생성됨)
   - 모달(#modal-hedokje)이 처음 열릴 때 lazy 초기화
   - 구조/주의사항은 yaksok-carousel.js 와 동일
   ========================================================= */
(function () {
  var DIR = 'img/modal/haedokje/';
  var IMAGES = [
    "00 - 진입 화면.png",
    "01 - 스플레시 스크린.png",
    "02 - 온보딩.png",
    "03 - 온보딩.png",
    "04 -로그인.png",
    "05 - 본인인증 1.png",
    "06- 본인인증 2.png",
    "07 - 본인인증 3.png",
    "08 - 본인인증 4.png",
    "09 - 메인화면.png",
    "10 - 가게부 01.png",
    "10 - 가게부 02.png",
    "10 - 가게부 03.png",
    "11 - 장터 01.png",
    "11 - 장터 02 검색.png",
    "11 - 장터 03 파티 (1).png",
    "11 - 장터 03 파티 (2).png",
    "11 - 장터 03 파티(3).png",
    "11 - 장터 04 채티방.png",
    "11 - 장터 04 파티장 (1).png",
    "11 - 장터 04 파티장 (2).png",
    "11 - 장터 04 파티장 (3).png",
    "11 - 장터 04 파티장 (4).png",
    "11 - 장터 04 파티장 (5).png",
    "11- 장터 03 세부페이지.png",
    "12 - 혜택.png",
    "13 - 마이페이지 쿠폰함.png",
    "13- 마이페이지.png",
    "장터 - 파티.png",
  ];

  var swiper = null;

  function build() {
    var wrap = document.querySelector('#hedokje-swiper .swiper-wrapper');
    if (!wrap || wrap.children.length) return;
    IMAGES.forEach(function (name, i) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      var img = document.createElement('img');
      img.dataset.src = DIR + name;
      img.alt = '해독제 화면 ' + (i + 1);
      slide.appendChild(img);
      wrap.appendChild(slide);
    });
  }

  function loadAround(index) {
    var imgs = document.querySelectorAll('#hedokje-swiper .swiper-slide img');
    [index - 1, index, index + 1].forEach(function (j) {
      var img = imgs[j];
      if (img && img.dataset.src && !img.src) img.src = img.dataset.src;
    });
  }

  function init() {
    if (swiper) { swiper.update(); return; }
    build();
    swiper = new Swiper('#hedokje-swiper', {
      grabCursor: true,
      spaceBetween: 0,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '#hedokje-prev', nextEl: '#hedokje-next' },
      pagination: { el: '#hedokje-frac', type: 'fraction' },
      on: {
        init: function () { loadAround(0); },
        slideChange: function () { loadAround(this.activeIndex); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-modal-open="modal-hedokje"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(init, 0);
      });
    });
  });
})();
