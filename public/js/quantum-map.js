/* ============================================================
   AURA 2050 — 3D QUANTUM DELIVERY MAP & AUTOMATED FULFILLMENT
   ============================================================ */

function open3DQuantumTrackingModal(orderId, shippingCity, shippingCountry) {
  let modal = document.getElementById('quantum-map-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quantum-map-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(7, 10, 18, 0.95); backdrop-filter: blur(16px);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background: #0e1424; border: 1px solid var(--color-neon-cyan); border-radius: 16px; width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; padding: 2rem; color: #fff; box-shadow: var(--shadow-glow); position: relative;">
      <button onclick="closeQuantumMapModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">✕</button>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="font-size: 0.8rem; font-weight: 800; color: var(--color-neon-cyan); letter-spacing: 0.1em; text-transform: uppercase;">🛰️ 2050 Quantum Satellite Telemetry</div>
          <h2 style="color: #fff; margin: 0.25rem 0;">Real-Time 3D Drone Tracking — Order #${orderId}</h2>
        </div>
        <span class="status-badge" style="background: rgba(0,240,255,0.15); color: var(--color-neon-cyan); border: 1px solid var(--color-neon-cyan); padding: 0.4rem 0.85rem; font-size: 0.85rem;">
          ● LIVE DRONE SIGNAL LOCKED
        </span>
      </div>

      <!-- 3D Radar Map Canvas Container -->
      <div style="position: relative; width: 100%; height: 360px; background: #070a12; border: 1px solid rgba(0,240,255,0.3); border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem;">
        <canvas id="quantum-radar-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
        
        <!-- Live HUD Overlay -->
        <div style="position: absolute; top: 12px; left: 12px; background: rgba(14, 20, 36, 0.85); backdrop-filter: blur(8px); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem;">
          <div style="color: var(--color-neon-cyan); font-weight: 700;">UNIT: AURA-DRONE-X9</div>
          <div>Destination: <span style="color: #fff; font-weight: 600;">${escapeHtml(shippingCity || 'Destination Sector')}, ${escapeHtml(shippingCountry || 'Earth')}</span></div>
          <div>Speed: <span style="color: #4ade80; font-weight: 700;">412 km/h (Autonomous Flight)</span></div>
          <div>Altitude: <span style="color: #cbd5e1;">1,240 ft</span></div>
        </div>

        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(14, 20, 36, 0.85); backdrop-filter: blur(8px); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.75rem; color: #94a3b8;">
          Drag to rotate 3D Radar Globe
        </div>
      </div>

      <!-- 2075 Automated Pipeline Progress -->
      <div style="background: rgba(17, 24, 39, 0.8); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem;">
        <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">🤖 2075 Fully Automated Robotic Dispatch Pipeline</h3>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
          <div style="background: rgba(0, 240, 255, 0.1); border: 1px solid var(--color-neon-cyan); padding: 1rem; border-radius: 8px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">🧠</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-neon-cyan);">1. AI Order Matrix</div>
            <div style="font-size: 0.75rem; color: #4ade80;">Verified (0.002s)</div>
          </div>
          <div style="background: rgba(0, 240, 255, 0.1); border: 1px solid var(--color-neon-cyan); padding: 1rem; border-radius: 8px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">🤖</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-neon-cyan);">2. Robotic Arm Pick</div>
            <div style="font-size: 0.75rem; color: #4ade80;">Completed</div>
          </div>
          <div style="background: rgba(112, 0, 255, 0.2); border: 1px solid var(--color-neon-purple); padding: 1rem; border-radius: 8px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">🛸</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #a78bfa;">3. Drone In Flight</div>
            <div style="font-size: 0.75rem; color: #facc15;">In Transit (ETA 12m)</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">📍</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #94a3b8;">4. Teleport Drop</div>
            <div style="font-size: 0.75rem; color: #64748B;">Pending Drop</div>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  render3DQuantumRadarMap('quantum-radar-canvas');
}

function closeQuantumMapModal() {
  const modal = document.getElementById('quantum-map-modal');
  if (modal) modal.style.display = 'none';
}

function render3DQuantumRadarMap(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth || 800;
  canvas.height = 360;

  let globeAngle = 0;
  let droneProgress = 0.2; // 0 to 1 along flight path

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // 1. Draw 3D Wireframe Holographic Globe Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1.5;

    // Outer atmosphere ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
    ctx.stroke();

    // Latitudes
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      const yOffset = (i / 4) * radius;
      const r = Math.sqrt(radius * radius - yOffset * yOffset);
      ctx.ellipse(centerX, centerY + yOffset, r, r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Longitudes with rotating angle
    for (let i = 0; i < 6; i++) {
      const angle = globeAngle + (i * Math.PI) / 6;
      const rX = Math.abs(Math.cos(angle)) * radius;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rX, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Draw Curved Flight Trajectory (Origin Hub -> Destination)
    const hubX = centerX - 90;
    const hubY = centerY + 30;
    const destX = centerX + 80;
    const destY = centerY - 40;

    ctx.strokeStyle = '#7000ff';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    ctx.quadraticCurveTo(centerX, centerY - 100, destX, destY);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Hub Node
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(hubX, hubY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('AURA Origin Hub', hubX - 40, hubY + 20);

    // Dest Node
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(destX, destY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Customer Destination', destX - 45, destY + 20);

    // 3. Animated 3D Delivery Drone Marker on Bezier Curve
    const t = droneProgress;
    const droneX = (1 - t) * (1 - t) * hubX + 2 * (1 - t) * t * centerX + t * t * destX;
    const droneY = (1 - t) * (1 - t) * hubY + 2 * (1 - t) * t * (centerY - 100) + t * t * destY;

    // Pulse aura ring
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(droneX, droneY, 14 + Math.sin(Date.now() * 0.008) * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Drone Icon
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(droneX, droneY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('🛸 DRONE-X9', droneX - 30, droneY - 15);

    // Update animations
    globeAngle += 0.005;
    droneProgress += 0.0012;
    if (droneProgress > 0.95) droneProgress = 0.1;

    requestAnimationFrame(draw);
  }

  draw();
}
