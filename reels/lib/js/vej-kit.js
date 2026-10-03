/* VEJ reel kit — «botánico editorial de papel». Base de dibujo; las primitivas extra viven en vej-prims.js
 * (se enchufan con VEJ.extend) y el reproductor (título, subtítulos, cierre) en reel-runtime.js.
 * Componentes de dibujo 2D para HyperFrames (canvas + hf-seek). Todo es función pura del tiempo:
 * cada componente recibe t (o un progreso 0..1) y redibuja; nada acumula estado entre frames.
 * Uso: const K = VEJ.kit(ctx, {W, H, seed}); luego K.wall(t), K.light(t, opts), K.plant(...), etc.
 */
(function () {
  const C = {
    ink: '#0A1F1C', card: '#14302A', moss: '#2D4A3F', bright: '#4B8D6B', leafLight: '#6FA887',
    terra: '#D2725A', terraSoft: '#DE8C74', terraDeep: '#B35A44', amber: '#C9A961',
    cream: '#F5EFE4', creamSoft: '#E8E1D3', wall: '#EFE7D8', floor: '#E2D6C1',
    wood: '#D4B189', woodMid: '#BF9469', woodShade: '#A27A55', woodLine: '#8A6343',
    ramas: '#7B5236', ramasBg: '#3A281D', compost: '#5A3C28', compostBit: '#8A6446',
    soil: '#3B2A20', soilTop: '#4A3527', hand: '#DB8A72', handLine: '#B9654F', sleeve: '#2D4A3F', linen: '#F1E7D6', linenCuff: '#E5D6BF',
    shadow: 'rgba(10,31,28,0.26)',
  };

  // ---------- utilidades ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    inOut: (u) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(u)),                // seno: sin tirones
    out: (u) => 1 - Math.pow(1 - clamp(u), 3),
    outSoft: (u) => { u = clamp(u); return 1 - Math.pow(1 - u, 2.2); },
    outBack: (u) => { u = clamp(u); const c = 1.2; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); },
  };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6d2b79f5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // ruido suave 1D determinista (suma de senos con fases de semilla)
  const wob = (t, s = 0) => Math.sin(t * 0.9 + s) * 0.6 + Math.sin(t * 1.7 + s * 2.3) * 0.3 + Math.sin(t * 3.1 + s * 5.1) * 0.1;
  function bez(p, u) { // cúbica: p = [[x,y]x4]
    const v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
    return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
  }


  // ================= LOGO VEJ (símbolo) — vector fiel a /brand-mark.png =================
  // Coordenadas en el espacio 1024×1024 del PNG escalado ×8, medidas sobre sus píxeles:
  // círculo ajustado por mínimos cuadrados (centro 506.9,494.5 · r 404.2), el resto por centro de trazo.
  // Trazo = 17/1024 del lado. Cada trazo es una polilínea densa, así se puede dibujar por longitud exacta.
  const LOGO = (() => {
    const cr = (pts, n = 10) => {                  // Catmull-Rom → puntos densos (pasa por todos los puntos)
      const out = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (let k = 0; k < n; k++) {
          const u = k / n, u2 = u * u, u3 = u2 * u;
          out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
                    0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)]);
        }
      }
      out.push(pts[pts.length - 1]); return out;
    };
    const CX = 506.9, CY = 494.5, R = 404.2, d2r = Math.PI / 180;
    // el círculo del original no es perfecto: abajo se ensancha poco a poco (+15 px a 124°, +21 px a 92°) hasta la cúspide
    const ring = [];
    for (let a = -12.7; a >= -260; a -= 1.2) {                         // arriba → izquierda → abajo (100°)
      const th = a + 360, u = Math.min(1, Math.max(0, (160 - th) / 68)), r = R + 21 * (1 - (1 - u) * (1 - u));
      ring.push([CX + r * Math.cos(a * d2r), CY + r * Math.sin(a * d2r)]);
    }
    const ringTail = cr([ring[ring.length - 2], ring[ring.length - 1], [494, 921], [526, 927], [553, 933]]).slice(10);   // tangente continua hasta la cúspide
    const stem = cr([[553, 933], [547, 900], [545, 862], [549, 826], [557, 800], [566, 778], [571, 755], [571, 730], [567, 700], [563, 660], [561, 620], [561, 580], [564, 545], [570, 505]]);
    const leafTop = [...cr([[570, 505], [540, 478], [523, 460], [513, 440], [507, 420], [506, 400], [508, 380], [513, 360], [522, 340], [536, 320], [554, 300], [576, 280], [600, 260], [622, 242], [633, 227]]),
                     ...cr([[633, 227], [640, 260], [646, 280], [654, 300], [660, 320], [665, 340], [668, 360], [669, 385], [667, 405], [662, 422], [653, 441], [640, 460], [618, 480], [595, 494], [570, 505]])];
    const leafLeft = [...cr([[260, 418], [340, 440], [402, 460], [442, 480], [466, 500], [483, 520], [494, 540], [500, 560], [504, 585], [503, 610], [495, 632], [478, 648], [455, 658], [432, 662]]),
                      ...cr([[432, 662], [405, 661], [375, 655], [346, 642], [322, 622], [305, 600], [294, 576], [286, 550], [280, 525], [274, 500], [270, 470], [267, 443], [260, 418]])];
    const veinLeft = cr([[384, 544], [406, 560], [430, 580], [448, 600], [468, 620], [487, 641], [500, 660], [508, 680], [516, 700], [524, 720], [530, 742], [534, 766]]);
    const leafRight = [...cr([[564, 614], [575, 594], [588, 578], [603, 560], [626, 540], [655, 521], [704, 500], [760, 487], [812, 478], [868, 470], [920, 464]]),
                       ...cr([[920, 464], [905, 481], [895, 500], [892, 520], [888, 540], [885, 560], [880, 580], [874, 600], [867, 620], [859, 640], [849, 660], [835, 680], [817, 700], [792, 720], [752, 741], [702, 757], [662, 763], [632, 756], [607, 743], [588, 732], [571, 724]])];
    const veinRight = cr([[752, 588], [734, 600], [702, 619], [673, 640], [651, 660], [633, 680], [617, 700], [603, 718], [592, 734]]);
    const len = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
    // orden de dibujo: círculo → ramita → hojas una por una (izquierda + nervadura, derecha + nervadura, superior)
    const strokes = [
      { name: 'ring', pts: [...ring, ...ringTail], at: [0.00, 0.34] },
      { name: 'stem', pts: stem, at: [0.30, 0.48] },
      { name: 'leafLeft', pts: leafLeft, at: [0.46, 0.66] },
      { name: 'veinLeft', pts: veinLeft, at: [0.60, 0.70] },
      { name: 'leafRight', pts: leafRight, at: [0.64, 0.84] },
      { name: 'veinRight', pts: veinRight, at: [0.78, 0.87] },
      { name: 'leafTop', pts: leafTop, at: [0.82, 1.00] },
    ];
    for (const s of strokes) s.len = len(s.pts);
    return { strokes, box: 1024, width: 16 };
  })();

  function kit(ctx, opt) {
    const W = opt.W, H = opt.H, SEED = opt.seed || 7;
    const lowScale = 6;                                   // capas de luz/sombra a 1/6: el reescalado da el desenfoque
    const low = document.createElement('canvas'); low.width = Math.ceil(W / lowScale); low.height = Math.ceil(H / lowScale);
    const lx = low.getContext('2d');
    const shadeScale = 14;
    const shade = document.createElement('canvas'); shade.width = Math.ceil(W / shadeScale); shade.height = Math.ceil(H / shadeScale);
    const sx = shade.getContext('2d');

    // grano de papel: 3 texturas precalculadas con semilla, alternadas a 12 fps
    const grains = [0, 1, 2].map((k) => {
      const g = document.createElement('canvas'); g.width = W / 2; g.height = H / 2;
      const gx = g.getContext('2d'), img = gx.createImageData(g.width, g.height), r = mulberry32(SEED * 97 + k);
      for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - 0.5) * 120; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      gx.putImageData(img, 0, 0); return g;
    });
    // fibras de papel (estáticas): manchas grandes muy suaves
    const fibers = document.createElement('canvas'); fibers.width = 90; fibers.height = 160;
    { const fx = fibers.getContext('2d'), r = mulberry32(SEED + 3);
      fx.fillStyle = '#808080'; fx.fillRect(0, 0, 90, 160);
      for (let i = 0; i < 260; i++) { fx.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.05 + r() * 0.08})`; fx.beginPath(); fx.arc(r() * 90, r() * 160, 2 + r() * 7, 0, 7); fx.fill(); } }

    // sombra de papel recortado sobre lo que dibuje fn
    function paper(fn, o = {}) {
      ctx.save();
      ctx.shadowColor = o.color || C.shadow; ctx.shadowBlur = o.blur ?? 16;
      ctx.shadowOffsetX = o.dx ?? 5; ctx.shadowOffsetY = o.dy ?? 9;
      fn(); ctx.restore();
    }

    // ---------- fondo: pared + piso de papel ----------
    function wall(t, floorY) {
      const g = ctx.createLinearGradient(0, 0, W, floorY);
      g.addColorStop(0, '#E9E0CF'); g.addColorStop(0.55, C.wall); g.addColorStop(1, '#E6DCCA');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, floorY);
      const f = ctx.createLinearGradient(0, floorY, 0, H);
      f.addColorStop(0, '#D9CCB5'); f.addColorStop(0.12, C.floor); f.addColorStop(1, '#D6C8B0');
      ctx.fillStyle = f; ctx.fillRect(0, floorY, W, H - floorY);
      // zoclo de papel con su sombrita
      paper(() => { ctx.fillStyle = C.creamSoft; ctx.fillRect(0, floorY - 22, W, 22); }, { blur: 10, dx: 0, dy: 5 });
      ctx.strokeStyle = 'rgba(138,99,67,0.35)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, floorY - 22.5); ctx.lineTo(W, floorY - 22.5); ctx.stroke();
      // duela del piso: juntas horizontales que se abren hacia el frente + juntas verticales escalonadas
      ctx.save(); ctx.strokeStyle = 'rgba(138,99,67,0.14)'; ctx.lineWidth = 1.2;
      const rows = 7; let prevY = floorY;
      for (let i = 1; i <= rows; i++) {
        const y = floorY + (H - floorY) * Math.pow(i / rows, 1.45);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        const r = mulberry32(SEED + 60 + i), step = 260 + 90 * i / rows;
        for (let x = r() * step; x < W; x += step * (0.8 + r() * 0.5)) { ctx.beginPath(); ctx.moveTo(x, prevY + 2); ctx.lineTo(x, y - 2); ctx.stroke(); }
        prevY = y;
      }
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.55; ctx.imageSmoothingEnabled = true;
      ctx.drawImage(fibers, 0, 0, W, H); ctx.restore();
    }

    // ---------- luz de ventana: mancha dorada con parteluz + sombras de hojas que se mecen + haz con polen ----------
    function light(t, o = {}) {
      const k = o.intensity ?? 1, drift = Math.sin(t * 0.16) * 26 + t * 1.6;     // se mueve lento, nunca salta
      const s = 1 / lowScale;
      lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, low.width, low.height);
      lx.setTransform(s, 0, 0, s, 0, 0);
      // mancha de ventana (paralelogramo inclinado), 2x3 paneles
      const x0 = 250 + drift, y0 = 120, pw = 690, ph = 1180, sk = 300;
      lx.fillStyle = '#FFD891';
      lx.beginPath(); lx.moveTo(x0, y0); lx.lineTo(x0 + pw, y0 + 120); lx.lineTo(x0 + pw + sk, y0 + 120 + ph); lx.lineTo(x0 + sk, y0 + ph); lx.closePath(); lx.fill();
      lx.globalCompositeOperation = 'destination-out';
      lx.fillStyle = 'rgba(0,0,0,0.92)';
      const bar = (u, w) => { lx.beginPath(); lx.moveTo(x0 + pw * u, y0 + 120 * u); lx.lineTo(x0 + pw * u + w, y0 + 120 * u + 2); lx.lineTo(x0 + pw * u + w + sk, y0 + 120 * u + ph); lx.lineTo(x0 + pw * u + sk, y0 + 120 * u + ph); lx.closePath(); lx.fill(); };
      bar(0.5, 34);
      for (const v of [0.34, 0.67]) { const yy = y0 + ph * v; lx.beginPath(); lx.moveTo(x0 + sk * v - 10, yy); lx.lineTo(x0 + sk * v + pw + 10, yy + 120); lx.lineTo(x0 + sk * v + pw + 10, yy + 150); lx.lineTo(x0 + sk * v - 10, yy + 30); lx.closePath(); lx.fill(); }
      // hojas de una planta fuera de cuadro (arriba a la derecha) proyectadas dentro de la luz
      const r = mulberry32(SEED + 11);
      lx.fillStyle = 'rgba(0,0,0,0.78)';
      for (let b = 0; b < 3; b++) {
        const bx = 1080 + 40 * b, by = 60 + 260 * b, sw = wob(t * 0.55, b * 2) * 0.09;
        lx.save(); lx.translate(bx, by); lx.rotate(-0.35 + b * 0.15 + sw);
        lx.lineWidth = 10; lx.strokeStyle = 'rgba(0,0,0,0.7)'; lx.beginPath(); lx.moveTo(0, 0); lx.quadraticCurveTo(-260, 60, -520, 160); lx.stroke();
        for (let i = 0; i < 7; i++) {
          const u = 0.2 + i * 0.12, px = -520 * u, py = 160 * u * u + 30 * u, side = i % 2 ? 1 : -1;
          const a = side * (0.9 + r() * 0.4) + wob(t * 0.8, i + b * 7) * 0.12, L = 120 + r() * 70;
          lx.save(); lx.translate(px, py); lx.rotate(a + Math.PI);
          lx.beginPath(); lx.moveTo(0, 0); lx.quadraticCurveTo(L * 0.4, -L * 0.28, L, 0); lx.quadraticCurveTo(L * 0.4, L * 0.28, 0, 0); lx.fill();
          lx.restore();
        }
        lx.restore();
      }
      lx.globalCompositeOperation = 'source-over';
      ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = Math.min(1, 1.0 * k); ctx.drawImage(low, 0, 0, W, H);
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.34 * k; ctx.drawImage(low, 0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.10 * k; ctx.drawImage(low, 0, 0, W, H);
      // haz volumétrico diagonal desde arriba a la izquierda
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.20 * k;
      const hx = drift * 0.6;
      const g = ctx.createLinearGradient(0 + hx, 0, 700 + hx, 1500);
      g.addColorStop(0, 'rgba(255,226,160,0.9)'); g.addColorStop(1, 'rgba(255,226,160,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-100 + hx, -50); ctx.lineTo(420 + hx, -50); ctx.lineTo(1250 + hx, 1700); ctx.lineTo(520 + hx, 1900); ctx.closePath(); ctx.fill();
      ctx.restore();
      motes(t, hx, k);
    }

    // polen / polvo flotando dentro del haz: posición = f(t), sin integrar
    const moteSeeds = (() => { const r = mulberry32(SEED + 5); return Array.from({ length: 46 }, () => ({ u: r(), v: r(), s: 0.4 + r(), p: r() * 6.28, z: r() })); })();
    function motes(t, hx, k) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (const m of moteSeeds) {
        const along = (m.v + t * 0.012 * m.s) % 1;                 // baja muy lento a lo largo del haz
        const bx = lerp(160, 900, along) + hx + (m.u - 0.5) * lerp(420, 700, along);
        const by = lerp(0, 1650, along) + Math.sin(t * 0.7 * m.s + m.p) * 18;
        const x = bx + Math.sin(t * 0.5 * m.s + m.p * 2) * 22;
        const a = (0.5 + 0.4 * Math.sin(t * 1.3 * m.s + m.p)) * k * Math.sin(Math.PI * along);
        const rr = 2.2 + m.z * 3.6;
        const g = ctx.createRadialGradient(x, by, 0, x, by, rr * 3);
        g.addColorStop(0, `rgba(255,236,190,${a})`); g.addColorStop(1, 'rgba(255,236,190,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, by, rr * 3, 0, 7); ctx.fill();
      }
      ctx.restore();
    }

    // sombra larga proyectada en la pared (luz desde arriba-izquierda): silueta desplazada y desenfocada
    function castShadow(drawSil, o = {}) {
      const s = 1 / shadeScale;
      sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, shade.width, shade.height);
      sx.setTransform(s, 0, 0, s, (o.dx ?? 56) * s, (o.dy ?? 14) * s);
      sx.globalAlpha = 1; sx.fillStyle = '#000'; drawSil(sx);
      ctx.save(); ctx.globalAlpha = o.alpha ?? 0.16; ctx.globalCompositeOperation = 'multiply';
      ctx.imageSmoothingEnabled = true; ctx.drawImage(shade, 0, 0, W, H); ctx.restore();
    }
    // sombra larga sobre el piso: la base del objeto se estira hacia atrás-derecha (luz de arriba-izquierda)
    function floorShadow(x0, x1, y, len = 240, a = 0.22) {
      const s = 1 / shadeScale;
      sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, shade.width, shade.height);
      sx.setTransform(s, 0, 0, s, 0, 0); sx.globalAlpha = 1;
      const g = sx.createLinearGradient(x0, y, x1 + len, y - len * 0.3);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      sx.fillStyle = g; sx.beginPath(); sx.moveTo(x0, y); sx.lineTo(x1, y); sx.lineTo(x1 + len, y - len * 0.3); sx.lineTo(x0 + len * 0.8, y - len * 0.3); sx.closePath(); sx.fill();
      ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'multiply'; ctx.imageSmoothingEnabled = true;
      ctx.drawImage(shade, 0, 0, W, H); ctx.restore();
    }
    function contactShadow(x, y, rx, ry, a = 0.28) {
      ctx.save();
      const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, `rgba(10,31,28,${a})`); g.addColorStop(1, 'rgba(10,31,28,0)');
      ctx.fillStyle = g; ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
      ctx.beginPath(); ctx.arc(x, y, rx, 0, 7); ctx.fill(); ctx.restore();
    }

    // grano encima de todo (sutil, vivo a 12 fps)
    function grain(t, a = 0.075) {
      const g = grains[Math.floor(t * 12) % 3];
      ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; ctx.drawImage(g, 0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1;
      const v = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.28, W / 2, H * 0.5, H * 0.72);
      v.addColorStop(0, 'rgba(255,255,255,0)'); v.addColorStop(1, 'rgba(120,95,70,0.35)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore();
    }

    // ---------- tallo que crece: cúbica rellena con grosor decreciente ----------
    function stem(p, grow, w0, w1, color, sway = 0) {
      const n = 48, pts = [];
      const g = clamp(grow); if (g <= 0.001) return { tip: p[0], ang: -Math.PI / 2, at: () => [p[0], -Math.PI / 2] };
      const P = sway ? p.map((q, i) => [q[0] + sway * i * i / 9 * 60, q[1]]) : p;   // se mece más arriba que abajo
      for (let i = 0; i <= n; i++) pts.push(bez(P, (i / n) * g));
      const left = [], right = [];
      for (let i = 0; i <= n; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
        const w = lerp(w0, w1, i / n) * 0.5 * (i === n ? 0.6 : 1);
        left.push([pts[i][0] + Math.cos(ang) * w, pts[i][1] + Math.sin(ang) * w]);
        right.push([pts[i][0] - Math.cos(ang) * w, pts[i][1] - Math.sin(ang) * w]);
      }
      paper(() => {
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(left[0][0], left[0][1]);
        for (const q of left) ctx.lineTo(q[0], q[1]);
        const tip = pts[n]; ctx.lineTo(tip[0], tip[1]);
        for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
        ctx.closePath(); ctx.fill();
      }, { blur: 10, dx: 4, dy: 6 });
      const tipA = Math.atan2(pts[n][1] - pts[n - 1][1], pts[n][0] - pts[n - 1][0]);
      // at(u): punto y ángulo en u (de la curva completa), para colgar hojas
      const at = (u) => { const a = bez(P, Math.max(0, u - 0.01)), b = bez(P, Math.min(1, u + 0.01)); return [bez(P, u), Math.atan2(b[1] - a[1], b[0] - a[0])]; };
      return { tip: pts[n], ang: tipA, at };
    }

    // ---------- hoja: se abre (largo primero, ancho después), dos tonos tipo papel doblado + nervadura ----------
    function leaf(x, y, ang, len, wid, open, o = {}) {
      const k = clamp(open); if (k <= 0.001) return;
      const L = len * E.outBack(k), Wd = wid * E.out(prog(k, 0.25, 1));
      const a = lerp(o.closedAng ?? ang, ang, E.out(k)) + (o.flutter || 0);
      paper(() => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.fillStyle = o.color || C.bright;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.bezierCurveTo(L * 0.25, -Wd * 1.05, L * 0.75, -Wd * 0.8, L, 0);
        ctx.bezierCurveTo(L * 0.72, Wd * 0.85, L * 0.28, Wd * 0.95, 0, 0); ctx.fill();
        ctx.restore();
      }, { blur: 12, dx: 5, dy: 8 });
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      const A = ctx.globalAlpha; ctx.fillStyle = o.dark || C.moss; ctx.globalAlpha = A * 0.55;             // mitad en sombra
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0);
      ctx.bezierCurveTo(L * 0.72, Wd * 0.85, L * 0.28, Wd * 0.95, 0, 0); ctx.fill();
      ctx.globalAlpha = A * 0.5; ctx.strokeStyle = C.cream; ctx.lineWidth = Math.max(1, len * 0.012);
      ctx.beginPath(); ctx.moveTo(L * 0.04, 0); ctx.quadraticCurveTo(L * 0.5, -Wd * 0.08, L * 0.9, 0); ctx.stroke();
      ctx.globalAlpha = A * 0.28; ctx.lineWidth = Math.max(0.8, len * 0.006);
      for (let i = 1; i <= 3; i++) { const u = i / 4.2; ctx.beginPath(); ctx.moveTo(L * u, -Wd * 0.02); ctx.quadraticCurveTo(L * (u + 0.08), -Wd * 0.4, L * (u + 0.16), -Wd * 0.62); ctx.stroke(); }
      ctx.restore();
    }

    // ---------- flor: capullo → pétalos que se despliegan uno por uno con leve rebote + brillo dorado ----------
    const back = (u, c = 1.9) => { u = clamp(u); return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
    function petal(x, y, ang, len, wid, color) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(len * 0.3, -wid, len, -wid * 0.75, len, 0); ctx.bezierCurveTo(len, wid * 0.75, len * 0.3, wid, 0, 0); ctx.fill();
      ctx.restore();
    }
    function flower(x, y, open, t, size = 70, stemAng = -Math.PI / 2) {
      const k = clamp(open); if (k <= 0.001) return;
      const R = size, n = 7, bud = E.out(prog(k, 0, 0.12));
      if (k > 0.25) {                                                     // brillo dorado cuando ya abre
        const gk = E.inOut(prog(k, 0.25, 1));
        ctx.save(); const glow = ctx.createRadialGradient(x, y, 0, x, y, R * 2.6);
        glow.addColorStop(0, `rgba(201,169,97,${0.55 * gk})`); glow.addColorStop(1, 'rgba(201,169,97,0)');
        ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, R * 2.6, 0, 7); ctx.fill(); ctx.restore();
      }
      const sway = Math.sin(t * 0.7) * 0.04;
      const order = [0, 3, 5, 1, 4, 6, 2];                                // no se abren en orden de reloj
      for (let layer = 0; layer < 2; layer++) {
        paper(() => {
          for (let j = 0; j < n; j++) {
            const i = order[j], d = layer ? 0.5 + j * 0.05 : 0.1 + j * 0.065;
            const kp = prog(k, d, d + 0.34), b = back(kp);
            const final = sway + (i + layer * 0.5) * (Math.PI * 2 / n) - Math.PI / 2;
            const fold = stemAng + (i / (n - 1) - 0.5) * 0.5;                // cerrado: todos apuntan hacia arriba (capullo)
            const L = (layer ? 0.7 : 1) * R * lerp(0.42 * bud, 1, b), Wd = (layer ? 0.7 : 1) * R * 0.44 * lerp(0.4, 1, clamp(b));
            petal(x, y, lerp(fold, final, clamp(b * 1.0, 0, 1.08)), L, Wd, layer ? C.terraSoft : (j % 2 ? C.terra : '#CC6A52'));
          }
        }, { blur: 10, dx: 4, dy: 6 });
      }
      const ck = back(prog(k, 0.62, 0.9), 2.2);                            // centro: aparece con rebote
      if (ck > 0.01) {
        ctx.save(); ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(x, y, R * 0.24 * ck, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(122,82,54,0.75)';
        for (let i = 0; i < 9; i++) { const a = i * 2.4, rr = R * 0.12 * ck * Math.sqrt((i + 1) / 9); ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 2.2 * ck, 0, 7); ctx.fill(); }
        ctx.restore();
      }
    }

    // ---------- planta compuesta: tallo + hojas (+ flor). spec.leaves: [{u, side, len, wid, at:[t0,t1]}] ----------
    // o.ts: tiempo real para el meneo (si t es un tiempo "virtual" de crecimiento); o.droop: hojas caídas (rad, 0 = sanas)
    function plant(t, spec, o = {}) {
      const g = E.inOut(prog(t, spec.grow[0], spec.grow[1])), ts = o.ts ?? t;
      const sway = Math.sin(ts * 0.9 + (spec.phase || 0)) * 0.018 * g;
      const s = stem(spec.pts, g, spec.w0 || 16, spec.w1 || 5, spec.color || C.moss, sway * 3);
      for (const lf of spec.leaves || []) {
        if (!lf.tip && g < lf.u) continue;                          // tip: la hoja viaja con la punta que crece
        const [pt, ang] = lf.tip ? [s.tip, s.ang] : s.at(lf.u);
        const k = prog(t, lf.at[0], lf.at[1]);
        const fl = Math.sin(ts * 1.3 + (lf.u || 1) * 9) * 0.05;
        const a = ang + lf.side * ((lf.spread || 1.05) + (o.droop || 0) * (lf.droop ?? 1));
        const shape = lf.shape || spec.shape;
        (shape && self.leafX ? self.leafX : leaf)(pt[0], pt[1], a, lf.len, lf.wid, E.inOut(k),
          { closedAng: ang, flutter: fl, color: lf.color, dark: lf.dark, shape, holes: lf.holes, t: ts });
      }
      if (spec.flower) flower(s.tip[0], s.tip[1], prog(t, spec.flower[0], spec.flower[1]), t, spec.flowerSize, s.ang);
      return s;
    }

    // ---------- semilla ----------
    function seed(x, y, k, crack) {
      if (k <= 0) return;
      paper(() => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.4 + crack * 0.5); ctx.scale(E.outBack(k), E.outBack(k));
        ctx.fillStyle = '#C8A06E'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 13, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(122,82,54,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.quadraticCurveTo(0, -4 - crack * 5, 16, 0); ctx.stroke();
        ctx.restore();
      }, { blur: 6, dx: 2, dy: 4 });
    }

    // ---------- maceta de barro con puntitos ----------
    function pot(cx, rimY, baseY, topW, botW, o = {}) {
      const rimH = o.rimH ?? 56, r = mulberry32(SEED + 21 + (o.seed || 0));
      const body = new Path2D();
      body.moveTo(cx - topW * 0.46, rimY + rimH); body.lineTo(cx + topW * 0.46, rimY + rimH);
      body.lineTo(cx + botW / 2, baseY - 8); body.quadraticCurveTo(cx + botW / 2, baseY, cx + botW / 2 - 10, baseY);
      body.lineTo(cx - botW / 2 + 10, baseY); body.quadraticCurveTo(cx - botW / 2, baseY, cx - botW / 2, baseY - 8); body.closePath();
      const rim = new Path2D(); rim.roundRect(cx - topW / 2, rimY, topW, rimH, 8);
      const bodyC = o.body || C.terra, rimC = o.rim || C.terraSoft, dotC = o.dots || 'rgba(120,52,36,0.45)';
      paper(() => { ctx.fillStyle = bodyC; ctx.fill(body); }, { blur: 18, dx: 6, dy: 10 });
      // luz desde la izquierda
      ctx.save(); ctx.clip(body);
      const g = ctx.createLinearGradient(cx - topW / 2, 0, cx + topW / 2, 0);
      g.addColorStop(0, 'rgba(255,220,180,0.35)'); g.addColorStop(0.45, 'rgba(255,220,180,0)'); g.addColorStop(1, 'rgba(90,40,25,0.28)');
      ctx.fillStyle = g; ctx.fillRect(cx - topW, rimY, topW * 2, baseY - rimY);
      ctx.fillStyle = dotC;
      for (let i = 0; i < Math.round(150 * topW / 400); i++) { ctx.beginPath(); ctx.arc(cx + (r() - 0.5) * topW, rimY + rimH + r() * (baseY - rimY - rimH), 0.9 + r() * 1.6, 0, 7); ctx.fill(); }
      ctx.restore();
      paper(() => { ctx.fillStyle = rimC; ctx.fill(rim); }, { blur: 12, dx: 4, dy: 7 });
      ctx.save(); ctx.clip(rim);
      ctx.fillStyle = 'rgba(120,52,36,0.35)';
      for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(cx + (r() - 0.5) * topW, rimY + r() * rimH, 0.8 + r() * 1.4, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.strokeStyle = 'rgba(120,52,36,0.55)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(cx - topW * 0.46, rimY + rimH + 1); ctx.lineTo(cx + topW * 0.46, rimY + rimH + 1); ctx.stroke();
      // tierra dentro (elipse oscura en la boca)
      ctx.fillStyle = C.soil; ctx.beginPath(); ctx.ellipse(cx, rimY + 6, topW * 0.44, Math.min(12, topW * 0.04), 0, 0, 7); ctx.fill();
      return { body, rim };
    }

    // ---------- tabla de madera con vetas, clavos y veta de corte ----------
    function plank(x, y, w, h, o = {}) {
      const r = mulberry32(o.seed || 1), tone = o.color || [C.wood, C.woodMid, '#CBA57C', '#D9BA93'][Math.floor(r() * 4)];
      paper(() => { ctx.fillStyle = tone; ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.fill(); }, { blur: o.blur ?? 14, dx: 4, dy: 8 });
      ctx.save(); const A = ctx.globalAlpha; ctx.beginPath(); ctx.roundRect(x, y, w, h, 5); ctx.clip();
      if (o.shade) { ctx.fillStyle = `rgba(60,35,20,${o.shade})`; ctx.fillRect(x, y, w, h); }
      const hg = ctx.createLinearGradient(0, y, 0, y + h); hg.addColorStop(0, 'rgba(255,240,215,0.28)'); hg.addColorStop(0.3, 'rgba(255,240,215,0)'); hg.addColorStop(1, 'rgba(70,40,20,0.2)');
      ctx.fillStyle = hg; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = C.woodLine; ctx.lineWidth = 1.3;
      const vertical = h > w;
      const lines = Math.max(3, Math.round((vertical ? w : h) / 13));
      for (let i = 0; i < lines; i++) {
        const off = (i + 0.5) / lines, ph = r() * 6, amp = 1.5 + r() * 3.5;
        ctx.globalAlpha = A * (0.25 + r() * 0.3); ctx.beginPath();
        const Lm = vertical ? h : w;
        for (let s = 0; s <= Lm; s += 12) {
          const d = amp * Math.sin(s * 0.018 + ph) + amp * 0.5 * Math.sin(s * 0.05 + ph * 2);
          const px = vertical ? x + off * w + d : x + s, py = vertical ? y + s : y + off * h + d;
          s ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.stroke();
      }
      if (r() < 0.6) { // nudo
        const kx = vertical ? x + w * (0.3 + r() * 0.4) : x + w * (0.15 + r() * 0.7), ky = vertical ? y + h * (0.15 + r() * 0.7) : y + h * (0.3 + r() * 0.4);
        ctx.globalAlpha = A * 0.5; ctx.beginPath(); ctx.ellipse(kx, ky, vertical ? 6 : 14, vertical ? 14 : 6, 0, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(kx, ky, vertical ? 3 : 7, vertical ? 7 : 3, 0, 0, 7); ctx.stroke();
      }
      ctx.restore();
      if (o.stamp) {                                                   // sello de tarima tratada (HT), desvaído
        ctx.save(); ctx.globalAlpha *= 0.32; ctx.strokeStyle = '#3A281D'; ctx.fillStyle = '#3A281D'; ctx.lineWidth = 2.5;
        const sx0 = x + o.stamp, sy0 = y + h / 2 - 26;
        ctx.strokeRect(sx0, sy0, 96, 52); ctx.beginPath(); ctx.moveTo(sx0 + 40, sy0 + 6); ctx.lineTo(sx0 + 40, sy0 + 46); ctx.stroke();
        ctx.font = 'bold 26px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('HT', sx0 + 48, sy0 + 27);
        ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(sx0 + 20, sy0 + 10 + i * 10); ctx.lineTo(sx0 + 12, sy0 + 5 + i * 10); ctx.moveTo(sx0 + 20, sy0 + 10 + i * 10); ctx.lineTo(sx0 + 28, sy0 + 5 + i * 10); }
        ctx.moveTo(sx0 + 20, sy0 + 6); ctx.lineTo(sx0 + 20, sy0 + 46); ctx.stroke(); ctx.restore();
      }
      if (o.nails !== false) {
        ctx.fillStyle = 'rgba(58,40,29,0.75)';
        const nails = vertical ? [[x + w / 2, y + 16], [x + w / 2, y + h - 16]] : [[x + 16, y + h * 0.32], [x + 16, y + h * 0.68], [x + w - 16, y + h * 0.32], [x + w - 16, y + h * 0.68]];
        for (const [nx, ny] of nails) { ctx.beginPath(); ctx.arc(nx, ny, 3.4, 0, 7); ctx.fill(); }
      }
      if (o.cutEnd) { // cara de corte con anillos (veta de testa)
        const ex = o.cutEnd === 'right' ? x + w : x;
        ctx.save(); ctx.beginPath(); ctx.rect(ex - 14, y, 14, h); ctx.clip();
        ctx.fillStyle = '#E3C79F'; ctx.fillRect(ex - 14, y, 14, h);
        ctx.strokeStyle = 'rgba(138,99,67,0.6)'; ctx.lineWidth = 1;
        for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(ex - 2, y + h * 1.4, i * 12, i * 26, 0, 0, 7); ctx.stroke(); }
        ctx.restore();
        ctx.save(); ctx.strokeStyle = C.cream; ctx.globalAlpha *= 0.9; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ex, y + 2); ctx.lineTo(ex, y + h - 2); ctx.stroke(); ctx.restore();
      }
    }

    // ---------- capas del bancal (corte): ramas, composta, tierra. level = y de la superficie ----------
    const layerSeeds = {};
    function layerDots(name, n, x0, x1, y0, y1, seedN) {
      if (!layerSeeds[name]) { const r = mulberry32(seedN); layerSeeds[name] = Array.from({ length: n }, () => [lerp(x0, x1, r()), lerp(y0, y1, r()), r(), r(), r()]); }
      return layerSeeds[name];
    }
    function surface(x0, x1, level, bump) { // borde superior irregular + montículo bajo el punto de vertido
      const p = new Path2D(); p.moveTo(x0, 4000);
      for (let x = x0; x <= x1 + 1; x += 12) {
        const b = bump ? bump.h * Math.exp(-Math.pow((x - bump.x) / bump.w, 2)) : 0;
        p.lineTo(x, level + 5 * Math.sin(x * 0.031 + level * 0.01) + 3 * Math.sin(x * 0.083) - b);
      }
      p.lineTo(x1, 4000); p.closePath(); return p;
    }
    function layer(kind, x0, x1, bottom, level, full, bump) {
      if (level >= bottom - 1) return;
      const clipP = surface(x0, x1, level, bump);
      ctx.save();
      ctx.beginPath(); ctx.rect(x0, level - 60, x1 - x0, bottom - level + 60); ctx.clip();
      ctx.clip(clipP);
      if (kind === 'ramas') {
        ctx.fillStyle = C.ramasBg; ctx.fillRect(x0, level - 60, x1 - x0, bottom - level + 60);
        const sticks = layerDots('ramas', 150, x0 - 40, x1 + 40, bottom - (bottom - full) * 1.05, bottom + 10, SEED + 31);
        ctx.lineCap = 'round';
        for (const [sx0, sy0, a, b, c] of sticks) {
          const ang = (a - 0.5) * 1.4, L = 50 + b * 90;
          ctx.strokeStyle = [C.ramas, '#946A47', '#5E3E28'][Math.floor(c * 3)]; ctx.lineWidth = 5 + c * 6;
          ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(sx0 + Math.cos(ang) * L, sy0 + Math.sin(ang) * L); ctx.stroke();
          if (b > 0.55) { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx0 + Math.cos(ang) * L * 0.5, sy0 + Math.sin(ang) * L * 0.5); ctx.lineTo(sx0 + Math.cos(ang - 0.6) * L * 0.8, sy0 + Math.sin(ang - 0.6) * L * 0.8); ctx.stroke(); }
        }
      } else if (kind === 'composta') {
        ctx.fillStyle = C.compost; ctx.fillRect(x0, level - 60, x1 - x0, bottom - level + 60);
        for (const [dx, dy, a, b, c] of layerDots('composta', 420, x0, x1, full - 20, bottom, SEED + 41)) {
          ctx.fillStyle = c < 0.08 ? '#6E8B4E' : c < 0.14 ? '#C9895F' : a < 0.5 ? C.compostBit : '#3E2A1D';
          ctx.beginPath(); ctx.ellipse(dx, dy, 2.5 + b * 5, 2 + a * 3.5, a * 3, 0, 7); ctx.fill();
        }
      } else {
        ctx.fillStyle = C.soil; ctx.fillRect(x0, level - 60, x1 - x0, bottom - level + 60);
        for (const [dx, dy, a, b] of layerDots('tierra', 520, x0, x1, full - 30, bottom, SEED + 51)) {
          ctx.fillStyle = a < 0.5 ? 'rgba(106,78,58,0.8)' : 'rgba(30,20,14,0.6)';
          ctx.beginPath(); ctx.arc(dx, dy, 1.2 + b * 2.4, 0, 7); ctx.fill();
        }
      }
      // brillo del borde superior (luz rasante)
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x0, level - 60, x1 - x0, bottom - level + 60); ctx.clip();
      ctx.strokeStyle = kind === 'tierra' ? 'rgba(201,169,97,0.35)' : 'rgba(255,230,190,0.18)'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = x0; x <= x1 + 1; x += 12) {
        const b = bump ? bump.h * Math.exp(-Math.pow((x - bump.x) / bump.w, 2)) : 0;
        const y = level + 5 * Math.sin(x * 0.031 + level * 0.01) + 3 * Math.sin(x * 0.083) - b;
        x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.restore();
    }

    // ---------- mano estilizada en silueta plana (terracota suave) ----------
    // Piezas cónicas pintadas en un lienzo propio y compuestas con UNA sombra de papel (sin costuras).
    // pose 'cup': palma arriba, dedos a la izquierda, sostiene material. 'flat': dedos rectos, asienta/empuja.
    const handCv = document.createElement('canvas'); handCv.width = W; handCv.height = H;
    const hx = handCv.getContext('2d');
    function cone(c, x1, y1, r1, x2, y2, r2) {
      const a = Math.atan2(y2 - y1, x2 - x1), n = a + Math.PI / 2;
      c.beginPath(); c.arc(x1, y1, r1, 0, 7); c.fill();
      c.beginPath(); c.arc(x2, y2, r2, 0, 7); c.fill();
      c.beginPath();
      c.moveTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1); c.lineTo(x2 + Math.cos(n) * r2, y2 + Math.sin(n) * r2);
      c.lineTo(x2 - Math.cos(n) * r2, y2 - Math.sin(n) * r2); c.lineTo(x1 - Math.cos(n) * r1, y1 - Math.sin(n) * r1);
      c.closePath(); c.fill();
    }
    const FINGERS = {
      cup: [[-104, -10, 19, -192, -24, 16, -212, -46, 13], [-106, 10, 19, -200, 4, 16, -224, -16, 13],
            [-100, 28, 18, -186, 28, 15, -206, 10, 12], [-88, 42, 16, -160, 46, 12]],
      flat: [[-100, -12, 19, -222, -22, 15], [-104, 8, 19, -236, 6, 15], [-100, 26, 18, -222, 32, 14], [-88, 42, 16, -190, 56, 12]],
    };
    const THUMB = { cup: [-20, -28, 20, -96, -60, 14], flat: [-18, -32, 20, -100, -70, 14] };
    const TIP = { cup: [-222, -36], flat: [-236, 6] };
    function handXf(x, y, rot, s, flip) { return (px, py) => { const X = px * s * (flip ? -1 : 1), Y = py * s; return [x + X * Math.cos(rot) - Y * Math.sin(rot), y + X * Math.sin(rot) + Y * Math.cos(rot)]; }; }
    function hand(x, y, rot, s, pose, o = {}) {
      const alpha = o.alpha ?? 1; if (alpha <= 0.001) return;
      hx.setTransform(1, 0, 0, 1, 0, 0); hx.clearRect(0, 0, W, H);
      hx.translate(x, y); hx.rotate(rot); hx.scale(s * (o.flip ? -1 : 1), s);
      if (o.load && (o.loadK ?? 1) > 0.02) {                          // montoncito de material en la palma
        const k = o.loadK ?? 1;
        hx.fillStyle = o.load; hx.beginPath(); hx.ellipse(-128, -30, 70 * (0.5 + 0.5 * k), 30 * k, -0.12, 0, 7); hx.fill();
        hx.fillStyle = 'rgba(255,235,200,0.18)'; for (let i = 0; i < 12; i++) { hx.beginPath(); hx.arc(-170 + i * 8, -34 - Math.abs(Math.sin(i * 1.7)) * 16 * k, 2.6, 0, 7); hx.fill(); }
      }
      hx.fillStyle = C.hand;
      cone(hx, 10, 2, 38, 520, -70, 46);                              // antebrazo: entra desde el borde derecho
      hx.beginPath(); hx.ellipse(-56, 6, 76, 44, -0.06, 0, 7); hx.fill(); // palma
      for (const f of FINGERS[pose]) { cone(hx, f[0], f[1], f[2], f[3], f[4], f[5]); if (f.length > 6) cone(hx, f[3], f[4], f[5], f[6], f[7], f[8]); }
      cone(hx, ...THUMB[pose]);
      // luz desde la izquierda sobre la piel
      hx.globalCompositeOperation = 'source-atop';
      const g = hx.createLinearGradient(-200, -80, 120, 80); g.addColorStop(0, 'rgba(255,225,190,0.22)'); g.addColorStop(1, 'rgba(120,50,35,0.12)');
      hx.fillStyle = g; hx.fillRect(-260, -120, 760, 320);
      hx.globalCompositeOperation = 'source-over';
      // manga de lino crema arremangada: puño doblado + rayas finas del tejido
      hx.fillStyle = C.linen; cone(hx, 400, -52, 54, 1500, -200, 62);
      hx.save(); hx.globalCompositeOperation = 'source-atop';
      hx.strokeStyle = 'rgba(160,128,92,0.28)'; hx.lineWidth = 1.4;
      for (let i = -4; i <= 4; i++) { hx.beginPath(); hx.moveTo(400, -52 + i * 11); hx.lineTo(1500, -200 + i * 13); hx.stroke(); }
      hx.restore();
      hx.fillStyle = C.linenCuff; cone(hx, 386, -50, 55, 446, -58, 56);
      hx.strokeStyle = 'rgba(160,110,80,0.55)'; hx.lineWidth = 1.8;
      hx.beginPath(); hx.moveTo(380, -104); hx.quadraticCurveTo(372, -50, 380, 4); hx.stroke();
      hx.beginPath(); hx.moveTo(446, -113); hx.quadraticCurveTo(438, -58, 448, -3); hx.stroke();
      // líneas finas: separación de dedos, pliegue de palma, uña del pulgar
      hx.strokeStyle = C.handLine; hx.globalAlpha = 0.6; hx.lineWidth = 2.2; hx.lineCap = 'round';
      const F = FINGERS[pose];
      for (let i = 0; i < 3; i++) { const a = F[i], b = F[i + 1]; hx.beginPath(); hx.moveTo((a[0] + b[0]) / 2 - 6, (a[1] + b[1]) / 2); hx.lineTo((a[3] + b[3]) / 2 + 8, (a[4] + b[4]) / 2); hx.stroke(); }
      hx.beginPath(); hx.moveTo(-8, 20); hx.quadraticCurveTo(-46, 32, -84, 22); hx.stroke();
      hx.globalAlpha = 1;
      ctx.save(); ctx.globalAlpha *= alpha;
      ctx.shadowColor = 'rgba(10,31,28,0.26)'; ctx.shadowBlur = 22; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 14;
      ctx.drawImage(handCv, 0, 0); ctx.restore();
      return { tip: handXf(x, y, rot, s, o.flip)(...TIP[pose]) };
    }
    // ---------- material que cae de la mano: partículas en forma cerrada (pos = f(t), sin integrar) ----------
    // emitter(te) → [x,y] del punto de vertido; floor(t) → y de la superficie donde se posa y desaparece.
    const PAL = {
      tierra: ['#3B2A20', '#4A3527', '#2E2018', '#5E4533', '#6A4E3A'],
      composta: ['#5A3C28', '#8A6446', '#3E2A1D', '#6E4A30'],
      ramas: ['#7B5236', '#946A47', '#5E3E28', '#A77B52'],
      hoja: ['#9C6B3F', '#B7844F', '#7E5A36', '#7A8F4E'],
    };
    function pour(t, o) {
      const r = mulberry32(o.seed || 9), g = 1350, out = [];
      const n = Math.floor((o.t1 - o.t0) * o.rate);
      for (let i = 0; i < n; i++) {
        const te = o.t0 + i / o.rate + r() * 0.04, vx = (r() - 0.5) * 70 + (o.vx || 0), vy = 20 + r() * 50;
        const ox = (r() - 0.5) * 18, kind = r(), sz = r(), rot0 = r() * 6, ph = r() * 6, c = r();
        if (t < te) continue;
        const dt = t - te, [ex, ey] = o.emitter(te);
        const light = kind > 0.72 ? 0.55 : 1;                                  // lo liviano cae más lento y aletea
        let x = ex + ox + vx * dt, y = ey + vy * dt + 0.5 * g * light * dt * dt;
        if (kind > 0.72) x += Math.sin(dt * 7 + ph) * 9;
        if (y > o.floor(t) + 3) continue;
        out.push({ x, y, kind, sz, rot: rot0 + dt * (vx > 0 ? 5 : -5), c });
      }
      ctx.save(); ctx.lineCap = 'round';
      for (const q of out) {
        const pick = (arr) => arr[Math.floor(q.c * arr.length)];
        if (o.kind === 'ramas' && q.kind < 0.62) {                             // ramita fina, a veces bifurcada
          const L = 14 + q.sz * 28, ca = Math.cos(q.rot), sa = Math.sin(q.rot);
          ctx.strokeStyle = pick(PAL.ramas); ctx.lineWidth = 2 + q.sz * 2.4;
          ctx.beginPath(); ctx.moveTo(q.x - ca * L / 2, q.y - sa * L / 2); ctx.lineTo(q.x + ca * L / 2, q.y + sa * L / 2); ctx.stroke();
          if (q.sz > 0.6) { ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x + Math.cos(q.rot - 0.7) * L * 0.4, q.y + Math.sin(q.rot - 0.7) * L * 0.4); ctx.stroke(); }
        } else if (q.kind > 0.72 && o.kind !== 'tierra') {                    // hojita seca / hoja de composta
          const L = 7 + q.sz * 9; ctx.fillStyle = pick(PAL.hoja);
          ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(q.rot * 2)));
          ctx.beginPath(); ctx.moveTo(-L, 0); ctx.quadraticCurveTo(0, -L * 0.55, L, 0); ctx.quadraticCurveTo(0, L * 0.55, -L, 0); ctx.fill(); ctx.restore();
        } else if (o.kind === 'composta' && q.kind > 0.64) {                  // cáscara de huevo
          ctx.fillStyle = '#EFE3CC'; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot);
          ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(4, -3); ctx.lineTo(1, 3); ctx.closePath(); ctx.fill(); ctx.restore();
        } else {                                                              // miga fina; algunos grumos irregulares
          const clump = q.sz > 0.86, rr = clump ? 3 + q.c * 1.8 : 1 + q.sz * 1.9;
          ctx.fillStyle = pick(o.kind === 'tierra' ? PAL.tierra : PAL.composta);
          ctx.beginPath(); ctx.ellipse(q.x, q.y, rr, rr * (clump ? 0.72 : 1), q.rot, 0, 7); ctx.fill();
        }
      }
      ctx.restore();
    }

    // ---------- maceta colgante de macramé con enredadera que cae y se mece ----------
    // spec: {x, rimY, topW, h, drop:[t0,t1], vines:[{dx, len}], phase, seed}
    function hanging(t, sp) {
      const d = E.inOut(prog(t, sp.drop[0], sp.drop[1])); if (d <= 0) return;
      const dy = (1 - d) * -(sp.rimY + sp.h + 420);
      const ang = Math.sin(t * 0.45 + (sp.phase || 0)) * 0.018 + (1 - d) * 0.05;
      ctx.save(); ctx.translate(sp.x, -30); ctx.rotate(ang); ctx.translate(-sp.x, 30 + dy);
      const x = sp.x, rim = sp.rimY, w = sp.topW, knotY = rim - 70;
      ctx.strokeStyle = '#B99A74'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      for (const fx of [-0.44, 0, 0.44]) {                                 // cuerdas: bajan juntas y se abren sobre la maceta
        ctx.beginPath(); ctx.moveTo(x, -30); ctx.lineTo(x + fx * w * 0.35, knotY); ctx.lineTo(x + fx * w, rim + 6); ctx.stroke();
        ctx.fillStyle = '#CDB38D'; ctx.beginPath(); ctx.ellipse(x + fx * w * 0.35, knotY, 5, 7, 0, 0, 7); ctx.fill();
      }
      ctx.fillStyle = '#CDB38D'; ctx.beginPath(); ctx.ellipse(x, knotY - 150, 6, 10, 0, 0, 7); ctx.fill();
      pot(x, rim, rim + sp.h, w, w * 0.7, { rimH: Math.round(sp.h * 0.2), seed: sp.seed || 3 });
      const r = mulberry32(sp.seed || 3);
      for (const [vi, v] of sp.vines.entries()) {                          // enredadera tipo pothos
        const sw = Math.sin(t * 0.6 + vi * 1.7 + (sp.phase || 0));
        const P = (u) => [x + v.dx + Math.sin(u * 3 + vi) * 10 + sw * 14 * u * u, rim + 8 + u * v.len];
        ctx.strokeStyle = C.moss; ctx.lineWidth = 2.6; ctx.beginPath();
        for (let u = 0; u <= 1.001; u += 0.05) { const [px, py] = P(u); u ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke();
        const nL = Math.floor(v.len / 34);
        for (let i = 1; i <= nL; i++) {
          const u = i / nL, [px, py] = P(u), side = i % 2 ? 1 : -1;
          const L = lerp(40, 24, u) * (0.85 + r() * 0.3);
          leaf(px, py, Math.PI / 2 + side * (0.9 + 0.2 * Math.sin(t * 0.9 + i)), L, L * 0.5, 1,
            { color: i % 3 ? C.bright : C.leafLight, dark: C.moss });
        }
      }
      for (const [j, a] of [-0.5, 0.1, 0.6].entries()) leaf(x + (j - 1) * w * 0.25, rim + 4, -Math.PI / 2 + a + Math.sin(t * 0.8 + j) * 0.05, 44, 22, 1, { color: C.bright });
      ctx.restore();
    }

    // ---------- cortina de papel: dos paneles verde profundo que se cierran desde los lados ----------
    // xL = borde derecho del panel izquierdo, xR = borde izquierdo del panel derecho (px). Borde rasgado fino,
    // fibras de papel y sombra suave sobre la escena.
    const deckle = (y, ph) => 4 * Math.sin(y * 0.047 + ph) + 2.4 * Math.sin(y * 0.131 + ph * 2) + 1.3 * Math.sin(y * 0.37 + ph * 3);
    function panel(side, edge, color, ph) {
      const p = new Path2D(), x0 = side < 0 ? -40 : W + 40;
      p.moveTo(x0, -40);
      for (let y = -40; y <= H + 40; y += 16) p.lineTo(edge + deckle(y, ph), y);
      p.lineTo(x0, H + 40); p.closePath();
      paper(() => { ctx.fillStyle = color; ctx.fill(p); }, { color: 'rgba(10,31,28,0.38)', blur: 34, dx: -side * 12, dy: 6 });
      ctx.save(); ctx.clip(p);
      ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.28; ctx.drawImage(fibers, 0, 0, W, H);
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 1;
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(201,169,97,0.10)'); g.addColorStop(0.6, 'rgba(201,169,97,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(245,239,228,0.22)'; ctx.lineWidth = 2;        // canto del papel que agarra luz
      ctx.beginPath(); for (let y = -40; y <= H + 40; y += 16) { const x = edge + deckle(y, ph) + side * 1.5; y === -40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
      ctx.restore();
    }
    function curtain(xL, xR) {
      if (xL > -30) panel(-1, xL, C.card, 0.7);
      if (xR < W + 30) panel(1, xR, '#173A31', 2.9);
    }
    // ---------- tarjeta final: fondo verde profundo con brillo dorado que respira y polen que sube ----------
    const cardMotes = (() => { const r = mulberry32(SEED + 77); return Array.from({ length: 24 }, () => ({ x: r() * W, y: r() * H, s: 0.4 + r(), p: r() * 6.28, z: r() })); })();
    function cardBg(t, a, cx, cy) {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = C.card; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.22 * a; ctx.drawImage(fibers, 0, 0, W, H);
      ctx.globalCompositeOperation = 'screen';
      const br = 0.13 + 0.02 * Math.sin(t * 1.1);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 620);
      g.addColorStop(0, `rgba(201,169,97,${br})`); g.addColorStop(1, 'rgba(201,169,97,0)');
      ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const m of cardMotes) {                                      // polen: sube muy despacio, pos = f(t)
        const y = ((m.y - t * 14 * m.s) % H + H) % H, x = m.x + Math.sin(t * 0.6 * m.s + m.p) * 16;
        const al = (0.35 + 0.3 * Math.sin(t * 1.4 * m.s + m.p)) * a, rr = 1.8 + m.z * 3;
        const mg = ctx.createRadialGradient(x, y, 0, x, y, rr * 3);
        mg.addColorStop(0, `rgba(232,205,140,${al})`); mg.addColorStop(1, 'rgba(232,205,140,0)');
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(x, y, rr * 3, 0, 7); ctx.fill();
      }
      ctx.restore();
    }

    // ---------- logo VEJ: el símbolo se dibuja con un trazo que avanza (curvas lentas) ----------
    // k: progreso 0..1 (1 = logo completo, quieto). o: {x, y (centro), size (px del lado), color, glow}
    function vejLogo(k, o = {}) {
      const size = o.size || 400, s = size / LOGO.box, x0 = (o.x ?? W / 2) - size / 2, y0 = (o.y ?? H / 2) - size / 2;
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = o.color || C.cream;
      ctx.lineWidth = LOGO.width * s * (o.weight || 1);
      const pens = [];
      for (const st of LOGO.strokes) {
        const u = E.inOut(prog(k, st.at[0], st.at[1])); if (u <= 0) continue;
        let left = u * st.len, i = 1;
        ctx.beginPath(); ctx.moveTo(x0 + st.pts[0][0] * s, y0 + st.pts[0][1] * s);
        let px = st.pts[0][0], py = st.pts[0][1];
        for (; i < st.pts.length && left > 0; i++) {
          const [ax, ay] = st.pts[i - 1], [bx, by] = st.pts[i], L = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / L);
          px = ax + (bx - ax) * f; py = ay + (by - ay) * f; ctx.lineTo(x0 + px * s, y0 + py * s); left -= L;
        }
        ctx.stroke();
        if (u < 1) pens.push([x0 + px * s, y0 + py * s, Math.sin(Math.PI * u)]);
      }
      ctx.restore();
      if (o.glow !== false) for (const [px, py, a] of pens) {         // punta del trazo: brillo dorado
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        const g = ctx.createRadialGradient(px, py, 0, px, py, 26);
        g.addColorStop(0, `rgba(232,205,140,${0.75 * a})`); g.addColorStop(1, 'rgba(232,205,140,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 26, 0, 7); ctx.fill(); ctx.restore();
      }
    }

    const self = { ctx, W, H, C, E, clamp, lerp, prog, wob, mulberry32, paper, wall, light, castShadow, floorShadow, contactShadow, grain, stem, leaf, flower, plant, seed, pot, plank, layer, hand, pour, hanging, curtain, cardBg, vejLogo, handXf, TIP, fibers };
    for (const ext of EXT) Object.assign(self, ext(self, ctx));      // primitivas extra (vej-prims.js)
    return self;
  }
  const EXT = [];
  const extend = (fn) => EXT.push(fn);

  // ---------- DOM: subtítulos (una frase a la vez) ----------
  function subtitles(el, lines, t, o = {}) {
    const fin = o.fadeIn ?? 0.22, fout = o.fadeOut ?? 0.3;
    let cur = null, a = 0;
    for (const l of lines) {                                   // en un relevo gana la que tenga más opacidad
      if (t >= l.start - fin && t < l.end + fout) { const al = Math.min(1, (t - (l.start - fin)) / fin, (l.end + fout - t) / fout); if (al > a) { cur = l; a = al; } }
    }
    const p = el.querySelector('.sub-text'), band = el.querySelector('.sub-band');
    if (!cur) { band.style.opacity = '0'; return; }
    if (p.textContent !== cur.text) p.textContent = cur.text;
    const e = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, a)));
    band.style.opacity = String(e);
    p.style.transform = `translateY(${(1 - e) * 10}px)`;
  }
  // ---------- DOM: aparición suave (opacidad + subida + desenfoque) ----------
  function reveal(el, t, t0, dur = 1.1, rise = 26, out, blur = 6) {
    let k = Math.max(0, Math.min(1, (t - t0) / dur)); k = 1 - Math.pow(1 - k, 3);
    if (out) { const ko = Math.max(0, Math.min(1, (t - out[0]) / (out[1] - out[0]))); k *= 1 - (0.5 - 0.5 * Math.cos(Math.PI * ko)); }
    el.style.opacity = String(k);
    el.style.transform = `translateY(${(1 - k) * rise}px)`;
    el.style.filter = blur && k < 0.999 ? `blur(${(1 - k) * blur}px)` : 'none';
  }

  window.VEJ = { kit, extend, subtitles, reveal, LOGO, util: { clamp, lerp, prog, E, mulberry32, wob, bez } };
})();
