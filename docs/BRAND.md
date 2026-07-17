# Zed Studio — Brand Guide

## Voice
Confident, modern, helpful. Sell outcomes (enquiries, credibility, speed), never technology. Never market as cheapest — premium at launch pricing. English first, Bahasa Malaysia as an equal citizen.

## Design principles
Premium-SaaS bar (Linear/Stripe/Vercel): strong hierarchy, generous whitespace, purposeful animation only. Forbidden: purple/cyan "AI" gradients, gradient text, glassmorphism cards, neon glow spam, generic Tailwind look.

## Color tokens (css/style.css)
| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#0c0e0d` graphite-green | `#faf9f6` warm paper |
| `--surface` | `#141918` | `#ffffff` |
| `--text` | `#f2f1ea` warm off-white | `#14140f` ink |
| `--accent` | `#7ee0af` luminous mint | `#1a3a2f` deep forest |
| `--gold` | `#d4a84a` | `#b98a2f` |

Rules: one glow only (primary CTA hover). Gold is reserved for section numbers and small accents. Contact band and footer stay dark in both themes.

## Typography
- Display: **Space Grotesk** (600/700) — headlines, buttons, prices, logos
- Body: **Inter** (400/500/600)
- Eyebrows: Space Grotesk 600, uppercase, 0.14–0.16em tracking, accent color

## Theming architecture
Tokens on `:root` (dark), overrides on `[data-theme="light"]`. Theme applied pre-paint by an inline `<head>` script reading `localStorage.zed_theme` (default `dark`); toggled by `#themeToggle`. Never hardcode a color in components — always tokens.

## Logo
Wordmark `ZED` + accent `STUDIO` (`.logo`, `em` = accent color). Favicon: mint Z on graphite rounded square (`images/favicon.svg`).
