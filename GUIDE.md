# GadgetZone — Complete Deployment Guide
## GitHub Pages + Supabase + SSLCommerz

---

## 📁 Project File Structure

```
gadgetzone/
├── index.html              ← Main landing page
├── css/
│   └── style.css           ← All styles
├── js/
│   ├── config.js           ← YOUR KEYS GO HERE
│   ├── products.js         ← Product list + rendering
│   ├── cart.js             ← Cart logic
│   ├── checkout.js         ← Order + payment logic
│   └── main.js             ← Init
├── supabase_setup.sql      ← Run this in Supabase once
└── GUIDE.md                ← This file
```

---

## STEP 1 — Set Up Supabase (Free Database)

1. Go to **https://supabase.com** → Sign up free
2. Click **"New Project"**
   - Project name: `gadgetzone`
   - Database password: (set a strong one, save it)
   - Region: Singapore (closest to Bangladesh)
3. Wait ~2 minutes for project to create
4. Go to **SQL Editor** (left sidebar) → **New Query**
5. Open the file `supabase_setup.sql`, copy everything, paste it and click **Run**
6. You'll see a success message ✅

### Get your Supabase keys:
1. Go to **Settings** (gear icon, left sidebar) → **API**
2. Copy:
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **anon public** key → long string starting with `eyJ...`

---

## STEP 2 — Set Up SSLCommerz (Free Sandbox)

1. Go to **https://developer.sslcommerz.com/registration/**
2. Register for a free sandbox account
3. After login, go to your dashboard
4. You'll see your **Store ID** and **Store Password**
5. Keep `SSLCOMMERZ_SANDBOX: true` for testing
6. When you go live, set `SSLCOMMERZ_SANDBOX: false` and use live credentials

---

## STEP 3 — Fill in Your Keys

Open `js/config.js` and replace the placeholder values:

```javascript
SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',   // ← Your Supabase URL
SUPABASE_ANON_KEY: 'eyJ...',                         // ← Your anon key
SSLCOMMERZ_STORE_ID: 'testXXXXXX',                  // ← From SSLCommerz
SSLCOMMERZ_STORE_PASSWORD: 'testXXXXXXpass',        // ← From SSLCommerz
SSLCOMMERZ_SANDBOX: true,                            // ← true for testing
CONTACT_PHONE: '01712345678',                        // ← Your phone
CONTACT_EMAIL: 'your@email.com',                     // ← Your email
```

---

## STEP 4 — Deploy to GitHub Pages

### First time:

1. Go to **https://github.com** → Sign in (or sign up free)
2. Click **"+"** → **New Repository**
   - Repository name: `gadgetzone` (or any name)
   - Set to **Public**
   - Click **Create Repository**

3. Upload your files:
   - Click **"uploading an existing file"** link
   - Drag and drop ALL your project files (keep the folder structure)
   - Commit message: `Initial deploy`
   - Click **Commit changes**

4. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages** (left sidebar)
   - Source: **Deploy from a branch**
   - Branch: **main** → **/ (root)**
   - Click **Save**

5. Wait 2-3 minutes, then your site is live at:
   **`https://YOUR_GITHUB_USERNAME.github.io/gadgetzone`**

### To update later:
Just edit files and commit again — GitHub Pages auto-updates.

---

## STEP 5 — Test Everything

### Test Cart:
- [ ] Add products to cart
- [ ] Change quantity (+ and −)
- [ ] Remove items
- [ ] Cart count updates in nav

### Test Checkout COD:
- [ ] Fill in name, phone, address
- [ ] Select "Cash on Delivery"
- [ ] Click Place Order
- [ ] See success screen with order ID
- [ ] Check Supabase → Table Editor → orders (order should appear!)

### Test bKash:
- [ ] Select bKash/Nagad
- [ ] Enter a phone number and fake TXN ID
- [ ] Place order — check Supabase

### Test SSLCommerz:
- [ ] Select Card/Online
- [ ] Place order → you'll be redirected to SSLCommerz sandbox page
- [ ] Use test card: `4111 1111 1111 1111`, expiry `12/25`, CVV `123`
- [ ] Complete payment → redirected back to your site

---

## 📦 Viewing Your Orders

1. Go to **Supabase Dashboard**
2. Click **Table Editor** → **orders**
3. You'll see all orders with customer info, items, payment status

### Order Statuses:
| Status | Meaning |
|--------|---------|
| `new` | Just placed |
| `confirmed` | Payment verified |
| `processing` | Being packed |
| `shipped` | Out for delivery |
| `delivered` | Delivered ✅ |
| `cancelled` | Cancelled |

---

## 🛒 Adding / Editing Products

Open `js/products.js` and edit the `PRODUCTS` array:

```javascript
{
  id: 9,                        // Unique number
  name: "Your Product Name",
  desc: "Short description",
  price: 500,                   // Price in BDT
  oldPrice: 700,                // Crossed-out price
  emoji: "📦",                  // Product icon
  category: "smart",            // fan | audio | smart
  badge: "New",                 // New | Sale | Hot | ""
  stars: 5,                     // 1-5
  rating: "4.8",
  stock: 20,
},
```

---

## 🆓 Everything is Free Until...

| Service | Free Limit | Cost After |
|---------|-----------|-----------|
| GitHub Pages | Unlimited | Free forever |
| Supabase | 50,000 rows, 500MB | ~$25/month |
| SSLCommerz | Sandbox free | 1-2% transaction fee (live) |

For a small store, you'll stay in the free tier for a long time!

---

## 🌐 Custom Domain (Later)

When you buy a domain:
1. Go to GitHub Pages Settings
2. Enter your domain in "Custom domain"
3. Update your domain DNS: add CNAME record pointing to `YOUR_USERNAME.github.io`

---

## ❓ Need Help?

If something doesn't work:
1. Open browser → F12 → Console tab → look for red error messages
2. Most common issues:
   - Wrong Supabase URL or key → double check copy-paste
   - SSLCommerz redirect fails → make sure sandbox mode is on
   - Orders not saving → check Supabase SQL ran successfully
