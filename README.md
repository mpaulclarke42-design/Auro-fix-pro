# 🔧 Auto Fix PRO

**Professional repair guides for Gas, Electric, Diesel & Hybrid vehicles**

Live: [https://auro-fix-pro.vercel.app](https://auro-fix-pro.vercel.app)

---

## 🚀 Features

- **7 Repair Guides** covering Gas, EV, Diesel, and Hybrid vehicles
- **DIY Savings Calculator** — shows how much users save vs. shop labor
- **Paywall System** — free tier (2 guides preview), Pro at $9.99/month
- **Step-by-step instructions** with safety warnings
- **Responsive mobile-first design**
- **PWA** — installable as an app, works offline via service worker
- **Color-coded vehicle types** with emoji icons

---

## 📁 Project Structure

```
├── index.html        # Main application shell
├── app.js            # Application logic (guides data + UI)
├── styles.css        # All styling
├── sw.js             # Service worker for offline/caching
├── manifest.json     # PWA configuration
├── README.md         # This file
└── assets/           # App icons (add icon-192x192.png, icon-512x512.png)
```

---

## 🛠️ Setup & Deployment

### 1. Add App Icons

Place PNG icons in the `assets/` folder:

- `assets/icon-192x192.png` — required for Android / Chrome
- `assets/icon-512x512.png` — required for splash screens

### 2. Configure Stripe Payments

In `app.js`, update the `subscribe()` function:

```js
const stripeLink = 'https://buy.stripe.com/YOUR_LINK_HERE';
```

Replace `YOUR_LINK_HERE` with your Stripe Payment Link URL from the Stripe Dashboard.

### 3. Deploy

This is a static site — deploy to any host:

| Platform | Command / Steps |
|----------|----------------|
| **Vercel** | `vercel --prod` or connect GitHub repo |
| **Netlify** | Drag & drop folder or `netlify deploy --prod` |
| **GitHub Pages** | Enable in repo Settings → Pages |
| **Firebase** | `firebase deploy` |

---

## 💰 Monetization

| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | First 2 guide views |
| Pro  | $9.99/mo | Unlimited guides, offline, savings calculator |

To increase free tier limit, change `MAX_FREE_VIEWS` in `app.js`:

```js
const MAX_FREE_VIEWS = 5; // production default
```

---

## 📱 PWA Installation

Users can install the app to their home screen:

- **Android/Chrome**: "Add to Home Screen" prompt appears automatically
- **iOS/Safari**: Share → "Add to Home Screen"
- **Desktop**: Install icon in the address bar

---

## 🔒 Security & Safety

- High-voltage warnings are shown for all EV and Hybrid guides
- Users are referred to professionals for complex or dangerous repairs
- No user data is stored server-side in the current version

---

## 🎨 Brand Colors

| Usage | Hex |
|-------|-----|
| Primary (orange) | `#ff6b35` |
| EV (green) | `#00ff88` |
| Diesel (gold) | `#ffd700` |
| Hybrid (magenta) | `#ff00ff` |
| Background | `#1a1a2e` |

---

## 📞 Support

- Email: support@autofixpro.com
