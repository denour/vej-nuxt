/* VEJ reel kit — PRIMITIVAS de dibujo (se enchufan a cada kit con VEJ.extend).
 * Todo es función pura de sus parámetros (+ t para movimiento). Coordenadas de mundo: lienzo 1080×1920.
 * Firma visual: formas planas de papel recortado, sombra suave, línea fina, paleta VEJ.
 *
 * Índice
 *   hojas ........ leafX(x,y,ang,len,wid,open,{shape:'lanza|corazon|monstera|redonda|suculenta|helecho|hierba|ovalada'})
 *   plantas ...... preset(name, x, baseY, {scale,g,t,...}) → 'pothos','monstera','suculenta','helecho','hierbas','tomatera','cactus'
 *   recipientes .. pot(...) (kit) · planter · jar
 *   agua ......... drops · stream · rain · mist · splash
 *   luz .......... sky · sun · moon · clouds · lamp · glow · grade(mood) · night · vignette · mood(name)
 *   objetos ...... wateringCan · scissors · sprayBottle · trowel · stake · shelf · table · tiles · railing · windowFrame
 *   bichos ....... aphid · ladybug · worm · sparkle
 *   escenarios ... set(name, t, {mood}) → 'ventana','balcon','jardin','mesa','cocina','invernadero','subsuelo','macro'
 */
(function () {
  const { clamp, lerp, prog, E, mulberry32 } = VEJ.util;

  // --------- atmósferas (hora y luz). Claves sin acento; 'mañana' también se acepta ---------
  const MOODS = {
    manana:  { sky: ['#CFDCD3', '#EEF0E4'], sun: '#F6EBC6', beam: '#F4F2E2', beamA: 0.65, grade: ['#D5E3DC', 'soft-light', 0.45], ink: 0.9 },
    dorada:  { sky: ['#EDB978', '#F8E2B2'], sun: '#F2C46A', beam: '#FFD891', beamA: 1.0, grade: null, ink: 1 },
    nublado: { sky: ['#9FAAA2', '#C9CFC5'], sun: null, beam: '#E4E8DF', beamA: 0.3, grade: ['#A7B1A7', 'multiply', 0.30], rain: true, ink: 0.85 },
    noche:   { sky: ['#0B1F1B', '#1C3B34'], moon: '#EDE6D6', beam: null, beamA: 0, grade: ['#0F241F', 'multiply', 0.35], lamp: true, ink: 0.7 },   // de noche la herramienta principal es night(luces); grade('noche') solo si no hay luces
  };
  const moodOf = (m) => MOODS[String(m || 'dorada').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()] || MOODS.dorada;

  VEJ.extend((k, ctx) => {
    const { C, paper, W, H } = k;
    const P = {};

    // ================= HOJAS =================
    // Hoja apuntando a +x en coordenadas locales; open 0..1 (largo primero, ancho después).
    function leafPath(shape, L, Wd, o) {
      const p = new Path2D();
      if (shape === 'corazon') {
        p.moveTo(0, 0);
        p.bezierCurveTo(-0.16 * L, -0.55 * Wd, 0.2 * L, -1.05 * Wd, 0.55 * L, -0.72 * Wd);
        p.bezierCurveTo(0.82 * L, -0.45 * Wd, 0.96 * L, -0.12 * Wd, L, 0);
        p.bezierCurveTo(0.96 * L, 0.12 * Wd, 0.82 * L, 0.45 * Wd, 0.55 * L, 0.72 * Wd);
        p.bezierCurveTo(0.2 * L, 1.05 * Wd, -0.16 * L, 0.55 * Wd, 0, 0);
      } else if (shape === 'monstera') {
        // contorno ovado con cortes profundos desde el margen + agujeros (evenodd)
        const w = (s) => Wd * Math.pow(Math.sin(Math.PI * clamp(s * 0.94 + 0.03)), 0.75) * (1.08 - 0.3 * s);
        const cuts = [0.26, 0.4, 0.54, 0.68, 0.8];
        for (const side of [-1, 1]) {
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const s = i / 40;
            const c = cuts.find((q) => s > q && s < q + 0.055);
            if (c !== undefined && s - c < 0.03) { pts.push([L * s, side * w(s)]); pts.push([L * (c + 0.02), side * w(s) * 0.22]); }
            else pts.push([L * s, side * w(s)]);
          }
          if (side === -1) { p.moveTo(0, 0); for (const q of pts) p.lineTo(q[0], q[1]); }
          else { for (let i = pts.length - 1; i >= 0; i--) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); }
        }
        for (const [s, d] of [[0.33, -0.42], [0.47, 0.4], [0.6, -0.36], [0.2, 0.36]]) {
          p.moveTo(L * s + Wd * 0.07, d * w(s)); p.ellipse(L * s, d * w(s), Wd * 0.07, Wd * 0.045, 0.3, 0, Math.PI * 2);
        }
      } else if (shape === 'redonda') {
        p.moveTo(0, 0);
        p.bezierCurveTo(0.05 * L, -0.9 * Wd, 0.95 * L, -0.95 * Wd, L, 0);
        p.bezierCurveTo(0.95 * L, 0.95 * Wd, 0.05 * L, 0.9 * Wd, 0, 0);
      } else if (shape === 'ovalada') {
        p.moveTo(0, 0);
        p.bezierCurveTo(0.12 * L, -0.95 * Wd, 0.78 * L, -0.9 * Wd, L, -0.04 * Wd);
        p.bezierCurveTo(0.8 * L, 0.8 * Wd, 0.15 * L, 0.9 * Wd, 0, 0);
      } else if (shape === 'suculenta') {
        p.moveTo(0, -0.55 * Wd);
        p.bezierCurveTo(0.35 * L, -1.0 * Wd, 0.8 * L, -0.55 * Wd, L, 0);
        p.bezierCurveTo(0.8 * L, 0.55 * Wd, 0.35 * L, 1.0 * Wd, 0, 0.55 * Wd);
        p.closePath();
      } else if (shape === 'hierba') {
        p.moveTo(0, -Wd * 0.5);
        p.quadraticCurveTo(L * 0.55, -Wd * 0.7, L, 0);
        p.quadraticCurveTo(L * 0.55, Wd * 0.2, 0, Wd * 0.5);
        p.closePath();
      } else { // lanza
        p.moveTo(0, 0);
        p.bezierCurveTo(L * 0.25, -Wd * 1.05, L * 0.75, -Wd * 0.8, L, 0);
        p.bezierCurveTo(L * 0.72, Wd * 0.85, L * 0.28, Wd * 0.95, 0, 0);
      }
      return p;
    }
    P.leafPath = leafPath;
    P.leafX = function (x, y, ang, len, wid, open, o = {}) {
      const shape = o.shape || 'lanza';
      if (shape === 'lanza' && !o.force) return k.leaf(x, y, ang, len, wid, open, o);
      const kk = clamp(open); if (kk <= 0.001) return;
      if (shape === 'helecho') return fern(x, y, ang, len, wid, kk, o);
      const L = len * E.outBack(kk), Wd = wid * E.out(prog(kk, 0.2, 1));
      const a = lerp(o.closedAng ?? ang, ang, E.out(kk)) + (o.flutter || 0);
      const path = leafPath(shape, L, Wd, o);
      const base = o.color || (shape === 'suculenta' ? '#8DB39A' : C.bright);
      const A = ctx.globalAlpha;
      paper(() => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = base; ctx.fill(path, 'evenodd'); ctx.restore(); },
        { blur: o.blur ?? 12, dx: 5, dy: 8 });
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.clip(path, 'evenodd');
      if (shape === 'suculenta') {                                      // cera: luz en el lomo, rubor en la punta
        const g = ctx.createLinearGradient(0, -Wd, 0, Wd); g.addColorStop(0, 'rgba(255,250,235,0.35)'); g.addColorStop(0.5, 'rgba(255,250,235,0)'); g.addColorStop(1, 'rgba(40,70,55,0.35)');
        ctx.fillStyle = g; ctx.fillRect(-L, -Wd * 2, L * 3, Wd * 4);
        if (o.blush !== false) { const b = ctx.createRadialGradient(L, 0, 0, L, 0, L * 0.35); b.addColorStop(0, 'rgba(210,114,90,0.55)'); b.addColorStop(1, 'rgba(210,114,90,0)'); ctx.fillStyle = b; ctx.fillRect(0, -Wd, L * 1.2, Wd * 2); }
      } else {
        ctx.fillStyle = o.dark || C.moss; ctx.globalAlpha = A * 0.5; ctx.fillRect(0, 0, L * 1.2, Wd * 1.5);  // mitad en sombra
        ctx.globalAlpha = A * 0.5; ctx.strokeStyle = C.cream; ctx.lineWidth = Math.max(1, len * 0.011);
        ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.quadraticCurveTo(L * 0.5, -Wd * 0.06, L * 0.93, 0); ctx.stroke();
        ctx.globalAlpha = A * 0.26; ctx.lineWidth = Math.max(0.8, len * 0.006);
        const n = shape === 'monstera' ? 5 : 4;
        for (let i = 1; i <= n; i++) {
          const u = i / (n + 1);
          for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(L * u, 0); ctx.quadraticCurveTo(L * (u + 0.06), sd * Wd * 0.35, L * (u + 0.14), sd * Wd * 0.7); ctx.stroke(); }
        }
      }
      ctx.restore();
    };
    function fern(x, y, ang, len, wid, kk, o) {                        // fronda: raquis + foliolos que se abren de la base a la punta
      const n = 11, curl = (1 - kk) * 1.6;
      const pts = [];
      for (let i = 0; i <= 24; i++) { const u = i / 24; const a = ang + (o.bend ?? 0.35) * u + curl * u * u; pts.push(u); }
      let px = x, py = y, a = ang;
      const P2 = [[x, y, ang]];
      for (let i = 1; i <= 24; i++) { const u = i / 24; a = ang + (o.bend ?? 0.35) * u + curl * u * u * u; px += Math.cos(a) * len * kk / 24; py += Math.sin(a) * len * kk / 24; P2.push([px, py, a]); }
      paper(() => {
        ctx.strokeStyle = o.stem || C.moss; ctx.lineWidth = Math.max(2, len * 0.012); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y); for (const q of P2) ctx.lineTo(q[0], q[1]); ctx.stroke();
        for (let i = 1; i <= n; i++) {
          const u = i / (n + 1), q = P2[Math.round(u * 24)], vis = clamp((kk - u * 0.6) / 0.4);
          if (vis <= 0) continue;
          const fl = len * 0.2 * (1 - u * 0.75) * vis, fw = fl * 0.28;
          for (const sd of [-1, 1]) {
            const la = q[2] + sd * (1.15 - u * 0.3);
            ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(la); ctx.fillStyle = sd > 0 ? (o.color || C.bright) : (o.dark || '#3F7A5C');
            ctx.fill(leafPath('lanza', fl, fw)); ctx.restore();
          }
        }
      }, { blur: 10, dx: 4, dy: 7 });
    }

    // ================= PLANTAS DE REFERENCIA (el agente puede diseñar otras con stem/leafX) =================
    // g: crecimiento 0..1 · t: tiempo real (meneo) · scale
    P.preset = function (name, x, baseY, o = {}) {
      const s = o.scale || 1, g = clamp(o.g ?? 1), t = o.t || 0, r = mulberry32(o.seed || 11);
      const sw = (i) => Math.sin(t * 0.8 + i * 1.7) * 0.03;
      const at = (a, b) => E.inOut(prog(g, a, b));
      if (name === 'pothos' || name === 'colgante') {
        // tallos cortos arriba + guías que caen por el borde (o.rimW = ancho de la boca; o.drape = largo de caída)
        const rimW = (o.rimW || 260) * s, drape = (o.drape || 420) * s;
        const ups = [[-0.5, -0.35], [0.05, -0.05], [0.45, 0.3]];
        ups.forEach(([dx, lean], i) => {
          const gi = at(i * 0.1, 0.5 + i * 0.1), h = (150 + 60 * (i % 2)) * s * gi;
          const bx = x + dx * rimW * 0.5, tx = bx + lean * 90 * s;
          ctx.save(); ctx.strokeStyle = C.moss; ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(bx, baseY); ctx.quadraticCurveTo(bx, baseY - h * 0.6, tx, baseY - h); ctx.stroke(); ctx.restore();
          if (gi > 0.2) P.leafX(tx, baseY - h, -Math.PI / 2 + lean * 1.4 + sw(i), 110 * s, 62 * s, at(0.2 + i * 0.1, 0.6 + i * 0.1), { shape: 'corazon', color: i % 2 ? C.bright : '#5E9E78' });
          if (gi > 0.5) P.leafX(bx + (tx - bx) * 0.55, baseY - h * 0.55, -Math.PI / 2 + (i - 1) * 1.1 + 0.5 + sw(i + 3), 88 * s, 50 * s, at(0.4, 0.8), { shape: 'corazon', color: '#5E9E78' });
          if (gi > 0.35) P.leafX(bx + (tx - bx) * 0.3, baseY - h * 0.3, -Math.PI / 2 + (i - 1) * 1.1 - 0.9 + sw(i + 5), 76 * s, 44 * s, at(0.3, 0.7), { shape: 'corazon', color: C.bright });
        });
        [[-1, 1.0], [1, 0.85], [-1, 0.6]].forEach(([side, f], vi) => {
          const len = drape * f * at(0.15 + vi * 0.08, 0.95);
          if (len < 8) return;
          const x0 = x + side * rimW * (0.42 - vi * 0.1), y0 = baseY + 4, swing = Math.sin(t * 0.55 + vi * 2) * 12 * s;
          const V = (u) => [x0 + side * (30 * s * Math.sin(u * 2.2) + 18 * s * u) + swing * u * u, y0 + u * len];
          ctx.save(); ctx.strokeStyle = C.moss; ctx.lineWidth = 3.6 * s; ctx.lineCap = 'round'; ctx.beginPath();
          for (let u = 0; u <= 1.001; u += 0.04) { const [px, py] = V(u); u ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
          const nL = Math.max(1, Math.floor(len / (46 * s)));
          for (let i = 1; i <= nL; i++) {
            const u = i / nL, [px, py] = V(u), sd = i % 2 ? 1 : -1, L = lerp(92, 48, u) * s * (0.85 + r() * 0.3);
            P.leafX(px, py, Math.PI / 2 + sd * (1.0 + 0.25 * Math.sin(t * 0.9 + i)) , L, L * 0.58, 1, { shape: 'corazon', color: (i + vi) % 3 ? C.bright : '#6FAE86', blur: 8 });
          }
        });
      } else if (name === 'monstera') {
        const stems = o.leaves || 4;
        for (let i = 0; i < stems; i++) {
          const a = -Math.PI / 2 + (i - (stems - 1) / 2) * 0.55 + sw(i), h = (330 + 90 * ((i + 1) % 2)) * s;
          const gi = at(i * 0.12, 0.55 + i * 0.1);
          const tx = x + Math.cos(a) * h * 0.55 * gi, ty = baseY - h * gi;
          ctx.save(); ctx.strokeStyle = '#3F6F55'; ctx.lineWidth = 7 * s; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x, baseY); ctx.quadraticCurveTo(x + Math.cos(a) * h * 0.1, baseY - h * 0.6 * gi, tx, ty); ctx.stroke(); ctx.restore();
          if (gi > 0.3) P.leafX(tx, ty, a + (i % 2 ? 0.5 : -0.5) + sw(i + 2), 250 * s, 150 * s, at(0.3 + i * 0.1, 0.8 + i * 0.05), { shape: 'monstera', color: i % 2 ? '#3F8A63' : C.bright, dark: '#1F4A38' });
        }
      } else if (name === 'suculenta') {
        const rings = [[9, 1.0, 0.0], [7, 0.78, 0.3], [5, 0.55, 0.6]];
        rings.forEach(([n, f, off], ri) => {
          for (let i = 0; i < n; i++) {
            const a = -Math.PI + (i + 0.5 + off) / n * Math.PI + (ri % 2 ? 0.05 : -0.05);
            const L = 120 * f * s, gi = at(ri * 0.15, 0.6 + ri * 0.15);
            P.leafX(x, baseY - 8 * s, a, L, L * 0.34, gi, { shape: 'suculenta', color: ri === 2 ? '#A8C7AE' : ri ? '#95BBA0' : '#7FA88A', blur: 8 });
          }
        });
      } else if (name === 'helecho') {
        const n = o.fronds || 7;
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.32 + sw(i) * 0.6;
          P.leafX(x, baseY, a, (260 + 80 * Math.sin(i * 2.1)) * s, 60 * s, at(i * 0.06, 0.6 + i * 0.05), { shape: 'helecho', bend: (i < n / 2 ? -1 : 1) * 0.55 });
        }
      } else if (name === 'hierbas' || name === 'albahaca') {
        for (let b = 0; b < 3; b++) {
          const lean = (b - 1) * 0.35, h = (230 + 40 * (b % 2)) * s, gi = at(b * 0.1, 0.7 + b * 0.1);
          const spec = { pts: [[x + (b - 1) * 18 * s, baseY], [x + (b - 1) * 26 * s, baseY - h * 0.35], [x + lean * 120 * s, baseY - h * 0.7], [x + lean * 150 * s, baseY - h]], grow: [0, 1], w0: 8 * s, w1: 4 * s, color: '#4E7F5E', phase: b,
            leaves: [0.35, 0.55, 0.75].flatMap((u, j) => [-1, 1].map((sd) => ({ u, side: sd, len: (78 - j * 12) * s, wid: (40 - j * 5) * s, at: [0.2 + j * 0.2, 0.6 + j * 0.15], spread: 1.0, shape: 'ovalada', color: (o.colors || ['#6FAE86', C.bright])[j % 2], dark: o.dark }))).concat([{ tip: true, side: 1, len: 50 * s, wid: 26 * s, at: [0.7, 1], spread: 0.2, shape: 'ovalada', color: (o.colors || [])[1], dark: o.dark, droop: 0.3 }]) };
          k.plant(gi, spec, { ts: t, droop: o.droop || 0 });   // o.droop: hojas caídas (planta rendida); o.colors: [hoja clara, hoja]
        }
      } else if (name === 'tomatera') {
        const h = 420 * s;
        const spec = { pts: [[x, baseY], [x - 20 * s, baseY - h * 0.35], [x + 30 * s, baseY - h * 0.7], [x, baseY - h]], grow: [0, 0.8], w0: 12 * s, w1: 5 * s, color: '#4E7F5E', phase: 1,
          leaves: [0.25, 0.42, 0.58, 0.74, 0.88].map((u, j) => ({ u, side: j % 2 ? 1 : -1, len: (120 - j * 10) * s, wid: 42 * s, at: [0.15 + j * 0.12, 0.5 + j * 0.1], spread: 1.1 })) };
        const st = k.plant(g, spec, { ts: t });
        [[0.5, 1, 26], [0.52, 1, 20], [0.68, -1, 24]].forEach(([u, sd, R], j) => {
          const vis = at(0.6 + j * 0.1, 0.95); if (vis <= 0) return;
          const [pt] = st.at(u), cx = pt[0] + sd * 34 * s, cy = pt[1] + 40 * s;
          paper(() => { ctx.fillStyle = j === 1 ? '#E08A6A' : C.terra; ctx.beginPath(); ctx.arc(cx, cy, R * s * E.outBack(vis), 0, 7); ctx.fill(); }, { blur: 8, dx: 3, dy: 5 });
          ctx.save(); ctx.globalAlpha *= 0.5; ctx.fillStyle = '#FFE9D6'; ctx.beginPath(); ctx.arc(cx - R * 0.35 * s, cy - R * 0.35 * s, R * 0.22 * s * vis, 0, 7); ctx.fill(); ctx.restore();
        });
      } else if (name === 'cactus') {
        const h = 300 * s * at(0, 0.8), w = 90 * s;
        paper(() => {
          ctx.fillStyle = '#5E9E78';
          ctx.beginPath(); ctx.roundRect(x - w / 2, baseY - h, w, h, [w / 2, w / 2, 8, 8]); ctx.fill();
          const ah = 120 * s * at(0.4, 1);
          if (ah > 2) { ctx.beginPath(); ctx.roundRect(x - w / 2 - 60 * s, baseY - h * 0.62 - ah, 46 * s, ah + 30 * s, 23 * s); ctx.fill(); ctx.fillRect(x - w / 2 - 20 * s, baseY - h * 0.62, 30 * s, 26 * s); }
        }, { blur: 12, dx: 5, dy: 8 });
        ctx.save(); ctx.strokeStyle = 'rgba(31,74,56,0.5)'; ctx.lineWidth = 2;
        for (const dx of [-0.2, 0.1, 0.35]) { ctx.beginPath(); ctx.moveTo(x + dx * w, baseY - h + 20 * s); ctx.lineTo(x + dx * w, baseY - 6); ctx.stroke(); }
        ctx.restore();
      }
    };

    // ================= RECIPIENTES =================
    P.planter = function (x0, x1, topY, baseY, o = {}) {                // jardinera rectangular (madera o barro)
      const wood = o.material !== 'barro';
      if (wood) {
        const rows = Math.max(1, Math.round((baseY - topY) / 90));
        for (let i = 0; i < rows; i++) k.plank(x0, topY + i * (baseY - topY) / rows, x1 - x0, (baseY - topY) / rows - 6, { seed: 400 + i + (o.seed || 0), nails: true });
      } else {
        paper(() => { ctx.fillStyle = C.terra; ctx.beginPath(); ctx.roundRect(x0, topY, x1 - x0, baseY - topY, 8); ctx.fill(); }, { blur: 16, dx: 6, dy: 10 });
        ctx.save(); ctx.fillStyle = C.terraSoft; ctx.fillRect(x0 - 8, topY, x1 - x0 + 16, 22); ctx.restore();
      }
      ctx.save(); ctx.fillStyle = C.soil; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, topY + 4, (x1 - x0) / 2 - 10, 9, 0, 0, 7); ctx.fill(); ctx.restore();
    };
    P.jar = function (x, baseY, w, h, o = {}) {                        // frasco de vidrio (propagación en agua)
      const top = baseY - h, t = o.t || 0, lvl = o.water ?? 0.62;
      ctx.save();
      const body = new Path2D(); body.roundRect(x - w / 2, top, w, h, [18, 18, 24, 24]);
      paper(() => { ctx.fillStyle = 'rgba(232,241,236,0.55)'; ctx.fill(body); }, { blur: 14, dx: 5, dy: 8, color: 'rgba(10,31,28,0.18)' });
      ctx.clip(body);
      const wy = baseY - h * lvl + Math.sin(t * 1.4) * 2;
      ctx.fillStyle = 'rgba(143,184,176,0.42)'; ctx.fillRect(x - w, wy, w * 2, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2, wy); ctx.lineTo(x + w / 2, wy); ctx.stroke();
      if (o.roots) {                                                     // raíces blancas que crecen en el agua
        const rr = mulberry32(7), gr = clamp(o.roots);
        ctx.strokeStyle = 'rgba(245,239,228,0.9)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
          const x0 = x + (rr() - 0.5) * w * 0.3, L = h * (0.25 + rr() * 0.35) * gr, bend = (rr() - 0.5) * 60;
          ctx.beginPath(); ctx.moveTo(x0, wy - 6); ctx.quadraticCurveTo(x0 + bend * 0.3, wy + L * 0.5, x0 + bend, wy + L); ctx.stroke();
        }
      }
      const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
      g.addColorStop(0, 'rgba(255,255,255,0.45)'); g.addColorStop(0.22, 'rgba(255,255,255,0.05)'); g.addColorStop(0.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.25)');
      ctx.fillStyle = g; ctx.fillRect(x - w / 2, top, w, h);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(122,150,140,0.55)'; ctx.lineWidth = 2; ctx.stroke(body);
      ctx.fillStyle = 'rgba(232,241,236,0.7)'; ctx.fillRect(x - w / 2 - 4, top - 6, w + 8, 12); ctx.restore();
      return { waterY: wy, top };
    };

    // ================= AGUA Y PARTÍCULAS (pos = f(t), sin integrar) =================
    P.drops = function (t, o) {  // {t0,t1,rate,emitter(te)->[x,y],vx,vy,spread,floor(t)->y,size,color,seed,g}
      const r = mulberry32(o.seed || 21), g = o.g ?? 1500, n = Math.floor((o.t1 - o.t0) * o.rate);
      ctx.save();
      for (let i = 0; i < n; i++) {
        const te = o.t0 + i / o.rate + r() * 0.03, vx = (o.vx || 0) + (r() - 0.5) * (o.spread ?? 60), vy = (o.vy || 0) + r() * 40, sz = (o.size || 4) * (0.6 + r() * 0.8);
        if (t < te) continue;
        const dt = t - te, [ex, ey] = o.emitter(te);
        const x = ex + vx * dt, y = ey + vy * dt + 0.5 * g * dt * dt;
        if (y > (o.floor ? o.floor(t) : H + 50)) continue;
        const sp = Math.hypot(vx, vy + g * dt), ang = Math.atan2(vy + g * dt, vx), st = clamp(sp / 900, 1, 2.6);
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
        ctx.fillStyle = o.color || 'rgba(143,184,176,0.85)'; ctx.beginPath(); ctx.ellipse(0, 0, sz * st, sz, 0, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(sz * 0.3 * st, -sz * 0.3, sz * 0.3, 0, 7); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };
    P.stream = function (x0, y0, vx, vy, o = {}) {                     // chorro continuo parabólico con brillo
      const g = o.g ?? 1500, T = o.dur ?? 0.5, w = o.width || 9, a = o.alpha ?? 1;
      if (a <= 0) return;
      const pts = []; for (let i = 0; i <= 30; i++) { const s = (i / 30) * T; pts.push([x0 + vx * s, y0 + vy * s + 0.5 * g * s * s]); }
      ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(143,184,176,0.8)'; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = w * 0.3; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0] - w * 0.2, p[1]) : ctx.moveTo(p[0] - w * 0.2, p[1]))); ctx.stroke();
      ctx.restore();
      return pts[pts.length - 1];
    };
    P.rain = function (t, o = {}) {                                     // lluvia: trazos diagonales en un rectángulo
      const [x0, y0, x1, y1] = o.rect || [0, 0, W, H], n = o.count || 90, r = mulberry32(o.seed || 31), sp = o.speed || 1400, a = o.alpha ?? 0.45;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      ctx.strokeStyle = o.color || 'rgba(235,242,238,0.9)'; ctx.lineCap = 'round';
      for (let i = 0; i < n; i++) {
        const bx = x0 + r() * (x1 - x0 + 200), ph = r(), len = 26 + r() * 30, z = 0.5 + r() * 0.5;
        const y = y0 + (((ph + t * sp / (y1 - y0) * z) % 1) * (y1 - y0 + len)) - len;
        const x = bx - (y - y0) * 0.18;
        ctx.globalAlpha = a * z; ctx.lineWidth = 1.2 + z * 1.4;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.18, y + len); ctx.stroke();
      }
      ctx.restore();
    };
    P.mist = function (t, o) {                                          // atomizador: cono de gotitas finas {x,y,ang,t0,dur,len,spread}
      const u = (t - o.t0) / o.dur; if (u < 0 || u > 1.6) return;
      const r = mulberry32(o.seed || 41);
      ctx.save();
      for (let i = 0; i < (o.count || 160); i++) {
        const d = r(), off = (r() - 0.5) * (o.spread || 0.5), birth = r() * 0.6;
        const life = (u - birth) / 0.9; if (life <= 0 || life > 1) continue;
        const dist = (o.len || 320) * (1 - Math.pow(1 - life, 2)) * (0.6 + d * 0.5), a = o.ang + off;
        const x = o.x + Math.cos(a) * dist, y = o.y + Math.sin(a) * dist + life * life * 30;
        ctx.globalAlpha = (1 - life) * 0.9; ctx.fillStyle = i % 3 ? 'rgba(220,236,230,1)' : 'rgba(255,255,255,1)';
        ctx.beginPath(); ctx.arc(x, y, 2.2 + d * 3.4, 0, 7); ctx.fill();
      }
      ctx.restore();
    };
    P.splash = function (x, y, u, o = {}) {                             // salpicadura: anillo + gotitas (u 0..1)
      if (u <= 0 || u >= 1) return;
      ctx.save(); ctx.globalAlpha *= 1 - u; ctx.strokeStyle = 'rgba(210,228,222,0.9)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, y, 10 + u * (o.r || 40), 3 + u * 8, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(210,228,222,0.9)';
      for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.15 + i * 0.175), d = u * 36; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 1.3 + u * u * 30, 2.4, 0, 7); ctx.fill(); }
      ctx.restore();
    };

    // ================= LUZ Y ATMÓSFERA =================
    P.mood = moodOf;
    P.sky = function (x0, y0, x1, y1, mood, t, o = {}) {                // cielo por hora + sol/luna + nubes de papel + colinas opcionales
      const M = moodOf(mood);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, M.sky[0]); g.addColorStop(1, M.sky[1]);
      ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      const sx = o.sunX ?? lerp(x0, x1, 0.7), sy = o.sunY ?? lerp(y0, y1, 0.35);
      if (M.sun && o.sun !== false) P.sun(sx, sy, o.sunR || 70, t, M.sun);
      if (M.moon && o.sun !== false) P.moon(sx, sy, (o.sunR || 70) * 0.7, t);
      if (M.moon) { const r = mulberry32(5); ctx.fillStyle = 'rgba(237,230,214,0.8)'; for (let i = 0; i < 40; i++) { const a = 0.4 + 0.6 * Math.sin(t * 1.3 + i); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(lerp(x0, x1, r()), lerp(y0, y1, r() * 0.7), 1 + r() * 1.5, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
      if (o.clouds !== false) P.clouds(x0, y0, x1, y1, t, { dark: !!M.moon || !!M.rain, n: M.rain ? 7 : 3 });
      if (o.hills) P.hills(x0, x1, y1, t, mood);
      if (o.city) P.city(x0, x1, y1, mood);
      ctx.restore();
    };
    P.sun = function (x, y, r, t, color = '#F2C46A') {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(255,230,170,0.7)'); g.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill(); ctx.restore();
      paper(() => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r * (1 + 0.01 * Math.sin(t)), 0, 7); ctx.fill(); }, { blur: 20, dx: 0, dy: 0, color: 'rgba(242,196,106,0.5)' });
    };
    P.moon = function (x, y, r) {
      paper(() => { ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }, { blur: 30, dx: 0, dy: 0, color: 'rgba(237,230,214,0.45)' });
      ctx.save(); ctx.fillStyle = 'rgba(180,170,150,0.25)'; for (const [dx, dy, rr] of [[-0.3, -0.2, 0.18], [0.25, 0.2, 0.12], [0.1, -0.35, 0.08]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, 7); ctx.fill(); } ctx.restore();
    };
    P.clouds = function (x0, y0, x1, y1, t, o = {}) {
      const r = mulberry32(o.seed || 61), n = o.n || 3;
      for (let i = 0; i < n; i++) {
        const w = 180 + r() * 220, cy = lerp(y0, y1, 0.12 + r() * 0.45), speed = 6 + r() * 8;
        const cx = x0 + ((r() * (x1 - x0 + w) + t * speed) % (x1 - x0 + w * 2)) - w;
        paper(() => {
          ctx.fillStyle = o.dark ? (i % 2 ? '#8E9A91' : '#A3ADA4') : (i % 2 ? '#FBF6EA' : '#F5EFE4');
          ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.5, w * 0.16, 0, 0, 7); ctx.ellipse(cx - w * 0.18, cy - w * 0.1, w * 0.2, w * 0.15, 0, 0, 7); ctx.ellipse(cx + w * 0.12, cy - w * 0.13, w * 0.24, w * 0.18, 0, 0, 7); ctx.fill();
        }, { blur: 14, dx: 3, dy: 6, color: 'rgba(10,31,28,0.12)' });
      }
    };
    P.hills = function (x0, x1, y1, t, mood) {
      const M = moodOf(mood), night = !!M.moon;
      [[0.0, night ? '#1E3E36' : '#9DBBA0', 60], [0.5, night ? '#16322B' : '#6E9C7C', 30], [1.1, night ? '#10271F' : '#4B8D6B', 0]].forEach(([ph, col, lift], i) => {
        paper(() => {
          ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0, y1);
          for (let x = x0; x <= x1 + 20; x += 20) ctx.lineTo(x, y1 - 90 - lift - 40 * Math.sin(x * 0.006 + ph * 3) - 18 * Math.sin(x * 0.017 + ph));
          ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
        }, { blur: 16, dx: 0, dy: -4, color: 'rgba(10,31,28,0.18)' });
      });
    };
    P.city = function (x0, x1, y1, mood) {                              // siluetas de edificios en papel, dos planos
      const M = moodOf(mood), r = mulberry32(71), night = !!M.moon;
      [[night ? '#1B362F' : '#B9C6BA', 0.8], [night ? '#122B25' : '#93A898', 1]].forEach(([col, f], li) => {
        paper(() => {
          ctx.fillStyle = col;
          for (let x = x0 - 20; x < x1; x += 60 + r() * 70) { const w = 50 + r() * 80, h = (120 + r() * 220) * f; ctx.fillRect(x, y1 - h - li * 10, w, h + 20); }
        }, { blur: 10, dx: 0, dy: -3, color: 'rgba(10,31,28,0.15)' });
        if (night) { ctx.save(); ctx.fillStyle = 'rgba(242,196,106,0.75)'; for (let i = 0; i < 26; i++) ctx.fillRect(x0 + r() * (x1 - x0), y1 - 40 - r() * 200 * f, 6, 9); ctx.restore(); }
      });
    };
    P.glow = function (x, y, rad, color = '255,214,150', a = 0.6) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${color},${a})`); g.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); ctx.restore();
    };
    P.lamp = function (x, y, t, o = {}) {                               // lámpara colgante: cable + pantalla de papel + foco
      const s = o.scale || 1, on = o.on ?? 1, sw = Math.sin(t * 0.7) * 0.012;
      ctx.save(); ctx.translate(x, -20); ctx.rotate(sw); ctx.translate(-x, 20);
      ctx.strokeStyle = '#2B2B26'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x, y - 60 * s); ctx.stroke();
      paper(() => {
        ctx.fillStyle = o.color || C.terra; ctx.beginPath();
        ctx.moveTo(x - 30 * s, y - 60 * s); ctx.lineTo(x + 30 * s, y - 60 * s); ctx.lineTo(x + 110 * s, y + 20 * s); ctx.quadraticCurveTo(x, y + 34 * s, x - 110 * s, y + 20 * s); ctx.closePath(); ctx.fill();
      }, { blur: 16, dx: 4, dy: 8 });
      ctx.fillStyle = on > 0 ? '#FFE9B8' : '#D9CFBD'; ctx.beginPath(); ctx.ellipse(x, y + 24 * s, 34 * s, 12 * s, 0, 0, 7); ctx.fill();
      ctx.restore();
      if (on > 0) { P.glow(x, y + 30 * s, 140 * s, '255,226,170', 0.8 * on); }
      return [x, y + 26 * s];
    };
    // Gradación por hora (después de dibujar el escenario y el sujeto; antes del grano)
    P.grade = function (mood, a = 1) {
      const M = moodOf(mood); if (!M.grade) return;
      ctx.save(); ctx.globalCompositeOperation = M.grade[1]; ctx.globalAlpha = M.grade[2] * a; ctx.fillStyle = M.grade[0]; ctx.fillRect(0, 0, W, H); ctx.restore();
    };
    // Noche: oscurece todo menos charcos de luz (luces: [{x,y,r}]), y añade el calor de la lámpara
    const nightCv = document.createElement('canvas'); nightCv.width = Math.ceil(W / 8); nightCv.height = Math.ceil(H / 8);
    const nx = nightCv.getContext('2d');
    P.night = function (lights = [], a = 1) {
      nx.setTransform(1, 0, 0, 1, 0, 0); nx.clearRect(0, 0, nightCv.width, nightCv.height); nx.setTransform(1 / 8, 0, 0, 1 / 8, 0, 0);
      nx.globalCompositeOperation = 'source-over'; nx.fillStyle = `rgba(9,26,22,${Math.min(0.94, 0.78 * a)})`; nx.fillRect(0, 0, W, H);
      nx.globalCompositeOperation = 'destination-out';
      for (const L of lights) { const g = nx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(0.55, 'rgba(0,0,0,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); nx.fillStyle = g; nx.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2); }
      ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(nightCv, 0, 0, W, H); ctx.restore();
      for (const L of lights) P.glow(L.x, L.y, L.r * 0.9, '255,214,150', 0.22 * a);
    };
    P.vignette = function (a = 0.35) {
      ctx.save(); ctx.globalCompositeOperation = 'multiply';
      const v = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.5, H * 0.75);
      v.addColorStop(0, 'rgba(255,255,255,0)'); v.addColorStop(1, `rgba(60,50,40,${a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore();
    };

    // ================= OBJETOS Y HERRAMIENTAS =================
    P.wateringCan = function (x, y, rot, s = 1, o = {}) {              // regadera de metal pintado; devuelve la punta de la roseta
      const body = o.color || '#4B8D6B', dark = o.dark || '#2D4A3F';
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
      paper(() => {
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(90, -70); ctx.lineTo(110, 90); ctx.quadraticCurveTo(0, 104, -130, 90); ctx.closePath(); ctx.fill();   // cuerpo
        ctx.beginPath(); ctx.moveTo(-100, 40); ctx.lineTo(-290, -110); ctx.lineTo(-282, -124); ctx.lineTo(-90, 0); ctx.closePath(); ctx.fill();                  // pico
        ctx.save(); ctx.translate(-296, -122); ctx.rotate(-0.65); ctx.beginPath(); ctx.ellipse(0, 0, 16, 30, 0, 0, 7); ctx.fill(); ctx.restore();                // roseta
      }, { blur: 16, dx: 6, dy: 10 });
      ctx.lineCap = 'round'; ctx.strokeStyle = dark; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(-60, -70); ctx.bezierCurveTo(-50, -170, 80, -170, 96, -40); ctx.stroke();                                                       // asa
      ctx.fillStyle = 'rgba(245,239,228,0.18)'; ctx.fillRect(-110, -60, 30, 140);
      ctx.strokeStyle = 'rgba(245,239,228,0.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-104, -40); ctx.lineTo(96, -40); ctx.stroke();
      ctx.fillStyle = 'rgba(245,239,228,0.5)'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-300 + i * 3, -136 + i * 7, 2, 0, 7); ctx.fill(); }
      ctx.restore();
      const c = Math.cos(rot), sn = Math.sin(rot), lx = -300 * s, ly = -118 * s;
      return [x + lx * c - ly * sn, y + lx * sn + ly * c];
    };
    P.scissors = function (x, y, rot, s = 1, open = 0.3, o = {}) {      // tijeras de podar: hojas crema, mangos terracota
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
      for (const sd of [1, -1]) {
        ctx.save(); ctx.rotate(sd * open * 0.5);
        paper(() => {
          ctx.fillStyle = sd > 0 ? '#E8E1D3' : '#D9D2C2';
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-90, sd * -22, -170, sd * -4); ctx.quadraticCurveTo(-100, sd * 8, 0, sd * 12); ctx.closePath(); ctx.fill();
          ctx.fillStyle = o.handle || C.terra;
          ctx.beginPath(); ctx.moveTo(0, sd * 4); ctx.quadraticCurveTo(70, sd * 10, 150, sd * 34); ctx.lineTo(150, sd * 58); ctx.quadraticCurveTo(70, sd * 34, 0, sd * 18); ctx.closePath(); ctx.fill();
        }, { blur: 12, dx: 5, dy: 8 });
        ctx.strokeStyle = 'rgba(58,40,29,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-8, sd * 6); ctx.quadraticCurveTo(-90, sd * -8, -160, sd * -4); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#6B6A60'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#C9C3B4'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7); ctx.fill();
      ctx.restore();
    };
    P.sprayBottle = function (x, y, s = 1, press = 0, o = {}) {        // atomizador; devuelve la boquilla
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      paper(() => {
        ctx.fillStyle = o.color || '#F1EBDD'; ctx.beginPath(); ctx.roundRect(-60, -40, 120, 220, [30, 30, 18, 18]); ctx.fill();
        ctx.fillStyle = o.cap || C.moss; ctx.beginPath(); ctx.roundRect(-34, -110, 68, 74, 10); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-34, -110); ctx.lineTo(-96, -104); ctx.lineTo(-96, -86); ctx.lineTo(-34, -82); ctx.closePath(); ctx.fill();
        ctx.save(); ctx.translate(-30, -60); ctx.rotate(-0.25 + press * 0.25); ctx.fillStyle = C.bright; ctx.beginPath(); ctx.roundRect(-40, -8, 44, 16, 6); ctx.fill(); ctx.restore();
      }, { blur: 14, dx: 5, dy: 9 });
      ctx.fillStyle = 'rgba(143,184,176,0.35)'; ctx.fillRect(-52, 40, 104, 130);
      ctx.fillStyle = C.terra; ctx.fillRect(-60, 10, 120, 26);
      ctx.restore();
      return [x - 98 * s, y - 95 * s];
    };
    P.trowel = function (x, y, rot, s = 1) {                            // palita de jardín
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
      paper(() => {
        ctx.fillStyle = '#C9C3B4'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-60, -40, -150, 0); ctx.quadraticCurveTo(-60, 40, 0, 0); ctx.fill();
        ctx.fillStyle = '#8A8574'; ctx.fillRect(0, -5, 40, 10);
        ctx.fillStyle = C.terra; ctx.beginPath(); ctx.roundRect(38, -14, 110, 28, 14); ctx.fill();
      }, { blur: 12, dx: 5, dy: 8 });
      ctx.strokeStyle = 'rgba(58,40,29,0.3)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-130, 0); ctx.stroke();
      ctx.restore();
    };
    P.stake = function (x, y, s = 1) {                                  // estaca/etiqueta de madera (el texto va en el DOM)
      paper(() => { ctx.fillStyle = '#E3C79F'; ctx.beginPath(); ctx.moveTo(x - 60 * s, y - 60 * s); ctx.lineTo(x + 60 * s, y - 60 * s); ctx.lineTo(x + 60 * s, y); ctx.lineTo(x + 8 * s, y); ctx.lineTo(x, y + 90 * s); ctx.lineTo(x - 8 * s, y); ctx.lineTo(x - 60 * s, y); ctx.closePath(); ctx.fill(); }, { blur: 10, dx: 4, dy: 7 });
    };
    P.shelf = function (x0, x1, y, o = {}) {                            // repisa de madera con ménsulas
      k.plank(x0, y, x1 - x0, o.h || 36, { seed: o.seed || 500, color: o.color, nails: false, blur: 16 });
      for (const bx of [x0 + 60, x1 - 90]) paper(() => { ctx.fillStyle = '#2B2B26'; ctx.beginPath(); ctx.moveTo(bx, y + 34); ctx.lineTo(bx + 30, y + 34); ctx.lineTo(bx + 30, y + 44); ctx.lineTo(bx + 10, y + 120); ctx.lineTo(bx, y + 120); ctx.closePath(); ctx.fill(); }, { blur: 8, dx: 3, dy: 6 });
    };
    P.table = function (x0, x1, y, o = {}) {                            // mesa de trabajo: cubierta con veta + canto + patas
      const th = o.th || 44;
      for (const lx of [x0 + 50, x1 - 100]) k.plank(lx, y + th, 50, (o.legs || 700), { seed: 520 + lx, color: '#A27A55', nails: false, blur: 10 });
      k.plank(x0, y, x1 - x0, th, { seed: o.seed || 510, color: o.color || '#C9A27E', nails: false, blur: 22 });
      ctx.save(); ctx.fillStyle = 'rgba(255,240,215,0.3)'; ctx.fillRect(x0, y, x1 - x0, 5); ctx.restore();
    };
    P.tiles = function (x0, y0, x1, y1, o = {}) {                       // azulejos de cocina con junta fina
      const sz = o.size || 90, r = mulberry32(o.seed || 81);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      ctx.fillStyle = o.grout || '#D8CFBF'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      for (let y = y0; y < y1; y += sz) for (let x = x0 - ((Math.floor((y - y0) / sz) % 2) * sz / 2); x < x1; x += sz) {
        ctx.fillStyle = (o.colors || ['#F3ECDF', '#EFE6D6', '#F6F0E6'])[Math.floor(r() * 3)];
        ctx.beginPath(); ctx.roundRect(x + 3, y + 3, sz - 6, sz - 6, 6); ctx.fill();
        if (o.accent && r() < 0.12) { ctx.fillStyle = o.accent; ctx.beginPath(); ctx.roundRect(x + 3, y + 3, sz - 6, sz - 6, 6); ctx.fill(); }
      }
      const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(40,30,20,0.1)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.restore();
    };
    P.railing = function (y, o = {}) {                                  // barandal de balcón (barrotes finos)
      const col = o.color || '#23352F', x0 = o.x0 ?? -20, x1 = o.x1 ?? W + 20, h = o.h || 300;
      paper(() => {
        ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, 16); ctx.fillRect(x0, y + h - 12, x1 - x0, 12);
        for (let x = x0 + 20; x < x1; x += 46) ctx.fillRect(x, y + 10, 7, h - 16);
      }, { blur: 10, dx: 4, dy: 8 });
    };
    P.windowFrame = function (x, y, w, h, t, o = {}) {                  // ventana: cielo por hora + marco de madera pintada + parteluz (+ lluvia en el vidrio)
      const M = moodOf(o.mood);
      P.sky(x, y, x + w, y + h, o.mood, t, { sunX: o.sunX ?? x + w * 0.72, sunY: o.sunY ?? y + h * 0.3, sunR: o.sunR || 56, hills: o.hills ?? true, city: o.city, clouds: o.clouds });
      if (M.rain || o.rain) { P.rain(t, { rect: [x, y, x + w, y + h], count: 70, alpha: 0.5 }); }
      const f = o.frame || '#F1EBDD', b = o.bar || 22;
      paper(() => {
        ctx.fillStyle = f;
        ctx.fillRect(x - b, y - b, w + 2 * b, b); ctx.fillRect(x - b, y + h, w + 2 * b, b * 1.6); ctx.fillRect(x - b, y, b, h); ctx.fillRect(x + w, y, b, h);
        ctx.fillRect(x + w / 2 - b / 3, y, b * 0.66, h); ctx.fillRect(x, y + h * 0.45 - b / 3, w, b * 0.66);
      }, { blur: 18, dx: 6, dy: 10 });
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x + w * 0.08, y); ctx.lineTo(x + w * 0.22, y); ctx.lineTo(x + w * 0.02, y + h * 0.4); ctx.lineTo(x, y + h * 0.4); ctx.lineTo(x, y + h * 0.15); ctx.closePath(); ctx.fill(); ctx.restore();
    };

    // ================= BICHOS Y BRILLOS =================
    P.aphid = function (x, y, s = 1, t = 0, rot = 0, o = {}) {          // pulgón: óvalo verde claro con patitas
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot + Math.sin(t * 6 + x) * 0.08); ctx.scale(s, s);
      ctx.strokeStyle = 'rgba(40,60,40,0.7)'; ctx.lineWidth = 1.4;
      for (const i of [-1, 0, 1]) for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(i * 5, 0); ctx.lineTo(i * 7 + Math.sin(t * 12 + i) * 1.5, sd * 11); ctx.stroke(); }
      ctx.fillStyle = o.color || '#7E9A48'; ctx.strokeStyle = 'rgba(30,45,25,0.8)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, 0, 11, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3E5424'; ctx.beginPath(); ctx.arc(10, 0, 3.4, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-3, -2, 2.4, 0, 7); ctx.fill();
      ctx.restore();
    };
    P.ladybug = function (x, y, s = 1, rot = 0, t = 0) {                // catarina (aliada)
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
      paper(() => { ctx.fillStyle = '#C94F3B'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 15, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1E1E1A'; ctx.beginPath(); ctx.arc(16, 0, 8, 0, 7); ctx.fill(); }, { blur: 6, dx: 2, dy: 4 });
      ctx.strokeStyle = '#1E1E1A'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(13, 0); ctx.stroke();
      ctx.fillStyle = '#1E1E1A'; for (const [dx, dy] of [[-8, -6], [-8, 6], [2, -8], [2, 8]]) { ctx.beginPath(); ctx.arc(dx, dy, 3, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.arc(-6, -8, 3, 0, 7); ctx.fill();
      ctx.restore();
    };
    P.worm = function (x, y, len, t, o = {}) {                          // lombriz: gusano que ondula
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = o.color || '#C98A7A'; ctx.lineWidth = o.w || 10;
      ctx.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, px = x + u * len, py = y + Math.sin(u * 9 - t * 3) * 8; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      ctx.strokeStyle = 'rgba(122,70,60,0.5)'; ctx.lineWidth = 1.2; for (let i = 2; i < 20; i += 2) { const u = i / 20, px = x + u * len, py = y + Math.sin(u * 9 - t * 3) * 8; ctx.beginPath(); ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 4); ctx.stroke(); }
      ctx.restore();
    };
    P.sparkle = function (x, y, u, size = 26) {                         // destello dorado (u 0..1)
      if (u <= 0 || u >= 1) return;
      const a = Math.sin(Math.PI * u), r = size * (0.6 + 0.4 * u);
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(232,205,140,${a})`;
      ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill(); ctx.restore();
      P.glow(x, y, size * 2.2, '232,205,140', 0.5 * a);
    };

    // ================= ESCENARIOS (fondos completos, paramétricos por hora) =================
    // Devuelven la geometría útil para colocar objetos: {floor, table, shelf, ground, window:[x,y,w,h], surface}
    P.set = function (name, t, o = {}) {
      const mood = o.mood || 'dorada', M = moodOf(mood);
      const wallCol = (c) => { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]); return g; };
      const night = !!M.moon;
      if (name === 'ventana') {                                          // repisa junto a la ventana
        ctx.fillStyle = wallCol(night ? ['#2E3F38', '#243731'] : ['#E9E0CF', '#E6DCCA']); ctx.fillRect(0, 0, W, H);
        const win = [150, 300, 780, 760];
        P.windowFrame(...win, t, { mood, city: o.city, hills: !o.city });
        if (M.beam) k.light(t, { intensity: M.beamA });
        const shelfY = 1110;
        k.plank(-20, shelfY, W + 40, 44, { seed: 530, color: '#F1EBDD', nails: false, blur: 22 });
        ctx.fillStyle = night ? '#1E2E28' : '#DDD2BF'; ctx.fillRect(0, shelfY + 44, W, H - shelfY - 44);
        return { shelf: shelfY, window: win, floor: shelfY };
      }
      if (name === 'balcon') {
        P.sky(0, 0, W, 1300, mood, t, { sunX: 780, sunY: 330, sunR: 80, city: true });
        if (M.rain && (o.rain ?? 1) > 0) P.rain(t, { rect: [0, 0, W, H], count: 120, alpha: 0.4 * (o.rain ?? 1) });
        const floor = 1330;
        P.railing(980, { h: 360 });
        ctx.save(); for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#C9745E' : '#D2806A'; ctx.fillRect(0, floor + i * 80, W, 80); } ctx.strokeStyle = 'rgba(90,40,30,0.3)'; for (let x = 0; x < W; x += 135) { ctx.beginPath(); ctx.moveTo(x, floor); ctx.lineTo(x, H); ctx.stroke(); } ctx.restore();
        paper(() => { ctx.fillStyle = '#B5634E'; ctx.fillRect(0, floor - 10, W, 16); }, { blur: 10, dx: 0, dy: 6 });
        return { floor, railing: 980 };
      }
      if (name === 'jardin') {
        P.sky(0, 0, W, 1250, mood, t, { sunX: 300, sunY: 360, sunR: 90, hills: true });
        if (M.rain && (o.rain ?? 1) > 0) P.rain(t, { rect: [0, 0, W, H], count: 130, alpha: 0.45 * (o.rain ?? 1) });
        const ground = 1250, r = mulberry32(91);
        paper(() => { ctx.fillStyle = night ? '#16302A' : '#7FAE87'; ctx.fillRect(0, ground, W, H - ground); }, { blur: 16, dx: 0, dy: -6 });
        ctx.save(); ctx.fillStyle = night ? '#1F3D35' : '#6C9E78';
        for (let i = 0; i < 90; i++) { const x = r() * W, y = ground + r() * (H - ground), h = 14 + r() * 26; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3, y - h * 0.6, x + 8 * (r() - 0.3), y - h); ctx.lineTo(x + 4, y); ctx.fill(); }
        ctx.restore();
        paper(() => { ctx.fillStyle = night ? '#23332D' : '#D9C4A0'; for (let x = -20; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, ground + 10); ctx.lineTo(x, ground - 170); ctx.lineTo(x + 20, ground - 196); ctx.lineTo(x + 40, ground - 170); ctx.lineTo(x + 40, ground + 10); ctx.fill(); } ctx.fillRect(0, ground - 140, W, 16); ctx.fillRect(0, ground - 60, W, 16); }, { blur: 10, dx: 4, dy: 6 });
        return { ground: ground + 150, floor: ground + 150 };
      }
      if (name === 'mesa') {                                             // mesa de trabajo junto a una pared de tablas
        ctx.fillStyle = night ? '#2B3A34' : '#E4D8C4'; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 8; i++) k.plank(i * 140 - 20, -40, 132, 1300, { seed: 540 + i, color: night ? '#394A42' : (i % 2 ? '#E8DCC8' : '#E1D3BC'), nails: false, blur: 4 });
        if (M.beam) k.light(t, { intensity: M.beamA * 0.9 });
        const table = 1180;
        ctx.fillStyle = night ? '#1B2824' : '#CFC1A8'; ctx.fillRect(0, table + 44, W, H);
        P.table(-40, W + 40, table, { legs: 800 });
        return { table, floor: table };
      }
      if (name === 'cocina') {
        ctx.fillStyle = night ? '#2A3833' : '#EFE7D8'; ctx.fillRect(0, 0, W, H);
        P.tiles(0, 520, W, 1200, { accent: night ? null : '#DCE6DA' });
        P.windowFrame(120, 120, 420, 330, t, { mood, hills: true });
        P.shelf(600, 1040, 400, { color: '#E3C79F' });
        [[660, 330, '#F1EBDD'], [760, 350, C.terraSoft], [880, 336, '#DCE6DA']].forEach(([jx, jy, col], i) => paper(() => { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(jx, jy, 70, 400 - jy, 10); ctx.fill(); }, { blur: 10, dx: 3, dy: 6 }));
        if (M.beam) k.light(t, { intensity: M.beamA * 0.8 });
        const counter = 1200;
        k.plank(-20, counter, W + 40, 60, { seed: 560, color: '#D4B189', nails: false, blur: 22 });
        ctx.fillStyle = night ? '#23302B' : '#6E8F7C'; ctx.fillRect(0, counter + 60, W, H);
        ctx.strokeStyle = 'rgba(20,48,42,0.35)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 270) { ctx.strokeRect(x + 20, counter + 90, 230, 420); ctx.beginPath(); ctx.arc(x + 225, counter + 300, 8, 0, 7); ctx.stroke(); }
        return { table: counter, floor: counter, window: [120, 120, 420, 330] };
      }
      if (name === 'invernadero') {
        P.sky(0, 0, W, H, mood, t, { sunX: 760, sunY: 260, sunR: 70, hills: true });
        ctx.save(); ctx.fillStyle = 'rgba(232,241,236,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();   // vidrio difuso
        if (M.rain && (o.rain ?? 1) > 0) P.rain(t, { rect: [0, 0, W, 1250], count: 110, alpha: 0.35 * (o.rain ?? 1) });
        paper(() => {
          ctx.strokeStyle = night ? '#2A3F38' : '#F1EBDD'; ctx.lineWidth = 16;
          ctx.beginPath(); ctx.arc(W / 2, 1250, 760, Math.PI, 0); ctx.stroke();
          ctx.lineWidth = 10; for (let a = 1; a < 8; a++) { const th = Math.PI + a * Math.PI / 8; ctx.beginPath(); ctx.moveTo(W / 2, 1250); ctx.lineTo(W / 2 + Math.cos(th) * 760, 1250 + Math.sin(th) * 760); ctx.stroke(); }
          ctx.beginPath(); ctx.arc(W / 2, 1250, 430, Math.PI, 0); ctx.stroke();
        }, { blur: 12, dx: 4, dy: 8 });
        const bench = 1250;
        for (let i = 0; i < 7; i++) { const px = 60 + i * 150; k.pot(px, bench - 90, bench, 80, 60, { rimH: 16, seed: i }); P.leafX(px, bench - 92, -Math.PI / 2 + (i % 3 - 1) * 0.5, 60, 26, 1, { force: true, color: i % 2 ? C.bright : '#6FAE86', blur: 6 }); }
        for (let i = 0; i < 4; i++) k.plank(-20, bench + i * 26, W + 40, 20, { seed: 570 + i, color: '#C9A27E', nails: false, blur: 8 });
        ctx.fillStyle = night ? '#1C2B26' : '#B9C9B9'; ctx.fillRect(0, bench + 104, W, H);
        return { table: bench, floor: bench };
      }
      if (name === 'subsuelo') {                                         // corte bajo tierra: superficie arriba, estratos, raíces
        const surf = o.surface || 620;
        P.sky(0, 0, W, surf, mood, t, { sunX: 820, sunY: 220, sunR: 60 });
        const r = mulberry32(95);
        [['#5C4332', 0], ['#4A3527', 0.28], ['#3B2A20', 0.58], ['#2C2019', 0.82]].forEach(([col, f], i) => {
          const y = surf + f * (H - surf);
          ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, y);
          for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, y + 10 * Math.sin(x * 0.012 + i * 2)); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
        });
        ctx.save();
        for (let i = 0; i < 260; i++) { const x = r() * W, y = surf + 30 + r() * (H - surf); ctx.fillStyle = r() < 0.5 ? 'rgba(120,90,66,0.7)' : 'rgba(20,14,10,0.5)'; ctx.beginPath(); ctx.arc(x, y, 1.5 + r() * 3, 0, 7); ctx.fill(); }
        for (let i = 0; i < 16; i++) { const x = r() * W, y = surf + 200 + r() * (H - surf - 300), w = 18 + r() * 30; paper(() => { ctx.fillStyle = ['#8C8378', '#A39A8E', '#6F675D'][i % 3]; ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.65, r(), 0, 7); ctx.fill(); }, { blur: 6, dx: 2, dy: 4 }); }
        ctx.restore();
        paper(() => { ctx.fillStyle = '#6C9E78'; ctx.beginPath(); ctx.moveTo(0, surf + 18); for (let x = 0; x <= W + 20; x += 12) ctx.lineTo(x, surf - 8 - 10 * Math.abs(Math.sin(x * 0.2))); ctx.lineTo(W, surf + 18); ctx.closePath(); ctx.fill(); }, { blur: 10, dx: 0, dy: 5 });
        return { surface: surf, floor: surf };
      }
      if (name === 'macro') {                                            // fondo desenfocado (bokeh) para planos de detalle
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, night ? '#0E2420' : '#2D4A3F'); g.addColorStop(1, night ? '#081814' : '#14302A');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const r = mulberry32(97);
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 26; i++) {
          const x = r() * W + Math.sin(t * 0.2 + i) * 14, y = r() * H, rad = 40 + r() * 120, warm = r() < (M.moon ? 0.2 : 0.5);
          const bg = ctx.createRadialGradient(x, y, 0, x, y, rad); bg.addColorStop(0, warm ? 'rgba(201,169,97,0.22)' : 'rgba(111,174,134,0.2)'); bg.addColorStop(0.7, warm ? 'rgba(201,169,97,0.12)' : 'rgba(111,174,134,0.1)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
        }
        ctx.restore();
        return {};
      }
      // 'pared' (referencia v5): pared + piso + luz de ventana
      k.wall(t, o.floor || 1420); if (M.beam) k.light(t, { intensity: M.beamA });
      return { floor: (o.floor || 1420) + 80 };
    };

    return P;
  });
})();
