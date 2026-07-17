# Component Reference (marketing site)

All components live in `css/style.css`, themed via tokens (see BRAND.md). Reuse these — never re-invent a card or button per section.

| Component | Classes | Notes |
|---|---|---|
| Buttons | `.btn` + `--primary` / `--outline` / `--nav` / `--full` / `--light` / `--outline-light` | Primary = accent bg; light variants only on dark bands (contact) |
| Nav | `.nav` (+`.scrolled`), `.nav__links`, `.nav__burger` | Fixed; blur bg after 40px scroll; burger < 680px |
| Toggles | `.lang-toggle` (`#langToggle`), `.theme-toggle` (`#themeToggle`) | Pill buttons; state persisted in `localStorage` (`zed_lang`, `zed_theme`) |
| Hero | `.hero`, `.hero__title/sub/cta/points` | `::before` = faint technical grid, masked radially |
| Section head | `.section__head` + `.section__num` | Gold numbered chip + h2 + optional sub |
| Demo card | `.demo-card` + `__shot/__ribbon/__industry/__body/__link` | 16:10 screenshot, hover lift + zoom |
| Service card | `.service-card` (+`--main` top border) | 2-col grid |
| Why item | `.why-item` | Borderless; gold em-dash before h3 |
| Price card | `.price-card` (+`--featured`, `__badge/__for/__price`) | Featured = accent border, first on mobile |
| Redesign banner | `.redesign-banner` | Full-width deep-green band inside pricing |
| Add-on row | `.addons` > `.addon` | Name + price pairs |
| Process step | `.step` + `.step__num` | Numbered circle, top-rule |
| FAQ | `.faq-item` (native `<details>`) | +/– indicator, no JS |
| Reveal | `.reveal` → `.in` | Added by `js/main.js` IntersectionObserver; disabled under `prefers-reduced-motion` |

## i18n contract
Every user-visible string: `data-i18n="key"` on the element + the key in **both** `en` and `ms` dictionaries in `js/translations.js`. `applyLanguage()` swaps `innerHTML`. Adding a language = one new dictionary; components never change.
