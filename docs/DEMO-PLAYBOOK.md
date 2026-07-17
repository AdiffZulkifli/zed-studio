# Industry Demo Playbook

The repeatable recipe for adding a demo. A demo is a **production-ready website for a fictional but realistic Malaysian business** — never a recoloured clone of an existing demo.

## 1. Concept (needs founder approval — design proposal per CLAUDE.md)
- Industry chosen from roadmap research (enquiry potential, ticket size, WhatsApp-native buying behaviour)
- Invent the business: name, location, story, realistic Malaysian content (BM where natural)
- Define what makes this demo's identity unique: typography pairing, palette, spacing rhythm, photography direction, iconography, animation personality — all EIGHT uniqueness rules in CLAUDE.md

## 2. Build
- Folder: `demos/<slug>/` with `index.html`, `css/`, `js/`, `pages/`
- Required pages/sections: Hero, About, Services/Menu, Gallery, FAQ, Contact + WhatsApp CTA
- Data-driven: content loads from Supabase, table prefix = initials (e.g. Lorong Coffee → `lc_`). Single-request RPC (`<prefix>_get_all()`) + sync-cache data layer (copy the pattern in `demos/brek-laju/js/db.js`)
- Admin panel with password `123123` (demo standard), RLS public policies (demos only!)
- Demo ribbon: add the `zed-demo-ribbon` snippet (see any public demo page, before `</body>`) to every public page — never on admin pages. Ribbon links to `wa.me/601163293004`

## 3. Wire into the marketing site
- Screenshot: 1440×900 homepage capture → `images/<slug>.png` (compress!)
  `npx playwright screenshot --browser chromium --channel chrome --viewport-size "1440,900" --wait-for-timeout 7000 <url> images/<slug>.png`
- Add demo card in `index.html` #demos + `demos.dN.*` keys in BOTH dictionaries in `js/translations.js`

## 4. Ship
- Verify: pages render from Supabase, admin login works, ribbon on public pages only, no console errors
- Update: CHANGELOG, ROADMAP, this file if the recipe changed
- Conventional commit: `feat(demo): add <industry> demo — <business name>`

## Existing demos
| Slug | Industry | Prefix | Identity |
|---|---|---|---|
| lorong-coffee | Café & F&B | `lc_` | Forest green/yellow, serif display, Sarawak story |
| brek-laju | Fast food | `bl_` | Loud red/yellow on dark, BM-first copy |
| medicmesir | Education agency | `mm_` | Navy/gold corporate, serif elegance |
