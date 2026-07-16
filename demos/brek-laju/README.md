# 🍗 Brek Laju — Website

Laman web rasmi Brek Laju, jenama ayam goreng 100% Malaysia.

## 📁 Struktur Folder

```
brek-laju/
├── index.html          → Halaman Utama
├── pages/
│   ├── menu.html       → Halaman Menu
│   ├── about.html      → Tentang Kami
│   ├── outlets.html    → Cawangan
│   └── contact.html    → Hubungi Kami
├── css/
│   ├── style.css       → CSS Utama (global)
│   ├── menu.css        → CSS halaman Menu
│   ├── about.css       → CSS halaman About
│   ├── outlets.css     → CSS halaman Outlets
│   └── contact.css     → CSS halaman Contact
├── js/
│   ├── main.js         → JS Utama (navbar, scroll, animations)
│   └── menu.js         → JS Filter Menu
└── README.md
```

## 🚀 Cara Run

### Method 1: VS Code Live Server (Recommended)
1. Install extension **Live Server** dalam VS Code
2. Klik kanan pada `index.html`
3. Pilih **"Open with Live Server"**
4. Browser akan buka secara automatik

### Method 2: Direct Open
1. Buka folder `brek-laju`
2. Double-click `index.html`
3. Laman web akan buka dalam browser

### Method 3: Python HTTP Server
```bash
cd brek-laju
python -m http.server 8000
# Buka: http://localhost:8000
```

### Method 4: Node.js (npx serve)
```bash
cd brek-laju
npx serve .
# Buka URL yang diberikan
```

## 🎨 Tentang Design

- **Fonts**: Bebas Neue (heading) + Nunito (body) — dari Google Fonts
- **Warna**: Merah #E8192C, Kuning #FFD32A, Coklat Gelap #1A0A00
- **Images**: Dari Unsplash (percuma untuk digunakan)
- **Responsive**: Mobile-friendly dengan hamburger menu

## 📄 Halaman-Halaman

| Halaman | Penerangan |
|---------|-----------|
| `index.html` | Hero, kenapa pilih kami, menu highlight, cerita, testimonial, CTA |
| `menu.html` | Grid menu penuh dengan filter kategori & toast notification |
| `about.html` | Kisah syarikat, nilai teras, timeline, pasukan kepimpinan |
| `outlets.html` | Senarai cawangan dengan filter negeri |
| `contact.html` | Form hubungi, maklumat syarikat, social links |

## ✏️ Cara Customize

- Tukar nama/harga menu dalam `pages/menu.html`
- Tukar maklumat cawangan dalam `pages/outlets.html`
- Tukar warna dalam `:root` di `css/style.css`
- Ganti gambar dengan URL Unsplash baru atau gambar sendiri

---

Dibina dengan ❤️ untuk portfolio web freelance.
