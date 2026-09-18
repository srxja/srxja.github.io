/* sky.js — a physically-plausible night sky, drawn on <canvas>.
 *
 * What makes it read as real rather than "space wallpaper":
 *  - Star brightness follows a magnitude distribution: thousands of faint
 *    stars, a handful of bright ones (roughly N ∝ 10^(0.5·m), like the real sky).
 *  - Colour follows stellar temperature. Most stars are white or faintly
 *    yellow-white; a few are blue-white (hot) or orange (cool giants).
 *  - Only bright stars twinkle, and only a little. Faint stars don't
 *    scintillate visibly — the eye can't resolve it.
 *  - The Milky Way is a soft, mottled band, not a purple gradient.
 *  - The whole sky rotates slowly about a celestial pole in the upper-left,
 *    the way the sky actually turns (sped up so you notice it in a minute).
 *  - A meteor every minute or two, fast and faint, not a cartoon comet.
 *  - The sky background is near-black with a slight blue-grey cast — a real
 *    dark sky is never #000000 because of airglow.
 * Respects prefers-reduced-motion: renders one static frame.
 */
(function () {
  const canvas = document.getElementById('sky');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, DPR = 1;
  let stars = [];
  let milky = null;          // offscreen canvas holding the Milky Way band
  let pole = { x: 0, y: 0 }; // celestial pole in screen space
  let t0 = performance.now();
  let meteor = null, nextMeteorAt = 0;

  // ---------- helpers ----------
  const rand = (a, b) => a + Math.random() * (b - a);

  // Approximate blackbody tint by temperature class, expressed as RGB 0..255.
  // Weighted so the mix looks like a real field: mostly white/yellow-white.
  const CLASSES = [
    { w: 0.03, rgb: [170, 191, 255] }, // O/B — blue-white
    { w: 0.12, rgb: [202, 215, 255] }, // A — white-blue
    { w: 0.25, rgb: [248, 247, 255] }, // F — white
    { w: 0.35, rgb: [255, 244, 234] }, // G — yellow-white (Sun)
    { w: 0.19, rgb: [255, 210, 161] }, // K — orange
    { w: 0.06, rgb: [255, 180, 120] }, // M — orange-red
  ];
  function pickClass() {
    let r = Math.random(), acc = 0;
    for (const c of CLASSES) { acc += c.w; if (r <= acc) return c.rgb; }
    return CLASSES[3].rgb;
  }

  // Magnitude → visual radius/alpha. Sample magnitudes from ~1 to 6.5 with a
  // density that rises steeply toward the faint end.
  function sampleMagnitude() {
    // inverse-CDF of p(m) ∝ 10^(0.5 m) on [0.5, 6.5]
    const a = 0.5 * Math.LN10, m0 = 0.5, m1 = 6.5;
    const u = Math.random();
    return Math.log(Math.exp(a * m0) + u * (Math.exp(a * m1) - Math.exp(a * m0))) / a;
  }

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    pole = { x: W * 0.22, y: H * 0.18 };

    // Star count scales with area; ~1 star per 900 px² on desktop.
    const R = Math.hypot(Math.max(W - pole.x, pole.x), Math.max(H - pole.y, pole.y)) + 40;
    const count = Math.min(5000, Math.floor((W * H) / 520));
    stars = [];
    for (let i = 0; i < count; i++) {
      // uniform over a disc around the pole so rotation never leaves gaps
      const r = R * Math.sqrt(Math.random());
      const th = rand(0, Math.PI * 2);
      const m = sampleMagnitude();
      // brightness 0..1 from magnitude (m=0.5 → 1, m=6.5 → ~0.06)
      const b = Math.pow(10, -0.4 * (m - 0.5)) ;
      stars.push({
        r, th, m,
        size: m < 1.5 ? 2.2 : m < 2.5 ? 1.7 : m < 4 ? 1.25 : m < 5.5 ? 0.95 : 0.75,
        alpha: Math.min(1, 0.28 + b * 0.85),
        rgb: pickClass(),
        // scintillation only for bright stars; each has its own phase/rate
        twinkle: m < 3 ? rand(0.25, 0.6) : m < 4.2 ? rand(0.08, 0.2) : 0,
        ph: rand(0, Math.PI * 2),
        rate: rand(2.5, 6.5),
      });
    }
    buildMilkyWay();
  }

  // A soft diagonal band with value-noise mottling and dark dust lanes.
  function buildMilkyWay() {
    const off = document.createElement('canvas');
    const s = 0.5; // draw at half res, then scale — it's meant to be soft
    off.width = Math.max(2, Math.floor(W * s)); off.height = Math.max(2, Math.floor(H * s));
    const o = off.getContext('2d');
    const img = o.createImageData(off.width, off.height);
    const d = img.data;
    // band runs from lower-left to upper-right through the pole-ish region
    const ang = -0.62; // radians
    const cx = off.width * 0.55, cy = off.height * 0.45;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    const halfWidth = Math.min(off.width, off.height) * 0.22;
    // cheap value noise
    const grid = 22, g = [];
    for (let i = 0; i < grid * grid; i++) g.push(Math.random());
    const noise = (x, y) => {
      const fx = (x / off.width) * (grid - 1), fy = (y / off.height) * (grid - 1);
      const x0 = Math.floor(fx), y0 = Math.floor(fy);
      const sm = u => u * u * (3 - 2 * u);
      const tx = sm(fx - x0), ty = sm(fy - y0);
      const v = (i, j) => g[Math.min(grid - 1, j) * grid + Math.min(grid - 1, i)];
      const a = v(x0, y0) * (1 - tx) + v(x0 + 1, y0) * tx;
      const b = v(x0, y0 + 1) * (1 - tx) + v(x0 + 1, y0 + 1) * tx;
      return a * (1 - ty) + b * ty;
    };
    for (let y = 0; y < off.height; y++) {
      for (let x = 0; x < off.width; x++) {
        const dx = x - cx, dy = y - cy;
        const perp = Math.abs(-sin * dx + cos * dy); // distance from band axis
        let v = Math.exp(-(perp * perp) / (2 * halfWidth * halfWidth));
        const n = 0.6 * noise(x * 1.7, y * 1.7) + 0.4 * noise(x * 3.9 + 11, y * 3.9 + 5);
        const n2 = noise(x * 0.6 + 40, y * 0.6 + 17);
        v *= 0.35 + 1.1 * n * n;         // mottling, clumpy
        v *= 1 - 0.55 * Math.pow(n2, 3);  // dust lanes
        const i = (y * off.width + x) * 4;
        // faintly warm-grey, like the real band (no purple)
        d[i] = 188; d[i + 1] = 192; d[i + 2] = 205;
        d[i + 3] = Math.min(255, v * 26);
      }
    }
    o.putImageData(img, 0, 0);
    // soften: blur into a second canvas so no grid structure survives
    const soft = document.createElement('canvas');
    soft.width = off.width; soft.height = off.height;
    const sc = soft.getContext('2d');
    sc.filter = 'blur(' + Math.max(6, off.width / 90) + 'px)';
    sc.drawImage(off, 0, 0);
    milky = soft;
  }

  function drawFrame(now) {
    const t = (now - t0) / 1000;
    // Sidereal rotation: real sky turns 360° in 23h56m. We speed it up so a
    // patient viewer sees drift: one full turn per ~40 minutes.
    const rot = reduced ? 0 : (t / 2400) * Math.PI * 2;

    // sky base: very dark, slight blue-grey; a touch brighter toward the horizon (bottom)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#05070c');
    grad.addColorStop(0.75, '#070a10');
    grad.addColorStop(1, '#0b0e14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Milky Way (rotates with the stars)
    if (milky) {
      ctx.save();
      ctx.translate(pole.x, pole.y);
      ctx.rotate(rot);
      ctx.translate(-pole.x, -pole.y);
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = 1;
      // overscan so rotation never shows edges
      ctx.drawImage(milky, -W * 0.5, -H * 0.5, W * 2, H * 2);
      ctx.restore();
    }

    // Stars
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const c = Math.cos(s.th), sn = Math.sin(s.th);
      const lx = s.r * c, ly = s.r * sn;
      const x = pole.x + lx * cosR - ly * sinR;
      const y = pole.y + lx * sinR + ly * cosR;
      if (x < -3 || y < -3 || x > W + 3 || y > H + 3) continue;

      let a = s.alpha;
      if (s.twinkle && !reduced) {
        // two incommensurate sines → irregular flicker, not a pulse
        const f = Math.sin(t * s.rate + s.ph) * 0.6 + Math.sin(t * s.rate * 1.73 + s.ph * 2.1) * 0.4;
        a = Math.max(0.05, Math.min(1, a + f * s.twinkle * 0.35));
      }
      // atmospheric extinction: stars near the horizon look dimmer
      a *= 1 - 0.35 * Math.max(0, (y / H - 0.7) / 0.3);

      const [r, g, b] = s.rgb;
      if (s.size > 1.3) {
        // bright stars: small soft halo
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.18})`;
        ctx.beginPath(); ctx.arc(x, y, s.size * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill();
    }

    // Meteor: brief, thin, slightly greenish-white streak that fades.
    if (!reduced) {
      if (!meteor && now > nextMeteorAt) {
        const ang = rand(Math.PI * 0.55, Math.PI * 0.8);
        meteor = {
          x: rand(W * 0.2, W * 0.9), y: rand(0, H * 0.35),
          vx: Math.cos(ang) * rand(900, 1500), vy: Math.sin(ang) * rand(900, 1500),
          born: now, life: rand(280, 520), len: rand(60, 140),
        };
      }
      if (meteor) {
        const age = now - meteor.born;
        if (age > meteor.life) {
          meteor = null;
          nextMeteorAt = now + rand(45000, 120000);
        } else {
          const k = age / 1000;
          const x = meteor.x + meteor.vx * k, y = meteor.y + meteor.vy * k;
          const fade = 1 - age / meteor.life;
          const nx = meteor.vx, ny = meteor.vy, n = Math.hypot(nx, ny);
          const tx = x - (nx / n) * meteor.len, ty = y - (ny / n) * meteor.len;
          const g2 = ctx.createLinearGradient(tx, ty, x, y);
          g2.addColorStop(0, 'rgba(210,235,225,0)');
          g2.addColorStop(1, `rgba(230,245,240,${0.85 * fade})`);
          ctx.strokeStyle = g2; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        }
      }
    }
  }

  let raf = 0;
  function loop(now) { drawFrame(now); raf = requestAnimationFrame(loop); }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { build(); if (reduced) drawFrame(performance.now()); }, 150);
  });
  document.addEventListener('visibilitychange', () => {
    if (reduced) return;
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop);
  });

  build();
  nextMeteorAt = performance.now() + rand(8000, 25000);
  if (reduced) drawFrame(performance.now()); else raf = requestAnimationFrame(loop);
})();
