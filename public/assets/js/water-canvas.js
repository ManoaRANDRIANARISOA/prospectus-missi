/* ==========================================================================
   MISSI INNOVATION — WEBGL WATER RIPPLE CANVAS (LIN & BRUNS NOBLES)
   - Crête illuminée blanc pur + nuance Châtaigne Clair (#C8A282)
   - Réfraction ombrée très légère Brun Noyer (#3B2820) dans les creux
   - Désactivé sur mobile/tactile & prefers-reduced-motion: reduce
   - Auto-pause après 4s d'inactivité et quand l'onglet est caché
   ========================================================================== */
(function initPureWaterCanvas() {
  'use strict';

  const mobileOrCoarse = window.matchMedia('(max-width: 768px), (pointer: coarse)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mobileOrCoarse.matches || reducedMotion.matches) return;

  const canvas = document.getElementById('ambient-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const gl =
    canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true }) ||
    canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return;

  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const vsSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;

    #define MAX_DROPS 6
    uniform vec4 u_drops[MAX_DROPS];

    #define MAX_WAKE 24
    uniform vec4 u_wake[MAX_WAKE];

    void main() {
      vec2 screenPos = v_uv * u_resolution;
      float totalH = 0.0;
      vec2 grad = vec2(0.0);

      for (int i = 0; i < MAX_WAKE; i++) {
        vec4 w = u_wake[i];
        float age = u_time - w.z;
        if (age > 0.0 && age < 3.2) {
          vec2 diff = screenPos - w.xy;
          float dist = length(diff);
          if (dist > 0.5) {
            vec2 dir = diff / dist;
            float waveR = age * 95.0;
            float dR = dist - waveR;
            float sigma = 15.0 + age * 12.0;
            float env = exp(-(dR * dR) / (2.0 * sigma * sigma));
            float damping = exp(-age * 1.35);
            float dispersion = 1.0 / sqrt(1.0 + dist * 0.006);
            float window = smoothstep(3.2, 2.0, age);
            float k = 0.16;
            float amp = 0.48 * env * damping * dispersion * window * min(1.2, w.w * 0.9);
            totalH += amp * cos(k * dR);
            grad += dir * amp * (-k * sin(k * dR) - (dR / (sigma * sigma)) * cos(k * dR));
          }
        }
      }

      for (int j = 0; j < MAX_DROPS; j++) {
        vec4 d = u_drops[j];
        float age = u_time - d.z;
        if (age > 0.0 && age < 3.8) {
          vec2 diff = screenPos - d.xy;
          float dist = length(diff);
          if (dist > 0.5) {
            vec2 dir = diff / dist;
            float waveR = age * 135.0;
            float dR = dist - waveR;
            float sigma = 18.0 + age * 11.0;
            float env = exp(-(dR * dR) / (2.0 * sigma * sigma));
            float damping = exp(-age * 1.05);
            float dispersion = 1.0 / sqrt(1.0 + waveR * 0.008);
            float window = smoothstep(3.8, 2.5, age);
            float k = 0.14;
            float amp = 0.72 * env * damping * dispersion * window * d.w;
            totalH += amp * cos(k * dR);
            grad += dir * amp * (-k * sin(k * dR) - (dR / (sigma * sigma)) * cos(k * dR));
          }
        }
      }

      float slope = length(grad);
      if (slope < 0.0001 && abs(totalH) < 0.0001) {
        gl_FragColor = vec4(0.0);
        return;
      }

      vec3 normal = normalize(vec3(-grad * 24.0, 1.0));
      vec3 light = normalize(vec3(-0.35, 0.45, 0.8));
      vec3 eye = vec3(0.0, 0.0, 1.0);
      vec3 halfVec = normalize(light + eye);
      float spec = pow(max(0.0, dot(normal, halfVec)), 26.0);
      float crest = max(0.0, totalH);
      float trough = max(0.0, -totalH);
      float backSlope = max(0.0, dot(normal, -light));
      float caustic = crest * slope * 2.2;

      // Crête illuminée blanc pur + touche Châtaigne Clair (#C8A282)
      vec3 pureWhite = vec3(1.0, 1.0, 1.0);
      vec3 lightChestnut = vec3(0.784, 0.635, 0.510);
      vec3 walnutShadow = vec3(0.231, 0.157, 0.125);

      vec3 litColor =
        pureWhite * (spec * 2.4 + caustic * 0.95) +
        lightChestnut * (spec * 0.35 + caustic * 0.30 + slope * 0.16);

      float litAlpha = clamp(spec * 1.45 + caustic * 0.82 + slope * 0.22, 0.0, 0.86);

      // Creux / face opposée : réfraction ombrée très légère Brun Noyer (~0.08-0.11)
      float shadeAlpha = clamp((trough * 0.48 + backSlope * 0.22) * min(slope * 2.8, 1.0), 0.0, 0.11);

      float totalAlpha = clamp(litAlpha + shadeAlpha, 0.0, 0.88);
      vec3 premult = litColor * litAlpha + walnutShadow * shadeAlpha * (1.0 - min(litAlpha, 1.0));
      gl_FragColor = vec4(clamp(premult, 0.0, 1.0), totalAlpha);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uDropsLoc = gl.getUniformLocation(program, 'u_drops[0]');
  const uWakeLoc = gl.getUniformLocation(program, 'u_wake[0]');

  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const MAX_DROPS = 6;
  const dropsData = new Float32Array(MAX_DROPS * 4);
  let dropIndex = 0;

  const MAX_WAKE = 24;
  const wakeData = new Float32Array(MAX_WAKE * 4);
  let wakeIndex = 0;
  let lastWakeX = 0;
  let lastWakeY = 0;
  let lastWakeTime = 0;

  let lastActivityTime = -10000;
  let rafId = null;

  function ensureAnimating() {
    if (document.hidden || reducedMotion.matches || mobileOrCoarse.matches) return;
    lastActivityTime = performance.now();
    if (rafId === null) {
      rafId = requestAnimationFrame(render);
    }
  }

  function addDrop(x, y, strength) {
    const idx = dropIndex % MAX_DROPS;
    dropsData[idx * 4 + 0] = x * dpr;
    dropsData[idx * 4 + 1] = (height - y) * dpr;
    dropsData[idx * 4 + 2] = performance.now() / 1000.0;
    dropsData[idx * 4 + 3] = strength !== undefined ? strength : 1.0;
    dropIndex++;
    ensureAnimating();
  }

  function addWakePoint(x, y, speed) {
    const idx = wakeIndex % MAX_WAKE;
    wakeData[idx * 4 + 0] = x * dpr;
    wakeData[idx * 4 + 1] = (height - y) * dpr;
    wakeData[idx * 4 + 2] = performance.now() / 1000.0;
    wakeData[idx * 4 + 3] = speed;
    wakeIndex++;
    ensureAnimating();
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      const now = performance.now();
      if (now - lastWakeTime > 250) {
        lastWakeX = e.clientX;
        lastWakeY = e.clientY;
        lastWakeTime = now;
        return;
      }
      const dt = Math.max(8, Math.min(60, now - lastWakeTime));
      const dist = Math.hypot(e.clientX - lastWakeX, e.clientY - lastWakeY);
      if (dist > 14) {
        const speed = Math.min(dist / dt, 2.5);
        addWakePoint(e.clientX, e.clientY, speed);
        lastWakeX = e.clientX;
        lastWakeY = e.clientY;
        lastWakeTime = now;
      }
    },
    { capture: true, passive: true }
  );

  window.addEventListener(
    'pointerdown',
    (e) => {
      addDrop(e.clientX, e.clientY, 1.25);
      lastWakeX = e.clientX;
      lastWakeY = e.clientY;
      lastWakeTime = performance.now();
    },
    { capture: true, passive: true }
  );

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  function render(now) {
    if (document.hidden || reducedMotion.matches || mobileOrCoarse.matches) {
      rafId = null;
      return;
    }

    // Auto-pause after 4.0s of inactivity
    if (now - lastActivityTime > 4000) {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      rafId = null;
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, now / 1000.0);
    if (uDropsLoc) gl.uniform4fv(uDropsLoc, dropsData);
    if (uWakeLoc) gl.uniform4fv(uWakeLoc, wakeData);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    rafId = requestAnimationFrame(render);
  }

  // Onde d'accueil unique au chargement (s'arrête automatiquement après 4s)
  setTimeout(() => {
    if (!document.hidden && !reducedMotion.matches && !mobileOrCoarse.matches) {
      addDrop(width * 0.52, height * 0.34, 1.1);
    }
  }, 180);
})();
