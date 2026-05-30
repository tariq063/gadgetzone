// ============================================================
//  PRODUCTS — Add / edit your products here
// ============================================================

const PRODUCTS = [
  {
    id: 1,
    name: "USB Mini Fan",
    desc: "Portable desk fan, whisper-quiet, 3-speed settings",
    price: 320,
    oldPrice: 450,
    emoji: "🌀",
    category: "fan",
    badge: "Hot",   // "New" | "Sale" | "Hot" | ""
    stars: 5,
    rating: "4.8",
    stock: 50,
  },
  {
    id: 2,
    name: "Neck Fan Wearable",
    desc: "Hands-free bladeless neck fan, 360° cool airflow",
    price: 650,
    oldPrice: 900,
    emoji: "💨",
    category: "fan",
    badge: "New",
    stars: 5,
    rating: "4.7",
    stock: 30,
  },
  {
    id: 3,
    name: "Air Buds Pro",
    desc: "True wireless earbuds, 24hr battery, deep bass",
    price: 890,
    oldPrice: 1200,
    emoji: "🎧",
    category: "audio",
    badge: "Sale",
    stars: 5,
    rating: "4.9",
    stock: 40,
  },
  {
    id: 4,
    name: "Mini BT Speaker",
    desc: "Waterproof portable speaker, 10hr playtime",
    price: 750,
    oldPrice: 1000,
    emoji: "🔊",
    category: "audio",
    badge: "",
    stars: 4,
    rating: "4.6",
    stock: 25,
  },
  {
    id: 5,
    name: "Smart Band",
    desc: "Fitness tracker, heart rate, sleep monitor, IP67",
    price: 1200,
    oldPrice: 1600,
    emoji: "⌚",
    category: "smart",
    badge: "New",
    stars: 5,
    rating: "4.8",
    stock: 20,
  },
  {
    id: 6,
    name: "Wireless Charger",
    desc: "15W fast charging pad, compatible with all Qi devices",
    price: 480,
    oldPrice: 650,
    emoji: "⚡",
    category: "smart",
    badge: "",
    stars: 4,
    rating: "4.5",
    stock: 35,
  },
  {
    id: 7,
    name: "Clip-On Fan",
    desc: "Rechargeable clip fan for stroller, desk, bed",
    price: 390,
    oldPrice: 500,
    emoji: "🌬️",
    category: "fan",
    badge: "",
    stars: 4,
    rating: "4.4",
    stock: 45,
  },
  {
    id: 8,
    name: "TWS Earphones",
    desc: "In-ear noise isolation, built-in mic, sport fit",
    price: 520,
    oldPrice: 700,
    emoji: "🎵",
    category: "audio",
    badge: "Sale",
    stars: 5,
    rating: "4.7",
    stock: 30,
  },
];

// ---- Product rendering ----

let quantities = {};
PRODUCTS.forEach(p => { quantities[p.id] = 1; });

function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${p.badge ? `<span class="badge ${p.badge === 'New' ? 'new' : p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</span>` : ''}
        <button class="wishlist-btn" onclick="event.stopPropagation();toggleWishlist(${p.id})" id="wish-${p.id}">🤍</button>
        <span style="font-size:3.5rem">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="stars">${'★'.repeat(p.stars)}${'☆'.repeat(5 - p.stars)}
          <span style="color:var(--muted);font-size:11px">(${p.rating})</span>
        </div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-bottom">
          <div class="price-block">
            <div class="price-new">৳${p.price}</div>
            <div class="price-old">৳${p.oldPrice}</div>
          </div>
          <div class="product-actions">
            <div class="qty-ctrl">
              <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
              <span class="qty-num" id="qty-${p.id}">1</span>
              <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
            </div>
            <button class="add-btn" id="add-${p.id}" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  quantities[id] = Math.max(1, Math.min(10, (quantities[id] || 1) + delta));
  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = quantities[id];
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

function toggleWishlist(id) {
  const btn = document.getElementById('wish-' + id);
  const isLiked = btn.textContent === '❤️';
  btn.textContent = isLiked ? '🤍' : '❤️';
  showToast(isLiked ? 'Removed from wishlist' : 'Added to wishlist ❤️');
}
