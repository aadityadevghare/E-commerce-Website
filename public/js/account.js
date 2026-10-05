/* ============================================================
   AURA ACCOUNT & ORDERS CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadAccountPage();
});

async function loadAccountPage() {
  const container = document.getElementById('account-page-container');
  if (!container) return;

  const user = API.getUser();
  if (!user) {
    window.location.href = 'login.html?redirect=account.html';
    return;
  }

  try {
    const ordersRes = await API.getOrders();
    const orders = ordersRes.orders || [];

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; align-items: start;">
        <!-- Left: Profile Sidebar -->
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.75rem;">
          <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border);">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #eff6ff; color: var(--color-action); font-size: 1.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
              ${escapeHtml(user.name.charAt(0).toUpperCase())}
            </div>
            <h3 style="margin-bottom: 0.25rem;">${escapeHtml(user.name)}</h3>
            <p class="text-muted text-small">${escapeHtml(user.email)}</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-outline btn-full text-error" onclick="handleLogout()">
              Log Out
            </button>
          </div>
        </div>

        <!-- Right: Order History -->
        <div>
          <h2 style="margin-bottom: 1.5rem;">Order History (${orders.length})</h2>

          ${orders.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">📦</div>
              <h3>You haven't placed an order yet.</h3>
              <p>When you place an order, your order history and live 3D shipment map tracking will appear here.</p>
              <a href="shop.html" class="btn btn-primary btn-lg">Start Shopping</a>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${orders.map(order => createOrderCardHtml(order)).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p class="text-error">Failed to load account information.</p></div>`;
  }
}

function createOrderCardHtml(order) {
  const dateStr = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const statusClass = `status-${order.status.toLowerCase()}`;

  return `
    <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1rem;">
        <div>
          <span style="font-weight: 700; font-size: 1.05rem;">Order #${order.id}</span>
          <span class="text-muted text-small" style="margin-left: 0.75rem;">Placed on ${dateStr}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span class="status-badge ${statusClass}">${escapeHtml(order.status)}</span>
          <span style="font-weight: 700; font-size: 1.1rem;">₹${order.total_amount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
        ${order.items ? order.items.map(item => `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${item.image_url}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; background: #f1f5f9;">
              <div>
                <a href="product-details.html?id=${item.product_id}" style="font-weight: 600; font-size: 0.95rem;">${escapeHtml(item.name)}</a>
                <div class="text-muted text-small">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div style="font-weight: 600; font-size: 0.95rem;">₹${(item.quantity * item.price).toLocaleString('en-IN')}</div>
          </div>
        `).join('') : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--color-bg); padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
        <div class="text-muted">
          <strong>Shipping to:</strong> ${escapeHtml(order.shipping_name)}, ${escapeHtml(order.shipping_city)}, ${escapeHtml(order.shipping_country)}
        </div>
        <button class="btn btn-primary btn-sm" onclick="open3DTrackingModal(${order.id}, '${escapeHtml(order.shipping_city)}', '${escapeHtml(order.shipping_country)}')">
          🛰️ Track Package on 3D Map
        </button>
      </div>
    </div>
  `;
}

async function handleLogout() {
  await API.logout();
  showToast('Logged out', 'info');
  window.location.href = 'index.html';
}
