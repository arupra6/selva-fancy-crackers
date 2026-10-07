(() => {
  'use strict';

  const PRODUCT_IMAGES = {
  "1": [
    "images/products/001-01.webp"
  ],
  "2": [
    "images/products/002-01.webp"
  ],
  "3": [
    "images/products/003-01.webp"
  ],
  "4": [
    "images/products/004-01.webp"
  ],
  "5": [
    "images/products/005-01.webp"
  ],
  "6": [
    "images/products/006-01.webp"
  ],
  "7": [
    "images/products/007-01.webp"
  ],
  "8": [
    "images/products/008-01.webp"
  ],
  "9": [
    "images/products/009-01.webp"
  ],
  "10": [
    "images/products/010-01.webp"
  ],
  "11": [
    "images/products/011-01.webp"
  ],
  "12": [
    "images/products/012-01.webp"
  ],
  "13": [
    "images/products/013-01.webp"
  ],
  "14": [
    "images/products/014-01.webp"
  ],
  "15": [
    "images/products/015-01.webp"
  ],
  "16": [
    "images/products/016-01.webp"
  ],
  "21": [
    "images/products/021-01.webp"
  ],
  "23": [
    "images/products/023-01.webp",
    "images/products/023-02.webp"
  ],
  "24": [
    "images/products/024-01.webp"
  ],
  "25": [
    "images/products/025-01.webp"
  ],
  "27": [
    "images/products/027-01.webp"
  ],
  "28": [
    "images/products/028-01.webp"
  ],
  "29": [
    "images/products/029-01.webp"
  ],
  "30": [
    "images/products/030-01.webp"
  ],
  "31": [
    "images/products/031-01.webp"
  ],
  "32": [
    "images/products/032-01.webp",
    "images/products/032-02.webp"
  ],
  "33": [
    "images/products/033-01.webp"
  ],
  "34": [
    "images/products/034-01.webp"
  ],
  "35": [
    "images/products/035-01.webp"
  ],
  "36": [
    "images/products/036-01.webp"
  ],
  "37": [
    "images/products/037-01.webp"
  ],
  "38": [
    "images/products/038-01.webp"
  ],
  "40": [
    "images/products/040-01.webp"
  ],
  "42": [
    "images/products/042-01.webp"
  ],
  "43": [
    "images/products/043-01.webp"
  ],
  "45": [
    "images/products/045-01.webp"
  ],
  "46": [
    "images/products/046-01.webp"
  ],
  "47": [
    "images/products/047-01.webp"
  ],
  "48": [
    "images/products/048-01.webp"
  ],
  "50": [
    "images/products/050-01.webp"
  ],
  "52": [
    "images/products/052-01.webp"
  ],
  "54": [
    "images/products/054-01.webp"
  ],
  "55": [
    "images/products/055-01.webp"
  ],
  "56": [
    "images/products/056-01.webp"
  ],
  "57": [
    "images/products/057-01.webp"
  ],
  "58": [
    "images/products/058-01.webp",
    "images/products/058-02.webp"
  ],
  "59": [
    "images/products/059-01.webp",
    "images/products/059-02.webp",
    "images/products/059-03.webp"
  ],
  "60": [
    "images/products/060-01.webp",
    "images/products/060-02.webp"
  ],
  "61": [
    "images/products/061-01.webp"
  ],
  "62": [
    "images/products/062-01.webp"
  ],
  "63": [
    "images/products/063-01.webp"
  ],
  "64": [
    "images/products/064-01.webp"
  ],
  "66": [
    "images/products/066-01.webp"
  ],
  "67": [
    "images/products/067-01.webp"
  ],
  "68": [
    "images/products/068-01.webp"
  ],
  "69": [
    "images/products/069-01.webp"
  ],
  "70": [
    "images/products/070-01.webp"
  ],
  "71": [
    "images/products/071-01.webp"
  ],
  "72": [
    "images/products/072-01.webp"
  ],
  "73": [
    "images/products/073-01.webp"
  ],
  "74": [
    "images/products/074-01.webp"
  ],
  "75": [
    "images/products/075-01.webp"
  ],
  "76": [
    "images/products/076-01.webp"
  ],
  "77": [
    "images/products/077-01.webp"
  ],
  "78": [
    "images/products/078-01.webp"
  ],
  "79": [
    "images/products/079-01.webp"
  ],
  "80": [
    "images/products/080-01.webp"
  ],
  "81": [
    "images/products/081-01.webp"
  ],
  "83": [
    "images/products/083-01.webp"
  ],
  "84": [
    "images/products/084-01.webp"
  ],
  "85": [
    "images/products/085-01.webp"
  ],
  "86": [
    "images/products/086-01.webp"
  ],
  "88": [
    "images/products/088-01.webp"
  ],
  "89": [
    "images/products/089-01.webp"
  ],
  "90": [
    "images/products/090-01.webp"
  ],
  "91": [
    "images/products/091-01.webp"
  ],
  "94": [
    "images/products/094-01.webp"
  ],
  "95": [
    "images/products/095-01.webp"
  ],
  "96": [
    "images/products/096-01.webp"
  ],
  "98": [
    "images/products/098-01.webp"
  ],
  "99": [
    "images/products/099-01.webp"
  ],
  "100": [
    "images/products/100-01.webp"
  ],
  "101": [
    "images/products/101-01.webp"
  ],
  "102": [
    "images/products/102-01.webp"
  ],
  "106": [
    "images/products/106-01.webp"
  ],
  "107": [
    "images/products/107-01.webp"
  ],
  "108": [
    "images/products/108-01.webp"
  ],
  "109": [
    "images/products/109-01.webp"
  ],
  "111": [
    "images/products/111-01.webp"
  ],
  "112": [
    "images/products/112-01.webp"
  ],
  "113": [
    "images/products/113-01.webp"
  ],
  "114": [
    "images/products/114-01.webp"
  ],
  "115": [
    "images/products/115-01.webp"
  ],
  "116": [
    "images/products/116-01.webp"
  ],
  "117": [
    "images/products/117-01.webp"
  ],
  "118": [
    "images/products/118-01.webp"
  ],
  "120": [
    "images/products/120-01.webp"
  ],
  "121": [
    "images/products/121-01.webp"
  ],
  "122": [
    "images/products/122-01.webp"
  ],
  "123": [
    "images/products/123-01.webp"
  ],
  "124": [
    "images/products/124-01.webp"
  ],
  "125": [
    "images/products/125-01.webp"
  ],
  "126": [
    "images/products/126-01.webp"
  ],
  "127": [
    "images/products/127-01.webp"
  ],
  "128": [
    "images/products/128-01.webp"
  ],
  "130": [
    "images/products/130-01.webp"
  ],
  "131": [
    "images/products/131-01.webp",
    "images/products/131-02.webp"
  ],
  "132": [
    "images/products/132-01.webp"
  ],
  "133": [
    "images/products/133-01.webp",
    "images/products/133-02.webp"
  ],
  "135": [
    "images/products/135-01.webp"
  ],
  "136": [
    "images/products/136-01.webp"
  ],
  "138": [
    "images/products/138-01.webp"
  ],
  "140": [
    "images/products/140-01.webp"
  ],
  "142": [
    "images/products/142-01.webp"
  ],
  "143": [
    "images/products/143-01.webp",
    "images/products/143-02.webp"
  ],
  "149": [
    "images/products/149-01.webp"
  ],
  "150": [
    "images/products/150-01.webp"
  ],
  "153": [
    "images/products/153-01.webp"
  ],
  "154": [
    "images/products/154-01.webp"
  ],
  "156": [
    "images/products/156-01.webp"
  ],
  "157": [
    "images/products/157-01.webp"
  ],
  "158": [
    "images/products/158-01.webp"
  ],
  "159": [
    "images/products/159-01.webp"
  ],
  "162": [
    "images/products/162-01.webp"
  ],
  "163": [
    "images/products/163-01.webp"
  ],
  "164": [
    "images/products/164-01.webp"
  ],
  "167": [
    "images/products/167-01.webp"
  ],
  "168": [
    "images/products/168-01.webp"
  ],
  "169": [
    "images/products/169-01.webp"
  ],
  "171": [
    "images/products/171-01.webp"
  ],
  "172": [
    "images/products/172-01.webp"
  ],
  "174": [
    "images/products/174-01.webp"
  ],
  "177": [
    "images/products/177-01.webp"
  ],
  "180": [
    "images/products/180-01.webp"
  ],
  "182": [
    "images/products/182-01.webp"
  ],
  "183": [
    "images/products/183-01.webp"
  ],
  "184": [
    "images/products/184-01.webp"
  ],
  "185": [
    "images/products/185-01.webp"
  ],
  "186": [
    "images/products/186-01.webp"
  ],
  "187": [
    "images/products/187-01.webp"
  ],
  "188": [
    "images/products/188-01.webp"
  ],
  "189": [
    "images/products/189-01.webp"
  ],
  "190": [
    "images/products/chain-crackers-wala.webp"
  ],
  "191": [
    "images/products/chain-crackers-wala.webp"
  ],
  "192": [
    "images/products/chain-crackers-wala.webp"
  ],
  "193": [
    "images/products/chain-crackers-wala.webp"
  ],
  "194": [
    "images/products/chain-crackers-wala.webp"
  ],
  "195": [
    "images/products/chain-crackers-wala.webp"
  ],
  "196": [
    "images/products/chain-crackers-wala.webp"
  ]
};
  const PLACEHOLDER = 'images/product-placeholder.webp';
  const state = { itemId: null, index: 0, images: [], name: '' };
  let observerScheduled = false;

  function getImages(itemId) {
    const images = PRODUCT_IMAGES[String(itemId)];
    return Array.isArray(images) && images.length ? images : [PLACEHOLDER];
  }

  function productName(tile) {
    return (tile.querySelector('h3')?.textContent || `Item ${tile.dataset.productId}`).trim();
  }

  function setTileImage(tile, index) {
    const itemId = Number(tile.dataset.productId);
    const images = getImages(itemId);
    const shell = tile.querySelector('.product-image-shell');
    const img = shell?.querySelector('.product-image');
    if (!shell || !img) return;

    const safeIndex = ((index % images.length) + images.length) % images.length;
    shell.dataset.galleryIndex = String(safeIndex);
    shell.dataset.galleryCount = String(images.length);
    img.src = images[safeIndex];
    img.alt = `${productName(tile)} — product photo ${safeIndex + 1} of ${images.length}`;

    const counter = shell.querySelector('.pg-card-counter');
    if (counter) counter.textContent = `${safeIndex + 1} / ${images.length}`;
  }

  function addTileControls(tile) {
    const itemId = Number(tile.dataset.productId);
    const images = getImages(itemId);
    const shell = tile.querySelector('.product-image-shell');
    const img = shell?.querySelector('.product-image');
    if (!shell || !img) return;

    shell.dataset.galleryItem = String(itemId);
    shell.dataset.galleryIndex = shell.dataset.galleryIndex || '0';
    shell.setAttribute('role', 'button');
    shell.setAttribute('tabindex', '0');
    shell.setAttribute('aria-label', `Open full photo for ${productName(tile)}`);

    const hasRealPhoto = !!PRODUCT_IMAGES[String(itemId)];
    const badge = shell.querySelector('.product-image-badge');
    if (badge) {
      badge.textContent = hasRealPhoto ? 'View photo' : 'Image coming soon';
      badge.classList.toggle('pg-placeholder-badge', !hasRealPhoto);
    }

    if (images.length > 1 && !shell.querySelector('.pg-card-prev')) {
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'pg-card-arrow pg-card-prev';
      prev.setAttribute('aria-label', `Previous photo for ${productName(tile)}`);
      prev.innerHTML = '&#10094;';

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'pg-card-arrow pg-card-next';
      next.setAttribute('aria-label', `Next photo for ${productName(tile)}`);
      next.innerHTML = '&#10095;';

      const counter = document.createElement('span');
      counter.className = 'pg-card-counter';
      counter.setAttribute('aria-hidden', 'true');

      shell.append(prev, next, counter);
    }

    setTileImage(tile, Number(shell.dataset.galleryIndex || 0));
  }

  function applyGallery() {
    document.querySelectorAll('.product-tile[data-product-id]').forEach(addTileControls);
  }

  function createLightbox() {
    if (document.getElementById('productPhotoLightbox')) return;

    const box = document.createElement('div');
    box.id = 'productPhotoLightbox';
    box.className = 'pg-lightbox';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `
      <div class="pg-lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="pgLightboxTitle">
        <button type="button" class="pg-lightbox-close" aria-label="Close full photo">&times;</button>
        <div class="pg-lightbox-stage">
          <button type="button" class="pg-lightbox-arrow pg-lightbox-prev" aria-label="Previous photo">&#10094;</button>
          <img class="pg-lightbox-image" alt="">
          <button type="button" class="pg-lightbox-arrow pg-lightbox-next" aria-label="Next photo">&#10095;</button>
        </div>
        <div class="pg-lightbox-meta">
          <div><strong id="pgLightboxTitle"></strong><small class="pg-lightbox-item"></small></div>
          <span class="pg-lightbox-counter"></span>
        </div>
      </div>`;
    document.body.appendChild(box);

    box.querySelector('.pg-lightbox-close').addEventListener('click', closeLightbox);
    box.querySelector('.pg-lightbox-prev').addEventListener('click', () => moveLightbox(-1));
    box.querySelector('.pg-lightbox-next').addEventListener('click', () => moveLightbox(1));
    box.addEventListener('click', e => { if (e.target === box) closeLightbox(); });
  }

  function renderLightbox() {
    const box = document.getElementById('productPhotoLightbox');
    if (!box || !state.images.length) return;

    const image = box.querySelector('.pg-lightbox-image');
    const prev = box.querySelector('.pg-lightbox-prev');
    const next = box.querySelector('.pg-lightbox-next');
    const counter = box.querySelector('.pg-lightbox-counter');
    const title = box.querySelector('#pgLightboxTitle');
    const item = box.querySelector('.pg-lightbox-item');

    image.src = state.images[state.index];
    image.alt = `${state.name} — full product photo ${state.index + 1} of ${state.images.length}`;
    title.textContent = state.name;
    item.textContent = `S.No ${state.itemId}`;
    counter.textContent = `${state.index + 1} / ${state.images.length}`;

    const multiple = state.images.length > 1;
    prev.hidden = !multiple;
    next.hidden = !multiple;

    if (multiple) {
      const preloadPrev = new Image();
      const preloadNext = new Image();
      preloadPrev.src = state.images[(state.index - 1 + state.images.length) % state.images.length];
      preloadNext.src = state.images[(state.index + 1) % state.images.length];
    }
  }

  function openLightbox(tile) {
    createLightbox();
    const itemId = Number(tile.dataset.productId);
    const shell = tile.querySelector('.product-image-shell');
    state.itemId = itemId;
    state.images = getImages(itemId);
    state.index = Math.min(Number(shell?.dataset.galleryIndex || 0), state.images.length - 1);
    state.name = productName(tile);
    renderLightbox();

    const box = document.getElementById('productPhotoLightbox');
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pg-lightbox-open');
    box.querySelector('.pg-lightbox-close')?.focus({ preventScroll: true });
  }

  function closeLightbox() {
    const box = document.getElementById('productPhotoLightbox');
    if (!box) return;
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pg-lightbox-open');
  }

  function moveLightbox(delta) {
    if (state.images.length < 2) return;
    state.index = (state.index + delta + state.images.length) % state.images.length;
    renderLightbox();
  }

  function moveTile(tile, delta) {
    const shell = tile.querySelector('.product-image-shell');
    const images = getImages(Number(tile.dataset.productId));
    if (!shell || images.length < 2) return;
    const current = Number(shell.dataset.galleryIndex || 0);
    setTileImage(tile, current + delta);
  }

  function handleClick(e) {
    const prev = e.target.closest('.pg-card-prev');
    const next = e.target.closest('.pg-card-next');
    if (prev || next) {
      e.preventDefault();
      e.stopPropagation();
      const tile = e.target.closest('.product-tile[data-product-id]');
      if (tile) moveTile(tile, prev ? -1 : 1);
      return;
    }

    const shell = e.target.closest('.product-image-shell[data-gallery-item]');
    if (!shell) return;
    const tile = shell.closest('.product-tile[data-product-id]');
    if (tile) openLightbox(tile);
  }

  function handleKeydown(e) {
    const shell = e.target.closest?.('.product-image-shell[data-gallery-item]');
    if (shell && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const tile = shell.closest('.product-tile[data-product-id]');
      if (tile) openLightbox(tile);
      return;
    }

    const box = document.getElementById('productPhotoLightbox');
    if (!box?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') moveLightbox(-1);
    if (e.key === 'ArrowRight') moveLightbox(1);
  }

  function scheduleApply() {
    if (observerScheduled) return;
    observerScheduled = true;
    requestAnimationFrame(() => {
      observerScheduled = false;
      applyGallery();
    });
  }

  function init() {
    createLightbox();
    applyGallery();

    const body = document.getElementById('productBody');
    if (body) {
      const observer = new MutationObserver(scheduleApply);
      observer.observe(body, { childList: true, subtree: true });
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.SelvaProductImages = PRODUCT_IMAGES;
})();
