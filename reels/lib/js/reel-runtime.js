/* VEJ reel runtime — la FIRMA fija de marca + la API que usa cada escena (reels/<id>/scene.js).
 *   Fijo: grano de papel, título de apertura, subtítulos, rótulos DOM, cortina de papel y logo que se dibuja.
 *   Variable (lo escribe el agente en scene.js): escenario, sujeto, cámara, transiciones, luz.
 *
 * scene.js:
 *   VEJ.reel((api) => {
 *     const { K, W, H, T, u } = api;          // K: kit principal · T: tiempos · u: utilidades
 *     api.label('dato', '6 h de luz', { x: 800, y: 900, at: [api.at(2), api.end(2) + 0.4] });
 *     return api.seq([                         // planos con transiciones entre ellos
 *       { to: api.at(1) - 0.3, draw: (k, t, lt, p) => { ... } },   // k: kit del plano (dibuja ahí), lt: tiempo local, p: 0..1
 *       { to: api.at(3) - 0.3, draw: ... },
 *       { draw: ... },                         // el último llega hasta que cierra la cortina
 *     ], { transitions: ['hoja', 'tierra'], dur: 1.1 });
 *   });
 */
(function () {
  const { clamp, lerp, prog, E } = VEJ.util;
  const W = 1080, H = 1920, FPS = 30;
  let sceneFactory = null;
  VEJ.reel = (fn) => { sceneFactory = fn; };

  function boot() {
    const R = window.REEL, DUR = R.total;
    const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
    const K = VEJ.kit(ctx, { W, H, seed: 7 });
    const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return VEJ.kit(c.getContext('2d'), { W, H, seed: 7 }); };
    const KA = mk(), KB = mk();
    const VOICE_END = R.voice_end, CLOSE = R.curtain_closed, LOGO_DONE = R.logo_done;
    const $ = (id) => document.getElementById(id);
    const annots = $('annots'), labels = [];

    // ---------- API para scene.js ----------
    const api = {
      K, W, H, FPS,
      T: { total: DUR, lines: R.lines, voiceEnd: VOICE_END, curtain: CLOSE, sceneEnd: CLOSE, titleOut: R.title_out },
      u: VEJ.util,
      at: (i) => R.lines[Math.min(i, R.lines.length - 1)].start,     // inicio de la línea de voz i (0 = primera)
      end: (i) => R.lines[Math.min(i, R.lines.length - 1)].end,
      // rótulo DOM (Fraunces itálica por defecto): {x,y,align,size,style:'label'|'big'|'tag'|'num',color,at:[t0,t1],rise}
      label(id, text, o = {}) {
        const el = document.createElement('div'); el.id = 'lbl-' + id; el.className = 'annot ' + (o.style || 'label'); el.textContent = text;
        const al = o.align || 'left';
        el.style.top = (o.y ?? 900) + 'px';
        if (al === 'right') el.style.right = (W - (o.x ?? 900)) + 'px';
        else if (al === 'center') { el.style.left = '0px'; el.style.width = W + 'px'; el.style.textAlign = 'center'; }
        else el.style.left = (o.x ?? 100) + 'px';
        if (o.size) el.style.fontSize = o.size + 'px';
        if (o.color) el.style.color = o.color;
        if (o.maxWidth) el.style.maxWidth = o.maxWidth + 'px';
        el.style.opacity = '0'; annots.appendChild(el);
        labels.push({ el, at: o.at || [0, DUR], rise: o.rise ?? 12 });
        return el;
      },
      // cámara: keys [{t, x, y, z, r}] (punto de mundo al centro de la pantalla, zoom, giro) — curvas lentas
      cam(k, keys, t) {
        let a = keys[0], b = keys[keys.length - 1];
        for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i].t && t <= keys[i + 1].t) { a = keys[i]; b = keys[i + 1]; break; }
        const f = a === b ? 0 : E.inOut(prog(t, a.t, b.t)), L = (p, d) => lerp(a[p] ?? d, b[p] ?? d, t < keys[0].t ? 0 : t > keys[keys.length - 1].t ? 1 : f);
        const x = L('x', W / 2), y = L('y', H / 2), z = L('z', 1), r = L('r', 0);
        k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.ctx.translate(W / 2, H / 2); k.ctx.rotate(r); k.ctx.scale(z, z); k.ctx.translate(-x, -y);
        return { x, y, z, r };
      },
      seq(shots, opts = {}) {
        let from = 0;
        const S = shots.map((s, i) => { const o = { ...s, from: s.from ?? from, to: s.to ?? (i === shots.length - 1 ? CLOSE + 0.2 : undefined) }; from = o.to; return o; });
        const XF = opts.dur ?? 1.1, kinds = opts.transitions || [];
        const drawShot = (i, k, t) => { const s = S[i]; k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.ctx.globalAlpha = 1; k.ctx.globalCompositeOperation = 'source-over'; s.draw(k, t, t - s.from, clamp((t - s.from) / (s.to - s.from))); k.ctx.setTransform(1, 0, 0, 1, 0, 0); };
        return (t) => {
          for (let j = 0; j < S.length - 1; j++) {
            const b = S[j].to, d = (S[j].xf ?? XF);
            if (t >= b - d / 2 && t < b + d / 2) {
              const u = (t - (b - d / 2)) / d;
              KA.ctx.setTransform(1, 0, 0, 1, 0, 0); KA.ctx.clearRect(0, 0, W, H); drawShot(j, KA, t);
              KB.ctx.setTransform(1, 0, 0, 1, 0, 0); KB.ctx.clearRect(0, 0, W, H); drawShot(j + 1, KB, t);
              TRANS[kinds[j] || 'fundido'](u, KA.ctx.canvas, KB.ctx.canvas, t, S[j].match || {});
              return;
            }
          }
          const i = S.findIndex((s) => t < s.to);
          drawShot(i < 0 ? S.length - 1 : i, K, t);
        };
      },
    };

    // ---------- transiciones (u 0..1; A sale, B entra) ----------
    const draw = (c, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.drawImage(c, 0, 0); ctx.restore(); };
    const TRANS = {
      fundido(u, A, B) { draw(A); draw(B, E.inOut(u)); },
      // hoja que barre: una hoja gigante cruza de izquierda a derecha; detrás de ella ya está el plano nuevo
      hoja(u, A, B, t) {
        const x = lerp(-420, W + 420, E.inOut(u)), edge = (y) => x + 70 * Math.sin(y * 0.004 + 1.3);
        draw(A);
        ctx.save(); ctx.beginPath(); ctx.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 40) ctx.lineTo(edge(y), y); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip(); draw(B); ctx.restore();
        ctx.save(); ctx.translate(x, H + 260); ctx.rotate(-Math.PI / 2 - 0.08);
        const L = H + 620, Wd = 420, p = K.leafPath('lanza', L, Wd);
        K.paper(() => { ctx.fillStyle = K.C.bright; ctx.fill(p); }, { blur: 40, dx: 18, dy: 0, color: 'rgba(10,31,28,0.35)' });
        ctx.clip(p); ctx.fillStyle = K.C.moss; ctx.globalAlpha = 0.5; ctx.fillRect(0, 0, L, Wd);
        ctx.globalAlpha = 0.45; ctx.strokeStyle = K.C.cream; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * 0.95, 0); ctx.stroke();
        ctx.lineWidth = 3; ctx.globalAlpha = 0.25; for (let i = 1; i < 9; i++) for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(L * i / 10, 0); ctx.quadraticCurveTo(L * (i / 10 + 0.05), sd * Wd * 0.35, L * (i / 10 + 0.12), sd * Wd * 0.75); ctx.stroke(); }
        ctx.restore();
      },
      // tierra que sube: una banda de tierra cubre el plano y sigue hacia arriba destapando el nuevo
      tierra(u, A, B, t) {
        const e = E.inOut(u), top = lerp(H + 80, -220, clamp(e * 2)), bot = lerp(H + 80, -220, clamp(e * 2 - 1));
        const wave = (y, x, s) => y + 22 * Math.sin(x * 0.012 + s) + 10 * Math.sin(x * 0.041 + s * 2);
        draw(A);
        ctx.save(); ctx.beginPath(); ctx.moveTo(-10, H + 10); for (let x = -10; x <= W + 10; x += 20) ctx.lineTo(x, wave(bot, x, 2)); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.clip(); draw(B); ctx.restore();
        const band = new Path2D(); band.moveTo(-10, wave(top, -10, 0)); for (let x = -10; x <= W + 10; x += 20) band.lineTo(x, wave(top, x, 0)); for (let x = W + 10; x >= -10; x -= 20) band.lineTo(x, wave(bot, x, 2)); band.closePath();
        K.paper(() => { ctx.fillStyle = K.C.soil; ctx.fill(band); }, { blur: 30, dx: 0, dy: -12, color: 'rgba(10,31,28,0.4)' });
        ctx.save(); ctx.clip(band); const r = K.mulberry32(3);
        for (let i = 0; i < 700; i++) { ctx.fillStyle = r() < 0.5 ? 'rgba(106,78,58,0.85)' : 'rgba(30,20,14,0.6)'; ctx.beginPath(); ctx.arc(r() * W, r() * H * 1.2 - 100, 1.5 + r() * 3.5, 0, 7); ctx.fill(); }
        ctx.strokeStyle = 'rgba(232,215,190,0.55)'; ctx.lineWidth = 2.4; for (let i = 0; i < 14; i++) { const x0 = r() * W, y0 = r() * H; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + 40, y0 + 60, x0 - 30, y0 + 120, x0 + 20, y0 + 200); ctx.stroke(); }
        ctx.restore();
      },
      // lluvia: el plano se lava bajo la lluvia y aparece el siguiente
      lluvia(u, A, B, t) {
        const v = E.inOut(u), peak = Math.sin(Math.PI * u);
        draw(A); draw(B, v);
        ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35 * peak; ctx.fillStyle = '#9FAAA2'; ctx.fillRect(0, 0, W, H); ctx.restore();
        K.rain(t, { count: 260, alpha: 0.75 * peak, speed: 2200, seed: 17 });
      },
      // cambio de estación: hojas secas que caen en diagonal y un tinte cálido
      estacion(u, A, B, t) {
        const v = E.inOut(u), peak = Math.sin(Math.PI * u), r = K.mulberry32(29);
        draw(A); draw(B, v);
        ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.6 * peak; ctx.fillStyle = '#D2725A'; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (let i = 0; i < 46; i++) {
          const x0 = r() * (W + 600) - 300, d = r(), ph = r() * 6, y = lerp(-200 - r() * 600, H + 300, u * (0.8 + d * 0.5)), x = x0 + (y * 0.3) + Math.sin(t * 2 + ph) * 40;
          K.leafX(x, y, ph + t * (1 + d), 50 + d * 50, 22 + d * 16, 1, { force: true, color: ['#C9A961', '#D2725A', '#B7844F', '#DE8C74'][i % 4], dark: '#8A5A3A', blur: 8 });
        }
      },
      // match-cut: el plano A entra en una forma (círculo en match.a) y el B sale de la misma forma (match.b)
      match(u, A, B, t, m) {
        const a = m.a || { x: W / 2, y: H / 2 }, b = m.b || a, z = m.zoom || 2.2;
        const zoomDraw = (c, p, s, al) => { ctx.save(); ctx.globalAlpha = al; ctx.translate(p.x, p.y); ctx.scale(s, s); ctx.translate(-p.x, -p.y); ctx.drawImage(c, 0, 0); ctx.restore(); };
        const e = E.inOut(u), cut = clamp((u - 0.42) / 0.16);
        if (cut < 1) zoomDraw(A, a, lerp(1, z, clamp(e * 1.6)), 1);
        if (cut > 0) zoomDraw(B, b, lerp(z, 1, clamp(e * 1.6 - 0.6)), cut);
      },
    };

    // ---------- cierre fijo: cortina de papel + tarjeta con el logo que se dibuja ----------
    const curtainX = (t) => ({ xL: lerp(-60, W / 2 + 8, E.inOut(prog(t, VOICE_END + 0.05, CLOSE))), xR: lerp(W + 60, W / 2 - 8, E.inOut(prog(t, VOICE_END + 0.14, CLOSE))) });
    const LOGO = { x: 540, y: 750, size: 390 };
    function closing(t) {
      if (t < VOICE_END) return;
      const { xL, xR } = curtainX(t);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      K.curtain(xL, xR);
      K.cardBg(t, E.inOut(prog(t, CLOSE, CLOSE + 0.45)), LOGO.x, LOGO.y);
      if (t > CLOSE + 0.1) K.vejLogo(prog(t, CLOSE + 0.15, LOGO_DONE), { ...LOGO, color: K.C.cream });
      annots.style.clipPath = `inset(0px ${Math.max(0, W - xR).toFixed(1)}px 0px ${Math.max(0, xL).toFixed(1)}px)`;
    }

    const sceneDraw = sceneFactory ? sceneFactory(api) : () => K.set('pared', 0);
    const titleWords = [...document.querySelectorAll('#title .rv')], plate = document.querySelector('#title .plate');
    const subs = $('subs');

    function render(time) {
      const t = Math.round(Math.max(0, Math.min(DUR, +time || 0)) * FPS) / FPS;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      if (t < CLOSE + 0.5) sceneDraw(t);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      closing(t);
      K.grain(t);
      if (t < VOICE_END) annots.style.clipPath = 'none';
      titleWords.forEach((el) => VEJ.reveal(el, t, +el.dataset.in, 1.1, 26, [R.title_out + +el.dataset.out, R.title_out + 0.8 + +el.dataset.out]));
      if (plate) VEJ.reveal(plate, t, 0.2, 0.9, 0, [R.title_out + 0.25, R.title_out + 1.05], 0);
      for (const L of labels) VEJ.reveal(L.el, t, L.at[0], 0.9, L.rise, [L.at[1], L.at[1] + 0.6], 0);
      VEJ.reveal($('card-l1'), t, LOGO_DONE - 0.25, 1.1, 22);
      VEJ.reveal($('card-l2'), t, LOGO_DONE - 0.05, 1.1, 22);
      VEJ.reveal($('card-url'), t, LOGO_DONE + 0.2, 1.0, 16);
      VEJ.subtitles(subs, R.captions, t);
    }
    window.addEventListener('hf-seek', (e) => render(e.detail.time));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render(window.__hfThreeTime || 0));
    render(window.__hfThreeTime || 0);
  }
  VEJ.boot = boot;
})();
