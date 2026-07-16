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

Each demo is a complete working website backed by Supabase — public site plus admin panel (all passwords `123123`):

| Demo | Industry | Admin |
|---|---|---|
| `demos/lorong-coffee` | Café & F&B | `pages/admin/login.html` — admin@lorongcoffee.com |
| `demos/brek-laju` | Fast food | `admin/index.html` — password only |
| `demos/medicmesir` | Education agency | `admin/login.html` — admin |

## Before real launch

1. Replace the placeholder WhatsApp number `60123456789` (search the repo — it appears in `index.html` and the demo ribbons).
2. Decide the business email (currently adiffhaizal1@gmail.com).
3. Enable GitHub Pages (Settings → Pages → Deploy from branch → main) for a free live URL.
