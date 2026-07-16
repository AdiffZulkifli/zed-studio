/* ============================================================
   MEDICMESIR — Data Layer (Supabase edition)
   All data lives in Supabase (tables prefixed mm_). Everything
   is loaded into an in-memory cache on page load (one blocking
   request), so all getXxx() calls stay synchronous and every
   page works unchanged. Writes update the cache instantly and
   sync to Supabase in the background.
============================================================ */

const MM_SUPABASE_URL = 'https://dlzvfbdolcnxxeavuuan.supabase.co';
const MM_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsenZmYmRvbGNueHhlYXZ1dWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIzODksImV4cCI6MjA5MjU2ODM4OX0.OYLIsUxoyADwO13JUh2SSynUmZzfm9rjQFTrXdofpPA';

/* ── internal helpers ── */
function _uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function _now() { return new Date().toISOString(); }

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

/* ── Supabase REST helpers ── */
function _mmPush(method, path, body) {
  fetch(MM_SUPABASE_URL + '/rest/v1/' + path, {
    method,
    headers: {
      'apikey': MM_SUPABASE_KEY,
      'Authorization': 'Bearer ' + MM_SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).catch(err => console.error('[data] Supabase sync failed:', err));
}

/* ── Load everything from Supabase (blocking, once per page) ── */
let _MM = null;
(function _mmInit() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', MM_SUPABASE_URL + '/rest/v1/rpc/mm_get_all', false); // synchronous on purpose
    xhr.setRequestHeader('apikey', MM_SUPABASE_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + MM_SUPABASE_KEY);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send('{}');
    if (xhr.status >= 200 && xhr.status < 300) {
      const d = JSON.parse(xhr.responseText);
      _MM = {
        programmes:   d.programmes   || [],
        universities: d.universities || [],
        offices:      d.offices      || [],
        news:         d.news         || [],
        promotions:   d.promotions   || [],
        settings:     d.settings     || {},
        analytics:    d.analytics    || { programmeViews:{}, universityViews:{}, newsViews:{}, enquiries:0 }
      };
    }
  } catch (e) {
    console.error('[data] Failed to load from Supabase:', e);
  }
  if (!_MM) _MM = { programmes:[], universities:[], offices:[], news:[], promotions:[], settings:{}, analytics:{ programmeViews:{}, universityViews:{}, newsViews:{}, enquiries:0 } };
})();

/* ══════════════════════════════════════════════════════════
   PROGRAMMES
══════════════════════════════════════════════════════════ */
function getProgrammes(filters = {}) {
  let data = [..._MM.programmes];
  if (filters.status)   data = data.filter(p => p.status === filters.status);
  if (filters.featured) data = data.filter(p => p.featured === true);
  if (filters.category) data = data.filter(p => p.category === filters.category);
  return data;
}
function getProgramme(id) { return getProgrammes().find(p => p.id === id) || null; }

function createProgramme(data) {
  const item = { id: 'prog_' + _uid(), views: 0, createdAt: _now(), updatedAt: _now(), ...data };
  _MM.programmes.push(item);
  _mmPush('POST', 'mm_programmes', item);
  return item;
}
function updateProgramme(id, data) {
  const idx = _MM.programmes.findIndex(p => p.id === id);
  if (idx === -1) return null;
  _MM.programmes[idx] = { ..._MM.programmes[idx], ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.programmes[idx];
  _mmPush('PATCH', 'mm_programmes?id=eq.' + encodeURIComponent(id), patch);
  return _MM.programmes[idx];
}
function deleteProgramme(id) {
  _MM.programmes = _MM.programmes.filter(p => p.id !== id);
  _mmPush('DELETE', 'mm_programmes?id=eq.' + encodeURIComponent(id));
  return true;
}

/* ══════════════════════════════════════════════════════════
   UNIVERSITIES
══════════════════════════════════════════════════════════ */
function getUniversities(filters = {}) {
  let data = [..._MM.universities];
  if (filters.status)  data = data.filter(u => u.status === filters.status);
  if (filters.country) data = data.filter(u => u.country === filters.country);
  return data;
}
function getUniversity(id) { return getUniversities().find(u => u.id === id) || null; }

function createUniversity(data) {
  const item = { id: 'uni_' + _uid(), createdAt: _now(), updatedAt: _now(), ...data };
  _MM.universities.push(item);
  _mmPush('POST', 'mm_universities', item);
  return item;
}
function updateUniversity(id, data) {
  const idx = _MM.universities.findIndex(u => u.id === id);
  if (idx === -1) return null;
  _MM.universities[idx] = { ..._MM.universities[idx], ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.universities[idx];
  _mmPush('PATCH', 'mm_universities?id=eq.' + encodeURIComponent(id), patch);
  return _MM.universities[idx];
}
function deleteUniversity(id) {
  _MM.universities = _MM.universities.filter(u => u.id !== id);
  _mmPush('DELETE', 'mm_universities?id=eq.' + encodeURIComponent(id));
  return true;
}

/* ══════════════════════════════════════════════════════════
   OFFICES / BRANCHES
══════════════════════════════════════════════════════════ */
function getOffices(filters = {}) {
  let data = [..._MM.offices];
  if (filters.status !== undefined) data = data.filter(o => o.status === filters.status);
  if (filters.isHQ   !== undefined) data = data.filter(o => o.isHQ === filters.isHQ);
  return data;
}
function getOffice(id) { return getOffices().find(o => o.id === id) || null; }

function createOffice(data) {
  const item = { id: 'off_' + _uid(), createdAt: _now(), updatedAt: _now(), ...data };
  _MM.offices.push(item);
  _mmPush('POST', 'mm_offices', item);
  return item;
}
function updateOffice(id, data) {
  const idx = _MM.offices.findIndex(o => o.id === id);
  if (idx === -1) return null;
  _MM.offices[idx] = { ..._MM.offices[idx], ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.offices[idx];
  _mmPush('PATCH', 'mm_offices?id=eq.' + encodeURIComponent(id), patch);
  return _MM.offices[idx];
}
function deleteOffice(id) {
  _MM.offices = _MM.offices.filter(o => o.id !== id);
  _mmPush('DELETE', 'mm_offices?id=eq.' + encodeURIComponent(id));
  return true;
}

/* ══════════════════════════════════════════════════════════
   NEWS / ANNOUNCEMENTS
══════════════════════════════════════════════════════════ */
function getNews(filters = {}) {
  let data = [..._MM.news];
  if (filters.status)   data = data.filter(n => n.status === filters.status);
  if (filters.featured) data = data.filter(n => n.featured === true);
  if (filters.category) data = data.filter(n => n.category === filters.category);
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}
function getNewsItem(id) { return _MM.news.find(n => n.id === id) || null; }

function createNewsItem(data) {
  const item = { id: 'news_' + _uid(), views: 0, createdAt: _now(), updatedAt: _now(), ...data };
  _MM.news.push(item);
  _mmPush('POST', 'mm_news', item);
  return item;
}
function updateNewsItem(id, data) {
  const idx = _MM.news.findIndex(n => n.id === id);
  if (idx === -1) return null;
  _MM.news[idx] = { ..._MM.news[idx], ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.news[idx];
  _mmPush('PATCH', 'mm_news?id=eq.' + encodeURIComponent(id), patch);
  return _MM.news[idx];
}
function deleteNewsItem(id) {
  _MM.news = _MM.news.filter(n => n.id !== id);
  _mmPush('DELETE', 'mm_news?id=eq.' + encodeURIComponent(id));
  return true;
}

/* ══════════════════════════════════════════════════════════
   PROMOTIONS / BANNERS
══════════════════════════════════════════════════════════ */
function getPromotions(filters = {}) {
  let data = [..._MM.promotions];
  if (filters.active !== undefined) data = data.filter(p => p.active === filters.active);
  return data;
}
function getPromotion(id) { return _MM.promotions.find(p => p.id === id) || null; }

function createPromotion(data) {
  const item = { id: 'promo_' + _uid(), createdAt: _now(), updatedAt: _now(), ...data };
  _MM.promotions.push(item);
  _mmPush('POST', 'mm_promotions', item);
  return item;
}
function updatePromotion(id, data) {
  const idx = _MM.promotions.findIndex(p => p.id === id);
  if (idx === -1) return null;
  _MM.promotions[idx] = { ..._MM.promotions[idx], ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.promotions[idx];
  _mmPush('PATCH', 'mm_promotions?id=eq.' + encodeURIComponent(id), patch);
  return _MM.promotions[idx];
}
function deletePromotion(id) {
  _MM.promotions = _MM.promotions.filter(p => p.id !== id);
  _mmPush('DELETE', 'mm_promotions?id=eq.' + encodeURIComponent(id));
  return true;
}

/* ══════════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════════ */
function getSettings() { return { ..._MM.settings }; }
function updateSettings(data) {
  _MM.settings = { ..._MM.settings, ...data, updatedAt: _now() };
  const { id:_omit, ...patch } = _MM.settings;
  _mmPush('PATCH', 'mm_settings?id=eq.1', patch);
  return _MM.settings;
}

/* ══════════════════════════════════════════════════════════
   ANALYTICS
══════════════════════════════════════════════════════════ */
function getAnalytics() { return _MM.analytics; }
function _mmSyncAnalytics() {
  const a = _MM.analytics;
  _mmPush('PATCH', 'mm_analytics?id=eq.1', {
    programmeViews: a.programmeViews || {},
    universityViews: a.universityViews || {},
    newsViews: a.newsViews || {},
    enquiries: a.enquiries || 0
  });
}
function trackView(type, id) {
  const a   = _MM.analytics;
  const key = type + 'Views';
  if (!a[key]) a[key] = {};
  a[key][id] = (a[key][id] || 0) + 1;
  _mmSyncAnalytics();
}
function trackEnquiry() {
  _MM.analytics.enquiries = (_MM.analytics.enquiries || 0) + 1;
  _mmSyncAnalytics();
}

/* ══════════════════════════════════════════════════════════
   ADMIN AUTH — credentials live in mm_settings on Supabase
══════════════════════════════════════════════════════════ */
function mmCheckAdminLogin(username, password) {
  const s = getSettings();
  return username === (s.adminUsername || 'admin') && password === (s.adminPassword || '');
}

/* Data is seeded in Supabase — nothing to do locally. */
function seedDefaultData() {}
