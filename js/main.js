// ============================================================
// ZED STUDIO — Site behaviour
// ============================================================

// ── i18n ─────────────────────────────────────────────────────
const ZED_LANG_KEY = 'zed_lang';

function applyLanguage(lang) {
  const dict = window.ZED_I18N[lang] || window.ZED_I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.documentElement.lang = lang === 'ms' ? 'ms' : 'en';
  document.querySelectorAll('[data-lang-opt]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang-opt') === lang);
  });
  localStorage.setItem(ZED_LANG_KEY, lang);
}

const savedLang = localStorage.getItem(ZED_LANG_KEY) || 'en';
applyLanguage(savedLang);

document.getElementById('langToggle').addEventListener('click', () => {
  const current = localStorage.getItem(ZED_LANG_KEY) || 'en';
  applyLanguage(current === 'en' ? 'ms' : 'en');
});

// ── Theme (dark default; toggle persists) ────────────────────
const ZED_THEME_KEY = 'zed_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(ZED_THEME_KEY, theme);
  const btn = document.getElementById('themeToggle');
  btn.textContent = theme === 'dark' ? '☀' : '☾';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0c0e0d' : '#faf9f6');
}

applyTheme(localStorage.getItem(ZED_THEME_KEY) || 'dark');

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = localStorage.getItem(ZED_THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ── Nav ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── Scroll reveal ────────────────────────────────────────────
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.1 });

document.querySelectorAll(
  '.demo-card, .service-card, .why-item, .price-card, .redesign-banner, .addon, .step, .faq-item, .section__head'
).forEach(el => { el.classList.add('reveal'); io.observe(el); });
