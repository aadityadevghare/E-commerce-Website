/* ============================================================
   AURA INDIA — CHECKOUT PAGE CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCheckout();
});

async function initCheckout() {
  const container = document.getElementById('checkout-page-container');
  if (!container) return;

  const user = API.getUser();
  
  if (!user) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔒</div>
        <h3>Account Required for Checkout</h3>
        <p>Please log in or create an account to proceed with your order.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
          <a href="login.html?redirect=checkout.html" class="btn btn-primary btn-lg">Log In</a>
          <a href="register.html?redirect=checkout.html" class="btn btn-outline btn-lg">Register</a>
        </div>
      </div>
    `;
    return;
  }

  try {
    const guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await API.addToCart(item.productId, item.quantity);
        } catch (e) {}
      }
      localStorage.removeItem('aura_guest_cart');
    }

    const res = await API.getCart();
    const items = res.items || [];
    const subtotal = res.total || 0;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart before proceeding to checkout.</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Shop Now</a>
        </div>
      `;
      return;
    }

    const shippingFee = subtotal > 2000 ? 0 : 150.00;
    const grandTotal = subtotal + shippingFee;

    container.innerHTML = `
      <div class="checkout-layout">
        <!-- Left: Form -->
        <div>
          <form id="checkout-form" onsubmit="handlePlaceOrder(event)">
            <div class="form-section">
              <h2>1. Shipping Address (India Express)</h2>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="shippingName">Full Name *</label>
                  <input type="text" id="shippingName" required value="${escapeHtml(user.name || '')}">
                </div>
                <div class="form-group">
                  <label for="shippingEmail">Email Address *</label>
                  <input type="email" id="shippingEmail" required value="${escapeHtml(user.email || '')}">
                </div>
                <div class="form-group">
                  <label for="shippingPhone">Phone Number (India) *</label>
                  <input type="tel" id="shippingPhone" required placeholder="+91 98765 43210" value="+91 98765 43210">
                </div>
                <div class="form-group full-width">
                  <label for="shippingAddress">Street Address *</label>
                  <input type="text" id="shippingAddress" required placeholder="Flat 402, Green Valley Apartments, MG Road">
                </div>
                <div class="form-group">
                  <label for="shippingCity">City *</label>
                  <select id="shippingCity" required>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="shippingState">State *</label>
                  <input type="text" id="shippingState" required value="Maharashtra" placeholder="State">
                </div>
                <div class="form-group">
                  <label for="shippingPostalCode">PIN Code *</label>
                  <input type="text" id="shippingPostalCode" required placeholder="400001" value="400001">
                </div>
                <div class="form-group">
                  <label for="shippingCountry">Country *</label>
                  <input type="text" id="shippingCountry" readonly value="India">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h2>2. Payment Method (India UPI / COD Simulation)</h2>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;">
                  <input type="radio" name="paymentMethod" value="upi" checked>
                  <div>
                    <div style="font-weight: 600;">GPay / PhonePe / Paytm UPI</div>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted);">Instant zero-fee payment simulation.</div>
                  </div>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;">
                  <input type="radio" name="paymentMethod" value="cod">
                  <div>
                    <div style="font-weight: 600;">Cash on Delivery (COD)</div>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted);">Pay cash to courier when delivered.</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" id="place-order-btn" class="btn btn-primary btn-lg btn-full" style="height: 52px; font-size: 1.1rem;">
              Place Order (₹${grandTotal.toLocaleString('en-IN')})
            </button>
          </form>
        </div>

        <!-- Right: Order Breakdown -->
        <div class="summary-card" style="position: sticky; top: 90px;">
          <h3 class="summary-title">Items in Order (${items.length})</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; max-height: 300px; overflow-y: auto;">
            ${items.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${item.image_url}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #f1f5f9;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem;">${escapeHtml(item.name)}</div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">Qty: ${item.quantity}</div>
                  </div>
                </div>
                <div style="font-weight: 600; font-size: 0.95rem;">₹${item.subtotal.toLocaleString('en-IN')}</div>
              </div>
            `).join('')}
          </div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span class="text-bold">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row">
            <span>Express Shipping (India)</span>
            <span class="text-bold">${shippingFee === 0 ? '<span class="text-success">FREE</span>' : '₹' + shippingFee}</span>
          </div>
          <div class="summary-row total">
            <span>Total to Pay</span>
            <span>₹${grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-error">Error initializing checkout.</p></div>`;
  }
}

async function handlePlaceOrder(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Order...';
  }

  const shippingData = {
    shippingName: document.getElementById('shippingName').value.trim(),
    shippingEmail: document.getElementById('shippingEmail').value.trim(),
    shippingPhone: document.getElementById('shippingPhone').value.trim(),
    shippingAddress: document.getElementById('shippingAddress').value.trim(),
    shippingCity: document.getElementById('shippingCity').value,
    shippingState: document.getElementById('shippingState').value.trim(),
    shippingPostalCode: document.getElementById('shippingPostalCode').value.trim(),
    shippingCountry: 'India'
  };

  try {
    const res = await API.createOrder(shippingData);

    showToast('Order placed successfully!', 'success');
    if (typeof updateCartBadgeCount === 'function') updateCartBadgeCount();

    window.location.href = `order-confirmation.html?id=${res.orderId}`;
  } catch (err) {
    showToast(err.message || 'Failed to place order', 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  }
}
