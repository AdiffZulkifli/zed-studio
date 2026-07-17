# Architectural Decision Records

One entry per significant decision. Newest at the top. Never delete — supersede.

---

## ADR-008 · 2026-07-17 · Lead capture: no-login wizard + insert-only table + WhatsApp handoff
**Status:** Accepted
**Context:** Founder wants prospects to describe their project (industry, stage, features, contact) so he can quote fast and reuse the brief as a Claude Code prompt. ChatGPT suggested Google sign-in; requiring any login before an enquiry adds friction and OAuth setup cost for marginal benefit (auto-filled name/email).
**Decision:** `/start.html` is a 5-step no-login wizard (industry → stage → current website → features → details + name/email/phone). On completion it (a) inserts the lead into `zs_leads`, (b) computes a recommended package from stage/features (booking/rewards/accounts or multi-branch ⇒ Custom; redesign ⇒ Redesign; starting ⇒ Landing; else Business), (c) stores a generated English build-brief (`brief_prompt`) for direct reuse in Claude Code, and (d) offers a wa.me handoff with the summary pre-filled. `zs_leads` is **insert-only for anon** — no read/update/delete policies, so leads are private; founder reads them in the Supabase dashboard.
**Consequences:** Zero-friction enquiries with double delivery (DB + WhatsApp). Google sign-in deferred to a future client portal. Wizard options are data-driven arrays in `js/wizard.js`; industry list covers all industries even where no demo exists yet.
**Alternatives considered:** Google OAuth gate (rejected: friction, founder setup); email notification service (deferred: wa.me handoff + dashboard suffice at this volume).

## ADR-007 · 2026-07-17 · Public demo admins with nightly data reset
**Status:** Accepted
**Context:** Letting prospects use the demo admin panels is our strongest sales proof, but public write access means demo data will eventually be vandalised or broken.
**Decision:** Demo login forms ship pre-filled with demo credentials (one click + Sign in). Known-good data is snapshotted in the `demo_seed` schema; `public.reset_demo_data()` (SECURITY DEFINER, EXECUTE revoked from anon/authenticated so it is not callable via REST) restores all demo tables and wipes visitor-generated customer data. A pg_cron job runs it nightly at 03:00 MYT.
**Consequences:** Prospects can safely edit anything; damage self-heals within 24h. When demo content is deliberately improved, the snapshot must be refreshed (re-run the snapshot migration) or the change reverts at night — documented in DEMO-PLAYBOOK.md.
**Alternatives considered:** Read-only demo admins (rejected — kills the "feel it work" moment); per-visitor sandboxed data (rejected — complexity unjustified at this stage).

## ADR-006 · 2026-07-17 · Dark-first dual theming via CSS custom properties
**Status:** Accepted
**Context:** Founder wants a futuristic dark default with a light option, explicitly avoiding "AI slop" aesthetics.
**Decision:** All colors are tokens on `:root` (dark values); `[data-theme="light"]` overrides restore the original editorial light theme. An inline head script applies the stored theme (`localStorage.zed_theme`, default `dark`) before first paint to avoid flash. Brand identity is preserved across themes (warm off-white, green accent, gold); banned styles documented in BRAND.md (no purple/cyan gradients, no gradient text, no glassmorphism, single CTA glow only).
**Consequences:** New components must use tokens exclusively; hardcoded colors are a review-blocker. Adding future themes = one more attribute block.
**Alternatives considered:** `prefers-color-scheme` as default source (rejected — founder wants dark default regardless of OS); separate stylesheets per theme (rejected — drift risk).

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
