// === BREK LAJU — Data Layer (db.js) — Supabase edition ===
// All data lives in Supabase (tables prefixed bl_). This file loads everything
// into an in-memory cache on page load (one blocking request), so every
// getXxx() call stays synchronous and all page code works unchanged.
// Writes update the cache instantly and sync to Supabase in the background.

const BL_SUPABASE_URL = 'https://dlzvfbdolcnxxeavuuan.supabase.co';
const BL_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsenZmYmRvbGNueHhlYXZ1dWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIzODksImV4cCI6MjA5MjU2ODM4OX0.OYLIsUxoyADwO13JUh2SSynUmZzfm9rjQFTrXdofpPA';

// ── Utilities ──────────────────────────
function generateId() {
  return 'bl_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}
function nowISO() { return new Date().toISOString(); }
function fmtDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('ms-MY', { dateStyle: 'medium', timeStyle: 'short' });
}

// ── Supabase REST helpers ──────────────
function _blHeaders() {
  return {
    'apikey': BL_SUPABASE_KEY,
    'Authorization': 'Bearer ' + BL_SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  };
}
// Background write (fire-and-forget; cache is already updated)
function _blPush(method, path, body) {
  fetch(BL_SUPABASE_URL + '/rest/v1/' + path, {
    method,
    headers: _blHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).catch(err => console.error('[db] Supabase sync failed:', err));
}

// ── Fallback data (used only if Supabase is unreachable) ──
const DEFAULT_DATA = {
  listings: [],
  branches: [],
  promotions: [],
  settings: {
    siteName:'Brek Laju', tagline:'Rangup. Laju. Sedap.', heroTitle:'RASA LAJU,',
    heroSubtitle:'Ayam goreng rangup dengan rempah rahsia turun-temurun.',
    contactPhone:'03-1234 5678', contactEmail:'hello@breklaju.my', contactAddress:'Cyberjaya, Selangor',
    socialFacebook:'#', socialInstagram:'#', socialTiktok:'#',
    adminPassword:'123123', updatedAt: nowISO()
  },
  analytics: { listingViews:{}, pageViews:{} }
};

// ── Load everything from Supabase (blocking, once per page) ──
let _DB = null;
(function _blInit() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', BL_SUPABASE_URL + '/rest/v1/rpc/bl_get_all', false); // synchronous on purpose
    xhr.setRequestHeader('apikey', BL_SUPABASE_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + BL_SUPABASE_KEY);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send('{}');
    if (xhr.status >= 200 && xhr.status < 300) {
      const d = JSON.parse(xhr.responseText);
      _DB = {
        listings:   d.listings   || [],
        branches:   d.branches   || [],
        promotions: d.promotions || [],
        settings:   d.settings   || { ...DEFAULT_DATA.settings },
        analytics:  {
          listingViews: (d.analytics && d.analytics.listingViews) || {},
          pageViews:    (d.analytics && d.analytics.pageViews)    || {}
        }
      };
    }
  } catch (e) {
    console.error('[db] Failed to load from Supabase:', e);
  }
  if (!_DB) _DB = JSON.parse(JSON.stringify(DEFAULT_DATA));
})();

function _getDB() { return _DB; }
function resetDB() {
  // Reload fresh data from the server
  window.location.reload();
  return _DB;
}

// ══════════════════════════════════════
// LISTINGS API
// ══════════════════════════════════════
function getListings(filters = {}) {
  const db = _getDB(); let r = [...db.listings];
  if (filters.category) r = r.filter(l => l.category === filters.category);
  if (filters.isFeatured !== undefined) r = r.filter(l => l.isFeatured === filters.isFeatured);
  if (filters.isAvailable !== undefined) r = r.filter(l => l.isAvailable === filters.isAvailable);
  if (!filters.includeHidden) r = r.filter(l => !l.isHidden);
  return r;
}
function getListing(id) { return _getDB().listings.find(l => l.id === id) || null; }
function createListing(data) {
  const db = _getDB();
  const item = { id:generateId(), name:'', description:'', price:0, priceUnit:'', category:'ayam', imageUrl:'', badge:'', badgeType:'none', spiceLevel:0, tags:[], isAvailable:true, isFeatured:false, isHidden:false, viewCount:0, createdAt:nowISO(), updatedAt:nowISO(), ...data };
  db.listings.push(item);
  _blPush('POST', 'bl_listings', item);
  return item;
}
function updateListing(id, data) {
  const db = _getDB(); const i = db.listings.findIndex(l => l.id === id);
  if (i === -1) return null;
  db.listings[i] = { ...db.listings[i], ...data, updatedAt:nowISO() };
  const { id:_omit, ...patch } = db.listings[i];
  _blPush('PATCH', 'bl_listings?id=eq.' + encodeURIComponent(id), patch);
  return db.listings[i];
}
function deleteListing(id) {
  const db = _getDB(); db.listings = db.listings.filter(l => l.id !== id);
  _blPush('DELETE', 'bl_listings?id=eq.' + encodeURIComponent(id));
  return true;
}

// ══════════════════════════════════════
// BRANCHES API
// ══════════════════════════════════════
function getBranches(filters = {}) {
  const db = _getDB(); let r = [...db.branches];
  if (filters.state) r = r.filter(b => b.state === filters.state);
  if (filters.isOpen !== undefined) r = r.filter(b => b.isOpen === filters.isOpen);
  return r;
}
function getBranch(id) { return _getDB().branches.find(b => b.id === id) || null; }
function createBranch(data) {
  const db = _getDB();
  const branch = { id:generateId(), name:'', address:'', state:'selangor', hours:'', phone:'', mapsUrl:'https://maps.google.com', imageUrl:'', isOpen:true, createdAt:nowISO(), updatedAt:nowISO(), ...data };
  db.branches.push(branch);
  _blPush('POST', 'bl_branches', branch);
  return branch;
}
function updateBranch(id, data) {
  const db = _getDB(); const i = db.branches.findIndex(b => b.id === id);
  if (i === -1) return null;
  db.branches[i] = { ...db.branches[i], ...data, updatedAt:nowISO() };
  const { id:_omit, ...patch } = db.branches[i];
  _blPush('PATCH', 'bl_branches?id=eq.' + encodeURIComponent(id), patch);
  return db.branches[i];
}
function deleteBranch(id) {
  const db = _getDB(); db.branches = db.branches.filter(b => b.id !== id);
  _blPush('DELETE', 'bl_branches?id=eq.' + encodeURIComponent(id));
  return true;
}

// ══════════════════════════════════════
// PROMOTIONS API
// ══════════════════════════════════════
function getPromotions(filters = {}) {
  const db = _getDB(); let r = [...db.promotions];
  if (filters.isActive !== undefined) r = r.filter(p => p.isActive === filters.isActive);
  return r;
}
function getPromotion(id) { return _getDB().promotions.find(p => p.id === id) || null; }
function createPromotion(data) {
  const db = _getDB();
  const promo = { id:generateId(), title:'', description:'', imageUrl:'', ctaText:'Pesan Sekarang', ctaUrl:'pages/menu.html', isActive:true, createdAt:nowISO(), updatedAt:nowISO(), ...data };
  db.promotions.push(promo);
  _blPush('POST', 'bl_promotions', promo);
  return promo;
}
function updatePromotion(id, data) {
  const db = _getDB(); const i = db.promotions.findIndex(p => p.id === id);
  if (i === -1) return null;
  db.promotions[i] = { ...db.promotions[i], ...data, updatedAt:nowISO() };
  const { id:_omit, ...patch } = db.promotions[i];
  _blPush('PATCH', 'bl_promotions?id=eq.' + encodeURIComponent(id), patch);
  return db.promotions[i];
}
function deletePromotion(id) {
  const db = _getDB(); db.promotions = db.promotions.filter(p => p.id !== id);
  _blPush('DELETE', 'bl_promotions?id=eq.' + encodeURIComponent(id));
  return true;
}

// ══════════════════════════════════════
// SETTINGS API
// ══════════════════════════════════════
function getSettings() { return { ..._getDB().settings }; }
function updateSettings(data) {
  const db = _getDB();
  db.settings = { ...db.settings, ...data, updatedAt:nowISO() };
  const { id:_omit, ...patch } = db.settings;
  _blPush('PATCH', 'bl_settings?id=eq.1', patch);
  return db.settings;
}

// ══════════════════════════════════════
// ANALYTICS API
// ══════════════════════════════════════
function _blSyncAnalytics() {
  const db = _getDB();
  _blPush('PATCH', 'bl_analytics?id=eq.1', {
    listingViews: db.analytics.listingViews,
    pageViews: db.analytics.pageViews
  });
}
function trackView(listingId) {
  const db = _getDB();
  db.analytics.listingViews[listingId] = (db.analytics.listingViews[listingId] || 0) + 1;
  const i = db.listings.findIndex(l => l.id === listingId);
  if (i !== -1) {
    db.listings[i].viewCount = (db.listings[i].viewCount || 0) + 1;
    _blPush('PATCH', 'bl_listings?id=eq.' + encodeURIComponent(listingId), { viewCount: db.listings[i].viewCount });
  }
  _blSyncAnalytics();
}
function trackPageView(page) {
  const db = _getDB();
  db.analytics.pageViews[page] = (db.analytics.pageViews[page] || 0) + 1;
  _blSyncAnalytics();
}
function getAnalytics() {
  const db = _getDB();
  const listings = db.listings || [];
  const branches = db.branches || [];
  const promotions = db.promotions || [];
  const topListings = [...listings].sort((a,b) => (b.viewCount||0) - (a.viewCount||0)).slice(0, 5);
  return {
    topListings,
    pageViews: db.analytics?.pageViews || {},
    totalListings: listings.length,
    availableListings: listings.filter(l => l.isAvailable && !l.isHidden).length,
    totalBranches: branches.length,
    openBranches: branches.filter(b => b.isOpen).length,
    totalPromotions: promotions.length,
    activePromotions: promotions.filter(p => p.isActive).length,
    totalViews: listings.reduce((sum, l) => sum + (l.viewCount || 0), 0)
  };
}

// ══════════════════════════════════════
// AUTH
// ══════════════════════════════════════
function adminLogin(password) {
  const settings = getSettings();
  if (password === settings.adminPassword) {
    sessionStorage.setItem('bl_admin', '1');
    sessionStorage.setItem('bl_admin_time', nowISO());
    return true;
  }
  return false;
}
function adminLogout() { sessionStorage.removeItem('bl_admin'); sessionStorage.removeItem('bl_admin_time'); }
function isAdminLoggedIn() { return sessionStorage.getItem('bl_admin') === '1'; }
function requireAdmin(redirectPath = '../admin/index.html') {
  if (!isAdminLoggedIn()) { window.location.href = redirectPath; return false; }
  return true;
}

// ══════════════════════════════════════
// REFERENCE DATA
// ══════════════════════════════════════
const CATEGORIES = [
  { id:'ayam',    label:'🍗 Ayam Goreng' },
  { id:'combo',   label:'🎁 Combo & Set' },
  { id:'burger',  label:'🍔 Burger' },
  { id:'snack',   label:'🍟 Snack' },
  { id:'minuman', label:'🥤 Minuman' }
];
const STATES = [
  { id:'selangor', label:'Selangor' },
  { id:'kl',       label:'Kuala Lumpur' },
  { id:'johor',    label:'Johor' },
  { id:'penang',   label:'Pulau Pinang' },
  { id:'perak',    label:'Perak' },
  { id:'kedah',    label:'Kedah' },
  { id:'sabah',    label:'Sabah' },
  { id:'sarawak',  label:'Sarawak' }
];
const BADGE_TYPES = [
  { id:'none',    label:'Tiada' },
  { id:'default', label:'Standard (Kuning)' },
  { id:'hot',     label:'Hot 🔥 (Merah)' },
  { id:'new',     label:'Baru! (Hijau)' }
];
