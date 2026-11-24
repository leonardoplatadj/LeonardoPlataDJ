{
  // Idioma ES / EN
  const body = document.body;
  const btns = document.querySelectorAll('.lang button');
  const setLang = (l) => {
    body.dataset.showLang = l;
    document.documentElement.lang = l;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
    try { localStorage.setItem('lp-lang', l); } catch (e) {}
  };
  let start = 'es';
  if (location.hash === '#en') start = 'en';
  else { try { start = localStorage.getItem('lp-lang') || 'es'; } catch (e) {} }
  setLang(start);
  btns.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.l)));

  // Cabecera sólida al hacer scroll
  const top = document.getElementById('top');
  const onScroll = () => top.classList.toggle('solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const drawer = document.getElementById('drawer');
  const openBtn = document.getElementById('open-menu');
  const closeBtn = document.getElementById('close-menu');
  openBtn.addEventListener('click', () => { drawer.classList.add('open'); closeBtn.focus(); });
  const close = () => { drawer.classList.remove('open'); openBtn.focus(); };
  closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => drawer.classList.remove('open')));
  drawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Aparición suave
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }
}

// Carruseles: flechas, teclado y barra de progreso
{
  document.querySelectorAll('.carousel').forEach((car) => {
    const track = car.querySelector('.track');
    const prev = car.querySelector('.prev');
    const next = car.querySelector('.next');
    const bar = car.querySelector('.bar i');
    const step = () => {
      const first = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 0;
      const size = track.scrollWidth > 0 ? Math.min(1, track.clientWidth / track.scrollWidth) : 1;
      bar.style.width = (size * 100) + '%';
      bar.style.transform = 'translateX(' + (ratio * (1 / size - 1) * 100) + '%)';
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      car.querySelector('.ctrl').style.visibility = max > 2 ? 'visible' : 'hidden';
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });
    track.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    update();
  });
}
