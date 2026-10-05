/* ============================================================
   AURA INDIA — HOME PAGE CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;

  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="product-card">
      <div class="product-image-container skeleton"></div>
      <div class="product-info">
        <div class="skeleton" style="height: 14px; width: 40%; margin-bottom: 8px;"></div>
        <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 12px;"></div>
        <div class="skeleton" style="height: 16px; width: 50%; margin-bottom: 16px;"></div>
        <div class="skeleton" style="height: 36px; width: 100%;"></div>
      </div>
    </div>
  `).join('');

  try {
    const response = await API.getProducts({ featured: 'true', limit: 8 });
    const products = response.products || [];

    if (products.length === 0) {
      grid.innerHTML = '<p class="text-muted">No featured products available.</p>';
      return;
    }

    grid.innerHTML = products.map(product => createProductCardHtml(product)).join('');
  } catch (err) {
    grid.innerHTML = `<p class="text-error">Failed to load products. Please refresh.</p>`;
  }
}

function createProductCardHtml(product) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
        <img src="${product.image_url}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'">
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3 class="product-title"><a href="product-details.html?id=${product.id}">${escapeHtml(product.name)}</a></h3>
        <div class="product-rating">
          ★ <span>${product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          <span class="rating-num">(${Math.floor(Math.random() * 50) + 12})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
          ${hasDiscount ? `<span class="product-original-price">₹${product.original_price.toLocaleString('en-IN')}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm btn-full" onclick="handleAddToCart(${product.id}, '${escapeHtml(product.name)}')">
            Add to Cart
          </button>
          <a href="product-details.html?id=${product.id}" class="btn btn-outline btn-sm">
            View
          </a>
        </div>
      </div>
    </div>
  `;
}

async function handleAddToCart(productId, productName) {
  try {
    const user = API.getUser();
    if (user) {
      await API.addToCart(productId, 1);
    } else {
      let guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      const index = guestCart.findIndex(item => item.productId === productId);
      if (index > -1) {
        guestCart[index].quantity += 1;
      } else {
        guestCart.push({ productId, quantity: 1 });
      }
      localStorage.setItem('aura_guest_cart', JSON.stringify(guestCart));
    }

    showToast(`Added "${productName}" to cart!`, 'success');
    if (typeof updateCartBadgeCount === 'function') {
      updateCartBadgeCount();
    }
  } catch (err) {
    showToast(err.message || 'Failed to add item to cart', 'error');
  }
}
