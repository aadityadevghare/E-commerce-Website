/* ============================================================
   AURA WISHLIST CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadWishlistPage();
});

async function loadWishlistPage() {
  const container = document.getElementById('wishlist-page-container');
  if (!container) return;

  const user = API.getUser();
  if (!user) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔒</div>
        <h3>Account Required</h3>
        <p>Please log in to view and manage your saved wishlist items.</p>
        <a href="login.html?redirect=wishlist.html" class="btn btn-primary btn-lg">Log In</a>
      </div>
    `;
    return;
  }

  try {
    const res = await API.getWishlist();
    const items = res.items || [];

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">♥</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Explore our catalog and click the heart icon to save your favorite products.</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Explore Shop</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="products-grid">
        ${items.map(product => `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
              <img src="${product.image_url}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'">
            </div>
            <div class="product-info">
              <span class="product-category">${escapeHtml(product.category)}</span>
              <h3 class="product-title"><a href="product-details.html?id=${product.id}">${escapeHtml(product.name)}</a></h3>
              <div class="product-price-row">
                <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
              </div>
              <div class="product-actions">
                <button class="btn btn-primary btn-sm btn-full" onclick="handleAddToCart(${product.id}, '${escapeHtml(product.name)}')">
                  Add to Cart
                </button>
                <button class="btn btn-outline btn-sm text-error" title="Remove from Wishlist" onclick="removeWishlistItem(${product.id})">
                  ✕
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-error">Failed to load wishlist.</p></div>`;
  }
}

async function removeWishlistItem(productId) {
  try {
    await API.toggleWishlist(productId);
    showToast('Removed from Wishlist', 'info');
    loadWishlistPage();
  } catch (err) {
    showToast('Error updating wishlist', 'error');
  }
}
