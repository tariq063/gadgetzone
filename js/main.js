// ============================================================
//  MAIN — Initialize everything on page load
// ============================================================

let toastTimer;

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.toggle('error', isError);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();        // Load products grid
  checkPaymentReturn();    // Handle SSLCommerz redirect
});
