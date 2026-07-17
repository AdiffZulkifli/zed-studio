# Zed Studio

Premium websites for Malaysian businesses — bespoke design, bilingual (English/Bahasa Malaysia), hand-coded, with real admin dashboards.

**Live structure**

```
index.html          Marketing site (EN/BM toggle, launch pricing, FAQ, WhatsApp CTAs)
css/style.css       Editorial light theme — Space Grotesk + Inter, forest green + gold
js/translations.js  All site copy in EN + BM (data-driven i18n)
js/main.js          Language toggle, nav, scroll reveal
images/             Demo screenshots
demos/              Three full working industry demos (café, fast food, education agency)
```

## Run locally

```
npx http-server . -p 8140
```

Open http://localhost:8140/

## Demos

Each demo is a complete working website backed by Supabase — public site plus admin panel (all passwords `123123`, login forms pre-filled). Demo data auto-resets nightly from `demo_seed` snapshots via `reset_demo_data()`.

**One-time setup still needed (run in Supabase SQL Editor):**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('reset-demo-data-daily', '0 19 * * *', 'SELECT public.reset_demo_data()');
```


| Demo | Industry | Admin |
|---|---|---|
| `demos/lorong-coffee` | Café & F&B | `pages/admin/login.html` — admin@lorongcoffee.com |
| `demos/brek-laju` | Fast food | `admin/index.html` — password only |
| `demos/medicmesir` | Education agency | `admin/login.html` — admin |

## Deployment

Hosted on **Vercel** (static, zero config): vercel.com → Add New… → Project → Import `AdiffZulkifli/zed-studio` → Deploy. Every push to `main` auto-deploys; branches get preview URLs.

Remaining launch items are tracked in [docs/ROADMAP.md](docs/ROADMAP.md).
