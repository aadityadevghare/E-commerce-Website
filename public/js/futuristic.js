/* ============================================================
   AURA 2050 — FUTURISTIC ENGINE & NEURAL SUITE
   ============================================================ */

// 1. Audio SFX Engine (Web Audio API - zero external sound files needed!)
const AudioSFX = {
  ctx: null,
  soundEnabled: true,

  init() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    } catch (e) {}
  },

  playClick() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  },

  playSuccess() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
};

// 2. Neural Voice Assistant (Web Speech API)
function initNeuralVoiceSearch() {
  const voiceBtn = document.getElementById('neural-voice-btn');
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    AudioSFX.playClick();
    showToast('🎙️ Listening for 2050 Neural Voice Command...', 'info');
    voiceBtn.classList.add('pulse-active');
    try {
      recognition.start();
    } catch (e) {}
  });

  recognition.onresult = (event) => {
    voiceBtn.classList.remove('pulse-active');
    const transcript = event.results[0][0].transcript.toLowerCase();
    showToast(`Neural Command: "${transcript}"`, 'success');

    if (transcript.includes('cart')) {
      window.location.href = 'cart.html';
    } else if (transcript.includes('shop') || transcript.includes('products')) {
      window.location.href = 'shop.html';
    } else if (transcript.includes('home')) {
      window.location.href = 'index.html';
    } else {
      window.location.href = `shop.html?search=${encodeURIComponent(transcript)}`;
    }
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove('pulse-active');
    showToast('Neural voice command not recognized.', 'error');
  };
}

// 3. 360° Holographic Canvas Rotator
function initHolographic3DViewer(canvasId, imageUrl) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let angle = 0;
  let isDragging = false;
  let previousMouseX = 0;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageUrl;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Holographic Cyber Grid Ring
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 110, 140, 40, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3D Perspective Scale & Rotate simulation
    const scaleX = Math.cos(angle);
    ctx.scale(scaleX, 1);

    if (img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, -100, -100, 200, 200);
    }

    ctx.restore();
  }

  img.onload = () => render();

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => isDragging = false);

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    angle += deltaX * 0.02;
    previousMouseX = e.clientX;
    render();
  });
}

// 4. Quantum Price Lock & Trend Renderer
async function loadPriceTrends(productId) {
  const graphContainer = document.getElementById('price-trend-graph');
  if (!graphContainer) return;

  try {
    const res = await API.request(`/futuristic/price-trends/${productId}`);
    const trends = res.trends || [];
    const forecast = res.forecast;

    const maxPrice = Math.max(...trends.map(t => t.price)) * 1.1;

    graphContainer.innerHTML = `
      <div style="background: rgba(17, 24, 39, 0.95); border: 1px solid var(--color-neon-blue); border-radius: 12px; padding: 1.5rem; color: #fff; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <span style="font-weight: 700; font-size: 1rem; color: var(--color-neon-blue);">⚡ 2050 Quantum Price Predictor</span>
          <span class="status-badge" style="background: rgba(0, 240, 255, 0.15); color: var(--color-neon-blue); border: 1px solid var(--color-neon-blue);">AI Confidence: ${forecast.confidence}</span>
        </div>

        <div style="display: flex; align-items: flex-end; gap: 0.75rem; height: 120px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">
          ${trends.map(t => {
            const heightPct = Math.round((t.price / maxPrice) * 100);
            return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 0.7rem; color: #94a3b8;">$${t.price}</span>
                <div style="width: 100%; height: ${heightPct}%; background: linear-gradient(180deg, #00f0ff 0%, #7000ff 100%); border-radius: 4px 4px 0 0;"></div>
                <span style="font-size: 0.65rem; color: #64748B;">${t.day}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.85rem; color: #cbd5e1;">
            💡 Forecast: Predicted price drop to <strong style="color: #4ade80;">$${forecast.predictedPriceTomorrow}</strong> tomorrow.
          </div>
          <button class="btn btn-primary btn-sm" onclick="handleLockPrice(${productId})">
            🔒 Quantum Price Lock (24h)
          </button>
        </div>
      </div>
    `;
  } catch (e) {}
}

async function handleLockPrice(productId) {
  AudioSFX.playClick();
  try {
    const res = await API.request('/futuristic/price-lock', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    AudioSFX.playSuccess();
    showToast(res.message, 'success', 5000);
  } catch (err) {
    showToast(err.message || 'Error locking price', 'error');
  }
}

// 5. 2050 Holographic Mystery Reward Wheel
function initQuantumWheel() {
  const wheelBtn = document.getElementById('spin-quantum-wheel');
  if (!wheelBtn) return;

  wheelBtn.addEventListener('click', () => {
    AudioSFX.playClick();
    wheelBtn.disabled = true;
    wheelBtn.textContent = '🌀 Quantum Calculating...';

    setTimeout(() => {
      const rewards = ['CYBER2050', 'AURA10', 'SAVE20', 'WELCOME15'];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      AudioSFX.playSuccess();
      showToast(`🎉 Quantum Reward Unlocked! Code: "${reward}" applied to your session!`, 'success', 6000);
      wheelBtn.textContent = `Unlocked: ${reward}`;
    }, 1500);
  });
}

// 6. Sound Toggle & Theme Toggle Setup
document.addEventListener('DOMContentLoaded', () => {
  AudioSFX.init();
  initNeuralVoiceSearch();
  initQuantumWheel();

  // Attach sound to all buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.btn')) {
      AudioSFX.playClick();
    }
  });
});
