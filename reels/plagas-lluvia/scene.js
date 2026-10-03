/* «Plagas fuera, sin químicos» — balcón urbano en día nublado con lluvia. Estructura: error → solución.
 * Planos: (1) ERROR: la albahaca rendida bajo la lluvia, con pulgones · (2) SOLUCIÓN: macro, una mano voltea
 *         la hoja y aparece la colonia en el envés · (3) rocío de jabón suave, los pulgones se van
 *         (4) abierto otra vez: flores y aromáticas cerca, llegan las catarinas, la lluvia amaina.
 * Transiciones: lluvia → fundido → tierra que sube.
 */
VEJ.reel((api) => {
  const { W, H, u } = api;
  const { clamp, lerp, prog, E, mulberry32 } = u;
  const POT = { x: 540, rim: 1062, base: 1330, top: 330, bot: 250 };
  const SICK = ['#B9B77C', '#A3AE76'], OK = ['#6FAE86', '#4B8D6B'];
  const s1 = api.at(1) - 0.35, s2 = api.at(2) - 0.35, s3 = api.at(3) - 0.35;

  // ---- la albahaca del balcón (sana o rendida) ----
  function basil(k, t, health, rainK) {
    const S = k.set('balcon', t, { mood: 'nublado', rain: rainK });
    k.contactShadow(POT.x, POT.base + 2, 210, 18, 0.3);
    k.pot(POT.x, POT.rim, POT.base, POT.top, POT.bot, { rimH: 46, seed: 2 });
    const col = [0, 1].map((i) => mix(SICK[i], OK[i], health));
    k.preset('hierbas', POT.x, POT.rim + 8, { scale: 1.35, g: 1, t, droop: lerp(0.8, 0, health), colors: col, dark: health < 0.5 ? '#6E7A4E' : undefined });
    return S;
  }
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, f) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(f))).toString(16).padStart(2, '0')).join(''); };
  const rnd = mulberry32(12);
  const APH = Array.from({ length: 9 }, () => [lerp(430, 660, rnd()), lerp(820, 1010, rnd()), rnd() * 6]);

  // ---- hoja grande en macro: se voltea (s: 1 haz → -1 envés); colonia de pulgones en el envés ----
  const LEAF = { x: 170, y: 1560, ang: -0.95, L: 1080, Wd: 330 };
  const rc = mulberry32(44);
  const COLONY = Array.from({ length: 14 }, () => [lerp(0.42, 0.7, rc()), (rc() - 0.5) * 0.9, rc() * 6, rc()]);
  function bigLeaf(k, t, s, heal, bugs) {
    const c = k.ctx, { x, y, ang, L, Wd } = LEAF, p = k.leafPath('lanza', L, Wd), under = s < 0;
    c.save(); c.strokeStyle = '#3F6F55'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 260, y + 420); c.quadraticCurveTo(x - 60, y + 160, x, y); c.stroke(); c.restore();
    c.save(); c.translate(x, y); c.rotate(ang + Math.sin(t * 0.6) * 0.01); c.scale(1, Math.abs(s) < 0.03 ? 0.03 * Math.sign(s || 1) : s);
    k.paper(() => { c.fillStyle = under ? mix('#AFC49A', '#BFD6B4', heal) : k.C.bright; c.fill(p); }, { blur: 30, dx: 10, dy: 18, color: 'rgba(5,20,16,0.45)' });
    c.clip(p);
    if (!under) { c.fillStyle = k.C.moss; c.globalAlpha = 0.45; c.fillRect(0, 0, L * 1.2, Wd * 1.5); c.globalAlpha = 1; }
    c.strokeStyle = under ? 'rgba(245,239,228,0.75)' : 'rgba(245,239,228,0.45)'; c.lineWidth = under ? 7 : 4;
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(L * 0.5, -Wd * 0.05, L * 0.95, 0); c.stroke();
    c.lineWidth = under ? 3.2 : 2; c.globalAlpha = under ? 0.6 : 0.3;
    for (let i = 1; i <= 7; i++) for (const sd of [-1, 1]) { const q = i / 8.5; c.beginPath(); c.moveTo(L * q, 0); c.quadraticCurveTo(L * (q + 0.05), sd * Wd * 0.4, L * (q + 0.12), sd * Wd * 0.78); c.stroke(); }
    c.globalAlpha = 1;
    if (under) {                                                        // manchas de daño que se van con la cura
      c.fillStyle = `rgba(170,150,70,${0.45 * (1 - heal)})`;
      for (const [q, v] of [[0.5, 0.3], [0.6, -0.35], [0.66, 0.15], [0.45, -0.1]]) { c.beginPath(); c.ellipse(L * q, Wd * v, 34, 22, 0.4, 0, 7); c.fill(); }
      for (const [q, v, ph, d] of COLONY) {
        const a = clamp(bugs * 1.4 - d * 0.4); if (a <= 0.02) continue;
        c.save(); c.globalAlpha = a * Math.min(1, -s * 1.4); c.translate(L * q, Wd * v + (1 - a) * 40); c.scale(1, 1 / Math.max(0.3, -s));
        k.aphid(0, 0, 1.25, t + ph, ph); c.restore();
      }
    }
    c.restore();
  }
  const leafPoint = (qx, qy, s) => { const { x, y, ang, L, Wd } = LEAF; const lx = L * qx, ly = Wd * qy * s; return [x + lx * Math.cos(ang) - ly * Math.sin(ang), y + lx * Math.sin(ang) + ly * Math.cos(ang)]; };

  api.label('error', 'error', { style: 'stamp', x: 96, y: 760, at: [api.at(0) + 1.4, s1 - 0.3] });
  api.label('solucion', 'solución', { style: 'stamp ok', x: 96, y: 300, at: [api.at(1) + 0.2, s3 - 0.2] });
  api.label('cuando', 'cada semana · al amanecer', { style: 'tag light', x: 96, y: 390, at: [api.at(1) + 0.9, s2 - 0.1] });
  api.label('receta', 'jabón suave al 2 % · cada 5 días', { style: 'tag light', x: 96, y: 390, at: [api.at(2) + 0.6, s3 - 0.2] });
  api.label('aliadas', 'aliadas', { style: 'stamp ok', x: 96, y: 300, at: [api.at(3) + 0.9, api.T.voiceEnd] });

  return api.seq([
    { // 1 · ERROR: rendida bajo la lluvia, con pulgones en los tallos
      to: s1, draw(k, t, lt, p) {
        api.cam(k, [{ t: 0, x: 540, y: 960, z: 1.0 }, { t: s1 + 0.6, x: 548, y: 990, z: 1.07 }], t);
        basil(k, t, 0, 1);
        APH.forEach(([x, y, ph], i) => k.aphid(x + Math.sin(t * 0.7 + ph) * 6, y + Math.cos(t * 0.5 + ph) * 4, 1.0, t + ph, ph));
        k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.grade('nublado', 1);
      } },
    { // 2 · SOLUCIÓN: macro, una mano voltea la hoja y aparece el envés con la colonia
      to: s2, draw(k, t, lt, p) {
        k.set('macro', t, { mood: 'nublado' });
        const flip = E.inOut(prog(p, 0.12, 0.5)), s = Math.cos(Math.PI * flip);
        const colony = leafPoint(0.56, 0, -1);
        api.cam(k, [{ t: s1 - 0.6, x: 560, y: 1000, z: 1.0 }, { t: s1 + 0.55 * (s2 - s1), x: 560, y: 1000, z: 1.0 }, { t: s2 + 0.6, x: colony[0] + 40, y: colony[1] + 60, z: 1.28 }], t);
        bigLeaf(k, t, s, 0, 1);
        const [hx, hy] = leafPoint(0.8, -0.72, s);
        const inA = E.inOut(prog(p, 0.0, 0.14)) * (1 - E.inOut(prog(p, 0.62, 0.8)));
        k.hand(hx + 150 + (1 - inA) * 420, hy + 10, -0.25, 0.8, 'flat', { alpha: inA });
        k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.grade('nublado', 0.5);
      } },
    { // 3 · rocío de jabón suave: dos disparos, la colonia se va y la hoja se recupera
      to: s3, draw(k, t, lt, p) {
        k.set('macro', t, { mood: 'nublado' });
        const colony = leafPoint(0.56, 0, -1);
        const cam = api.cam(k, [{ t: s2 - 0.6, x: colony[0] + 40, y: colony[1] + 60, z: 1.28 }, { t: s3 + 0.6, x: colony[0] + 10, y: colony[1] + 20, z: 1.2 }], t);
        const heal = E.inOut(prog(p, 0.35, 0.9)), bugs = 1 - E.inOut(prog(p, 0.28, 0.8));
        bigLeaf(k, t, -1, heal, bugs);
        k.ctx.setTransform(1, 0, 0, 1, 0, 0);
        const cs = [W / 2 + (colony[0] - cam.x) * cam.z, H / 2 + (colony[1] - cam.y) * cam.z];
        const inA = E.inOut(prog(p, 0.02, 0.16)) * (1 - E.inOut(prog(p, 0.78, 0.95)));
        const press = Math.max(Math.sin(Math.PI * prog(p, 0.18, 0.26)), Math.sin(Math.PI * prog(p, 0.4, 0.48)));
        const nz = k.sprayBottle(lerp(1300, 880, inA), 1120, 1.55, press, { cap: '#2D4A3F', color: '#F1EBDD' });
        const ang = Math.atan2(cs[1] - nz[1], cs[0] - nz[0]);
        for (const t0 of [0.18, 0.4]) k.mist(t, { x: nz[0], y: nz[1], ang, t0: s2 + t0 * (s3 - s2), dur: 0.9, len: Math.hypot(cs[0] - nz[0], cs[1] - nz[1]) * 1.1, spread: 0.45, seed: t0 * 100 });
        k.sparkle(cs[0] - 60, cs[1] - 80, prog(p, 0.82, 1.0), 34);
        k.grade('nublado', 0.5);
      } },
    { // 4 · aliadas: flores y aromáticas cerca, llegan las catarinas, la lluvia amaina
      draw(k, t, lt, p) {
        api.cam(k, [{ t: s3 - 0.6, x: 560, y: 1020, z: 1.12 }, { t: api.T.curtain, x: 540, y: 980, z: 1.0 }], t);
        basil(k, t, E.inOut(prog(p, 0, 0.5)) * 0.6 + 0.4, lerp(0.8, 0.15, E.inOut(p)));
        k.pot(250, 1170, 1330, 190, 150, { rimH: 30, seed: 4, body: '#E8DCC8', rim: '#F1EBDD', dots: 'rgba(150,130,100,0.3)' });
        [[-40, 0.9, 1.05], [0, 1, 1.0], [42, 0.85, 1.1]].forEach(([dx, h, ph], i) => k.plant(t, {
          pts: [[250 + dx * 0.3, 1176], [250 + dx * 0.6, 1100], [250 + dx, 1020], [250 + dx * 1.2, 1176 - 240 * h]], grow: [s3 - 0.4, s3 + 1.6], w0: 8, w1: 4, phase: ph,
          leaves: [{ u: 0.4, side: -1, len: 60, wid: 24, at: [s3, s3 + 1.2] }, { u: 0.6, side: 1, len: 54, wid: 22, at: [s3 + 0.2, s3 + 1.4] }],
          flower: [s3 + 1.0 + i * 0.3, s3 + 2.6 + i * 0.3], flowerSize: 34 }));
        k.pot(850, 1170, 1330, 190, 150, { rimH: 30, seed: 5 });
        k.preset('hierbas', 850, 1176, { scale: 0.75, g: E.inOut(prog(p, 0, 0.5)), t, colors: ['#8FC29E', '#5E9E78'] });
        [[980, 300, 470, 900, 0.55], [1150, 700, 610, 870, 0.62], [-120, 520, 520, 960, 0.7]].forEach(([x0, y0, x1, y1, land], i) => {
          const f = E.inOut(prog(p, 0.15 + i * 0.08, land)), x = lerp(x0, x1, f), y = lerp(y0, y1, f) - Math.sin(Math.PI * f) * 160 + (f < 1 ? Math.sin(t * 9 + i) * 6 : 0);
          if (p > 0.1 + i * 0.08) k.ladybug(x, y, 1.1, Math.atan2(y1 - y0, x1 - x0) * (1 - f) + (f >= 1 ? Math.sin(t + i) * 0.3 : 0), t);
        });
        k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.grade('nublado', lerp(1, 0.45, E.inOut(p)));
      } },
  ], { transitions: ['lluvia', 'fundido', 'tierra'], dur: 1.1 });
});
