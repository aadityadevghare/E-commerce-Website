/* ============================================================
   AURA INDIA — INTERACTIVE LIVE SUPPORT CHAT ASSISTANT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLiveSupportChat();
});

function initLiveSupportChat() {
  let chatWrapper = document.getElementById('aura-chat-wrapper');
  if (chatWrapper) return;

  chatWrapper = document.createElement('div');
  chatWrapper.id = 'aura-chat-wrapper';
  chatWrapper.innerHTML = `
    <!-- Floating Chat Trigger Button -->
    <button id="chat-trigger-btn" onclick="toggleChatWindow()" style="position: fixed; bottom: 24px; left: 24px; z-index: 999; background: #2563eb; color: #fff; padding: 0.75rem 1.25rem; border-radius: 99px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer;">
      <span style="font-size: 1.2rem;">💬</span> Need Help? Chat Now
    </button>

    <!-- Chat Modal Window -->
    <div id="chat-window" style="display: none; position: fixed; bottom: 85px; left: 24px; z-index: 1000; width: 350px; height: 460px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); flex-direction: column; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #111827; color: #fff; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 1rem;">AURA Assistant (India)</div>
          <div style="font-size: 0.75rem; color: #4ade80;">● Online — Express Support</div>
        </div>
        <button onclick="toggleChatWindow()" style="background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer;">✕</button>
      </div>

      <!-- Messages Area -->
      <div id="chat-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; background: #f8fafc; font-size: 0.88rem;">
        <div style="background: #ffffff; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 85%; align-self: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          Namaste! 🙏 Welcome to AURA India. How can I help you today?
        </div>
      </div>

      <!-- Quick Suggestion Pills -->
      <div style="padding: 0.5rem 0.75rem; background: #fff; border-top: 1px solid #e2e8f0; display: flex; gap: 0.4rem; overflow-x: auto; font-size: 0.75rem;">
        <button onclick="sendQuickMessage('Track my order')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 0.25rem 0.6rem; border-radius: 99px; white-space: nowrap;">Track Order</button>
        <button onclick="sendQuickMessage('Available Coupons')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 0.25rem 0.6rem; border-radius: 99px; white-space: nowrap;">Coupons</button>
        <button onclick="sendQuickMessage('Delivery in India')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 0.25rem 0.6rem; border-radius: 99px; white-space: nowrap;">Delivery Info</button>
      </div>

      <!-- Input Area -->
      <form onsubmit="handleChatSubmit(event)" style="display: flex; padding: 0.75rem; border-top: 1px solid #e2e8f0; background: #fff; gap: 0.5rem;">
        <input type="text" id="chat-input" placeholder="Type your question..." style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; outline: none;">
        <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 0.5rem 0.85rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Send</button>
      </form>
    </div>
  `;

  document.body.appendChild(chatWrapper);
}

function toggleChatWindow() {
  const window = document.getElementById('chat-window');
  if (!window) return;
  if (window.style.display === 'none' || !window.style.display) {
    window.style.display = 'flex';
  } else {
    window.style.display = 'none';
  }
}

function sendQuickMessage(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    handleChatSubmit(new Event('submit'));
  }
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  if (!input || !messages || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  // Append user msg
  const userDiv = document.createElement('div');
  userDiv.style.cssText = 'background: #2563eb; color: #fff; padding: 0.65rem 0.9rem; border-radius: 12px; max-width: 85%; align-self: flex-end;';
  userDiv.textContent = userMsg;
  messages.appendChild(userDiv);
  messages.scrollTop = messages.scrollHeight;

  // Generate intelligent response
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.style.cssText = 'background: #ffffff; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 85%; align-self: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

    const lower = userMsg.toLowerCase();
    if (lower.includes('track') || lower.includes('order')) {
      botDiv.innerHTML = `You can track your order anytime on the <a href="account.html" style="color: #2563eb; font-weight: 600;">My Account</a> page by clicking <strong>"🛰️ Track Package on 3D Map"</strong>!`;
    } else if (lower.includes('coupon') || lower.includes('code') || lower.includes('discount')) {
      botDiv.innerHTML = `Use promo codes:<br>• <strong>AURA10</strong> (10% OFF)<br>• <strong>SAVE500</strong> (₹500 OFF over ₹2,000)<br>• <strong>WELCOME15</strong> (15% OFF over ₹1,000)`;
    } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('india')) {
      botDiv.innerHTML = `We offer free express delivery across all major Indian cities (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, Jaipur, Ahmedabad) within 1-2 business days!`;
    } else {
      botDiv.textContent = `Thank you for reaching out! Our team is available 24/7 to assist you. Explore our shop or check your cart for instant updates.`;
    }

    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 600);
}
