(function(){
  const groups = {
    front: [
      {src:'images/shop-gallery/shop-front-01.webp',title:'Shop Front Photo 1',alt:'Selva Crackers shop front and main signboard'},
      {src:'images/shop-gallery/shop-front-02.webp',title:'Shop Front Photo 2',alt:'Selva Crackers shop front from an angled roadside view'},
      {src:'images/shop-gallery/shop-front-03.webp',title:'Shop Front Photo 3',alt:'Selva Crackers side building and signboard view'}
    ],
    products: [
      {src:'images/shop-gallery/product-display-01.webp',title:'Product Display Photo 1',alt:'Inside Selva Crackers product display 1'},
      {src:'images/shop-gallery/product-display-02.webp',title:'Product Display Photo 2',alt:'Inside Selva Crackers product display 2'},
      {src:'images/shop-gallery/product-display-03.webp',title:'Product Display Photo 3',alt:'Inside Selva Crackers product display 3'},
      {src:'images/shop-gallery/product-display-04.webp',title:'Product Display Photo 4',alt:'Inside Selva Crackers product display 4'},
      {src:'images/shop-gallery/product-display-05.webp',title:'Product Display Photo 5',alt:'Inside Selva Crackers product display 5'},
      {src:'images/shop-gallery/product-display-06.webp',title:'Product Display Photo 6',alt:'Inside Selva Crackers product display 6'},
      {src:'images/shop-gallery/product-display-07.webp',title:'Product Display Photo 7',alt:'Inside Selva Crackers product display 7'},
      {src:'images/shop-gallery/product-display-08.webp',title:'Product Display Photo 8',alt:'Inside Selva Crackers product display 8'},
      {src:'images/shop-gallery/product-display-09.webp',title:'Product Display Photo 9',alt:'Inside Selva Crackers product display 9'},
      {src:'images/shop-gallery/product-display-10.webp',title:'Product Display Photo 10',alt:'Inside Selva Crackers product display 10'},
      {src:'images/shop-gallery/product-display-11.webp',title:'Product Display Photo 11',alt:'Inside Selva Crackers product display 11'},
      {src:'images/shop-gallery/product-display-12.webp',title:'Product Display Photo 12',alt:'Inside Selva Crackers product display 12'},
      {src:'images/shop-gallery/product-display-13.webp',title:'Product Display Photo 13',alt:'Inside Selva Crackers product display 13'}
    ]
  };

  const blocks = Array.from(document.querySelectorAll('[data-shop-gallery-block]'));
  if(!blocks.length) return;

  const lightbox = document.querySelector('[data-shop-lightbox]');
  const lightboxImg = lightbox && lightbox.querySelector('img');
  const lightboxCounter = lightbox && lightbox.querySelector('[data-lightbox-counter]');
  const lightboxPrev = lightbox && lightbox.querySelector('[data-lightbox-prev]');
  const lightboxNext = lightbox && lightbox.querySelector('[data-lightbox-next]');
  let activeController = null;

  function createController(root){
    const group = root.dataset.galleryGroup;
    const items = groups[group] || [];
    const img = root.querySelector('[data-gallery-image]');
    const title = root.querySelector('[data-gallery-title]');
    const caption = root.querySelector('[data-gallery-caption]');
    const counter = root.querySelector('[data-gallery-counter]');
    const thumbs = root.querySelector('[data-gallery-thumbs]');
    const prev = root.querySelector('[data-gallery-prev]');
    const next = root.querySelector('[data-gallery-next]');
    let index = 0;

    function renderThumbs(){
      thumbs.innerHTML = items.map((item,i)=>`<button type="button" class="shop-gallery-thumb${i===index?' active':''}" data-thumb-index="${i}" aria-label="Open ${item.title}"><img src="${item.src}" alt="${item.alt}" decoding="async"></button>`).join('');
    }
    function render(){
      if(!items.length) return;
      index = Math.max(0,Math.min(index,items.length-1));
      const item = items[index];
      img.src=item.src; img.alt=item.alt;
      title.textContent=item.title; caption.textContent=item.alt;
      counter.textContent=`${index+1} / ${items.length}`;
      renderThumbs();
      if(activeController===controller && lightbox && lightbox.classList.contains('open')) updateLightbox();
    }
    function go(n){ index=(n+items.length)%items.length; render(); }
    function updateLightbox(){
      if(!lightbox || !items.length) return;
      const item=items[index];
      lightboxImg.src=item.src; lightboxImg.alt=item.alt;
      lightboxCounter.textContent=`${index+1} / ${items.length}`;
    }
    function openLightbox(){
      if(!lightbox) return;
      activeController=controller; updateLightbox();
      lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }
    prev.addEventListener('click',()=>go(index-1));
    next.addEventListener('click',()=>go(index+1));
    thumbs.addEventListener('click',e=>{const b=e.target.closest('[data-thumb-index]');if(b){index=Number(b.dataset.thumbIndex);render();}});
    img.addEventListener('click',openLightbox);
    const controller={go,openLightbox,render,getIndex:()=>index,getCount:()=>items.length};
    render();
    return controller;
  }

  const controllers=blocks.map(createController);
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  if(lightbox){
    lightbox.addEventListener('click',e=>{if(e.target===lightbox || e.target.closest('[data-lightbox-close]')) closeLightbox();});
    lightboxPrev && lightboxPrev.addEventListener('click',()=>activeController && activeController.go(activeController.getIndex()-1));
    lightboxNext && lightboxNext.addEventListener('click',()=>activeController && activeController.go(activeController.getIndex()+1));
  }
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') closeLightbox();
    if(lightbox && lightbox.classList.contains('open') && activeController){
      if(e.key==='ArrowLeft') activeController.go(activeController.getIndex()-1);
      if(e.key==='ArrowRight') activeController.go(activeController.getIndex()+1);
    }
  });
})();
