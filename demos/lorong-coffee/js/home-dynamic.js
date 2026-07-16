/* ================================================================
   home-dynamic.js — Dynamic homepage sections
   FIX: Use readyState check instead of DOMContentLoaded listener
   (scripts load at bottom of body — event may have already fired)
   NEW: Branch-picker modal instead of blind redirect
   ================================================================ */

(function () {
  'use strict';
  initData();

  let _homeBranchCache = [];

  // ── BRANCH PICKER MODAL (shared from homepage) ─────────────
  function showHomeBranchPickerModal() {
    const existing = document.getElementById('branch-picker-modal');
    if (existing) existing.remove();

    const activeStores = _homeBranchCache.filter(s => !s.comingSoon);
    if (!activeStores.length) {
      window.location.href = 'pages/stores.html';
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'branch-picker-modal';
    modal.style.cssText = [
      'position:fixed;inset:0;z-index:9999;',
      'display:flex;align-items:center;justify-content:center;',
      'background:rgba(10,20,14,0.72);backdrop-filter:blur(6px);',
      'animation:bpFadeIn 0.22s ease;'
    ].join('');

    modal.innerHTML = `
      <style>
        @keyframes bpFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes bpSlideUp { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        #branch-picker-modal .bp-card {
          background:#fff;border-radius:20px;
          padding:2.2rem 2rem 1.6rem;max-width:420px;width:90%;
          box-shadow:0 32px 80px rgba(0,0,0,0.35);
          animation:bpSlideUp 0.28s cubic-bezier(.34,1.56,.64,1);
          font-family:var(--font-body,sans-serif);
        }
        #branch-picker-modal .bp-icon { font-size:2.8rem;text-align:center;margin-bottom:0.6rem; }
        #branch-picker-modal .bp-title {
          font-family:var(--font-display,serif);font-size:1.5rem;font-weight:800;
          color:var(--green,#1B4332);text-align:center;margin-bottom:0.35rem;
        }
        #branch-picker-modal .bp-sub {
          font-size:0.88rem;color:#6b7280;text-align:center;margin-bottom:1.4rem;line-height:1.6;
        }
        #branch-picker-modal .bp-branch-btn {
          display:flex;align-items:center;gap:0.9rem;width:100%;padding:0.85rem 1.1rem;
          border:2px solid #e5e7eb;border-radius:14px;background:#fff;cursor:pointer;
          transition:border-color 0.18s,background 0.18s,transform 0.15s;
          margin-bottom:0.65rem;font-family:var(--font-body,sans-serif);
        }
        #branch-picker-modal .bp-branch-btn:hover {
          border-color:var(--yellow,#F5C800);background:#fffbea;transform:translateY(-2px);
        }
        #branch-picker-modal .bp-emoji { font-size:1.6rem; }
        #branch-picker-modal .bp-info { text-align:left;flex:1; }
        #branch-picker-modal .bp-name {
          font-weight:700;font-size:0.95rem;color:var(--green,#1B4332);
        }
        #branch-picker-modal .bp-addr { font-size:0.78rem;color:#9ca3af;margin-top:2px; }
        #branch-picker-modal .bp-chip {
          font-size:0.65rem;font-weight:700;padding:3px 9px;
          border-radius:50px;text-transform:uppercase;letter-spacing:0.06em;
        }
        #branch-picker-modal .bp-chip.open { background:#d1fae5;color:#065f46; }
        #branch-picker-modal .bp-chip.closed { background:#fee2e2;color:#991b1b; }
        #branch-picker-modal .bp-cancel {
          display:block;width:100%;padding:0.7rem;border:none;background:transparent;
          font-size:0.85rem;color:#9ca3af;cursor:pointer;margin-top:0.3rem;
          font-family:var(--font-body,sans-serif);border-radius:10px;transition:background 0.15s;
        }
        #branch-picker-modal .bp-cancel:hover { background:#f3f4f6;color:#374151; }
      </style>
      <div class="bp-card">
        <div class="bp-icon">☕</div>
        <div class="bp-title">Choose Your Branch</div>
        <div class="bp-sub">Select the Lorong Coffee outlet you\'d like to order from.</div>
        ${activeStores.map(s => `
          <button class="bp-branch-btn" data-branch-id="${s.id}">
            <span class="bp-emoji">${s.emoji}</span>
            <span class="bp-info">
              <div class="bp-name">${s.name.replace('Lorong Coffee — ','')}</div>
              <div class="bp-addr">📍 ${s.address}</div>
            </span>
            <span class="bp-chip ${s.isOpen ? 'open' : 'closed'}">${s.isOpen ? 'Open' : 'Closed'}</span>
          </button>
        `).join('')}
        <button class="bp-cancel" id="bp-cancel-btn">✕ Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll('.bp-branch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.remove();
        window.location.href = `pages/menu.html#branch=${btn.dataset.branchId}`;
      });
    });
    document.getElementById('bp-cancel-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // ── CARD GRADIENT PRESETS ──────────────────────────────────
  const GRADIENTS = [
    'linear-gradient(135deg,#2D6A4F,#40916C)',
    'linear-gradient(135deg,#1B4332,#52B788)',
    'linear-gradient(135deg,#6B4226,#A0522D)',
    'linear-gradient(135deg,#2D8B55,#74C69D)',
    'linear-gradient(135deg,#4A1942,#9B2C8F)',
    'linear-gradient(135deg,#B5451B,#E76F51)',
    'linear-gradient(135deg,#1A3322,#2D6A4F)',
    'linear-gradient(135deg,#5C4500,#F5C800)',
    'linear-gradient(135deg,#7B3F00,#C97D4E)',
    'linear-gradient(135deg,#3D1F00,#8B4513)',
    'linear-gradient(135deg,#0D3B2E,#1B7A5C)',
    'linear-gradient(135deg,#8B5E3C,#D4A276)',
  ];

  // ── BUILD MENU CARD (supports imageUrl) ────────────────────
  function buildMenuCard(item) {
    const soldOut = !item.available;
    const hasImage = item.imageUrl && item.imageUrl.trim();

    const imageHtml = hasImage
      ? `<img src="${item.imageUrl}" alt="${item.name}"
              style="width:100%;height:100%;object-fit:cover;display:block;"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
         <div class="menu-card__emoji-fallback" style="display:none;align-items:center;justify-content:center;font-size:5rem;width:100%;height:100%;">${item.emoji || '☕'}</div>`
      : `<span style="font-size:5rem;z-index:1;">${item.emoji || '☕'}</span>`;

    return `
      <div class="menu-card reveal${soldOut ? ' sold-out' : ''}"
           data-category="${item.category}"
           data-badge="${(item.badge || '').toLowerCase()}"
           data-featured="${item.featured}"
           data-id="${item.id}">
        <div class="menu-card__image" style="background:${item.gradient || GRADIENTS[0]};flex-direction:column;overflow:hidden;">
          ${imageHtml}
          ${item.badge ? `<span class="menu-card__badge">${item.badge}</span>` : ''}
          ${soldOut ? `<div class="sold-out-overlay">Sold Out</div>` : ''}
        </div>
        <div class="menu-card__body">
          <div class="menu-card__name">${item.name}</div>
          <div class="menu-card__desc">${item.description}</div>
          <div class="menu-card__footer">
            <div class="menu-card__price">RM ${item.price} <small>/ cup</small></div>
            ${soldOut
              ? `<span class="sold-out-pill">Unavailable</span>`
              : `<button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name}">+</button>`}
          </div>
        </div>
      </div>
    `;
  }

  // ── PROMOTION BANNER ───────────────────────────────────────
  async function renderPromoBanner() {
    const container = document.getElementById('promo-banner');
    if (!container) return;

    const promos = await getPromotions({ active: true });
    if (!promos.length) { container.style.display = 'none'; return; }

    const p = promos[0];
    const ctaLink = p.ctaLink || 'pages/menu.html';
    container.innerHTML = `
      <div class="promo-banner__inner container">
        <div class="promo-banner__text">
          <span class="promo-banner__badge">${p.badgeText}</span>
          <span class="promo-banner__title">${p.title}</span>
          <span class="promo-banner__sub">${p.subtitle}</span>
        </div>
        <a href="${ctaLink}" class="promo-banner__cta">${p.ctaText || 'View Menu'} →</a>
      </div>
    `;
    container.style.display = '';
  }

  // ── FEATURED MENU ITEMS ────────────────────────────────────
  function renderFeaturedMenu() {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    // Show skeleton immediately
    container.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="menu-card skeleton-card">
        <div class="menu-card__image skeleton-box"></div>
        <div class="menu-card__body">
          <div class="skeleton-line" style="width:70%;height:18px;margin-bottom:8px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:90%;height:12px;margin-bottom:4px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:60%;height:12px;margin-bottom:16px;border-radius:4px;"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="skeleton-line" style="width:50px;height:20px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:36px;height:36px;border-radius:50%;"></div>
          </div>
        </div>
      </div>
    `).join('');

    // Load real data after a short delay for visual effect
    setTimeout(async () => {
      let featured = await getMenu({ featured: true });
      let items = featured;

      // Pad to 6 if not enough featured items
      if (items.length < 6) {
        const extras = await getMenu({ available: true });
        const extrasFiltered = extras
          .filter(i => !items.some(f => f.id === i.id))
          .slice(0, 6 - items.length);
        items = [...items, ...extrasFiltered];
      }
      items = items.slice(0, 6);

      if (!items.length) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);padding:3rem;">No menu items available.</div>`;
        return;
      }

      container.innerHTML = items.map(item => buildMenuCard(item)).join('');
      attachMenuTabs();
      attachAddBtns();
      attachCardClicks();
      attachReveal();
    }, 280);
  }

  // ── STORE STATUS CHIPS ─────────────────────────────────────
  async function renderStoreStatusChips() {
    const container = document.getElementById('store-status-chips');
    if (!container) return;
    const stores = await getStores({ comingSoon: false });
    container.innerHTML = stores.map(s => `
      <div class="store-status-chip ${s.isOpen ? 'open' : 'closed'}">
        <span class="store-status-chip__dot"></span>
        <span>${s.name.replace('Lorong Coffee — ', '')}</span>
        <span class="store-status-chip__label">${s.isOpen ? 'Open' : 'Closed'}</span>
      </div>
    `).join('');
  }

  // ── HOMEPAGE STORE CARDS ────────────────────────────────────
  async function renderHomeStores() {
    const container = document.getElementById('home-store-cards');
    if (!container) return;
    const stores = await getStores({ comingSoon: false });

    function updateMap(store) {
      const nameEl = document.getElementById('home-map-name');
      const addrEl = document.getElementById('home-map-addr');
      const linkEl = document.getElementById('home-map-link');
      if (!nameEl) return;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || store.name)}`;
      nameEl.textContent = store.name;
      addrEl.textContent = store.address || '';
      linkEl.href = mapsUrl;
    }

    container.innerHTML = stores.map((s, i) => `
      <div class="store-card ${i === 0 ? 'active' : ''} reveal" data-store-idx="${i}">
        <div class="store-card__icon">${s.emoji}</div>
        <div>
          <div class="store-card__name">${s.name}</div>
          <div class="store-card__address">📍 ${s.address}</div>
          <div class="store-card__hours">🕐 ${s.hours}</div>
          <div style="margin-top:6px;">
            <span class="store-status-chip ${s.isOpen ? 'open' : 'closed'}" style="font-size:0.7rem;padding:2px 10px;">
              <span class="store-status-chip__dot"></span>
              ${s.isOpen ? 'Open Now' : 'Currently Closed'}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    // Initialise map with first store
    if (stores.length) updateMap(stores[0]);

    document.querySelectorAll('.store-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.store-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const store = stores[parseInt(card.dataset.storeIdx, 10)];
        if (store) updateMap(store);
      });
    });
  }

  // ── HELPERS ────────────────────────────────────────────────
  function attachMenuTabs() {
    // Clone to remove stale listeners
    document.querySelectorAll('.menu-tab').forEach(tab => {
      const fresh = tab.cloneNode(true);
      tab.parentNode.replaceChild(fresh, tab);
    });
    document.querySelectorAll('.menu-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category;
        document.querySelectorAll('.menu-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  function attachAddBtns() {
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (id) trackView(id);
        showHomeBranchPickerModal();
      });
    });
  }

  function attachCardClicks() {
    document.querySelectorAll('.menu-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', e => {
        if (e.target.closest('.add-btn')) return;
        const id = card.dataset.id;
        if (id) trackView(id);
        showHomeBranchPickerModal();
      });
    });
  }

  function attachReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }

  // Expose picker so static HTML buttons can trigger it
  window.showBranchPicker = showHomeBranchPickerModal;

  // ── INIT — safe for scripts at bottom of body ──────────────
  // DOMContentLoaded may have already fired by the time this script executes,
  // so we check readyState and call immediately if DOM is ready.
  function init() {
    renderPromoBanner();
    renderFeaturedMenu();
    renderStoreStatusChips();
    renderHomeStores();
    // Pre-load stores for modal
    getStores().then(stores => { _homeBranchCache = stores; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
