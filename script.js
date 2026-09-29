/* ===== Lolly's birthday site ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- Photo placeholders: if an image file is missing, show a labelled pink frame --- */
function watchImage(img, frame) {
  const miss = () => { frame.classList.add('missing'); frame.dataset.name = img.getAttribute('src').replace('images/', ''); frame.dataset.slot = img.dataset.slot || 'Memory reel'; };
  img.addEventListener('error', miss);
  if (img.complete && !img.naturalWidth) miss();
}
$$('.ph img').forEach(img => watchImage(img, img.parentElement));

/* --- MEMORY REEL: list the photos you want in the reel (edit these names) --- */
const REEL_PHOTOS = [
  'photo-10.jpg', 'photo-11.jpg', 'photo-12.jpg',   // reel-only photos
  'photo-04.jpg', 'photo-06.jpg', 'photo-09.jpg'    // recap of the scrapbook
];
const reel = $('#reel');
const slides = REEL_PHOTOS.map((name, i) => {
  const s = document.createElement('div');
  s.className = 'slide' + (i === 0 ? ' on' : '');
  const img = new Image();
  img.alt = ''; img.src = 'images/' + name; img.loading = 'lazy';
  s.appendChild(img); reel.appendChild(s);
  watchImage(img, s);
  return s;
});
let cur = 0;
setInterval(() => {
  slides[cur].classList.remove('on');
  cur = (cur + 1) % slides.length;
  slides[cur].classList.add('on');
}, 5000);

/* --- Opening envelope --- */
const gate = $('#gate');
$('#openBtn').addEventListener('click', () => {
  gate.classList.add('opening');
  setTimeout(() => {
    gate.classList.add('gone');
    gate.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
  }, 1700);
});

/* --- Gentle reveal on scroll --- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('.rv').forEach(el => io.observe(el));

/* --- Music player (never autoplays; keeps playing while scrolling) --- */
const audio = $('#audio'), player = $('#player'), seek = $('#seek');
const fmt = t => isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
$('#playBtn').addEventListener('click', () => {
  if (audio.paused) audio.play().catch(() => $('#audioErr').hidden = false);
  else audio.pause();
});
audio.addEventListener('play', () => { player.classList.add('playing'); $('#playBtn').setAttribute('aria-label', 'Pause'); });
audio.addEventListener('pause', () => { player.classList.remove('playing'); $('#playBtn').setAttribute('aria-label', 'Play'); });
audio.addEventListener('loadedmetadata', () => $('#dur').textContent = fmt(audio.duration));
audio.addEventListener('timeupdate', () => {
  if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  $('#cur').textContent = fmt(audio.currentTime);
});
audio.addEventListener('ended', () => { seek.value = 0; $('#cur').textContent = '0:00'; });
audio.addEventListener('error', () => $('#audioErr').hidden = false);
seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration; });

/* --- Final gift: opens once, no re-close --- */
const gift = $('#gift'), giftBtn = $('#giftBtn');
giftBtn.addEventListener('click', () => {
  gift.classList.add('open');
  giftBtn.setAttribute('aria-expanded', 'true');
  giftBtn.tabIndex = -1;
  $('#ending').classList.add('show');
  setTimeout(() => $('#ending').scrollIntoView({ behavior: 'smooth', block: 'center' }), 1800);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('#hearts');
  for (let i = 0; i < 16; i++) {
    const h = document.createElement('span');
    h.textContent = Math.random() > .3 ? '♡' : '✦';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = 12 + Math.random() * 16 + 'px';
    h.style.animationDuration = 6 + Math.random() * 5 + 's';
    h.style.animationDelay = Math.random() * 3 + 's';
    box.appendChild(h);
  }
});