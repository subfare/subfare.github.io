// ===== Site Data =====
const SITE = {
  name: 'Your Name',
  tagline: 'Photography • 3D • Animals • Landscapes',
  email: 'you@example.com',
  socials: {
    instagram: 'https://instagram.com/yourhandle',
    pinterest: 'https://www.pinterest.com/yourhandle/',
    artstation: 'https://www.artstation.com/yourhandle'
  }
};

// Categories for filters
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'landscapes', label: 'Landscapes' },
  { id: 'animals', label: 'Animals' },
  { id: '3d', label: '3D Models' },
  { id: 'other', label: 'Other' }
];

// Your gallery items — update paths after adding images under /assets/
const PHOTOS = [
  // Landscapes
  { src: 'assets/landscapes/test1', alt: 'Sunrise over a lake', category: 'landscapes' },
  { src: 'assets/landscapes/nerovane7-min.png', alt: 'GTesttttttttttttt', category: 'landscapes' },
  // Animals
  { src: 'assets/animals/red-fox.jpg', alt: 'Red fox in the forest', category: 'animals' },
  { src: 'assets/animals/macaque.jpg', alt: 'Macaque portrait', category: 'animals' },
  // 3D Models
  { src: 'assets/3d/robot-bust.png', alt: 'Hard-surface robot bust render', category: '3d' },
  { src: 'assets/3d/stylized-house.png', alt: 'Stylized low-poly house', category: '3d' },
  // Other
  { src: 'assets/other/abstract.jpg', alt: 'Abstract texture study', category: 'other' }
];

// ===== Helpers =====
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return [...document.querySelectorAll(sel)]; }

// Write footer year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Home (index) — Filters & Gallery =====
const filtersEl = $('#filters');
const galleryEl = $('#gallery');

let active = 'all';

if (filtersEl && galleryEl) {
  // Build filter chips
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (cat.id === 'all' ? ' active' : '');
    chip.textContent = cat.label;
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-selected', cat.id === 'all' ? 'true' : 'false');
    chip.addEventListener('click', () => {
      active = cat.id;
      $all('.chip').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected','false'); });
      chip.classList.add('active'); chip.setAttribute('aria-selected','true');
      renderGallery();
    });
    filtersEl.appendChild(chip);
  });
  renderGallery();
}

function renderGallery() {
  if (!galleryEl) return;
  galleryEl.setAttribute('aria-busy', 'true');
  galleryEl.innerHTML = '';
  const list = PHOTOS.filter(p => active === 'all' ? true : p.category === active);

  list.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    const span = (i % 7 === 0 || i % 7 === 3) ? 6 : 4; // variety in grid spans
    card.style.gridColumn = `span ${span}`;
    card.setAttribute('data-category', p.category);
    card.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.src = p.src; img.alt = p.alt || '';
    img.loading = 'lazy';
    card.appendChild(img);

    const badge = document.createElement('span');
    badge.className = 'badge';
    const cat = CATEGORIES.find(c => c.id === p.category);
    badge.textContent = cat ? cat.label : p.category;
    card.appendChild(badge);

    const bar = document.createElement('div');
    bar.className = 'titlebar';
    bar.innerHTML = `<span>${p.alt || ''}</span><span style="opacity:.7; font-size:12px;">View</span>`;
    card.appendChild(bar);

    card.addEventListener('click', () => openLightbox(list, i));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(list, i); });

    galleryEl.appendChild(card);
  });
  galleryEl.setAttribute('aria-busy', 'false');
}

// ===== Lightbox =====
const lb = $('#lightbox');
const lbImg = $('#lbImage');
const lbMeta = $('#lbMeta');
const lbClose = $('#lbClose');
const lbPrev = $('#lbPrev');
const lbNext = $('#lbNext');

let lbIndex = 0; let lbList = PHOTOS;

function openLightbox(list, startIndex) {
  if (!lb) return;
  lbList = list; lbIndex = startIndex;
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  if (!lbImg || !lbMeta) return;
  const item = lbList[lbIndex];
  lbImg.src = item.src; lbImg.alt = item.alt || '';
  const cat = CATEGORIES.find(c => c.id === item.category);
  lbMeta.textContent = `${item.alt || ''} ${cat ? '— ' + cat.label : ''}`.trim();
}

function closeLightbox() {
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
if (lbPrev) lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbList.length) % lbList.length; updateLightbox(); });
if (lbNext) lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbList.length; updateLightbox(); });

window.addEventListener('keydown', (e) => {
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbList.length) % lbList.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbList.length; updateLightbox(); }
});
