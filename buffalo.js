(function () {
  window.BuffaloShow = { play };

  const BUFFALO = '🦬';
  const FILLERS = ['🎲', '⭐', '💎', '🔔', '🌟', '❤️', '🎰', '🌈', '✨', '💫', '🎊', '🍀'];
  const CELL_H = 56; // px — must match CSS .b-reel height

  const LEVELS = {
    1: { reels: 3,  particles: 10, sizeMin: 22, sizeMax: 40, shake: false, flash: false, multiFlash: 0 },
    2: { reels: 6,  particles: 35, sizeMin: 24, sizeMax: 64, shake: false, flash: true,  multiFlash: 2 },
    3: { reels: 12, particles: 100, sizeMin: 18, sizeMax: 96, shake: true,  flash: true,  multiFlash: 6 },
  };

  let stylesInjected = false;

  function play(level, modalContent) {
    if (!stylesInjected) injectStyles();

    const cfg = LEVELS[level];

    // Clear any previous reels injected
    const old = modalContent.querySelector('.b-reels');
    if (old) old.remove();

    // Build slot reels inside the modal
    const reelsEl = document.createElement('div');
    reelsEl.className = 'b-reels';
    modalContent.insertBefore(reelsEl, modalContent.firstChild);

    cfg.reels > 0 && buildReels(reelsEl, cfg.reels);

    // Particle rain
    rain(cfg);

    // Screen effects
    if (cfg.flash) goldFlash(cfg.multiFlash);
    if (cfg.shake) setTimeout(screenShake, 400);

    // For level 3: add extra drama — repeated waves of buffalo
    if (level === 3) {
      setTimeout(() => rain({ ...cfg, particles: 60, sizeMin: 30, sizeMax: 100 }), 1800);
      setTimeout(() => rain({ ...cfg, particles: 40, sizeMin: 40, sizeMax: 120 }), 3200);
    }
  }

  // ---- Slot machine reels ----

  function buildReels(container, count) {
    for (let i = 0; i < count; i++) {
      // Each reel has a unique strip ending in 🦬
      const stripItems = [...shuffled(FILLERS)].slice(0, 11);
      stripItems.push(BUFFALO); // always ends in buffalo
      const cells = stripItems.length;

      const reel = document.createElement('div');
      reel.className = 'b-reel';

      const strip = document.createElement('div');
      strip.className = 'b-strip';

      // CSS vars drive the animation
      const delay = i * 180;
      const dur = 1100 + i * 200;
      strip.style.setProperty('--cells', cells);
      strip.style.setProperty('--delay', `${delay}ms`);
      strip.style.setProperty('--dur', `${dur}ms`);

      stripItems.forEach((sym) => {
        const cell = document.createElement('div');
        cell.className = 'b-cell';
        cell.textContent = sym;
        strip.appendChild(cell);
      });

      reel.appendChild(strip);
      container.appendChild(reel);
    }
  }

  // ---- Particle rain ----

  function rain({ particles, sizeMin, sizeMax }) {
    const canvas = document.createElement('div');
    canvas.className = 'b-canvas';
    document.body.appendChild(canvas);

    for (let i = 0; i < particles; i++) {
      const delay = rand(0, 2200);
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'b-particle';
        const size = rand(sizeMin, sizeMax);
        const x = rand(-2, 102);
        const dur = rand(1600, 4000);
        const rot = rand(-360, 360);
        el.textContent = BUFFALO;
        el.style.cssText = `
          left:${x}%;
          font-size:${size}px;
          animation-duration:${dur}ms;
          --rot:${rot}deg;
        `;
        canvas.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }, delay);
    }

    setTimeout(() => { if (canvas.parentNode) canvas.remove(); }, 7500);
  }

  // ---- Screen effects ----

  function screenShake() {
    document.body.classList.add('b-shake');
    document.body.addEventListener('animationend', () => {
      document.body.classList.remove('b-shake');
    }, { once: true });
  }

  function goldFlash(extra) {
    doFlash();
    for (let i = 0; i < extra; i++) {
      setTimeout(doFlash, 220 + i * 200);
    }
  }

  function doFlash() {
    const f = document.createElement('div');
    f.className = 'b-flash';
    document.body.appendChild(f);
    f.addEventListener('animationend', () => f.remove(), { once: true });
  }

  // ---- Helpers ----

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffled(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function injectStyles() {
    stylesInjected = true;
    const s = document.createElement('style');
    s.textContent = `
      /* Reel container */
      .b-reels {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        margin-bottom: 18px;
      }

      /* Single reel window */
      .b-reel {
        width: ${CELL_H}px;
        height: ${CELL_H}px;
        overflow: hidden;
        border: 2px solid #ffd24d;
        border-radius: 8px;
        background: rgba(5,10,44,0.95);
        box-shadow: 0 0 14px rgba(255,210,77,0.5), inset 0 0 8px rgba(0,0,0,0.6);
        flex-shrink: 0;
      }

      /* Scrolling strip inside the reel */
      .b-strip {
        display: flex;
        flex-direction: column;
        /* Start at top (shows item 0), animate to bottom (shows last item = buffalo) */
        transform: translateY(0);
        animation: b-spin var(--dur) var(--delay) cubic-bezier(0.05, 0.85, 0.2, 1) forwards;
      }

      @keyframes b-spin {
        from { transform: translateY(0); }
        to   { transform: translateY(calc((var(--cells) - 1) * ${CELL_H}px * -1)); }
      }

      .b-cell {
        height: ${CELL_H}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        line-height: 1;
        flex-shrink: 0;
      }

      /* Particle canvas */
      .b-canvas {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      }

      /* Falling buffalo */
      .b-particle {
        position: absolute;
        top: -80px;
        user-select: none;
        line-height: 1;
        animation: b-fall linear forwards;
      }

      @keyframes b-fall {
        0%   { transform: translateY(0) rotate(0deg);           opacity: 1; }
        75%  { opacity: 1; }
        100% { transform: translateY(110vh) rotate(var(--rot)); opacity: 0; }
      }

      /* Screen shake (body) */
      @keyframes b-shake-kf {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-10px, 5px); }
        25% { transform: translate(10px, -5px); }
        40% { transform: translate(-8px, 8px); }
        55% { transform: translate(8px, -8px); }
        70% { transform: translate(-5px, 3px); }
        85% { transform: translate(5px, -3px); }
      }
      .b-shake { animation: b-shake-kf 0.65s ease-in-out; }

      /* Gold screen flash */
      .b-flash {
        position: fixed;
        inset: 0;
        background: rgba(255, 220, 80, 0.45);
        pointer-events: none;
        z-index: 9998;
        animation: b-flash-kf 0.45s ease-out forwards;
      }
      @keyframes b-flash-kf {
        from { opacity: 1; }
        to   { opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
})();
