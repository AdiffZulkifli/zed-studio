/* ================================================================
   menu-page.js — Full menu page dynamic rendering
   FIX: Use readyState check (scripts at bottom — DOM already ready)
   NEW: imageUrl support, extra filter modes (bestSeller, recommended,
        caffeinated, caffeineFree)
   NEW: Branch-specific menu from ?branch=ID URL param
   NEW: Friendly branch-picker modal instead of redirect
   ================================================================ */

(function () {
  'use strict';
  initData();

  // ── READ BRANCH FROM URL ────────────────────────────────────
  // Use hash fragment (#branch=id) — query strings get stripped by some dev servers
  function _getBranchId() {
    // Support both ?branch=id (direct links) and #branch=id (hash, server-safe)
    const qp = new URLSearchParams(window.location.search).get('branch');
    if (qp) return qp;
    const hash = window.location.hash.slice(1); // strip leading #
    if (hash) return new URLSearchParams(hash).get('branch') || null;
    return null;
  }
  const BRANCH_ID = _getBranchId();
  let currentBranchName = '';
  let allStoresCache = [];
  let _branchItems = null; // set when on a branch page, used by all renders

  // ── BRANCH PICKER MODAL ─────────────────────────────────────
  function showBranchPickerModal(onSelect) {
    // Remove existing modal if any
    const existing = document.getElementById('branch-picker-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'branch-picker-modal';
    modal.style.cssText = [
      'position:fixed;inset:0;z-index:9999;',
      'display:flex;align-items:center;justify-content:center;',
      'background:rgba(10,20,14,0.72);backdrop-filter:blur(6px);',
      'animation:bpFadeIn 0.22s ease;'
    ].join('');

    const activeStores = allStoresCache.filter(s => !s.comingSoon).sort((a, b) => a.id.localeCompare(b.id));

    modal.innerHTML = `
      <style>
        @keyframes bpFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes bpSlideUp { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        #branch-picker-modal .bp-card {
          background:#fff;
          border-radius:20px;
          padding:2.2rem 2rem 1.6rem;
          max-width:420px;
          width:90%;
          box-shadow:0 32px 80px rgba(0,0,0,0.35);
          animation:bpSlideUp 0.28s cubic-bezier(.34,1.56,.64,1);
          font-family:var(--font-body,sans-serif);
        }
        #branch-picker-modal .bp-icon { font-size:2.8rem; text-align:center; margin-bottom:0.6rem; }
        #branch-picker-modal .bp-title {
          font-family:var(--font-display,serif);
          font-size:1.5rem; font-weight:800;
          color:var(--green,#1B4332);
          text-align:center; margin-bottom:0.35rem;
        }
        #branch-picker-modal .bp-sub {
          font-size:0.88rem; color:#6b7280;
          text-align:center; margin-bottom:1.4rem; line-height:1.6;
        }
        #branch-picker-modal .bp-branch-btn {
          display:flex; align-items:center; gap:0.9rem;
          width:100%; padding:0.85rem 1.1rem;
          border:2px solid #e5e7eb; border-radius:14px;
          background:#fff; cursor:pointer;
          transition:border-color 0.18s, background 0.18s, transform 0.15s;
          margin-bottom:0.65rem;
          font-family:var(--font-body,sans-serif);
        }
        #branch-picker-modal .bp-branch-btn:hover {
          border-color:var(--yellow,#F5C800);
          background:#fffbea;
          transform:translateY(-2px);
        }
        #branch-picker-modal .bp-branch-btn .bp-emoji { font-size:1.6rem; }
        #branch-picker-modal .bp-branch-btn .bp-info { text-align:left; flex:1; }
        #branch-picker-modal .bp-branch-btn .bp-name {
          font-weight:700; font-size:0.95rem;
          color:var(--green,#1B4332);
        }
        #branch-picker-modal .bp-branch-btn .bp-addr {
          font-size:0.78rem; color:#9ca3af; margin-top:2px;
        }
        #branch-picker-modal .bp-branch-btn .bp-chip {
          font-size:0.65rem; font-weight:700; padding:3px 9px;
          border-radius:50px; text-transform:uppercase; letter-spacing:0.06em;
        }
        #branch-picker-modal .bp-chip.open { background:#d1fae5; color:#065f46; }
        #branch-picker-modal .bp-chip.closed { background:#fee2e2; color:#991b1b; }
        #branch-picker-modal .bp-cancel {
          display:block; width:100%; padding:0.7rem;
          border:none; background:transparent;
          font-size:0.85rem; color:#9ca3af;
          cursor:pointer; margin-top:0.3rem;
          font-family:var(--font-body,sans-serif);
          border-radius:10px; transition:background 0.15s;
        }
        #branch-picker-modal .bp-cancel:hover { background:#f3f4f6; color:#374151; }
      </style>
      <div class="bp-card">
        <div class="bp-icon">☕</div>
        <div class="bp-title">Choose Your Branch</div>
        <div class="bp-sub">Select the Lorong Coffee outlet you'd like to order from.</div>
        ${activeStores.map(s => `
          <button class="bp-branch-btn" data-branch-id="${s.id}" data-branch-name="${s.name}">
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
        onSelect(btn.dataset.branchId, btn.dataset.branchName);
      });
    });

    document.getElementById('bp-cancel-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  const CATEGORY_META = {
    coffee:    { label: 'Coffee Classics',            icon: '☕' },
    cold:      { label: 'Cold Brews & Iced Specials', icon: '🧊' },
    noncoffee: { label: 'Non-Coffee Favourites',      icon: '🍵' },
    seasonal:  { label: 'Seasonal Specials',          icon: '🌟' },
  };

  // Extended filter modes beyond categories
  const SPECIAL_FILTERS = ['bestSeller', 'recommended', 'caffeinated', 'caffeineFree', 'all'];

  let currentFilter = 'all'; // category OR special filter key
  let currentSearch = '';

  // ── BUILD CARD (supports imageUrl) ─────────────────────────
  function buildCard(item) {
    const soldOut = !item.available;
    const hasImage = item.imageUrl && item.imageUrl.trim();

    const imageHtml = hasImage
      ? `<img src="${item.imageUrl}" alt="${item.name}"
              style="width:100%;height:100%;object-fit:cover;display:block;"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
         <div style="display:none;align-items:center;justify-content:center;font-size:5rem;width:100%;height:100%;position:absolute;inset:0;">${item.emoji || '☕'}</div>`
      : `<span style="font-size:5rem;z-index:1;">${item.emoji || '☕'}</span>`;

    return `
      <div class="menu-card reveal${soldOut ? ' sold-out' : ''}"
           data-category="${item.category}"
           data-badge="${(item.badge || '').toLowerCase()}"
           data-featured="${item.featured}"
           data-id="${item.id}">
        <div class="menu-card__image" style="background:${item.gradient || 'linear-gradient(135deg,#2D6A4F,#40916C)'};overflow:hidden;flex-direction:column;">
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

  // ── APPLY FILTERS ──────────────────────────────────────────
  function applyFilter(items) {
    switch (currentFilter) {
      case 'all':         return items;
      case 'bestSeller':  return items.filter(i => (i.badge || '').toLowerCase() === 'best seller');
      case 'recommended': return items.filter(i => i.featured === true);
      case 'caffeinated': return items.filter(i => i.category === 'coffee' || i.category === 'cold');
      case 'caffeineFree':return items.filter(i => i.category === 'noncoffee');
      default:            return items.filter(i => i.category === currentFilter);
    }
  }

  // ── SKELETON LOADER ────────────────────────────────────────
  function renderSkeleton(container, count = 8) {
    container.innerHTML = Array.from({ length: count }).map(() => `
      <div class="menu-card skeleton-card">
        <div class="menu-card__image skeleton-box"></div>
        <div class="menu-card__body">
          <div class="skeleton-line" style="width:65%;height:18px;margin-bottom:8px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:90%;height:12px;margin-bottom:4px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:55%;height:12px;margin-bottom:16px;border-radius:4px;"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="skeleton-line" style="width:50px;height:20px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:36px;height:36px;border-radius:50%;"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ── RENDER ─────────────────────────────────────────────────
  async function renderMenu() {
    const wrapper = document.getElementById('menu-sections-wrapper');
    if (!wrapper) return;

    let items = _branchItems ? [..._branchItems] : await getMenu();

    // Apply search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.badge || '').toLowerCase().includes(q)
      );
    }

    // Apply filter
    items = applyFilter(items);

    // Update result count
    const countEl = document.getElementById('menu-result-count');
    if (countEl) countEl.textContent = items.length ? `${items.length} drink${items.length !== 1 ? 's' : ''} found` : '';

    if (!items.length) {
      wrapper.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:5rem 2rem;color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">☕</div>
          <div style="font-family:var(--font-display);font-size:1.5rem;color:var(--green);margin-bottom:0.5rem;">No drinks found</div>
          <p>Try a different search or category.</p>
        </div>`;
      return;
    }

    // Group by category only for "all" with no search
    const isCategory = !SPECIAL_FILTERS.includes(currentFilter);
    const showGrouped = (currentFilter === 'all' || isCategory) && !currentSearch;

    if (showGrouped && currentFilter === 'all') {
      const categories = ['coffee', 'cold', 'noncoffee', 'seasonal'];
      wrapper.innerHTML = categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        if (!catItems.length) return '';
        const meta = CATEGORY_META[cat];
        return `
          <div class="menu-category-section">
            <h3 class="menu-section-title">${meta.icon} ${meta.label}</h3>
            <div class="menu-grid" style="margin-bottom:3rem;">
              ${catItems.map(buildCard).join('')}
            </div>
          </div>
        `;
      }).join('');
    } else {
      wrapper.innerHTML = `
        <div class="menu-grid" style="margin-bottom:2rem;">
          ${items.map(buildCard).join('')}
        </div>
      `;
    }

    attachAddBtns();
    attachCardClicks();
    attachReveal();
  }

  // ── ADD BUTTON ─────────────────────────────────────────────
  function attachAddBtns() {
    document.querySelectorAll('.add-btn').forEach(btn =>
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (id) trackView(id);
        if (BRANCH_ID) {
          // Already on a branch menu — just show a friendly confirmation
          showOrderConfirmModal();
        } else {
          showBranchPickerModal((branchId, branchName) => {
            window.location.href = `menu.html#branch=${branchId}`;
          });
        }
      })
    );
  }

  // ── CARD CLICK ─────────────────────────────────────────────
  function attachCardClicks() {
    document.querySelectorAll('.menu-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', e => {
        // Don't double-trigger if the add-btn was clicked
        if (e.target.closest('.add-btn')) return;
        const id = card.dataset.id;
        if (id) trackView(id);
        if (BRANCH_ID) {
          showOrderConfirmModal();
        } else {
          showBranchPickerModal((branchId, branchName) => {
            window.location.href = `menu.html#branch=${branchId}`;
          });
        }
      });
    });
  }

  // ── ORDER CONFIRM (already on branch menu) ─────────────────
  function showOrderConfirmModal() {
    const existing = document.getElementById('order-confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'order-confirm-modal';
    modal.style.cssText = [
      'position:fixed;inset:0;z-index:9999;',
      'display:flex;align-items:center;justify-content:center;',
      'background:rgba(10,20,14,0.72);backdrop-filter:blur(6px);',
      'animation:bpFadeIn 0.22s ease;'
    ].join('');
    modal.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:2.2rem 2rem 1.6rem;
           max-width:360px;width:90%;box-shadow:0 32px 80px rgba(0,0,0,0.35);
           font-family:var(--font-body,sans-serif);
           animation:bpSlideUp 0.28s cubic-bezier(.34,1.56,.64,1);">
        <div style="font-size:2.8rem;text-align:center;margin-bottom:0.6rem;">☕</div>
        <div style="font-family:var(--font-display,serif);font-size:1.4rem;font-weight:800;
             color:var(--green,#1B4332);text-align:center;margin-bottom:0.4rem;">Order at ${currentBranchName.replace('Lorong Coffee — ','')}</div>
        <p style="font-size:0.88rem;color:#6b7280;text-align:center;line-height:1.6;margin-bottom:1.4rem;">
          Walk in or show this menu to our barista and they'll prepare your order fresh! 🥤
        </p>
        <button onclick="document.getElementById('order-confirm-modal').remove()"
          style="display:block;width:100%;padding:0.85rem;
                 background:var(--yellow,#F5C800);color:var(--green,#1B4332);
                 border:none;border-radius:14px;font-weight:800;font-size:0.95rem;
                 cursor:pointer;font-family:var(--font-body,sans-serif);">Got it! 👍</button>
        <button onclick="document.getElementById('order-confirm-modal').remove()"
          style="display:block;width:100%;padding:0.7rem;border:none;
                 background:transparent;font-size:0.85rem;color:#9ca3af;
                 cursor:pointer;margin-top:0.4rem;font-family:var(--font-body,sans-serif);
                 border-radius:10px;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // ── REVEAL ─────────────────────────────────────────────────
  function attachReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }

  // ── TABS — all .menu-tab elements work together ────────────
  function initTabs() {
    const allTabs = document.querySelectorAll('.menu-tab');
    allTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Deselect all tabs across both rows
        allTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.category;
        // Clear search when switching tabs
        if (currentSearch) {
          currentSearch = '';
          const inp = document.getElementById('menu-search');
          if (inp) inp.value = '';
        }
        const wrapper = document.getElementById('menu-sections-wrapper');
        renderSkeleton(wrapper, 6);
        setTimeout(renderMenu, 180);
      });
    });
  }

  // ── SEARCH ─────────────────────────────────────────────────
  function initSearch() {
    const input = document.getElementById('menu-search');
    if (!input) return;
    input.addEventListener('input', () => {
      currentSearch = input.value.trim();
      if (currentSearch) {
        // Reset to all tab when searching
        document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.menu-tab[data-category="all"]');
        if (allTab) allTab.classList.add('active');
        currentFilter = 'all';
      }
      clearTimeout(input._debounce);
      input._debounce = setTimeout(renderMenu, 220);
    });
  }

  window.switchToBranch = function(id) {
    window.location.href = `menu.html#branch=${id}`;
  };

  // ── BRANCH HERO INJECTION ───────────────────────────────────
  function injectBranchHero(store, shortName) {
    const existing = document.getElementById('branch-page-hero');
    if (existing) existing.remove();

    const activeStores = allStoresCache.filter(s => !s.comingSoon).sort((a, b) => a.id.localeCompare(b.id));
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || store.name)}`;

    const section = document.createElement('section');
    section.id = 'branch-page-hero';
    section.innerHTML = `
      <style>
        #branch-page-hero {
          background: #1B4332;
          padding: 6rem 2rem 4rem;
        }
        .bph-wrap { max-width:1160px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3.5rem;align-items:center; }
        @media(max-width:780px){ .bph-wrap{grid-template-columns:1fr;gap:2rem;} }

        .bph-tag {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,200,0,0.15);border:1px solid rgba(245,200,0,0.3);
          color:#F5C800;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;
          text-transform:uppercase;padding:5px 14px;border-radius:50px;margin-bottom:1.4rem;
        }
        .bph-emoji { font-size:4.5rem;line-height:1;margin-bottom:0.6rem;display:block; }
        .bph-name {
          font-family:var(--font-display,serif);
          font-size:clamp(3rem,7vw,5.5rem);font-weight:900;
          color:#F5C800;line-height:0.95;margin-bottom:0.5rem;
        }
        .bph-sub { font-size:0.78rem;color:rgba(255,255,255,0.35);font-family:var(--font-mono,monospace);letter-spacing:0.05em;margin-bottom:1.4rem; }
        .bph-status-row { display:flex;align-items:center;gap:8px;font-size:0.88rem;font-weight:700;color:rgba(255,255,255,0.9); }
        .bph-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
        .bph-dot.open { background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,0.6); }
        .bph-dot.closed { background:#f87171; }

        .bph-card {
          background:rgba(255,255,255,0.06);
          backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:24px;padding:2rem;
        }
        .bph-row { display:flex;align-items:flex-start;gap:14px;padding:0.85rem 0;border-bottom:1px solid rgba(255,255,255,0.07); }
        .bph-row:last-of-type { border-bottom:none;padding-bottom:0; }
        .bph-row-icon { font-size:1.1rem;flex-shrink:0;margin-top:1px;width:22px;text-align:center; }
        .bph-row-lbl { font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.38);margin-bottom:3px; }
        .bph-row-val { font-size:0.88rem;color:rgba(255,255,255,0.82);line-height:1.5; }

        .bph-actions { display:flex;gap:0.75rem;margin-top:1.4rem;flex-wrap:wrap; }
        .bph-btn-primary {
          flex:1;min-width:120px;padding:11px 18px;text-align:center;
          background:#F5C800;color:#1B4332;border:none;border-radius:50px;
          font-weight:800;font-size:0.85rem;cursor:pointer;
          font-family:var(--font-body,sans-serif);text-decoration:none;
          transition:background 0.18s,transform 0.15s;display:inline-block;
        }
        .bph-btn-primary:hover { background:#e6b800;transform:translateY(-1px); }
        .bph-btn-ghost {
          flex:1;min-width:120px;padding:11px 18px;
          background:rgba(255,255,255,0.08);color:white;
          border:1.5px solid rgba(255,255,255,0.18);border-radius:50px;
          font-weight:700;font-size:0.85rem;cursor:pointer;
          font-family:var(--font-body,sans-serif);
          transition:background 0.18s,border-color 0.18s;
        }
        .bph-btn-ghost:hover { background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.35); }

        /* Branch selector dropdown (next to search bar) */
        .bsel-wrap { position:relative;flex-shrink:0; }
        .bsel-btn {
          display:flex;align-items:center;gap:8px;
          padding:11px 18px;border-radius:50px;
          background:#1B4332;color:#F5C800;
          border:none;cursor:pointer;white-space:nowrap;
          font-family:var(--font-body,sans-serif);font-size:0.88rem;font-weight:700;
          transition:background 0.18s;
        }
        .bsel-btn:hover { background:#2D6A4F; }
        .bsel-chevron { font-size:0.65rem;opacity:0.7;margin-left:2px; }
        .bsel-dd {
          position:absolute;left:0;top:calc(100% + 8px);
          background:white;border-radius:18px;
          box-shadow:0 24px 60px rgba(0,0,0,0.18);
          min-width:280px;overflow:hidden;z-index:999;display:none;
        }
        .bsel-dh {
          padding:0.75rem 1.1rem 0.4rem;
          font-size:0.62rem;text-transform:uppercase;letter-spacing:0.1em;
          color:#9ca3af;border-bottom:1px solid #f3f4f6;
          font-family:var(--font-mono,monospace);
        }
        .bsel-opt {
          display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.1rem;
          cursor:pointer;border:none;background:transparent;width:100%;
          font-family:var(--font-body,sans-serif);text-align:left;
          transition:background 0.15s;
        }
        .bsel-opt:hover { background:#f9fafb; }
        .bsel-opt.cur { background:#fffbea; }
        .bsel-opt__emoji { font-size:1.3rem;flex-shrink:0; }
        .bsel-opt__name { font-weight:700;font-size:0.88rem;color:#1B4332; }
        .bsel-opt__addr { font-size:0.72rem;color:#9ca3af;margin-top:1px; }
        .bsel-chip {
          font-size:0.6rem;font-weight:700;padding:2px 9px;border-radius:50px;
          text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0;
        }
        .bsel-chip.open { background:#d1fae5;color:#065f46; }
        .bsel-chip.closed { background:#fee2e2;color:#991b1b; }
        .bsel-chip.cur { background:#F5C800;color:#1B4332; }
      </style>

      <div class="bph-wrap">
        <div>
          <div class="bph-tag">📍 Branch Menu</div>
          <span class="bph-emoji">${store.emoji}</span>
          <div class="bph-name">${shortName}</div>
          <div class="bph-sub">${store.name.toUpperCase()}</div>
          <div class="bph-status-row">
            <span class="bph-dot ${store.isOpen ? 'open' : 'closed'}"></span>
            ${store.isOpen ? 'Open Now' : 'Currently Closed'}
          </div>
        </div>
        <div class="bph-card">
          ${store.address ? `
            <div class="bph-row">
              <span class="bph-row-icon">📍</span>
              <div><div class="bph-row-lbl">Address</div><div class="bph-row-val">${store.address}</div></div>
            </div>` : ''}
          ${store.hours ? `
            <div class="bph-row">
              <span class="bph-row-icon">🕐</span>
              <div><div class="bph-row-lbl">Hours</div><div class="bph-row-val">${store.hours}</div></div>
            </div>` : ''}
          ${store.phone ? `
            <div class="bph-row">
              <span class="bph-row-icon">📞</span>
              <div><div class="bph-row-lbl">Phone</div><div class="bph-row-val">${store.phone}</div></div>
            </div>` : ''}
          ${store.address ? `
          <div class="bph-actions">
            <a href="${mapsUrl}" target="_blank" class="bph-btn-primary">📍 Get Directions</a>
          </div>` : ''}
        </div>
      </div>
    `;

    const menuFull = document.querySelector('.menu-full');
    if (menuFull) menuFull.parentNode.insertBefore(section, menuFull);

    // Inject branch selector dropdown next to the search bar
    const searchBarParent = document.querySelector('.menu-search-bar')?.parentElement;
    if (searchBarParent && activeStores.length > 1) {
      const curStore = activeStores.find(s => s.id === BRANCH_ID) || activeStores[0];
      const selWrap = document.createElement('div');
      selWrap.className = 'bsel-wrap';
      selWrap.id = 'bsel-wrap';
      selWrap.innerHTML = `
        <button class="bsel-btn" id="bsel-btn">
          <span>${curStore.emoji}</span>
          <span>${curStore.name.replace('Lorong Coffee — ','')}</span>
          <span class="bsel-chevron">▾</span>
        </button>
        <div class="bsel-dd" id="bsel-dd">
          <div class="bsel-dh">Switch Branch</div>
          ${activeStores.map(s => `
            <button class="bsel-opt ${s.id === BRANCH_ID ? 'cur' : ''}" onclick="switchToBranch('${s.id}')">
              <span class="bsel-opt__emoji">${s.emoji}</span>
              <span style="flex:1;">
                <div class="bsel-opt__name">${s.name.replace('Lorong Coffee — ','')}</div>
                <div class="bsel-opt__addr">📍 ${s.address}</div>
              </span>
              ${s.id === BRANCH_ID
                ? `<span class="bsel-chip cur">Viewing</span>`
                : `<span class="bsel-chip ${s.isOpen ? 'open' : 'closed'}">${s.isOpen ? 'Open' : 'Closed'}</span>`}
            </button>
          `).join('')}
        </div>
      `;
      searchBarParent.appendChild(selWrap);

      document.getElementById('bsel-btn').addEventListener('click', e => {
        e.stopPropagation();
        const dd = document.getElementById('bsel-dd');
        dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
      });
      document.addEventListener('click', function closeBsel(e) {
        const wrap = document.getElementById('bsel-wrap');
        if (wrap && !wrap.contains(e.target)) {
          const dd = document.getElementById('bsel-dd');
          if (dd) dd.style.display = 'none';
        }
      });
    }
  }

  // ── BRANCH-AWARE RENDER ─────────────────────────────────────
  async function renderMenuForBranch() {
    if (!BRANCH_ID) return renderMenu();

    if (!allStoresCache.length) {
      allStoresCache = await getStores();
    }
    const store = allStoresCache.find(s => s.id === BRANCH_ID);
    if (!store) {
      console.error('[BranchMenu] Store not found. BRANCH_ID:', BRANCH_ID, '| Available IDs:', allStoresCache.map(s => s.id));
      return renderMenu();
    }

    currentBranchName = store.name;
    const shortName = store.name.replace('Lorong Coffee — ', '');
    document.title = `${shortName} Menu — Lorong Coffee`;

    // Hide the generic page-hero and ticker — replaced by branch hero below
    const oldHero = document.querySelector('.page-hero');
    if (oldHero) oldHero.style.display = 'none';
    const ticker = document.querySelector('.ticker');
    if (ticker) ticker.style.display = 'none';

    injectBranchHero(store, shortName);

    const wrapper = document.getElementById('menu-sections-wrapper');
    if (!wrapper) return;
    renderSkeleton(wrapper, 8);

    const allItems = await getBranchMenuItems(BRANCH_ID);
    _branchItems = allItems
      .filter(i => i.branchStatus !== 'not_carried')
      .map(i => ({ ...i, available: i.branchStatus === 'available' }));

    await renderMenu();
  }

  // ── INIT — safe for scripts at bottom of body ──────────────
  async function init() {
    const wrapper = document.getElementById('menu-sections-wrapper');
    if (!wrapper) return;
    renderSkeleton(wrapper, 8);

    // Load stores first — needed for picker modal and branch rendering
    allStoresCache = await getStores();

    await renderMenuForBranch();
    initTabs();
    initSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
