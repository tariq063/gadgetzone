// ============================================================
//  CART — Add, remove, update, render
// ============================================================

let cart = {};  // { productId: quantity }

function addToCart(id) {
  const qty = quantities[id] || 1;
  cart[id] = (cart[id] || 0) + qty;

  // Reset product qty selector back to 1
  quantities[id] = 1;
  const qtyEl = document.getElementById('qty-' + id);
  if (qtyEl) qtyEl.textContent = 1;

  // Animate button
  const btn = document.getElementById('add-' + id);
  if (btn) {
    btn.textContent = '✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+'; btn.classList.remove('added'); }, 900);
  }

  updateCartCount();
  showToast('Added to cart! 🛒');
}

function removeFromCart(id) {
  delete cart[id];
  updateCartCount();
  renderCart();
}

function changeCartQty(id, delta) {
  const newQty = (cart[id] || 1) + delta;
  if (newQty < 1) {
    removeFromCart(id);
    return;
  }
  cart[id] = newQty;
  updateCartCount();
  renderCart();
}

function getCartSubtotal() {
  return Object.keys(cart).reduce((sum, id) => {
    const p = PRODUCTS.find(x => x.id == id);
    return sum + (p ? p.price * cart[id] : 0);
  }, 0);
}

function getDeliveryCharge(subtotal) {
  return subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_CHARGE;
}

function getCartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = getCartCount();
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = panel.classList.contains('open');
  if (!isOpen) renderCart();
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
}

function renderCart() {
  const el = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div>Your cart is empty</div>
        <div style="font-size:12px;margin-top:6px">Add some gadgets!</div>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';

  el.innerHTML = keys.map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    if (!p) return '';
    const line = p.price * cart[id];
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">৳${p.price} × ${cart[id]} = ৳${line}</div>
          <div class="cart-item-qty">
            <button class="ciq-btn" onclick="changeCartQty(${id}, -1)">−</button>
            <span style="font-size:13px;padding:0 6px">${cart[id]}</span>
            <button class="ciq-btn" onclick="changeCartQty(${id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${id})">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');

  const sub = getCartSubtotal();
  const delivery = getDeliveryCharge(sub);
  document.getElementById('subtotalAmt').textContent = '৳' + sub;
  document.getElementById('deliveryAmt').textContent = delivery === 0 ? 'FREE 🎉' : '৳' + delivery;
  document.getElementById('totalAmt').textContent = '৳' + (sub + delivery);
}
