# Changelog

All notable changes to Zed Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- CTO operating agreement in CLAUDE.md; documentation infrastructure (CHANGELOG, docs/DECISIONS, docs/ROADMAP)
- ADR-005: Vercel hosting; GitHub as version control only (ADR-004 made permanent)

### Changed
- Real WhatsApp number (+60 11-6329 3004) across the site and all 19 demo ribbons (roadmap A1 — done)

### Fixed
- Demo businesses' own fictional phone numbers intentionally left unchanged (they are demo content)

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

### Known placeholders
- WhatsApp number `60123456789` (site + demo ribbons)
- Contact email adiffhaizal1@gmail.com pending business email decision
