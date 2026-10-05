/* ============================================================
   AURA NAVIGATION MANAGER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateNavAuthState();
  updateCartBadgeCount();
});

function initNavbar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Highlight active page
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

async function updateNavAuthState() {
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;

  const user = API.getUser();
  if (user) {
    authContainer.innerHTML = `
      <a href="account.html" class="btn btn-outline btn-sm" title="My Account">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 4px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        ${escapeHtml(user.name.split(' ')[0])}
      </a>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-dark btn-sm">Login</a>
    `;
  }
}

async function updateCartBadgeCount() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  try {
    const user = API.getUser();
    if (user) {
      const cartData = await API.getCart();
      badge.textContent = cartData.count || 0;
    } else {
      // Local storage fallback for guest cart
      const guestCart = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
      const count = guestCart.reduce((acc, item) => acc + item.quantity, 0);
      badge.textContent = count;
    }
  } catch (err) {
    badge.textContent = 0;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
