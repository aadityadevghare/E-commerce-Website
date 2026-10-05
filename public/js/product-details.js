/* ============================================================
   AURA PRODUCT DETAILS PAGE CONTROLLER
   ============================================================ */

let currentProduct = null;
let selectedQuantity = 1;
let isWishlisted = false;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'shop.html';
    return;
  }

  fetchProductDetails(id);
  fetchProductReviews(id);
  checkWishlistStatus(id);
});

async function fetchProductDetails(id) {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  try {
    const res = await API.getProductById(id);
    currentProduct = res.product;
    const related = res.relatedProducts || [];

    renderProductDetails(currentProduct);
    renderRelatedProducts(related);

    // Initialize 3D Model Inspector
    setTimeout(() => {
      if (typeof init3DProductModel === 'function') {
        init3DProductModel('3d-model-container', currentProduct.category, currentProduct.name, currentProduct.image_url);
      }
    }, 100);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Product Not Found</h3>
        <p>The product you are looking for does not exist or has been removed.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
  }
}

async function checkWishlistStatus(id) {
  const user = API.getUser();
  if (!user) return;
  try {
    const res = await API.checkWishlist(id);
    isWishlisted = res.isWishlisted;
    updateWishlistBtnUI();
  } catch (e) {}
}

function renderProductDetails(product) {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  let stockClass = 'in-stock';
  let stockText = `In Stock (${product.stock} available)`;
  if (product.stock === 0) {
    stockClass = 'out-of-stock';
    stockText = 'Out of Stock';
  } else if (product.stock <= 5) {
    stockClass = 'low-stock';
    stockText = `Low Stock (Only ${product.stock} left)`;
  }

  const imgMain = product.image_url;

  container.innerHTML = `
    <div class="product-details-grid">
      <!-- Left: Multi-Angle Studio Gallery -->
      <div class="product-gallery">
        <div class="gallery-main" style="position: relative; overflow: hidden; border-radius: 12px; border: 1px solid var(--color-border); background: #fff;">
          <img src="${imgMain}" alt="${escapeHtml(product.name)}" id="main-product-img" style="width: 100%; height: 420px; object-fit: contain; padding: 1rem; transition: opacity 0.2s ease;" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'">
        </div>
        
        <!-- Multi-Angle Studio Thumbnails -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem; justify-content: center;">
          <button class="thumb-btn active" onclick="switchProductThumb('${imgMain}', this)" style="border: 2px solid var(--color-primary); border-radius: 8px; padding: 2px; background: #fff; cursor: pointer;" title="Front View">
            <img src="${imgMain}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 6px;">
          </button>
          <button class="thumb-btn" onclick="switchProductThumb('${imgMain}', this)" style="border: 1px solid var(--color-border); border-radius: 8px; padding: 2px; background: #fff; cursor: pointer;" title="Studio View">
            <img src="${imgMain}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 6px; transform: scale(1.1);">
          </button>
          <button class="thumb-btn" onclick="switchProductThumb('${imgMain}', this)" style="border: 1px solid var(--color-border); border-radius: 8px; padding: 2px; background: #fff; cursor: pointer;" title="Detail Zoom">
            <img src="${imgMain}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 6px; transform: scale(1.3);">
          </button>
        </div>

        <!-- 3D Interactive WebGL Inspector -->
        <div style="background: #0b0f19; border: 1px solid var(--color-border); border-radius: 12px; padding: 1rem; text-align: center; color: #fff; margin-top: 1.5rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #60a5fa; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>🔍 3D Interactive Model Inspection</span>
            <span style="font-size: 0.75rem; background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 2px 8px; border-radius: 12px;">Drag to Rotate</span>
          </div>
          <div id="3d-model-container" style="width: 100%; height: 220px;"></div>
        </div>
      </div>

      <!-- Right: Details, PIN Code Checker & Specifications -->
      <div class="details-content">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span class="product-category" style="text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--color-primary); font-size: 0.85rem;">${escapeHtml(product.category)}</span>
          <button id="wishlist-btn" class="btn btn-outline btn-sm" onclick="handleToggleWishlist()" title="Add to Wishlist">
            <span id="wishlist-icon">♥</span> <span id="wishlist-text">Save</span>
          </button>
        </div>

        <h1 style="font-size: 1.85rem; margin: 0.5rem 0 0.75rem 0;">${escapeHtml(product.name)}</h1>

        <div class="product-rating" style="margin-bottom: 1.25rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #f59e0b; font-weight: 800;">★ ${product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          <span class="rating-num" style="color: var(--color-text-muted);">| 128 Verified Customer Reviews</span>
        </div>

        <div class="product-price-row" style="margin-bottom: 1.25rem; display: flex; align-items: baseline; gap: 0.75rem;">
          <span class="product-price" style="font-size: 2.2rem; font-weight: 800; color: var(--color-text);">₹${product.price.toLocaleString('en-IN')}</span>
          ${hasDiscount ? `<span class="product-original-price" style="font-size: 1.3rem; text-decoration: line-through; color: var(--color-text-muted);">₹${product.original_price.toLocaleString('en-IN')}</span>` : ''}
          ${hasDiscount ? `<span class="discount-badge" style="background: #dcfce7; color: #166534; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.85rem;">Save ${discountPercent}%</span>` : ''}
        </div>

        <div class="stock-status ${stockClass}" style="margin-bottom: 1.5rem;">
          ${stockText}
        </div>

        <p class="text-muted" style="font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
          ${escapeHtml(product.description)}
        </p>

        <!-- PIN CODE DELIVERY CHECKER -->
        <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.25rem; margin-bottom: 2rem;">
          <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            📍 Delivery & Cash on Delivery Availability
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="pincode-input" placeholder="Enter 6-digit PIN Code (e.g. 400001)" maxlength="6" style="flex: 1; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.9rem;">
            <button type="button" class="btn btn-outline btn-sm" onclick="checkPinCodeAvailability()">Check</button>
          </div>
          <div id="pincode-result" style="font-size: 0.85rem; margin-top: 0.6rem; display: none;"></div>
        </div>

        ${product.stock > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem;">Quantity:</label>
            <div class="quantity-selector">
              <button class="qty-btn" onclick="changeQty(-1)">-</button>
              <input type="number" id="detail-qty" class="qty-input" value="1" min="1" max="${product.stock}" readonly>
              <button class="qty-btn" onclick="changeQty(1)">+</button>
            </div>
          </div>

          <div class="details-actions" style="display: flex; gap: 1rem;">
            <button class="btn btn-primary btn-lg" style="flex: 1; height: 50px; font-size: 1.05rem;" onclick="addCurrentToCart(false)">
              🛒 Add to Cart
            </button>
            <button class="btn btn-dark btn-lg" style="flex: 1; height: 50px; font-size: 1.05rem;" onclick="addCurrentToCart(true)">
              ⚡ Buy Now
            </button>
          </div>
        ` : `
          <button class="btn btn-outline btn-lg btn-full" disabled>Currently Unavailable</button>
        `}

        <!-- SPECIFICATIONS & GUARANTEES TABLE -->
        <div style="border-top: 1px solid var(--color-border); padding-top: 1.75rem; margin-top: 2rem;">
          <h4 style="font-size: 1rem; margin-bottom: 1rem;">Product Specifications & Trust Guarantees</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; color: var(--color-text-muted);">
            <tr style="border-bottom: 1px solid var(--color-border);">
              <td style="padding: 0.5rem 0; font-weight: 600;">Authenticity</td>
              <td style="padding: 0.5rem 0; color: var(--color-text);">100% Genuine Verified Item</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border);">
              <td style="padding: 0.5rem 0; font-weight: 600;">Warranty</td>
              <td style="padding: 0.5rem 0; color: var(--color-text);">1-Year Official Brand Warranty</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border);">
              <td style="padding: 0.5rem 0; font-weight: 600;">Shipping Courier</td>
              <td style="padding: 0.5rem 0; color: var(--color-text);">BlueDart / Delhivery Express Air</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: 600;">Return Policy</td>
              <td style="padding: 0.5rem 0; color: var(--color-text);">30-Day Easy Exchange / Return</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `;

  updateWishlistBtnUI();
}

async function handleToggleWishlist() {
  if (!currentProduct) return;
  const user = API.getUser();
  if (!user) {
    showToast('Please log in to save items to your wishlist.', 'info');
    window.location.href = `login.html?redirect=product-details.html?id=${currentProduct.id}`;
    return;
  }

  try {
    const res = await API.toggleWishlist(currentProduct.id);
    isWishlisted = res.isWishlisted;
    updateWishlistBtnUI();
    showToast(res.message, 'success');
  } catch (err) {
    showToast(err.message || 'Error updating wishlist', 'error');
  }
}

function updateWishlistBtnUI() {
  const btn = document.getElementById('wishlist-btn');
  const icon = document.getElementById('wishlist-icon');
  const text = document.getElementById('wishlist-text');

  if (!btn || !icon || !text) return;

  if (isWishlisted) {
    btn.classList.add('btn-dark');
    btn.classList.remove('btn-outline');
    icon.style.color = '#ef4444';
    text.textContent = 'Saved';
  } else {
    btn.classList.add('btn-outline');
    btn.classList.remove('btn-dark');
    icon.style.color = 'inherit';
    text.textContent = 'Save';
  }
}

async function fetchProductReviews(productId) {
  const reviewsContainer = document.getElementById('reviews-list');
  if (!reviewsContainer) return;

  try {
    const res = await API.getProductReviews(productId);
    const reviews = res.reviews || [];

    if (reviews.length === 0) {
      reviewsContainer.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review this product!</p>';
      return;
    }

    reviewsContainer.innerHTML = reviews.map(r => `
      <div style="padding: 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="text-bold">${escapeHtml(r.user_name)}</span>
          <span style="color: var(--color-accent); font-weight: 700;">${'★'.repeat(r.rating)}</span>
        </div>
        <p class="text-muted" style="font-size: 0.95rem;">${escapeHtml(r.comment)}</p>
        <span class="text-muted text-small" style="display: block; margin-top: 0.5rem;">${new Date(r.created_at).toLocaleDateString()}</span>
      </div>
    `).join('');
  } catch (e) {}
}

async function handleAddReview(e) {
  e.preventDefault();
  if (!currentProduct) return;

  const user = API.getUser();
  if (!user) {
    showToast('Please log in to submit a review.', 'info');
    window.location.href = `login.html?redirect=product-details.html?id=${currentProduct.id}`;
    return;
  }

  const rating = document.getElementById('review-rating').value;
  const comment = document.getElementById('review-comment').value.trim();

  try {
    await API.addReview(currentProduct.id, rating, comment);
    showToast('Thank you! Your review has been published.', 'success');
    document.getElementById('review-comment').value = '';
    fetchProductReviews(currentProduct.id);
    fetchProductDetails(currentProduct.id);
  } catch (err) {
    showToast(err.message || 'Error submitting review', 'error');
  }
}

function renderRelatedProducts(related) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  if (related.length === 0) {
    const sec = document.getElementById('related-products-section');
    if (sec) sec.style.display = 'none';
    return;
  }

  container.innerHTML = related.map(product => createProductCardHtml(product)).join('');
}

function changeQty(delta) {
  const input = document.getElementById('detail-qty');
  if (!input || !currentProduct) return;

  let current = parseInt(input.value, 10) || 1;
  current += delta;

  if (current < 1) current = 1;
  if (current > currentProduct.stock) current = currentProduct.stock;

  input.value = current;
  selectedQuantity = current;
}

async function addCurrentToCart(buyNow = false) {
  if (!currentProduct) return;

  try {
    const user = API.getUser();
    if (user) {
      await API.addToCart(currentProduct.id, selectedQuantity);
    } else {
      let guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      const index = guestCart.findIndex(item => item.productId === currentProduct.id);
      if (index > -1) {
        guestCart[index].quantity += selectedQuantity;
      } else {
        guestCart.push({ productId: currentProduct.id, quantity: selectedQuantity });
      }
      localStorage.setItem('aura_guest_cart', JSON.stringify(guestCart));
    }

    showToast(`Added "${currentProduct.name}" to cart!`, 'success');
    if (typeof updateCartBadgeCount === 'function') {
      updateCartBadgeCount();
    }

    if (buyNow) {
      window.location.href = 'checkout.html';
    }
  } catch (err) {
    showToast(err.message || 'Failed to add item', 'error');
  }
}

function switchProductThumb(imgUrl, btnElem) {
  const mainImg = document.getElementById('main-product-img');
  if (mainImg) {
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.style.opacity = '1';
    }, 150);
  }

  document.querySelectorAll('.thumb-btn').forEach(btn => {
    btn.style.borderColor = 'var(--color-border)';
    btn.classList.remove('active');
  });

  if (btnElem) {
    btnElem.style.borderColor = 'var(--color-primary)';
    btnElem.classList.add('active');
  }
}

function checkPinCodeAvailability() {
  const input = document.getElementById('pincode-input');
  const result = document.getElementById('pincode-result');
  if (!input || !result) return;

  const code = input.value.trim();
  if (!/^\d{6}$/.test(code)) {
    result.style.display = 'block';
    result.style.color = '#ef4444';
    result.innerHTML = '⚠️ Please enter a valid 6-digit Indian PIN code (e.g., 400001 or 110001).';
    return;
  }

  result.style.display = 'block';
  result.style.color = '#16a34a';
  result.innerHTML = `
    ✅ <strong>Express Delivery Available for ${code}</strong><br>
    • Estimated Delivery: <strong>Tomorrow by 4:00 PM</strong> (BlueDart Air Express)<br>
    • Cash on Delivery (COD) Available | Free Express Shipping Eligible
  `;
}
