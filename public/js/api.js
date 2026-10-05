/* ============================================================
   AURA API HELPER (EXPANDED)
   ============================================================ */

const API = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('aura_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('aura_token', token);
    } else {
      localStorage.removeItem('aura_token');
    }
  },

  getUser() {
    const userStr = localStorage.getItem('aura_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err.message);
      throw err;
    }
  },

  // Auth Endpoints
  async register(name, email, password, confirmPassword) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword })
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.setToken(null);
    this.setUser(null);
  },

  async getMe() {
    return await this.request('/auth/me');
  },

  // Products Endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/products${query ? '?' + query : ''}`);
  },

  async getProductById(id) {
    return await this.request(`/products/${id}`);
  },

  // Reviews Endpoints
  async getProductReviews(productId) {
    return await this.request(`/products/${productId}/reviews`);
  },

  async addReview(productId, rating, comment) {
    return await this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  },

  // Wishlist Endpoints
  async getWishlist() {
    return await this.request('/wishlist');
  },

  async toggleWishlist(productId) {
    return await this.request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  },

  async checkWishlist(productId) {
    return await this.request(`/wishlist/check/${productId}`);
  },

  // Coupons Endpoint
  async validateCoupon(code, cartTotal) {
    return await this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal })
    });
  },

  // Cart Endpoints
  async getCart() {
    return await this.request('/cart');
  },

  async addToCart(productId, quantity = 1) {
    return await this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  },

  async updateCartItem(id, quantity) {
    return await this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  },

  async removeCartItem(id) {
    return await this.request(`/cart/${id}`, {
      method: 'DELETE'
    });
  },

  async clearCart() {
    return await this.request('/cart', {
      method: 'DELETE'
    });
  },

  // Orders Endpoints
  async createOrder(shippingData) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(shippingData)
    });
  },

  async getOrders() {
    return await this.request('/orders');
  },

  async getOrderById(id) {
    return await this.request(`/orders/${id}`);
  }
};
