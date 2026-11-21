/**
 * OMKAR DEN // Lusion-Grade 60FPS Sound Waveform Visualizer
 * Replaces the static round dot (○ / ●) in the navbar sound toggle button
 * with a dynamic, fluid audio sine wave based on Lusion's audio visualizer mathematics.
 */

(function () {
  'use strict';

  function initSoundWave() {
    const sndBtn = document.getElementById('snd');
    if (!sndBtn) return;

    // Build or ensure required internal DOM nodes
    function ensureWaveDOM() {
      let label = sndBtn.querySelector('.snd-label');
      let waveWrap = sndBtn.querySelector('.snd-wave-wrap');
      let canvas = sndBtn.querySelector('.snd-wave-canvas');

      if (!label || !waveWrap || !canvas) {
        sndBtn.innerHTML = '';

        label = document.createElement('span');
        label.className = 'snd-label';
        label.textContent = 'sound';
        sndBtn.appendChild(label);

        waveWrap = document.createElement('span');
        waveWrap.className = 'snd-wave-wrap';
        waveWrap.setAttribute('aria-hidden', 'true');

        canvas = document.createElement('canvas');
        canvas.className = 'snd-wave-canvas';
        waveWrap.appendChild(canvas);
        sndBtn.appendChild(waveWrap);
      }
      return { canvas, waveWrap };
    }

    const { canvas } = ensureWaveDOM();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crisp high-DPI scaling
    const cssWidth = 22;
    const cssHeight = 14;
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';

    let isHovered = false;
    sndBtn.addEventListener('mouseenter', () => { isHovered = true; });
    sndBtn.addEventListener('mouseleave', () => { isHovered = false; });

    let currentAmp = 0;
    let time = 0;
    let lastTime = performance.now();

    function renderWave(now) {
      requestAnimationFrame(renderWave);

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const isPlaying = sndBtn.getAttribute('aria-pressed') === 'true';

      // Fluid amplitude targets
      const targetAmp = isPlaying ? (isHovered ? 1.15 : 0.9) : (isHovered ? 0.28 : 0.0);
      currentAmp += (targetAmp - currentAmp) * Math.min(1, dt * 10);

      // Relaxed, calm wave speed
      time += dt * (isPlaying ? 2.0 : 0.9);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = cssWidth / 2;
      const cy = cssHeight / 2;
      const waveWidth = cssWidth - 4; // 18px horizontal spread
      const maxAmp = 4.8;
      const activeAmp = maxAmp * currentAmp;

      const isDay = document.documentElement.dataset.look === 'day';
      if (isPlaying) {
        ctx.strokeStyle = isDay ? '#6442FF' : '#818FFF';
        ctx.shadowColor = isDay ? 'rgba(100, 66, 255, 0.45)' : 'rgba(129, 143, 255, 0.65)';
        ctx.shadowBlur = isHovered ? 5 : 2.5;
      } else {
        ctx.strokeStyle = isDay ? 'rgba(0, 20, 69, 0.35)' : 'rgba(248, 248, 248, 0.35)';
        ctx.shadowBlur = 0;
      }

      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const l = 32;
      for (let f = 0; f <= l; f++) {
        const t = f / l;
        const x = (t - 0.5) * waveWidth + cx;
        const envelope = Math.sin(Math.PI * t);
        const y = cy + Math.sin(time * 3.2 + t * 5.0) * activeAmp * envelope;

        if (f === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(renderWave);

    // Keep DOM clean from residual text replacements
    const observer = new MutationObserver(() => {
      if (sndBtn.textContent.includes('○') || sndBtn.textContent.includes('●')) {
        ensureWaveDOM();
      }
    });
    observer.observe(sndBtn, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoundWave);
  } else {
    initSoundWave();
  }
})();
