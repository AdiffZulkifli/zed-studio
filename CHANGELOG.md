# Changelog

All notable changes to Zed Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- `sales/Zed-Studio-Handbook.pdf`: A–Z owner's manual for a first-time
  founder — finding customers, full BM scripts, objection answers, agreement
  explained clause by clause, client workflow, time budgets, payment scripts
  + invoice template, Care Plan definitions and delivery runbook, cheat sheet

### Changed
- Copy correction: "hand-coded" removed everywhere (EN "fully custom /
  custom-built", BM "dibina khas") — site, README, pitch, ADR-001
- Domain & DNS pricing clarified everywhere: RM 150 is the setup service;
  the domain itself is billed at its actual yearly price (RM 50–120 typical)
- Pitch and Agreement PDFs regenerated with both corrections
- Sales kit: `sales/Zed-Studio-Pitch.pdf` (4-page branded pitch incl. market
  pricing comparison and the TikTok-vs-website argument),
  `sales/Zed-Studio-Agreement.pdf` (1-page client agreement, 50/50 payment,
  3 revisions, 14-day fix window), both generated from HTML sources in `sales/`
- `docs/SALES-PLAYBOOK.md`: prospecting channels, BM sales scripts, objection
  handling, market-pricing sources

## [0.4.0] — 2026-07-17

### Added
- Project Wizard (`start.html`, ADR-008): bilingual 5-step enquiry — industry
  (12 options incl. industries without demos yet), business stage, current
  website, features, details + contact (name/email/phone). Auto-recommends a
  package, saves to private `zs_leads` (insert-only), generates an internal
  Claude-Code-ready brief, and offers WhatsApp handoff with summary pre-filled
- "Start your project →" CTA under the demo grid

### Changed
- Pricing card CTAs and redesign banner now open the wizard with the package
  pre-selected (was: raw WhatsApp links)
- Demo ribbons now read "customise this website for your business" and open
  the wizard with the demo's industry pre-selected

## [0.3.0] — 2026-07-17

### Added
- "Try the admin →" link + pre-filled login note on every demo card (EN + BM)
- Demo login forms pre-filled with demo credentials — one click to sign in
- `demo_seed` snapshot schema + `reset_demo_data()` function (ADR-007);
  nightly pg_cron schedule pending founder run (see README)
- Demo-section note inviting visitors to edit freely (data resets nightly)

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
