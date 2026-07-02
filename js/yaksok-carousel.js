/* =========================================================
   약쏙 모바일 프로토타입 캐러셀 (Swiper)
   - 슬라이드 이미지 목록은 아래 IMAGES 배열(자동 생성됨)
   - 모달(#modal-yaksok)이 처음 열릴 때 lazy 초기화
   ========================================================= */
(function () {
  var DIR = 'img/modal/Yaksok/';
  var IMAGES = [
    "01 스플레시 스크린.png",
    "02 로그인.png",
    "03 아이디 찾기.png",
    "04 인증번호.png",
    "05 정보 열람.png",
    "06 비밀번호.png",
    "07 인증번호 2.png",
    "08 비밀번호 재설정.png",
    "09 회원가입 1.png",
    "10 회원가입 2.png",
    "11 회원가입 3.png",
    "12 회원가입 4.png",
    "13 회원가입 5.png",
    "14 회원가입 6.png",
    "15 회원가입 7.png",
    "16 회원가입 8.png",
    "17 관심사 체크.png",
    "18 데이터 이전.png",
    "19 알람창.png",
    "20 메인화면.png",
    "21 약 등록 체크.png",
    "21 프로필 수정.png",
    "22 약 등록 수기 등록.png",
    "23 약 등록 직접 등록.png",
    "24 약 등록 완료.png",
    "25 약 알람 설정 1.png",
    "26 약 알람 설정 2.png",
    "27 약 알람.png",
    "28 알람 목록.png",
    "29 복용 기록 체크.png",
    "30 복용기록 삭제.png",
    "31 약 정보 모아보기.png",
    "32 설정 창.png",
    "33 설정 -_ 연동.png",
    "34 약 리포트.png",
    "35 약 복용 조합 체크.png",
    "36 조합하기 1.png",
    "36 조합하기 2.png",
    "37 커뮤니티.png",
    "38 포스터.png",
    "39 쇼핑 화면.png",
    "40 쇼핑 검색.png",
    "41 쇼핑 알람.png",
    "42 쇼핑 이벤트.png",
    "43 장바구니.png",
    "44 주문하기.png",
    "45 쇼핑 마이페이지.png",
    "46 쇼핑 제품 정보.png",
  ];

  var swiper = null;

  function build() {
    var wrap = document.querySelector('#yaksok-swiper .swiper-wrapper');
    if (!wrap || wrap.children.length) return;   // 이미 생성됐으면 skip
    IMAGES.forEach(function (name, i) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      var img = document.createElement('img');
      // 직접 lazy 로드: 실제 경로는 data-src 에 보관, 필요할 때만 src 지정
      img.dataset.src = DIR + name;
      img.alt = '약쏙 화면 ' + (i + 1);
      slide.appendChild(img);
      wrap.appendChild(slide);
    });
  }

  // 현재 슬라이드 기준 앞뒤 1장씩 미리 로드 (native lazy가 가로 캐러셀에서 동작하지 않는 문제 대응)
  function loadAround(index) {
    var imgs = document.querySelectorAll('#yaksok-swiper .swiper-slide img');
    [index - 1, index, index + 1].forEach(function (j) {
      var img = imgs[j];
      if (img && img.dataset.src && !img.src) img.src = img.dataset.src;
    });
  }

  function init() {
    if (swiper) { swiper.update(); return; }
    build();
    swiper = new Swiper('#yaksok-swiper', {
      grabCursor: true,
      spaceBetween: 0,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '#yaksok-prev', nextEl: '#yaksok-next' },
      pagination: { el: '#yaksok-frac', type: 'fraction' },
      on: {
        init: function () { loadAround(0); },
        slideChange: function () { loadAround(this.activeIndex); }
      }
    });
  }

  // 목업 버튼이 눌려 모달이 표시된 다음 프레임에 초기화(숨김 상태 측정 오류 방지)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-modal-open="modal-yaksok"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // 모달이 표시(openModal)된 뒤 실행되도록 현재 태스크 이후로 지연
        setTimeout(init, 0);
      });
    });
  });
})();
