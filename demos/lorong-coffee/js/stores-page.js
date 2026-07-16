/* ================================================================
   stores-page.js — Stores page dynamic rendering
   FIX: Use readyState check (scripts at bottom — DOM already ready)
   ================================================================ */

(function () {
  'use strict';
  initData();

  let allStores = [];
  let currentSearch = '';

  function buildStoreCard(s) {
    const isComingSoon = s.comingSoon;
    const isOpen = s.isOpen && !isComingSoon;
    const statusLabel = isComingSoon ? 'Coming Soon' : isOpen ? 'Open Now' : 'Closed';
    const statusBadgeClass = isComingSoon ? 'closed' : isOpen ? '' : 'closed';

    return `
      <div class="location-card reveal${isComingSoon ? ' location-card--soon' : ''}">
        <div class="location-card__header" style="${isComingSoon ? 'background:linear-gradient(135deg,#555,#777)' : ''}">
          ${s.emoji}
          <span class="location-card__status ${statusBadgeClass}">${statusLabel}</span>
        </div>
        <div class="location-card__body">
          <div class="location-card__name">${s.name}</div>
          <div class="location-card__info">
            <strong>📍</strong> ${s.address}<br/>
            <strong>🕐</strong> ${s.hours}
            ${s.phone ? `<br/><strong>📞</strong> ${s.phone}` : ''}
            ${s.email ? `<br/><strong>✉️</strong> ${s.email}` : ''}
            ${isComingSoon ? `<br/><br/><em>Be the first to know when we open here!</em>` : ''}
          </div>
          <div style="margin-top:0.75rem;">
            <span class="store-status-chip ${isOpen ? 'open' : 'closed'}" style="font-size:0.72rem;">
              <span class="store-status-chip__dot"></span>
              ${statusLabel}
            </span>
          </div>
        </div>
        <div class="location-card__actions">
          ${isComingSoon
            ? `<button class="location-card__btn location-card__btn-outline" style="flex:1;" onclick="notifyMe('${s.name}')">🔔 Notify Me</button>`
            : `
              <button class="location-card__btn location-card__btn-primary" onclick="getDirections('${encodeURIComponent(s.address)}')">Get Directions</button>
              <a href="menu.html#branch=${s.id}" class="location-card__btn location-card__btn-outline">☕ Order Here</a>
            `}
        </div>
      </div>
    `;
  }

  function selectBranch(branchId) {
    sessionStorage.setItem('selected_branch_id', branchId);
  }
  window.selectBranch = selectBranch;

  function renderSkeleton(container, count = 5) {
    container.innerHTML = Array.from({ length: count }).map(() => `
      <div class="location-card skeleton-card">
        <div class="location-card__header skeleton-box" style="height:120px;border-radius:0;"></div>
        <div class="location-card__body">
          <div class="skeleton-line" style="width:70%;height:20px;margin-bottom:10px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:90%;height:12px;margin-bottom:6px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:75%;height:12px;margin-bottom:6px;border-radius:4px;"></div>
          <div class="skeleton-line" style="width:55%;height:12px;border-radius:4px;"></div>
        </div>
      </div>
    `).join('');
  }

  function renderStores() {
    const container = document.getElementById('stores-grid');
    if (!container) return;

    let stores = allStores;
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      stores = stores.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }

    const countEl = document.getElementById('stores-count');
    if (countEl) {
      const active = stores.filter(s => !s.comingSoon).length;
      const soon = stores.filter(s => s.comingSoon).length;
      countEl.textContent = `${active} active${soon ? ` · ${soon} coming soon` : ''}`;
    }

    if (!stores.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
          <div style="font-family:var(--font-display);font-size:1.5rem;color:var(--green);margin-bottom:0.5rem;">No stores found</div>
          <p>Try a different search term.</p>
        </div>`;
      return;
    }

    container.innerHTML = stores.map(buildStoreCard).join('');
    attachReveal();
  }

  function renderStoreStats() {
    const statsEl = document.getElementById('stores-stats');
    if (!statsEl) return;
    const open = allStores.filter(s => s.isOpen && !s.comingSoon).length;
    const total = allStores.filter(s => !s.comingSoon).length;
    statsEl.innerHTML = `
      <span class="store-status-chip open" style="font-size:0.8rem;padding:4px 14px;">
        <span class="store-status-chip__dot"></span>
        ${open} of ${total} branches open now
      </span>
    `;
  }

  function getDirections(address) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  }

  function notifyMe(storeName) {
    const existing = document.getElementById('notify-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'notify-modal';
    modal.style.cssText = [
      'position:fixed;inset:0;z-index:9999;',
      'display:flex;align-items:center;justify-content:center;',
      'background:rgba(10,20,14,0.72);backdrop-filter:blur(6px);',
    ].join('');
    const shortName = storeName.replace('Lorong Coffee — ', '');
    modal.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:2.2rem 2rem 1.6rem;
           max-width:380px;width:90%;box-shadow:0 32px 80px rgba(0,0,0,0.35);
           font-family:var(--font-body,sans-serif);">
        <div style="font-size:2.6rem;text-align:center;margin-bottom:0.6rem;">🔔</div>
        <div style="font-family:var(--font-display,serif);font-size:1.4rem;font-weight:800;
             color:var(--green,#1B4332);text-align:center;margin-bottom:0.4rem;">Get Notified!</div>
        <p style="font-size:0.88rem;color:#6b7280;text-align:center;line-height:1.6;margin-bottom:1.2rem;">
          Be the first to know when <strong>${shortName}</strong> opens.
        </p>
        <input id="notify-email-input" type="email" placeholder="Enter your email address"
          style="width:100%;box-sizing:border-box;padding:0.85rem 1rem;border:2px solid #e5e7eb;
                 border-radius:12px;font-size:0.92rem;font-family:var(--font-body,sans-serif);
                 margin-bottom:0.8rem;outline:none;color:#1f2937;"
          onfocus="this.style.borderColor='var(--yellow,#F5C800)';"
          onblur="this.style.borderColor='#e5e7eb';"/>
        <button id="notify-submit-btn"
          style="display:block;width:100%;padding:0.85rem;
                 background:var(--yellow,#F5C800);color:var(--green,#1B4332);
                 border:none;border-radius:12px;font-weight:800;font-size:0.95rem;
                 cursor:pointer;font-family:var(--font-body,sans-serif);margin-bottom:0.5rem;"
        >Notify Me 👍</button>
        <button id="notify-cancel-btn"
          style="display:block;width:100%;padding:0.7rem;border:none;background:transparent;
                 font-size:0.85rem;color:#9ca3af;cursor:pointer;
                 font-family:var(--font-body,sans-serif);border-radius:10px;"
        >✕ Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    const emailInput = document.getElementById('notify-email-input');
    document.getElementById('notify-submit-btn').addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#E63946';
        emailInput.focus();
        return;
      }
      modal.remove();
      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = [
        'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);',
        'background:var(--green,#1B4332);color:#fff;',
        'padding:0.9rem 1.6rem;border-radius:50px;font-weight:700;',
        'font-size:0.88rem;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,0.25);',
        'font-family:var(--font-body,sans-serif);',
        'animation:bpFadeIn 0.3s ease;',
      ].join('');
      toast.textContent = `✅ We'll notify ${email} when ${shortName} opens!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    });
    document.getElementById('notify-cancel-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    setTimeout(() => emailInput?.focus(), 100);
  }

  window.getDirections = getDirections;
  window.notifyMe = notifyMe;

  function attachReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }

  function initSearch() {
    const input = document.getElementById('store-search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      currentSearch = input.value.trim();
      clearTimeout(input._debounce);
      input._debounce = setTimeout(renderStores, 200);
    });
    const btn = document.getElementById('store-search-btn');
    if (btn) btn.addEventListener('click', () => renderStores());
  }

  // ── INIT — safe for scripts at bottom of body ──────────────
  function init() {
    const container = document.getElementById('stores-grid');
    if (!container) return;
    renderSkeleton(container, 5);
    setTimeout(async () => {
      allStores = await getStores();
      renderStoreStats();
      renderStores();
      initSearch();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
