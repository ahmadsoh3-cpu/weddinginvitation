# 💍 Hannan & Jiya — Wedding Invitation

A luxurious digital wedding invitation built with **Next.js 14**, featuring a dramatic velvet drape reveal animation, floating rose petals, a live countdown, and a fully responsive elegant design.

## ✨ Features

- 🎭 **Velvet drape curtain** opening animation with gold trim & tassels
- 🌸 **Floating rose petals** throughout the page
- ⏳ **Live countdown** to June 5th, 2026
- 🕌 **Event details** for Nikkah & Walima
- 👗 **Dress code** section with colour swatches
- 📩 **RSVP form** with smooth interactions
- 📱 Fully **responsive** (mobile-first)
- ⚡ Google Fonts: *Great Vibes*, *Cormorant Garamond*, *Jost*

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
├── app/
│   ├── layout.js       # Root layout + Google Fonts
│   ├── page.js         # Main invitation page (all sections)
│   └── globals.css     # All styles & animations
├── next.config.mjs
└── package.json
```

## 🎨 Design System

| Token | Value |
|---|---|
| Deep Green | `#1B3A2D` |
| Gold | `#C9A96E` |
| Cream | `#FAF3E8` |
| Burgundy | `#7A1F35` |

## 🛠 Customisation

To update event details, venues, or times, edit the `EventCard` props in `app/page.js`.

## 🌐 Deployment

Push to GitHub, then deploy instantly to [Vercel](https://vercel.com):

```bash
git init
git add .
git commit -m "Initial wedding invitation"
git remote add origin https://github.com/YOUR_USERNAME/hannan-jiya-wedding.git
git push -u origin main
```

Then import the repo at **vercel.com/new** — zero configuration needed.

---

*Made with ❤️ for Hannan & Jiya — 5th June 2026*
