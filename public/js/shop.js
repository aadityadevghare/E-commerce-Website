/* ============================================================
   AURA SHOP PAGE CONTROLLER
   ============================================================ */

let currentFilters = {
  category: 'All',
  search: '',
  sort: 'featured',
  minPrice: '',
  maxPrice: ''
};

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  setupEventListeners();
  fetchShopProducts();
});

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('category')) {
    currentFilters.category = params.get('category');
  }
  if (params.has('search')) {
    currentFilters.search = params.get('search');
    const searchInput = document.getElementById('shop-search');
    if (searchInput) searchInput.value = currentFilters.search;
  }
  if (params.has('sort')) {
    currentFilters.sort = params.get('sort');
    const sortSelect = document.getElementById('shop-sort');
    if (sortSelect) sortSelect.value = currentFilters.sort;
  }

  updateCategoryActiveUI();
}

function setupEventListeners() {
  // Category buttons
  const catBtns = document.querySelectorAll('.filter-btn[data-category]');
  catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentFilters.category = btn.getAttribute('data-category');
      updateCategoryActiveUI();
      fetchShopProducts();
    });
  });

  // Search input with debounce
  const searchInput = document.getElementById('shop-search');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        fetchShopProducts();
      }, 300);
    });
  }

  // Sort select
  const sortSelect = document.getElementById('shop-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      fetchShopProducts();
    });
  }

  // Price range filters
  const minInput = document.getElementById('min-price');
  const maxInput = document.getElementById('max-price');
  const applyPriceBtn = document.getElementById('apply-price-filter');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      currentFilters.minPrice = minInput ? minInput.value : '';
      currentFilters.maxPrice = maxInput ? maxInput.value : '';
      fetchShopProducts();
    });
  }
}

function updateCategoryActiveUI() {
  const catBtns = document.querySelectorAll('.filter-btn[data-category]');
  catBtns.forEach(btn => {
    const cat = btn.getAttribute('data-category');
    if (cat.toLowerCase() === currentFilters.category.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

async function fetchShopProducts() {
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('shop-results-count');
  if (!grid) return;

  // Show skeletons
  grid.innerHTML = Array(6).fill(0).map(() => `
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
    const params = {};
    if (currentFilters.category && currentFilters.category !== 'All') {
      params.category = currentFilters.category;
    }
    if (currentFilters.search) {
      params.search = currentFilters.search;
    }
    if (currentFilters.sort) {
      params.sort = currentFilters.sort;
    }
    if (currentFilters.minPrice) {
      params.minPrice = currentFilters.minPrice;
    }
    if (currentFilters.maxPrice) {
      params.maxPrice = currentFilters.maxPrice;
    }

    const res = await API.getProducts(params);
    const products = res.products || [];

    if (countEl) {
      countEl.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>We couldn't find any products matching your active filters.</p>
          <button class="btn btn-outline" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(product => createProductCardHtml(product)).join('');
  } catch (err) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p class="text-error">Error loading products.</p></div>`;
  }
}

function resetFilters() {
  currentFilters = {
    category: 'All',
    search: '',
    sort: 'featured',
    minPrice: '',
    maxPrice: ''
  };

  const searchInput = document.getElementById('shop-search');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('shop-sort');
  if (sortSelect) sortSelect.value = 'featured';

  const minInput = document.getElementById('min-price');
  if (minInput) minInput.value = '';

  const maxInput = document.getElementById('max-price');
  if (maxInput) maxInput.value = '';

  updateCategoryActiveUI();
  fetchShopProducts();
}
