# ☕ Lorong Coffee — Website

A fully designed, multi-page coffee brand website for **Lorong Coffee**, 
a specialty coffee brand from Bintulu, Sarawak, Malaysia.

---

## 📁 Project Structure

```
lorong-coffee/
├── index.html              ← Homepage
├── css/
│   └── style.css           ← All styles (single unified stylesheet)
├── js/
│   └── main.js             ← Interactions, animations, scroll effects
├── images/
│   ├── logo.jpg            ← Lorong Coffee logo
│   └── store.png           ← Store/product photo
└── pages/
    ├── menu.html           ← Full menu page
    ├── about.html          ← About Us page
    ├── rewards.html        ← Loyalty rewards page
    ├── stores.html         ← Find a Store page
    ├── careers.html        ← Careers / Jobs page
    └── contact.html        ← Contact Us page
```

---

## 🚀 How to Run

### Option 1: Open directly in browser
Just double-click `index.html` — no server needed for basic viewing.

### Option 2: Use VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Your site will open at `http://127.0.0.1:5500`

### Option 3: Python local server
```bash
cd lorong-coffee
python -m http.server 3000
# Then visit http://localhost:3000
```

### Option 4: Node.js (npx serve)
```bash
cd lorong-coffee
npx serve .
```

---

## 🎨 Brand Colors

| Color         | Hex       | Usage                        |
|---------------|-----------|------------------------------|
| Lorong Yellow | `#F5C800` | CTA buttons, highlights      |
| Deep Green    | `#1B4332` | Navbar, backgrounds, primary |
| Mid Green     | `#2D6A4F` | Accents                      |
| Cream         | `#FFF8E7` | Page backgrounds             |
| Cream Dark    | `#F0E6CC` | Cards, subtle sections       |

---

## 📄 Pages

| Page           | File                    | Description                        |
|----------------|-------------------------|------------------------------------|
| Home           | `index.html`            | Hero, features, menu preview, CTA  |
| Menu           | `pages/menu.html`       | Full menu with category filters    |
| About          | `pages/about.html`      | Story, values, team                |
| Rewards        | `pages/rewards.html`    | Loyalty tier system                |
| Find a Store   | `pages/stores.html`     | All outlet listings                |
| Careers        | `pages/careers.html`    | Job listings, perks                |
| Contact        | `pages/contact.html`    | Contact form + info                |

---

## ✨ Features

- Fully responsive (mobile, tablet, desktop)
- Sticky navbar with scroll effect
- Hamburger menu for mobile
- Scroll-reveal animations
- Menu tab filtering (All / Coffee / Cold Brew / Non-Coffee / Seasonal)
- Animated counters (cups served, loyalty points)
- Scrolling ticker banner
- Loyalty rewards progress bar
- Contact form with submit feedback
- Store locator cards
- Job listings with apply buttons

---

## 🛠 Tech Stack

- **Pure HTML5, CSS3, Vanilla JavaScript** — no frameworks, no dependencies
- Google Fonts: Playfair Display, DM Sans, Space Mono
- CSS Custom Properties (variables) throughout
- IntersectionObserver for scroll animations

---

*Built as a freelance portfolio project showcasing a full coffee brand website redesign.*
