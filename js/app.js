(() => {
  'use strict';

  const CART_STORAGE_KEY = 'selvaCrackersCartV2';
  const VIEW_STORAGE_KEY = 'selvaCrackersProductView';
  const CUSTOMER_STORAGE_KEY = 'selvaCrackersCustomer';
  const OFFICIAL_WHATSAPP_NUMBER = '919842149415';
  const MINIMUM_ENQUIRY_VALUE = 3000;
  // Global promotional discount for standard-price items only.
  // Confirmed Deepavali promotional discount for standard-price items only.
  // Net Rate items are intentionally excluded and always retain their listed net price.
  const SITE_DISCOUNT_PERCENTAGE = 40;

  const tamilNaduDistricts = [
    'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode',
    'Kallakurichi','Kanchipuram','Kanniyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai',
    'Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet',
    'Salem','Sivagangai','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli',
    'Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore',
    'Viluppuram','Virudhunagar'
  ];
  const exactTamilNaduPinLookup = {
    '626203': { district:'Virudhunagar', postalArea:'Sattur / Etturvattam area' },
    '626204': { district:'Virudhunagar', postalArea:'Sattur / Paraipatti area' }
  };
  const tamilNaduPinPrefixLookup = {
    '600':{district:'Chennai',postalArea:'Chennai postal area'},
    '601':{district:'Tiruvallur',postalArea:'Tiruvallur / Chennai suburban postal area'},
    '602':{district:'Tiruvallur',postalArea:'Tiruvallur / Kanchipuram postal area'},
    '603':{district:'Chengalpattu',postalArea:'Chengalpattu postal area'},
    '604':{district:'Tiruvannamalai',postalArea:'Tiruvannamalai / Viluppuram postal area'},
    '605':{district:'Viluppuram',postalArea:'Viluppuram postal area'},
    '606':{district:'Tiruvannamalai',postalArea:'Tiruvannamalai / Kallakurichi postal area'},
    '607':{district:'Cuddalore',postalArea:'Cuddalore postal area'},
    '608':{district:'Cuddalore',postalArea:'Chidambaram / Cuddalore postal area'},
    '609':{district:'Mayiladuthurai',postalArea:'Mayiladuthurai / Nagapattinam postal area'},
    '610':{district:'Tiruvarur',postalArea:'Tiruvarur postal area'},
    '611':{district:'Nagapattinam',postalArea:'Nagapattinam postal area'},
    '612':{district:'Thanjavur',postalArea:'Kumbakonam / Thanjavur postal area'},
    '613':{district:'Thanjavur',postalArea:'Thanjavur postal area'},
    '614':{district:'Thanjavur',postalArea:'Thanjavur / Tiruvarur postal area'},
    '620':{district:'Tiruchirappalli',postalArea:'Tiruchirappalli city postal area'},
    '621':{district:'Tiruchirappalli',postalArea:'Tiruchirappalli / Perambalur / Ariyalur postal area'},
    '622':{district:'Pudukkottai',postalArea:'Pudukkottai postal area'},
    '623':{district:'Ramanathapuram',postalArea:'Ramanathapuram postal area'},
    '624':{district:'Dindigul',postalArea:'Dindigul postal area'},
    '625':{district:'Madurai',postalArea:'Madurai / Theni postal area'},
    '626':{district:'Virudhunagar',postalArea:'Virudhunagar / Sivakasi / Sattur postal area'},
    '627':{district:'Tirunelveli',postalArea:'Tirunelveli / Tenkasi postal area'},
    '628':{district:'Thoothukudi',postalArea:'Thoothukudi postal area'},
    '629':{district:'Kanniyakumari',postalArea:'Kanniyakumari postal area'},
    '630':{district:'Sivagangai',postalArea:'Sivagangai / Karaikudi postal area'},
    '631':{district:'Ranipet',postalArea:'Ranipet / Arakkonam postal area'},
    '632':{district:'Vellore',postalArea:'Vellore / Ranipet / Tirupathur postal area'},
    '635':{district:'Krishnagiri',postalArea:'Krishnagiri / Dharmapuri / Tirupathur postal area'},
    '636':{district:'Salem',postalArea:'Salem / Dharmapuri postal area'},
    '637':{district:'Namakkal',postalArea:'Namakkal postal area'},
    '638':{district:'Erode',postalArea:'Erode / Tiruppur postal area'},
    '639':{district:'Karur',postalArea:'Karur postal area'},
    '641':{district:'Coimbatore',postalArea:'Coimbatore / Tiruppur postal area'},
    '642':{district:'Coimbatore',postalArea:'Pollachi / Coimbatore postal area'},
    '643':{district:'Nilgiris',postalArea:'Nilgiris postal area'}
  };

  function storageGet(key) { try { return window.localStorage.getItem(key); } catch { return null; } }
  function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch {} }
  function storageRemove(key) { try { window.localStorage.removeItem(key); } catch {} }

  let cart = readJson(CART_STORAGE_KEY, {});
  let productViewMode = storageGet(VIEW_STORAGE_KEY) === 'list' ? 'list' : 'tile';
  let districtManuallyEdited = false;
  let postalAreaManuallyEdited = false;
  let isAutoFillingLocation = false;
  let activeEnquiryNo = null;
  let activeEnquiryAt = null;

  function invalidateEnquiryReference() {
    activeEnquiryNo = null;
    activeEnquiryAt = null;
  }

  function readJson(key, fallback) {
    try { return JSON.parse(storageGet(key)) || fallback; }
    catch { return fallback; }
  }
  function escapeHtml(value='') {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function formatCurrency(value) {
    const n = Number(value || 0);
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function roundMoney(value) {
    const n = Number(value || 0);
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
  function discountPercentFor(product) {
    if (!product || product.netRate) return 0;
    const pct = Number(SITE_DISCOUNT_PERCENTAGE || 0);
    return Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0;
  }
  function discountedUnitPrice(product) {
    if (!isSelectable(product)) return 0;
    const base = Number(product.price);
    const pct = discountPercentFor(product);
    return roundMoney(base * (1 - pct / 100));
  }
  function discountAmountFor(product, qty=1) {
    if (!isSelectable(product)) return 0;
    return roundMoney(Number(product.price) * Math.max(0, Number(qty || 0)) - discountedUnitPrice(product) * Math.max(0, Number(qty || 0)));
  }
  function saveCart() { storageSet(CART_STORAGE_KEY, JSON.stringify(cart)); }
  function categorySlug(value='') { return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function productArray() {
    if (Array.isArray(window.products)) return window.products;
    try { if (Array.isArray(products)) return products; } catch (_) {}
    return [];
  }
  function categoryArray() {
    if (Array.isArray(window.categoryOrder) && window.categoryOrder.length) return window.categoryOrder;
    try { if (Array.isArray(categoryOrder) && categoryOrder.length) return categoryOrder; } catch (_) {}
    return [...new Set(productArray().map(product => product.category).filter(Boolean))];
  }
  function hasCatalogue() { return productArray().length > 0; }

  function initNavigation() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
    });
  }

  function getProduct(id) { return productArray().find(p => p.id === Number(id)); }
  function isSelectable(product) { return !!(product && product.available && product.price !== null && Number.isFinite(Number(product.price))); }
  function getQty(id) { return Math.max(0, Number(cart[id] || 0)); }

  function productImageUrl(product) {
    const candidate = product && typeof product.image === 'string' ? product.image.trim() : '';
    return candidate || 'images/product-placeholder.webp';
  }

  function renderTileProduct(product) {
    const qty = getQty(product.id);
    const pct = discountPercentFor(product);
    const baseUnit = isSelectable(product) ? Number(product.price) : 0;
    const netUnit = isSelectable(product) ? discountedUnitPrice(product) : 0;
    const total = isSelectable(product) ? qty * netUnit : 0;
    const price = product.price !== null ? formatCurrency(product.price) : escapeHtml(product.priceText || 'Price on request');
    const netPrice = isSelectable(product) ? formatCurrency(netUnit) : price;
    return `<article class="product-tile" data-product-id="${product.id}">
      <div class="tile-topline">
        <span class="serial-chip">S.No ${product.id}</span>
        <span class="tag ${product.netRate ? 'tag-net' : 'tag-discount'}">${product.netRate ? 'Net Rate' : `${pct}% Discount`}</span>
      </div>
      <div class="product-image-shell">
        <img class="product-image" src="${escapeHtml(productImageUrl(product))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='images/product-placeholder.webp';">
        <span class="product-image-badge">Product Image</span>
      </div>
      <h3>${escapeHtml(product.name)}</h3>
      <div class="product-tamil">${escapeHtml(product.tamilName || '')}</div>
      <div class="product-meta"><span>${escapeHtml(product.category)}</span><span>Unit: ${escapeHtml(product.unit)}</span></div>
      <div class="price-line discount-price-line">
        <div class="price-block"><small>${product.netRate ? 'Net Price' : 'List Rate'}</small><strong>${price}</strong></div>
        ${product.netRate ? '' : `<div class="discount-block"><small>Discount</small><strong>${pct}%</strong></div>`}
        <div class="net-price-block"><small>${product.netRate ? 'Rate' : 'Your Rate'}</small><strong>${netPrice}</strong></div>
        <div class="tile-total"><small>Total</small><strong>${isSelectable(product) ? formatCurrency(total) : '—'}</strong></div>
      </div>
      ${isSelectable(product) ? `<div class="tile-qty-row"><div class="qty-control">
        <button type="button" data-action="minus" data-id="${product.id}" aria-label="Decrease quantity">−</button>
        <input class="qty-input" data-action="qty" data-id="${product.id}" type="number" min="0" step="1" value="${qty}" aria-label="Quantity for ${escapeHtml(product.name)}">
        <button type="button" data-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
      </div></div>` : `<div class="unavailable-note">${escapeHtml(product.priceText || 'Please confirm price')}</div>`}
    </article>`;
  }

  function renderListProduct(product) {
    const qty = getQty(product.id);
    const pct = discountPercentFor(product);
    const total = isSelectable(product) ? qty * discountedUnitPrice(product) : 0;
    const price = product.price !== null ? formatCurrency(product.price) : escapeHtml(product.priceText || 'Price on request');
    const netPrice = isSelectable(product) ? formatCurrency(discountedUnitPrice(product)) : price;
    return `<div class="product-list-row" data-product-id="${product.id}">
      <div class="list-main">
        <div class="list-main-title"><span class="serial-chip">${product.id}</span><strong>${escapeHtml(product.name)}</strong></div>
        <small>${escapeHtml(product.tamilName || '')}</small>
        <div class="list-meta"><span>${escapeHtml(product.category)}</span><span>Unit: ${escapeHtml(product.unit)}</span>${product.netRate ? '<span class="tag tag-net">Net Rate</span>' : `<span class="tag tag-discount">${pct}% Discount</span>`}</div>
      </div>
      <div class="list-price"><small>${product.netRate ? 'Net Price' : 'List / Your Rate'}</small><strong>${product.netRate ? netPrice : `${price} / ${netPrice}`}</strong></div>
      <div class="list-qty">${isSelectable(product) ? `<div class="qty-control">
        <button type="button" data-action="minus" data-id="${product.id}">−</button>
        <input class="qty-input" data-action="qty" data-id="${product.id}" type="number" min="0" step="1" value="${qty}">
        <button type="button" data-action="plus" data-id="${product.id}">+</button>
      </div>` : `<span class="unavailable-note">${escapeHtml(product.priceText || 'Confirm price')}</span>`}</div>
      <div class="list-total"><small>Total</small><strong>${isSelectable(product) ? formatCurrency(total) : '—'}</strong></div>
    </div>`;
  }

  function getActiveCategory() {
    const select = document.getElementById('categorySelect');
    if (select && select.value) return select.value;
    return new URLSearchParams(location.search).get('category') || '';
  }

  function renderProducts() {
    const body = document.getElementById('productBody');
    if (!body || !hasCatalogue()) return;
    const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const selectedCategory = getActiveCategory();
    const cats = selectedCategory ? categoryArray().filter(c => c === selectedCategory) : categoryArray();
    let visible = 0;
    let html = '';
    cats.forEach(category => {
      const group = productArray().filter(p => p.category === category && (
        !search ||
        p.name.toLowerCase().includes(search) ||
        (p.tamilName || '').toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.unit.toLowerCase().includes(search) ||
        String(p.id) === search
      ));
      if (!group.length) return;
      visible += group.length;
      html += `<div id="category-${categorySlug(category)}" class="tile-category-heading ${selectedCategory === category ? 'selected-category' : ''}"><span>${escapeHtml(category)}</span><small>${group.length} Items</small></div>`;
      html += productViewMode === 'list'
        ? `<div class="product-list-group">${group.map(renderListProduct).join('')}</div>`
        : `<div class="product-tile-grid">${group.map(renderTileProduct).join('')}</div>`;
    });
    body.classList.toggle('list-view-active', productViewMode === 'list');
    body.classList.toggle('tile-view-active', productViewMode !== 'list');
    body.innerHTML = html || '<div class="empty-results">No products found.</div>';
    const vc = document.getElementById('visibleCount');
    if (vc) vc.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    updateViewButtons();
    updateCartSummary();
  }

  function changeQty(id, delta) {
    const product = getProduct(id);
    if (!isSelectable(product)) return;
    const next = Math.max(0, getQty(id) + delta);
    if (next === 0) delete cart[id]; else cart[id] = next;
    invalidateEnquiryReference();
    saveCart();
    renderProducts();
    if (document.getElementById('estimateModal')?.classList.contains('open')) renderEstimateModal();
  }
  function setQty(id, raw) {
    const product = getProduct(id);
    if (!isSelectable(product)) return;
    let value = parseInt(raw, 10);
    if (!Number.isFinite(value) || value < 0) value = 0;
    if (value === 0) delete cart[id]; else cart[id] = value;
    invalidateEnquiryReference();
    saveCart();
    updateVisibleTotals();
    updateCartSummary();
    if (document.getElementById('estimateModal')?.classList.contains('open')) renderEstimateModal();
  }
  function updateVisibleTotals() {
    document.querySelectorAll('[data-product-id]').forEach(el => {
      const id = Number(el.dataset.productId);
      const p = getProduct(id);
      if (!p || !isSelectable(p)) return;
      const input = el.querySelector('.qty-input');
      const total = el.querySelector('.tile-total strong, .list-total strong');
      if (input) input.value = getQty(id);
      if (total) total.textContent = formatCurrency(getQty(id) * discountedUnitPrice(p));
    });
  }
  function getCartItems() {
    return Object.entries(cart).map(([id, qty]) => {
      const p = getProduct(id);
      if (!p || !isSelectable(p)) return null;
      const q = Math.max(0, Number(qty || 0));
      if (q <= 0) return null;
      const baseUnitPrice = Number(p.price);
      const discountPercent = discountPercentFor(p);
      const unitPrice = discountedUnitPrice(p);
      const subtotal = roundMoney(q * baseUnitPrice);
      const discountAmount = roundMoney(subtotal - q * unitPrice);
      const total = roundMoney(q * unitPrice);
      return { ...p, qty:q, baseUnitPrice, discountPercent, unitPrice, subtotal, discountAmount, total };
    }).filter(Boolean);
  }
  function totals() {
    const items = getCartItems();
    const subtotal = roundMoney(items.reduce((s,i) => s + i.subtotal, 0));
    const eligibleSubtotal = roundMoney(items.filter(i => !i.netRate).reduce((s,i) => s + i.subtotal, 0));
    const netRateSubtotal = roundMoney(items.filter(i => i.netRate).reduce((s,i) => s + i.subtotal, 0));
    const discount = roundMoney(items.reduce((s,i) => s + i.discountAmount, 0));
    const amount = roundMoney(items.reduce((s,i) => s + i.total, 0));
    return {
      items,
      qty: items.reduce((s,i) => s + i.qty, 0),
      subtotal,
      eligibleSubtotal,
      netRateSubtotal,
      discount,
      amount
    };
  }

  function updateCartSummary() {
    const t = totals();
    const selected = document.getElementById('selectedItems');
    if (selected) {
      if (!t.items.length) {
        selected.className = 'empty-state';
        selected.textContent = 'No products selected yet.';
      } else {
        selected.className = 'selected-list';
        selected.innerHTML = t.items.map(i => `<div class="summary-line"><span>${i.id}. ${escapeHtml(i.name)} × ${i.qty}</span><strong>${formatCurrency(i.total)}</strong></div>`).join('');
      }
    }
    setText('itemCount', t.qty);
    setText('cartSubtotal', formatCurrency(t.subtotal));
    setText('cartDiscountPercent', t.eligibleSubtotal > 0 ? `${SITE_DISCOUNT_PERCENTAGE}% eligible` : 'N/A');
    setText('cartDiscount', formatCurrency(t.discount));
    setText('cartTotal', formatCurrency(t.amount));
    setText('grandSubtotal', formatCurrency(t.subtotal));
    setText('grandDiscountPercent', t.eligibleSubtotal > 0 ? `${SITE_DISCOUNT_PERCENTAGE}% eligible` : 'N/A');
    setText('grandDiscount', formatCurrency(t.discount));
    setText('grandTotal', formatCurrency(t.amount));
    setText('mobileCartText', `Items: ${t.qty} | ${t.eligibleSubtotal > 0 ? `Discount: ${SITE_DISCOUNT_PERCENTAGE}% eligible` : 'Discount: N/A'} | Total: ${formatCurrency(t.amount)}`);
    const status = document.getElementById('minimumStatus');
    if (status) {
      if (MINIMUM_ENQUIRY_VALUE <= 0) {
        status.className = 'minimum-status info';
        status.textContent = 'No minimum enquiry value is currently configured.';
      } else if (t.amount >= MINIMUM_ENQUIRY_VALUE) {
        status.className = 'minimum-status success'; status.textContent = 'Minimum enquiry value reached. You can proceed.';
      } else {
        status.className = 'minimum-status warning';
        status.textContent = `Minimum enquiry value: ${formatCurrency(MINIMUM_ENQUIRY_VALUE)}. Add ${formatCurrency(MINIMUM_ENQUIRY_VALUE - t.amount)} more.`;
      }
    }
    document.querySelectorAll('.requires-selection').forEach(btn => btn.disabled = !t.items.length);
  }
  function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

  function updateViewButtons() {
    document.getElementById('tileViewBtn')?.classList.toggle('active', productViewMode === 'tile');
    document.getElementById('listViewBtn')?.classList.toggle('active', productViewMode === 'list');
  }
  function setProductView(mode) {
    productViewMode = mode === 'list' ? 'list' : 'tile';
    storageSet(VIEW_STORAGE_KEY, productViewMode);
    renderProducts();
  }

  function populateCategorySelect() {
    const select = document.getElementById('categorySelect');
    if (!select || !hasCatalogue()) return;
    categoryArray().forEach(cat => {
      const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; select.appendChild(opt);
    });
    const queryCat = new URLSearchParams(location.search).get('category');
    if (queryCat && categoryArray().includes(queryCat)) select.value = queryCat;
  }

  function resetEstimate() {
    const hasSelectedItems = getCartItems().length > 0;
    const hasCustomerDraft = Object.values(getCustomerDetails()).some(value => String(value || '').trim());
    if (!hasSelectedItems && !hasCustomerDraft) { alert('Nothing to reset.'); return; }
    if (!confirm('Clear all selected quantities and customer details and start again?')) return;

    // Full restart: clear order selection and customer draft, but keep the user's Tile/List preference.
    cart = {};
    invalidateEnquiryReference();
    storageRemove(CART_STORAGE_KEY);
    storageRemove(CUSTOMER_STORAGE_KEY);

    const form = document.getElementById('customerForm');
    if (form) form.reset();
    districtManuallyEdited = false;
    postalAreaManuallyEdited = false;
    isAutoFillingLocation = false;

    const pinStatus = document.getElementById('pinLookupStatus');
    if (pinStatus) pinStatus.textContent = 'Enter 6-digit PIN code to auto-fill district and postal area where available.';
    const suggestions = document.getElementById('districtSuggestions');
    if (suggestions) { suggestions.classList.remove('open'); suggestions.innerHTML = ''; }

    const search = document.getElementById('searchInput');
    const category = document.getElementById('categorySelect');
    if (search) search.value = '';
    if (category) category.value = '';
    try { history.replaceState(null, '', location.pathname); } catch {}

    renderProducts();
    updateCartSummary();
    closeEstimateModal();
    document.querySelector('.catalogue-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openEstimateModal() {
    if (!getCartItems().length) { alert('Please select at least one product.'); return; }
    renderEstimateModal();
    const modal = document.getElementById('estimateModal');
    if (!modal) return;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  }
  function closeEstimateModal() {
    const modal = document.getElementById('estimateModal');
    if (!modal) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');
  }
  function renderEstimateModal() {
    const t = totals(); const wrap = document.getElementById('estimateModalItems');
    if (!wrap) return;
    wrap.innerHTML = t.items.map(i => `<div class="estimate-modal-line"><div><strong>${i.id}. ${escapeHtml(i.name)}</strong><small>${escapeHtml(i.unit)} • Qty ${i.qty} • ${i.netRate ? 'Net Rate' : `Discount ${i.discountPercent}%`} • ${formatCurrency(i.unitPrice)} each</small></div><div class="line-amount">${formatCurrency(i.total)}<span>${i.netRate ? 'Net Rate / No Discount' : `${i.discountPercent}% Discount`}</span></div></div>`).join('') || '<div class="empty-state">No products selected.</div>';
    setText('modalQty', t.qty);
    setText('modalSubtotal', formatCurrency(t.subtotal));
    setText('modalDiscountPercent', t.eligibleSubtotal > 0 ? `${SITE_DISCOUNT_PERCENTAGE}% eligible` : 'N/A');
    setText('modalDiscount', formatCurrency(t.discount));
    setText('modalTotal', formatCurrency(t.amount));
  }

  function saveCustomerDraft() {
    if (!document.getElementById('customerForm')) return;
    invalidateEnquiryReference();
    storageSet(CUSTOMER_STORAGE_KEY, JSON.stringify(getCustomerDetails()));
  }
  function restoreCustomerDraft() {
    const data = readJson(CUSTOMER_STORAGE_KEY, null);
    if (!data) return;
    const map = {name:'customerName',mobile:'customerMobile',city:'customerCity',district:'customerDistrict',postalArea:'customerPostalArea',pincode:'customerPincode',message:'customerMessage'};
    Object.entries(map).forEach(([key,id]) => { const el=document.getElementById(id); if (el && data[key]) el.value=data[key]; });
  }
  function getCustomerDetails() {
    return {
      name: document.getElementById('customerName')?.value.trim() || '',
      mobile: document.getElementById('customerMobile')?.value.trim() || '',
      city: document.getElementById('customerCity')?.value.trim() || '',
      district: document.getElementById('customerDistrict')?.value.trim() || '',
      postalArea: document.getElementById('customerPostalArea')?.value.trim() || '',
      pincode: document.getElementById('customerPincode')?.value.trim() || '',
      message: document.getElementById('customerMessage')?.value.trim() || ''
    };
  }
  function validateCustomerDetails() {
    const d = getCustomerDetails();
    const mobileDigits = d.mobile.replace(/\D/g,'');
    if (!d.name || mobileDigits.length < 10 || !d.city || !d.district || !d.postalArea || !/^\d{6}$/.test(d.pincode)) {
      alert('Please enter name, valid mobile number, city/area, 6-digit PIN code, district and postal area.');
      return null;
    }
    return d;
  }
  function lookupTamilNaduPincode(pin) {
    const clean = String(pin || '').replace(/\D/g,'');
    if (clean.length !== 6) return null;
    return exactTamilNaduPinLookup[clean] || tamilNaduPinPrefixLookup[clean.slice(0,3)] || null;
  }
  function handlePincodeAutoFill() {
    const pin = document.getElementById('customerPincode'), district = document.getElementById('customerDistrict'), postal = document.getElementById('customerPostalArea'), status = document.getElementById('pinLookupStatus');
    if (!pin || !district || !postal) return;
    const clean = pin.value.replace(/\D/g,'').slice(0,6); pin.value = clean;
    if (clean.length < 6) { if (status) status.textContent='Enter 6-digit PIN code to auto-fill district and postal area where available.'; return; }
    const location = lookupTamilNaduPincode(clean); isAutoFillingLocation = true;
    if (location) {
      if (!districtManuallyEdited || !district.value.trim()) district.value = location.district;
      if (!postalAreaManuallyEdited || !postal.value.trim()) postal.value = location.postalArea;
      if (status) status.textContent = `Matched: ${location.district} - ${location.postalArea}. You can edit if required.`;
    } else if (status) status.textContent = 'PIN code not found in the helper list. Please enter district and postal area manually.';
    isAutoFillingLocation = false; saveCustomerDraft();
  }
  function showDistrictSuggestions(value='') {
    const box=document.getElementById('districtSuggestions'); if (!box) return;
    const q=value.toLowerCase().trim();
    const matches=tamilNaduDistricts.filter(x=>x.toLowerCase().includes(q)).slice(0,8);
    if (!matches.length) { box.classList.remove('open'); box.innerHTML=''; return; }
    box.innerHTML=matches.map(x=>`<button type="button" data-district="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('');
    box.classList.add('open');
  }

  function generateEnquiryNumber() {
    const now=new Date();
    const stamp=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const suffix=Math.floor(1000+Math.random()*9000);
    return `SC-${stamp}-${suffix}`;
  }
  function validateForDocument() {
    const t=totals();
    if (!t.items.length) { alert('Please select at least one product.'); return null; }
    if (MINIMUM_ENQUIRY_VALUE > 0 && t.amount < MINIMUM_ENQUIRY_VALUE) { alert(`Minimum enquiry value is ${formatCurrency(MINIMUM_ENQUIRY_VALUE)}.`); return null; }
    const details=validateCustomerDetails(); if (!details) return null;
    if (!activeEnquiryNo) {
      activeEnquiryNo = generateEnquiryNumber();
      activeEnquiryAt = new Date();
    }
    return { ...t, details, enquiryNo:activeEnquiryNo, generatedAt:activeEnquiryAt };
  }

  function getJsPdf() { return window.jspdf?.jsPDF || null; }
  function downloadPdf(payload, packing=false) {
    const JsPdf=getJsPdf();
    if (!JsPdf) { alert('PDF library is still loading or unavailable. Please try again in a moment.'); return false; }
    const pdf=new JsPdf({unit:'mm',format:'a4'});
    pdf.setFont('helvetica','bold');pdf.setTextColor(139,17,17);pdf.setFontSize(18);pdf.text('SELVA CRACKERS',12,15);
    pdf.setFontSize(11);pdf.setTextColor(16,24,39);pdf.text('The Original Sivakasi Crackers',12,22);pdf.setFontSize(10);pdf.text(packing?'Shop Packing List':'Customer Estimate',12,28);
    pdf.setFont('helvetica','normal');pdf.setFontSize(8);
    pdf.text('4/244-D, NH-7, Naduvapatti Bus Stop, Etturvattam Bus Stop, Sattur - 626 203, Near Sivakasi',12,34);
    pdf.text('Phone: +91 98421 49415 | +91 80720 50086',12,39);
    pdf.setFontSize(8.5);
    pdf.text(`Enquiry: ${payload.enquiryNo}`,12,45);pdf.text(`Date: ${payload.generatedAt.toLocaleString('en-IN')}`,110,45);
    pdf.text(`Customer: ${payload.details.name}`,12,51);pdf.text(`Mobile: ${payload.details.mobile}`,110,51);
    pdf.text(`Location: ${payload.details.city}, ${payload.details.district} - ${payload.details.pincode}`,12,57);
    const pdfMoney = value => `INR ${roundMoney(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const body=payload.items.map((i,idx)=>packing
      ? [idx+1,i.id,i.name,i.category,i.unit,i.qty]
      : [idx+1,i.id,i.name,i.unit,i.qty,pdfMoney(i.baseUnitPrice),i.netRate?'Net':`${i.discountPercent}%`,pdfMoney(i.unitPrice),pdfMoney(i.total)]);
    const head=packing
      ? [['S.No','Item No','Product','Category','Unit','Qty']]
      : [['S.No','Item No','Product','Unit','Qty','List Rate','Disc.','Your Rate','Total']];
    const columnStyles=packing
      ? {0:{cellWidth:10},1:{cellWidth:14},2:{cellWidth:65},3:{cellWidth:42},4:{cellWidth:15},5:{cellWidth:14}}
      : {0:{cellWidth:10},1:{cellWidth:14},2:{cellWidth:47},3:{cellWidth:13},4:{cellWidth:10},5:{cellWidth:20},6:{cellWidth:14},7:{cellWidth:20},8:{cellWidth:20}};
    if (typeof pdf.autoTable !== 'function') { alert('PDF table library is unavailable. Please try again.'); return false; }
    pdf.autoTable({startY:63,head,body,margin:{left:12,right:12},styles:{fontSize:6.6,cellPadding:1.8,overflow:'linebreak',valign:'middle'},columnStyles,headStyles:{fillColor:[95,7,7],textColor:[247,201,72],fontStyle:'bold'},alternateRowStyles:{fillColor:[255,247,223]}});
    let y=pdf.lastAutoTable.finalY+8;
    pdf.setFont('helvetica','bold');pdf.setTextColor(139,17,17);pdf.setFontSize(10);
    if (packing) {
      pdf.text('Check quantity carefully before dispatch.',12,y);
    } else {
      const money = value => roundMoney(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      pdf.text([
        `Eligible Items List Subtotal: INR ${money(payload.eligibleSubtotal)}`,
        `Promotional Discount: ${SITE_DISCOUNT_PERCENTAGE}% on eligible items only (-INR ${money(payload.discount)})`,
        `Net Rate Items Subtotal: INR ${money(payload.netRateSubtotal)} - No Discount`,
        `Estimate Total: INR ${money(payload.amount)}`
      ],12,y);
      pdf.setFont('helvetica','normal');pdf.setTextColor(71,84,103);pdf.setFontSize(7.5);
      pdf.text('Important: Net Rate items are not eligible for promotional discount. Estimate only; final stock, payment and pickup/delivery details are confirmed directly by SELVA CRACKERS.',12,y+24,{maxWidth:185});
    }
    pdf.save(`${payload.enquiryNo}_${packing?'packing_list':'customer_estimate'}.pdf`);
    return true;
  }

  function sendWhatsAppEnquiry() {
    const payload=validateForDocument(); if (!payload) return;
    // Generate the two required PDFs locally, then open WhatsApp.
    downloadPdf(payload,false); downloadPdf(payload,true);
    const itemLines=payload.items.map(i=>`${i.id}. ${i.name} (${i.unit}) | Qty ${i.qty} | List ${formatCurrency(i.baseUnitPrice)} | ${i.netRate?'Net Rate / No Discount':`Discount ${i.discountPercent}%`} | Rate ${formatCurrency(i.unitPrice)} | Total ${formatCurrency(i.total)}`).join('\n');
    const text=`SELVA CRACKERS Price List Enquiry
Enquiry No: ${payload.enquiryNo}

Name: ${payload.details.name}
Mobile: ${payload.details.mobile}
City/Area: ${payload.details.city}
District: ${payload.details.district}
Postal Area: ${payload.details.postalArea}
PIN Code: ${payload.details.pincode}

Selected Products:
${itemLines}

Eligible Items List Subtotal: ${formatCurrency(payload.eligibleSubtotal)}
Promotional Discount: ${SITE_DISCOUNT_PERCENTAGE}% on eligible items only (-${formatCurrency(payload.discount)})
Net Rate Items Subtotal: ${formatCurrency(payload.netRateSubtotal)} - No Discount
Estimate Total: ${formatCurrency(payload.amount)}

Message: ${payload.details.message || 'No special request'}

Note: Please confirm availability, permitted products, payment and next steps through official contact only.`;
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,'_blank','noopener');
  }

  function initProductsPage() {
    if (!document.getElementById('productBody') || !hasCatalogue()) return;
    populateCategorySelect();
    restoreCustomerDraft();
    renderProducts();

    const body=document.getElementById('productBody');
    body.addEventListener('click', e => {
      const btn=e.target.closest('button[data-action]'); if (!btn) return;
      const id=Number(btn.dataset.id);
      if (btn.dataset.action==='plus') changeQty(id,1);
      if (btn.dataset.action==='minus') changeQty(id,-1);
    });
    body.addEventListener('input', e => {
      const input=e.target.closest('input[data-action="qty"]'); if (input) setQty(Number(input.dataset.id),input.value);
    });

    document.getElementById('searchInput')?.addEventListener('input', renderProducts);
    document.getElementById('categorySelect')?.addEventListener('change', e => {
      const url=new URL(location.href);
      if (e.target.value) url.searchParams.set('category',e.target.value); else url.searchParams.delete('category');
      try { history.replaceState(null,'',url); } catch {}
      renderProducts();
      const target=e.target.value && document.getElementById(`category-${categorySlug(e.target.value)}`);
      if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
    document.getElementById('tileViewBtn')?.addEventListener('click',()=>setProductView('tile'));
    document.getElementById('listViewBtn')?.addEventListener('click',()=>setProductView('list'));
    document.getElementById('clearSearchBtn')?.addEventListener('click',()=>{
      const s=document.getElementById('searchInput'),c=document.getElementById('categorySelect');
      if(s)s.value='';if(c)c.value='';try { history.replaceState(null,'',location.pathname); } catch {} renderProducts();
    });
    document.getElementById('openEstimateBtn')?.addEventListener('click',openEstimateModal);
    document.getElementById('mobileViewEstimateBtn')?.addEventListener('click',openEstimateModal);
    document.getElementById('mobileResetBtn')?.addEventListener('click',resetEstimate);
    document.getElementById('estimateModalClose')?.addEventListener('click',closeEstimateModal);
    document.getElementById('modalContinueBtn')?.addEventListener('click',closeEstimateModal);
    document.getElementById('modalDetailsBtn')?.addEventListener('click',()=>{closeEstimateModal();document.getElementById('customer-details')?.scrollIntoView({behavior:'smooth'});});
    document.getElementById('estimateModal')?.addEventListener('click',e=>{if(e.target.id==='estimateModal')closeEstimateModal();});

    document.getElementById('customerPincode')?.addEventListener('input',handlePincodeAutoFill);
    document.getElementById('customerDistrict')?.addEventListener('focus',e=>showDistrictSuggestions(e.target.value));
    document.getElementById('customerDistrict')?.addEventListener('input',e=>{if(!isAutoFillingLocation)districtManuallyEdited=true;showDistrictSuggestions(e.target.value);saveCustomerDraft();});
    document.getElementById('customerPostalArea')?.addEventListener('input',()=>{if(!isAutoFillingLocation)postalAreaManuallyEdited=true;saveCustomerDraft();});
    document.getElementById('customerForm')?.addEventListener('input',saveCustomerDraft);
    document.getElementById('districtSuggestions')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-district]');if(!b)return;
      const input=document.getElementById('customerDistrict');if(input)input.value=b.dataset.district;
      districtManuallyEdited=true;e.currentTarget.classList.remove('open');saveCustomerDraft();
    });
    document.addEventListener('click',e=>{if(!e.target.closest('.district-field'))document.getElementById('districtSuggestions')?.classList.remove('open');});

    document.getElementById('whatsappBtn')?.addEventListener('click',sendWhatsAppEnquiry);
    document.getElementById('estimatePdfBtn')?.addEventListener('click',()=>{const p=validateForDocument();if(p)downloadPdf(p,false);});
    document.getElementById('packingPdfBtn')?.addEventListener('click',()=>{const p=validateForDocument();if(p)downloadPdf(p,true);});

    const queryCat=new URLSearchParams(location.search).get('category');
    if(queryCat){
      setTimeout(()=>document.getElementById(`category-${categorySlug(queryCat)}`)?.scrollIntoView({behavior:'auto',block:'start'}),100);
    }
  }

  function initDiscountDisplay() {
    document.querySelectorAll('[data-site-discount]').forEach(el => { el.textContent = `${SITE_DISCOUNT_PERCENTAGE}%`; });
  }

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeEstimateModal();});
  document.addEventListener('DOMContentLoaded',()=>{initNavigation();initDiscountDisplay();initProductsPage();});
})();
