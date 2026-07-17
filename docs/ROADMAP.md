# Zed Studio Roadmap

Source of truth for planned work (see ADR-004). Hierarchy: **Epic → Milestone → Issue**.
Status: `todo` · `blocked` · `in-progress` · `done`.

---

## Epic A — Launch Readiness
> Goal: the site is live on a public URL with real contact details. Nothing else matters until strangers can find and contact us.

### Milestone M1 — Go live (target: this week)
| # | Issue | Status | Notes |
|---|---|---|---|
| A1 | Replace placeholder WhatsApp number | **done** | +60 11-6329 3004 live everywhere (2026-07-17). Business email still adiffhaizal1@gmail.com |
| A2 | Deploy to Vercel | **done** | Live: https://zed-studio-theta.vercel.app (2026-07-17); pushes to `main` auto-deploy |
| A7 | Surface "first 10 businesses get launch pricing" offer on site | **done** | Pricing section copy, EN + BM (2026-07-17) |
| A8 | Dark-first redesign + theme toggle | **done** | ADR-006; dark default, light preserved, persisted toggle (2026-07-17) |
| A3 | Favicon + OG share image + meta polish | **in-progress** | Favicon done (mint Z SVG); OG image still the lorong-coffee screenshot — needs a branded card |
| A4 | SEO baseline: `sitemap.xml`, `robots.txt`, JSON-LD (ProfessionalService) | todo | |
| A5 | Accessibility pass: landmarks, focus states, contrast, reduced-motion | todo | Bar: WCAG 2.1 AA on the marketing site |
| A6 | Performance pass: self-host/optimise fonts, image compression, Lighthouse ≥ 95 | todo | Site must prove the "loads in under a second" claim |

## Epic B — Demo Portfolio Expansion
> Goal: demos cover the highest-value Malaysian SME industries. Each demo is a production-quality bespoke site (see CLAUDE.md demo rules).

### Milestone M2 — Two new industry demos
| # | Issue | Status | Notes |
|---|---|---|---|
| B1 | Industry research: pick next 2 industries by enquiry potential | todo | Candidates: clinic/dental, property agent, gym, salon, workshop, tuition centre |
| B2 | Demo #4 (design proposal → build) | todo | Proposal needs founder approval before build |
| B3 | Demo #5 (design proposal → build) | todo | |
| B4 | Refactor: extract shared demo-ribbon injector to one script | todo | Currently duplicated inline in 19 files — tech debt |

## Epic C — i18n at Scale
> Goal: add zh/ar/ja/fr without touching components (per operating agreement).

### Milestone M3 — i18n hardening
| # | Issue | Status | Notes |
|---|---|---|---|
| C1 | RTL readiness: logical CSS properties audit + `dir` switching | todo | Prerequisite for Arabic |
| C2 | Split translations per language file, lazy-load | todo | Only when dictionary size hurts; not before |
| C3 | Decide SEO strategy for non-EN content (client-side swap vs static pages) | todo | See ADR-002 trade-off |

## Epic D — Conversion & Trust
> Goal: turn visitors into WhatsApp enquiries at a measurably higher rate.

### Milestone M4 — Trust signals
| # | Issue | Status | Notes |
|---|---|---|---|
| D4 | One-click demo admin trial + nightly data reset | **done** | ADR-007 (2026-07-17); pg_cron schedule = founder one-liner in README |
| D5 | Project Wizard lead capture (`start.html`) + `zs_leads` | **done** | ADR-008 (2026-07-17); pricing CTAs + demo ribbons feed it |
| D1 | Testimonials / case-study section (needs first real clients) | blocked | Business input required |
| D2 | Simple analytics (privacy-friendly, e.g. GoatCounter/Plausible) | todo | Can't optimise conversion without measurement |
| D3 | WhatsApp link tracking (per-package UTM-style params) | todo | Partially covered by wizard `package_hint` |
| D6 | Netflix-style industry demo grid with categories/search | todo | Becomes worthwhile at ~6+ demos; until then the wizard's industry picker covers all industries (founder vision, 2026-07-17) |
| D7 | Google sign-in client portal | todo | Deferred by ADR-008; needs founder's Google Cloud OAuth credentials |
| D8 | Industry-specific demo features (booking for barber/clinic, rewards for F&B) | todo | Feeds M2 demo proposals |

## Epic E — Operations
> Goal: repeatable delivery process for real client projects.

### Milestone M5 — Client delivery kit
| # | Issue | Status | Notes |
|---|---|---|---|
| E1 | Proposal/quote template | todo | |
| E2 | Client project checklist (domain, DNS, RLS hardening, handover) | todo | Supabase RLS must be per-client locked, unlike demos |
| E3 | Care Plan runbook (what Essential/Pro actually include monthly) | todo | Defines the recurring-revenue product |

---

## Recommended implementation order
**A1 → A2** (unblock go-live, founder actions) → **A3–A6** (launch polish, no approval needed) → **D2** (measure from day one) → **B1** proposal → **B2/B3** builds → **C1** → rest by demand.

Rationale: a live, findable, measurable site beats more demos; demos beat deep i18n; i18n beats ops tooling until real clients arrive.
