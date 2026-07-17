# Architectural Decision Records

One entry per significant decision. Newest at the top. Never delete — supersede.

---

## ADR-005 · 2026-07-17 · Vercel for hosting; GitHub for version control only
**Status:** Accepted
**Context:** Founder direction (ZedStudio-System-v2): "Use Vercel for deployment. Keep zed-studio-system private. zed-studio public. GitHub is just for version control." Founder has prior Vercel experience.
**Decision:** Production hosting is Vercel, importing the public `zed-studio` GitHub repo (zero-config static deploy; every push to `main` auto-deploys). GitHub Pages is not used.
**Consequences:** Free preview deployments per branch (useful for demo/client review); custom domain attaches in Vercel; `zed-studio-system` stays private and is never deployed.

## ADR-004 · 2026-07-17 · Roadmap tracked in-repo (docs/ROADMAP.md)
**Status:** Accepted (made permanent 2026-07-17 — founder: "GitHub is just for version control", so GitHub Issues are not required)
**Context:** Originally a workaround for missing `gh` CLI; founder direction then made in-repo tracking the intended system.
**Decision:** `docs/ROADMAP.md` is the single source of truth for epics/milestones/issues.
**Consequences:** No issue numbers; work items referenced as A1/B2/etc. PR references use branch names.

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
