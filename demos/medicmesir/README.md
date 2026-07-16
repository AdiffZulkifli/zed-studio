# MedicMesir — Website Redesign

A complete, production-grade redesign of the MedicMesir medical education website.
Built as a portfolio piece demonstrating professional web design for a Malaysian medical education organisation.

---

## 📁 Project Structure

```
medicmesir/
├── index.html              ← Homepage
├── css/
│   └── styles.css          ← Full design system & all styles
├── js/
│   └── main.js             ← Animations, scroll effects, interactions
├── images/                 ← Drop your images here (see guide below)
│   ├── hero-doctor.jpg
│   ├── about-main.jpg
│   └── about-students.jpg
└── pages/
    ├── about.html          ← About Us page
    ├── programmes.html     ← Programmes page (MBBS, BDS, Pharmacy)
    ├── universities.html   ← Partner Universities page
    ├── news.html           ← News & Blog page
    └── contact.html        ← Contact page with form
```

---

## 🚀 How to Run

### Option 1: VS Code Live Server (Recommended)
1. Open the `medicmesir/` folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Your browser will open at `http://127.0.0.1:5500`

### Option 2: Python (no install needed)
```bash
cd medicmesir
python3 -m http.server 8080
```
Then open: `http://localhost:8080`

### Option 3: Node.js (npx)
```bash
cd medicmesir
npx serve .
```

---

## 🖼️ Images Guide

The site uses emoji placeholders that look great, but adding real photos makes it shine.

**Recommended free image sources:**
- [Unsplash](https://unsplash.com) — search "doctor", "medical student", "hospital"
- [Pexels](https://pexels.com) — search "Malaysia doctor", "medical school"

**Where to put images:**
- `images/hero-doctor.jpg` — Doctor or student photo (hero background, ~1200×800)
- `images/about-main.jpg` — Office or team photo (tall/portrait, ~600×750)
- `images/about-students.jpg` — Students studying (square, ~400×400)

Once downloaded, the images will appear automatically on the homepage.

---

## 🎨 Design System

**Colour Palette:**
- Navy: `#0D1B2A` (primary dark)
- Gold: `#C9963A` (accent)
- Ivory: `#F8F4EE` (background)

**Fonts (loaded from Google Fonts):**
- Display: Cormorant Garamond (headings)
- Body: DM Sans (paragraphs, UI)

**Pages:**
| Page | Description |
|------|-------------|
| `index.html` | Hero, About preview, Programmes, Process, Stats, Testimonials, News, CTA |
| `about.html` | Mission, Values, Timeline, Team |
| `programmes.html` | MBBS, BDS, Pharmacy with details + FAQ |
| `universities.html` | Partner universities by country with tabs |
| `news.html` | Articles grid + sidebar with categories |
| `contact.html` | Contact form + office info + branch locations |

---

## ✨ Features

- Fully responsive (mobile, tablet, desktop)
- Smooth scroll animations (Intersection Observer)
- Animated stat counters
- Sticky navbar with scroll effect
- Mobile hamburger menu
- Parallax hero background
- Interactive FAQ accordion
- Newsletter signup
- Country filter tabs on Universities page
- Card tilt effect on hover
- CSS-only marquee strip
- Form validation with toast notifications

---

## 📝 Customisation

**To change colours:** Edit the CSS variables at the top of `css/styles.css`

**To add a new page:** Copy any existing page in `/pages/`, update the navbar links.

**To change contact info:** Search for the phone/address in all HTML files and replace.

---

Built with ❤️ as a freelance portfolio project.
