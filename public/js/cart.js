/* ============================================================
   AURA INDIA — CART PAGE CONTROLLER
   ============================================================ */

let activeCoupon = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCartPage();
});

async function loadCartPage() {
  const container = document.getElementById('cart-page-container');
  if (!container) return;

  try {
    const user = API.getUser();
    let cartItems = [];
    let subtotal = 0;

    if (user) {
      const res = await API.getCart();
      cartItems = res.items || [];
      subtotal = res.total || 0;
    } else {
      const guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      for (const item of guestCart) {
        try {
          const prodRes = await API.getProductById(item.productId);
          const p = prodRes.product;
          const itemSubtotal = p.price * item.quantity;
          subtotal += itemSubtotal;
          cartItems.push({
            cart_item_id: `guest_${p.id}`,
            product_id: p.id,
            name: p.name,
            price: p.price,
            image_url: p.image_url,
            category: p.category,
            stock: p.stock,
            quantity: item.quantity,
            subtotal: parseFloat(itemSubtotal.toFixed(2))
          });
        } catch (e) {}
      }
    }

    if (cartItems.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is waiting for something great.</h3>
          <p>Explore our curated products and start filling your shopping cart.</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Continue Shopping</a>
        </div>
      `;
      return;
    }

    const shippingFee = subtotal > 2000 ? 0 : 150.00;
    let discountAmount = 0;
    if (activeCoupon) {
      discountAmount = activeCoupon.discountAmount;
    }

    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    container.innerHTML = `
      <div class="cart-layout">
        <!-- Left: Cart Items Table -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Shopping Cart (${cartItems.length} item${cartItems.length === 1 ? '' : 's'})</h2>
            <button class="btn btn-ghost btn-sm text-error" onclick="handleClearCart()">Clear Cart</button>
          </div>

          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map(item => `
                <tr>
                  <td>
                    <div class="cart-item-info">
                      <img src="${item.image_url}" class="cart-item-img" alt="${escapeHtml(item.name)}" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'">
                      <div>
                        <a href="product-details.html?id=${item.product_id}" class="text-bold">${escapeHtml(item.name)}</a>
                        <div class="text-muted text-small">${escapeHtml(item.category)}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-bold">₹${item.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div class="quantity-selector">
                      <button class="qty-btn" onclick="updateItemQuantity('${item.cart_item_id}', ${item.product_id}, ${item.quantity - 1})">-</button>
                      <input type="number" class="qty-input" value="${item.quantity}" readonly>
                      <button class="qty-btn" onclick="updateItemQuantity('${item.cart_item_id}', ${item.product_id}, ${item.quantity + 1})">+</button>
                    </div>
                  </td>
                  <td class="text-bold">₹${item.subtotal.toLocaleString('en-IN')}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm text-error" title="Remove Item" onclick="removeItem('${item.cart_item_id}', ${item.product_id})">
                      ✕
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <a href="shop.html" class="btn btn-outline">← Continue Shopping</a>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">
              💡 Try promo codes: <strong style="color: var(--color-action);">AURA10</strong> (10% off) or <strong style="color: var(--color-action);">SAVE500</strong> (₹500 off over ₹2,000)!
            </div>
          </div>
        </div>

        <!-- Right: Order Summary & Coupon Form -->
        <div class="summary-card">
          <h3 class="summary-title">Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span class="text-bold">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>

          <!-- Coupon input -->
          <div style="margin: 1rem 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1rem 0;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Promo Code</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="coupon-code-input" placeholder="Enter promo code (AURA10)" value="${activeCoupon ? activeCoupon.code : ''}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 6px; text-transform: uppercase;">
              <button type="button" class="btn btn-outline btn-sm" onclick="handleApplyCoupon(${subtotal})">Apply</button>
            </div>
            ${activeCoupon ? `<div class="text-success text-small" style="margin-top: 0.4rem;">✓ ${activeCoupon.message}</div>` : ''}
          </div>

          ${activeCoupon ? `
            <div class="summary-row text-success">
              <span>Promo Discount (${activeCoupon.code})</span>
              <span class="text-bold">-₹${discountAmount.toLocaleString('en-IN')}</span>
            </div>
          ` : ''}

          <div class="summary-row">
            <span>Estimated Shipping (India)</span>
            <span class="text-bold">${shippingFee === 0 ? '<span class="text-success">FREE</span>' : '₹' + shippingFee}</span>
          </div>

          <div class="summary-row total">
            <span>Total to Pay</span>
            <span>₹${grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <a href="checkout.html" class="btn btn-primary btn-lg btn-full">
            Proceed to Checkout →
          </a>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-error">Error loading cart.</p></div>`;
  }
}

async function handleApplyCoupon(subtotal) {
  const codeInput = document.getElementById('coupon-code-input');
  if (!codeInput || !codeInput.value.trim()) {
    showToast('Please enter a promo code', 'info');
    return;
  }

  try {
    const res = await API.validateCoupon(codeInput.value.trim(), subtotal);
    activeCoupon = res;
    showToast(res.message, 'success');
    loadCartPage();
  } catch (err) {
    showToast(err.message || 'Invalid coupon code', 'error');
  }
}

async function updateItemQuantity(cartItemId, productId, newQty) {
  const user = API.getUser();
  try {
    if (newQty <= 0) {
      await removeItem(cartItemId, productId);
      return;
    }

    if (user) {
      await API.updateCartItem(cartItemId, newQty);
    } else {
      let guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      const index = guestCart.findIndex(item => item.productId === productId);
      if (index > -1) {
        guestCart[index].quantity = newQty;
      }
      localStorage.setItem('aura_guest_cart', JSON.stringify(guestCart));
    }

    loadCartPage();
    if (typeof updateCartBadgeCount === 'function') updateCartBadgeCount();
  } catch (err) {
    showToast(err.message || 'Error updating cart', 'error');
  }
}

async function removeItem(cartItemId, productId) {
  const user = API.getUser();
  try {
    if (user) {
      await API.removeCartItem(cartItemId);
    } else {
      let guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      guestCart = guestCart.filter(item => item.productId !== productId);
      localStorage.setItem('aura_guest_cart', JSON.stringify(guestCart));
    }

    showToast('Item removed from cart', 'info');
    loadCartPage();
    if (typeof updateCartBadgeCount === 'function') updateCartBadgeCount();
  } catch (err) {
    showToast(err.message || 'Error removing item', 'error');
  }
}

async function handleClearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;

  const user = API.getUser();
  try {
    if (user) {
      await API.clearCart();
    } else {
      localStorage.removeItem('aura_guest_cart');
    }

    showToast('Cart cleared', 'info');
    loadCartPage();
    if (typeof updateCartBadgeCount === 'function') updateCartBadgeCount();
  } catch (err) {
    showToast(err.message || 'Error clearing cart', 'error');
  }
}
