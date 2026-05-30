// ============================================================
//  CHECKOUT — Form, Supabase order save, SSLCommerz payment
// ============================================================

let selectedPayMethod = 'cod';

// ---- Open checkout modal ----
function openCheckout() {
  const sub = getCartSubtotal();
  const delivery = getDeliveryCharge(sub);
  const total = sub + delivery;
  const keys = Object.keys(cart);

  const itemsList = keys.map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    return `<div class="order-row">
      <span>${p.emoji} ${p.name} ×${cart[id]}</span>
      <span>৳${p.price * cart[id]}</span>
    </div>`;
  }).join('');

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">Checkout 🧾</div>

    <div class="order-summary-mini">
      ${itemsList}
      <div class="order-row" style="color:var(--muted);font-size:12px">
        <span>Delivery</span>
        <span>${delivery === 0 ? 'FREE 🎉' : '৳' + delivery}</span>
      </div>
      <div class="order-row grand">
        <span>Grand Total</span>
        <span>৳${total}</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Full Name *</label>
      <input class="form-input" id="fname" placeholder="Enter your full name" />
      <div class="field-error" id="err-fname"></div>
    </div>

    <div class="form-group">
      <label class="form-label">Phone Number *</label>
      <input class="form-input" id="fphone" placeholder="01XXXXXXXXX" maxlength="11" />
      <div class="field-error" id="err-fphone"></div>
    </div>

    <div class="form-group">
      <label class="form-label">Email (optional)</label>
      <input class="form-input" id="femail" placeholder="your@email.com" type="email" />
    </div>

    <div class="form-group">
      <label class="form-label">Delivery Address *</label>
      <input class="form-input" id="faddress" placeholder="District, Upazila, Village / Area" />
      <div class="field-error" id="err-faddress"></div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">City *</label>
        <input class="form-input" id="fcity" placeholder="e.g. Pabna" />
        <div class="field-error" id="err-fcity"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Postal Code</label>
        <input class="form-input" id="fpost" placeholder="6600" maxlength="4" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Payment Method *</label>
      <div class="pay-method">
        <div class="pay-opt selected" id="pay-cod" onclick="selectPayMethod('cod')">
          <span class="pay-emoji">🚪</span>Cash on Delivery
        </div>
        <div class="pay-opt" id="pay-bkash" onclick="selectPayMethod('bkash')">
          <span class="pay-emoji">📱</span>bKash / Nagad
        </div>
        <div class="pay-opt" id="pay-card" onclick="selectPayMethod('card')">
          <span class="pay-emoji">💳</span>Card / Online
        </div>
      </div>
    </div>

    <div id="extraPayFields"></div>

    <div class="modal-actions">
      <button class="modal-cancel" onclick="closeCheckout()">← Back</button>
      <button class="modal-confirm" id="placeOrderBtn" onclick="placeOrder()">
        Place Order ✓
      </button>
    </div>
  `;

  selectedPayMethod = 'cod';
  document.getElementById('checkoutModal').classList.add('open');
}

// ---- Payment method selector ----
function selectPayMethod(method) {
  selectedPayMethod = method;
  ['cod', 'bkash', 'card'].forEach(m => {
    document.getElementById('pay-' + m).classList.toggle('selected', m === method);
  });

  const extra = document.getElementById('extraPayFields');
  if (method === 'bkash') {
    extra.innerHTML = `
      <div class="form-group" style="margin-top:4px">
        <label class="form-label">Send Money To</label>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:13px;color:var(--accent)">
          📱 bKash / Nagad: <strong>${CONFIG.CONTACT_PHONE}</strong> (Send Money)
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Your bKash / Nagad Number *</label>
        <input class="form-input" id="fbkash" placeholder="01XXXXXXXXX" maxlength="11" />
      </div>
      <div class="form-group">
        <label class="form-label">Transaction ID *</label>
        <input class="form-input" id="ftrx" placeholder="e.g. 8N7ABC12345" />
      </div>`;
  } else if (method === 'card') {
    extra.innerHTML = `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:13px;color:var(--muted);margin-bottom:1rem">
        🔒 You will be redirected to SSLCommerz secure payment page.
        Supports Visa, Mastercard, bKash, Nagad, Rocket and more.
      </div>`;
  } else {
    extra.innerHTML = `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:13px;color:var(--muted);margin-bottom:0">
        🚪 Pay when your order arrives at your door.
      </div>`;
  }
}

// ---- Validate form ----
function validateForm() {
  let valid = true;
  const fields = [
    { id: 'fname', label: 'Full Name', errId: 'err-fname' },
    { id: 'fphone', label: 'Phone Number', errId: 'err-fphone' },
    { id: 'faddress', label: 'Address', errId: 'err-faddress' },
    { id: 'fcity', label: 'City', errId: 'err-fcity' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if (el && (!el.value || !el.value.trim())) {
      if (errEl) errEl.textContent = f.label + ' is required';
      el.style.borderColor = 'var(--red)';
      valid = false;
    } else if (el) {
      if (errEl) errEl.textContent = '';
      el.style.borderColor = '';
    }
  });

  // Phone format check
  const phone = document.getElementById('fphone')?.value.trim();
  if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
    document.getElementById('err-fphone').textContent = 'Enter a valid BD number (01XXXXXXXXX)';
    document.getElementById('fphone').style.borderColor = 'var(--red)';
    valid = false;
  }

  // bKash fields
  if (selectedPayMethod === 'bkash') {
    const bkash = document.getElementById('fbkash')?.value.trim();
    const trx = document.getElementById('ftrx')?.value.trim();
    if (!bkash) { showToast('⚠️ Enter your bKash/Nagad number', true); valid = false; }
    if (!trx) { showToast('⚠️ Enter Transaction ID', true); valid = false; }
  }

  return valid;
}

// ---- Build order object ----
function buildOrderObject() {
  const sub = getCartSubtotal();
  const delivery = getDeliveryCharge(sub);
  const orderId = 'GZ' + Date.now().toString(36).toUpperCase();

  const items = Object.keys(cart).map(id => {
    const p = PRODUCTS.find(x => x.id == id);
    return { id: p.id, name: p.name, price: p.price, qty: cart[id] };
  });

  return {
    order_id: orderId,
    customer_name: document.getElementById('fname').value.trim(),
    customer_phone: document.getElementById('fphone').value.trim(),
    customer_email: document.getElementById('femail')?.value.trim() || '',
    address: document.getElementById('faddress').value.trim(),
    city: document.getElementById('fcity').value.trim(),
    postal_code: document.getElementById('fpost')?.value.trim() || '',
    items: items,
    subtotal: sub,
    delivery_charge: delivery,
    total: sub + delivery,
    payment_method: selectedPayMethod,
    payment_status: selectedPayMethod === 'cod' ? 'pending' : 'awaiting_verification',
    bkash_number: document.getElementById('fbkash')?.value.trim() || '',
    transaction_id: document.getElementById('ftrx')?.value.trim() || '',
    status: 'new',
    created_at: new Date().toISOString(),
  };
}

// ---- Save order to Supabase ----
async function saveOrderToSupabase(order) {
  const url = CONFIG.SUPABASE_URL + '/rest/v1/orders';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': CONFIG.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + CONFIG.SUPABASE_ANON_KEY,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Supabase error:', err);
    throw new Error('Failed to save order: ' + JSON.stringify(err));
  }

  return await res.json();
}

// ---- Initiate SSLCommerz payment ----
async function initiateSSLCommerz(order) {
  // SSLCommerz requires a backend to generate the payment URL securely.
  // Since we're using GitHub Pages (no backend), we use their direct POST API.
  // In SANDBOX mode this works for testing.

  const baseUrl = CONFIG.SSLCOMMERZ_SANDBOX
    ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

  const successUrl = window.location.origin + window.location.pathname + '?payment=success&order=' + order.order_id;
  const failUrl    = window.location.origin + window.location.pathname + '?payment=failed&order=' + order.order_id;
  const cancelUrl  = window.location.origin + window.location.pathname + '?payment=cancelled&order=' + order.order_id;

  const params = new URLSearchParams({
    store_id:       CONFIG.SSLCOMMERZ_STORE_ID,
    store_passwd:   CONFIG.SSLCOMMERZ_STORE_PASSWORD,
    total_amount:   order.total,
    currency:       'BDT',
    tran_id:        order.order_id,
    success_url:    successUrl,
    fail_url:       failUrl,
    cancel_url:     cancelUrl,
    cus_name:       order.customer_name,
    cus_email:      order.customer_email || 'customer@gadgetzone.com',
    cus_phone:      order.customer_phone,
    cus_add1:       order.address,
    cus_city:       order.city,
    cus_country:    'Bangladesh',
    shipping_method:'Courier',
    product_name:   CONFIG.STORE_NAME + ' Order',
    product_category:'Electronics',
    product_profile:'general',
  });

  // POST to SSLCommerz — they return a JSON with GatewayPageURL
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await res.json();

  if (data.status === 'SUCCESS' && data.GatewayPageURL) {
    window.location.href = data.GatewayPageURL;  // Redirect to SSLCommerz payment page
  } else {
    throw new Error('SSLCommerz failed: ' + (data.failedreason || JSON.stringify(data)));
  }
}

// ---- Main place order function ----
async function placeOrder() {
  if (!validateForm()) return;

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner"></span> Processing...';

  try {
    const order = buildOrderObject();

    // 1. Save order to Supabase database
    await saveOrderToSupabase(order);

    // 2. Handle payment
    if (selectedPayMethod === 'card') {
      // Redirect to SSLCommerz payment gateway
      await initiateSSLCommerz(order);
      // Page will redirect — no further code runs
    } else {
      // COD or bKash manual — show success screen
      showSuccessScreen(order);
      cart = {};
      updateCartCount();
    }

  } catch (err) {
    console.error('Order error:', err);
    btn.disabled = false;
    btn.innerHTML = 'Place Order ✓';
    showToast('⚠️ Something went wrong. Try again.', true);
  }
}

// ---- Success screen ----
function showSuccessScreen(order) {
  const payLabel = {
    cod: '🚪 Cash on Delivery',
    bkash: '📱 bKash / Nagad',
    card: '💳 Online Payment',
  }[order.payment_method];

  document.getElementById('modalContent').innerHTML = `
    <div class="success-screen">
      <div class="success-icon">🎉</div>
      <div class="success-title">Order Placed Successfully!</div>
      <div class="order-id-box">${order.order_id}</div>
      <div class="success-msg">
        Thank you, <strong>${order.customer_name}</strong>!<br><br>
        Payment: <strong>${payLabel}</strong><br>
        Total: <strong style="color:var(--accent)">৳${order.total}</strong><br><br>
        We'll call you at <strong>${order.customer_phone}</strong> to confirm.<br>
        Expected delivery: <strong>2–5 business days</strong><br><br>
        ${order.payment_method === 'bkash'
          ? `<span style="color:var(--accent2)">⚠️ Please keep your Transaction ID <strong>${order.transaction_id}</strong> safe. We'll verify your payment shortly.</span>`
          : ''}
      </div>
      <button class="modal-confirm" style="margin-top:1.5rem;width:100%;padding:14px" onclick="closeAndReset()">
        Done ✓
      </button>
    </div>
  `;
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function closeAndReset() {
  closeCheckout();
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  panel.classList.remove('open');
  overlay.classList.remove('open');
  renderCart();
}

// ---- Handle payment redirect returns ----
function checkPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const orderId = params.get('order');

  if (payment === 'success' && orderId) {
    // Update order payment status in Supabase
    fetch(CONFIG.SUPABASE_URL + '/rest/v1/orders?order_id=eq.' + orderId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + CONFIG.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ payment_status: 'paid', status: 'confirmed' }),
    });

    showToast('✅ Payment successful! Order confirmed.');
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  } else if (payment === 'failed') {
    showToast('❌ Payment failed. Please try again.', true);
    window.history.replaceState({}, '', window.location.pathname);
  } else if (payment === 'cancelled') {
    showToast('Payment cancelled.', true);
    window.history.replaceState({}, '', window.location.pathname);
  }
}
