# Changelog

All notable changes to Zed Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

_Nothing yet._

## [0.2.0] — 2026-07-17

### Added
- Dark-first dual theming (ADR-006): dark default, light theme preserved,
  pre-paint theme application, persisted `☀/☾` toggle in nav
- SVG favicon (mint Z on graphite)
- "First 10 clients" launch-offer wording in pricing (EN + BM)
- `prefers-reduced-motion` support and `:focus-visible` styles
- Docs: BRAND.md, COMPONENTS.md, DEMO-PLAYBOOK.md, CLIENT-DELIVERY.md
- CTO operating agreement in CLAUDE.md; docs infrastructure (CHANGELOG,
  DECISIONS ADR-001..006, ROADMAP)
- Production deployment: https://zed-studio-theta.vercel.app (Vercel
  auto-deploys `main`; ADR-005)

### Changed
- Real WhatsApp number (+60 11-6329 3004) across the site and all 19 demo
  ribbons; demo businesses' fictional numbers intentionally unchanged

## [0.1.0] — 2026-07-17

### Added
- Zed Studio marketing site: bilingual (EN/BM) single page with launch pricing,
  services, industry demos, process, FAQ and WhatsApp CTAs
- i18n system: `js/translations.js` dictionaries + `data-i18n` attributes,
  persistent language toggle
- Three industry demos under `demos/` (Lorong Coffee — café; Brek Laju — fast
  food; MedicMesir — education agency), each a full working site backed by
  Supabase with its own admin panel
- Zed Studio demo ribbon on all public demo pages
- CLAUDE.md master context, README
