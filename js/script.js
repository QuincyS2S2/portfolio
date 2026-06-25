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