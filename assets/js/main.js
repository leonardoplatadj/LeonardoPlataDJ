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
