# Architectural Decision Records

One entry per significant decision. Newest at the top. Never delete — supersede.

---

## ADR-004 · 2026-07-17 · Roadmap tracked in-repo until GitHub CLI is available
**Status:** Accepted (temporary)
**Context:** The operating agreement requires GitHub Issues, but no `gh` CLI or API token is available in the dev environment yet.
**Decision:** `docs/ROADMAP.md` is the single source of truth for epics/milestones/issues. When `gh` is installed and authenticated, migrate each backlog item to a real GitHub Issue and keep ROADMAP.md as the high-level view only.
**Consequences:** No issue numbers/links yet; PR references use branch names until migration.

## ADR-003 · 2026-07-17 · Demos are vendored copies inside this repo
**Status:** Accepted
**Context:** The three demos originated in `Downloads/.../Portfolio` (pre-rebrand). The marketing site needs stable, deployable demo links.
**Decision:** Demos are copied into `demos/` and this repo is now their canonical home. The Portfolio originals are frozen as backup. Demo improvements happen here.
**Consequences:** One deployable unit (site + demos) on GitHub Pages; the old Portfolio copies will drift and must not be edited.

## ADR-002 · 2026-07-17 · i18n via key/value dictionaries + `data-i18n` attributes
**Status:** Accepted
**Context:** Bilingual EN/BM required now; zh/ar/ja/fr later without component changes. Site is static HTML (no build step).
**Decision:** All copy lives in `js/translations.js` as flat key/value dictionaries per language. Elements declare `data-i18n="key"`; `applyLanguage()` swaps content and sets `<html lang>`. Language persisted in `localStorage` (`zed_lang`).
**Consequences:** Adding a language = adding one dictionary. Arabic will additionally need `dir="rtl"` handling and logical CSS properties — tracked in the roadmap (M3), no component rewrites expected. Trade-off: content swaps client-side, so search engines index the default English; acceptable now, revisit if BM SEO becomes a priority (would move to per-language static pages).

## ADR-001 · 2026-07-17 · Static hand-coded site + Supabase, no framework/build step
**Status:** Accepted
**Context:** Zed Studio sells hand-coded, fast, bespoke sites. The stack should demonstrate the product promise and stay maintainable by a small team.
**Decision:** Plain HTML/CSS/JS, no build pipeline, deployed on GitHub Pages. Dynamic demo data via Supabase (PostgreSQL + REST), table prefixes per project (`lc_`, `bl_`, `mm_`).
**Consequences:** Zero build complexity, sub-second loads, free hosting. Trade-offs: no component compilation (reuse is by convention — see coding standards in CLAUDE.md), and Supabase anon keys with open RLS policies are acceptable for demos only — client production work needs proper RLS per project.
