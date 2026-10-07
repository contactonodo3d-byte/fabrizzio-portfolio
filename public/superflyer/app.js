const dialog = document.querySelector('#flyer-dialog');
const dialogImage = document.querySelector('#dialog-image');
let origin;
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('.gallery-open').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault(); origin = link;
      document.querySelector('#dialog-title').textContent = link.dataset.title;
      dialogImage.src = link.href; dialogImage.alt = link.querySelector('img').alt;
      dialog.showModal(); document.querySelector('#close-dialog').focus();
    });
  });
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { origin?.focus(); dialogImage.removeAttribute('src'); });
  document.documentElement.dataset.galleryReady = 'true';
}
// La promoción vence al terminar el 20 de octubre de 2026 en Paraguay.
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Asuncion', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
if (today > '2026-10-20') {
  const promo = document.querySelector('#promo-note');
  promo.textContent = 'Planes con facturación mensual. Consultanos por otro volumen.';
  promo.classList.add('expired');
  document.querySelectorAll('.plan').forEach(plan => {
    const price = plan.querySelector('.price-amount');
    price.textContent = 'Gs. ' + price.dataset.regular;
    plan.querySelector('.price-period').textContent = 'Por mes';
    plan.querySelector('.regular').hidden = true;
  });
}

// El collage responde al puntero; cada muestra también puede abrirse con teclado.
const heroArt = document.querySelector('.hero-art');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
if (!reducedMotion.matches && finePointer.matches) {
  heroArt.addEventListener('pointermove', event => {
    const rect = heroArt.getBoundingClientRect();
    heroArt.style.setProperty('--move-x', `${((event.clientX - rect.left) / rect.width - .5) * 14}px`);
    heroArt.style.setProperty('--move-y', `${((event.clientY - rect.top) / rect.height - .5) * 10}px`);
  });
  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--move-x', '0px');
    heroArt.style.setProperty('--move-y', '0px');
  });
}
