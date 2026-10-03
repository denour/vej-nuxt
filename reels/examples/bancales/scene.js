/* EJEMPLO DE REFERENCIA (no plantilla): el prototipo v5 «Mis bancales con materiales reciclados» portado a la API.
 * Pared con ventana, hora dorada, ritual paso a paso, fundido. Muestra: planta que crece en maceta, bancal de tarimas
 * con ventana de corte y orden de capas correcto (fondo → interior → tierra → plantas/partículas → tablas → rótulos),
 * mano que asienta y mano que vierte, capas de material, macetas colgantes, guía de cintura, cámara que se acerca.
 * Los tiempos se anclan a las líneas de voz: api.at(i) = inicio de la línea i.
 */
VEJ.reel((api) => {
  const { W, u } = api;
  const { clamp, lerp, prog, E, wob } = u;
  const A1 = api.at(1), A2 = api.at(2), A3 = api.at(3), FLOOR = 1420;
  const X1 = A1 - 0.35;

  // ---------- plano 1: semilla que brota en una maceta ----------
  const seedling = { pts: [[540, 1106], [514, 992], [576, 894], [548, 806]], grow: [0.95, A1 - 0.5], w0: 16, w1: 6, phase: 0.4,
    leaves: [{ tip: true, side: -1, len: 136, wid: 50, at: [1.9, 3.5], spread: 1.25 }, { tip: true, side: 1, len: 130, wid: 48, at: [2.1, 3.7], spread: 1.2 },
      { u: 0.58, side: 1, len: 96, wid: 36, at: [3.1, 4.5] }, { u: 0.42, side: -1, len: 74, wid: 28, at: [3.5, 4.8] }] };

  // ---------- plano 2: bancal de tarimas con ventana de corte ----------
  const BX0 = 90, BX1 = 990, POST = 70, TOP = 880, BOT = 1500, IN0 = BX0 + POST, IN1 = BX1 - POST, IN_BOT = 1440, BACK_TOP = 866;
  const ROWS = [[900, 170], [1082, 170], [1264, 170]], WX = 404, WIN = { x0: WX, x1: IN1, y0: 1070, y1: IN_BOT };
  const FULL = { ramas: 1330, composta: 1200, tierra: 1004 };
  const FILL = { ramas: [A2 + 0.16, A2 + 1.46], composta: [A2 + 1.51, A2 + 2.76], tierra: [A2 + 2.86, A2 + 4.51] };
  const KINDS = ['ramas', 'composta', 'tierra'];
  const settle = (t, t0, d = 1.0) => { const q = E.inOut(prog(t, t0, t0 + d)); return { a: clamp(q * 1.6), dy: (1 - q) * -70 }; };
  const level = (kind, t) => lerp(kind === 'ramas' ? IN_BOT : kind === 'composta' ? FULL.ramas : FULL.composta, FULL[kind], E.inOut(prog(t, FILL[kind][0], FILL[kind][1])));
  const withA = (k, a, fn) => { if (a <= 0.001) return; k.ctx.save(); k.ctx.globalAlpha *= a; fn(); k.ctx.restore(); };
  const HS = 0.62;
  function handState(t) {
    const q = prog(t, A2 - 0.35, A2 + 4.9);
    let tilt = 0.06; for (const kd of KINDS) { const [a, b] = FILL[kd]; tilt = Math.max(tilt, 0.42 * Math.sin(Math.PI * prog(t, a - 0.15, b))); }
    const inA = E.inOut(prog(t, A2 - 0.45, A2 + 0.25)) * (1 - E.inOut(prog(t, A2 + 4.65, A2 + 5.45)));
    return { x: lerp(900, 830, E.inOut(q)) + Math.sin(t * 0.8) * 36 + (1 - inA) * 330, y: 752 + wob(t * 0.6, 3) * 10, rot: -0.14 - tilt, a: inA };
  }
  const tip = (k, t) => { const h = handState(t); return k.handXf(h.x, h.y, h.rot, HS, false)(...k.TIP.cup); };
  const plants = [
    { pts: [[660, 1004], [630, 896], [716, 780], [668, 660]], grow: [A3 - 0.75, A3 + 1.95], w0: 20, w1: 7, phase: 1.1,
      leaves: [{ u: 0.4, side: -1, len: 158, wid: 60, at: [A3 - 0.15, A3 + 1.05] }, { u: 0.54, side: 1, len: 150, wid: 56, at: [A3 + 0.25, A3 + 1.45] },
        { u: 0.69, side: -1, len: 122, wid: 46, at: [A3 + 0.85, A3 + 1.85] }, { u: 0.83, side: 1, len: 96, wid: 38, at: [A3 + 1.25, A3 + 2.25] }], flower: [A3 + 1.65, A3 + 3.85], flowerSize: 88 },
    { pts: [[420, 1004], [414, 940], [428, 872], [420, 822]], grow: [A3 - 0.65, A3 + 0.65], w0: 12, w1: 6,
      leaves: [{ u: 0.78, side: -1, len: 90, wid: 48, at: [A3 - 0.15, A3 + 0.95], spread: 1.1, color: '#6FAE86' }, { u: 0.86, side: 1, len: 100, wid: 50, at: [A3 + 0.05, A3 + 1.15], spread: 1.2, color: '#6FAE86' },
        { tip: true, side: -1, len: 76, wid: 40, at: [A3 + 0.25, A3 + 1.35], spread: 0.5 }, { tip: true, side: 1, len: 70, wid: 36, at: [A3 + 0.45, A3 + 1.55], spread: 0.45 }] },
    { pts: [[840, 1004], [846, 940], [828, 888], [836, 846]], grow: [A3 - 0.25, A3 + 1.15], w0: 10, w1: 5,
      leaves: [{ tip: true, side: -1, len: 76, wid: 30, at: [A3 + 0.25, A3 + 1.45], spread: 1.1 }, { tip: true, side: 1, len: 72, wid: 28, at: [A3 + 0.45, A3 + 1.65], spread: 1.1 }] },
  ];
  const hangers = [
    { x: 172, rimY: 470, topW: 150, h: 118, drop: [A1 + 0.3, A1 + 2.7], phase: 0.3, seed: 5, vines: [{ dx: -52, len: 250 }, { dx: -12, len: 290 }, { dx: 38, len: 200 }] },
    { x: 962, rimY: 322, topW: 100, h: 82, drop: [A1 + 0.9, A1 + 3.2], phase: 2.1, seed: 9, vines: [{ dx: -28, len: 170 }, { dx: 22, len: 220 }] },
  ];

  api.label('ramas', 'ramas', { style: 'light', align: 'right', x: 884, y: 1356, at: [FILL.ramas[1] - 0.2, api.T.voiceEnd] });
  api.label('composta', 'composta', { style: 'light', align: 'right', x: 884, y: 1238, at: [FILL.composta[1] - 0.2, api.T.voiceEnd] });
  api.label('tierra', 'tierra buena', { style: 'light', align: 'right', x: 884, y: 1114, at: [FILL.tierra[1] - 0.2, api.T.voiceEnd] });
  api.label('cintura', 'A la cintura', { style: 'tag', x: 100, y: 818, at: [A3 + 1.3, api.T.voiceEnd] });

  return api.seq([
    { to: X1, draw(k, t) {
        k.wall(t, FLOOR); k.light(t, {});
        k.castShadow((c) => { c.beginPath(); c.moveTo(330, 1100); c.lineTo(750, 1100); c.lineTo(690, 1500); c.lineTo(390, 1500); c.closePath(); c.fill(); }, { alpha: 0.14 });
        k.floorShadow(390, 690, 1500, 240, 0.2); k.contactShadow(540, 1500, 260, 28, 0.32);
        k.pot(540, 1100, 1500, 420, 300);
        k.seed(550, 1104, E.out(prog(t, 0.25, 0.85)), E.inOut(prog(t, 0.8, 1.4)) * (1 - prog(t, 1.8, 2.4)));
        if (t > 0.95) k.plant(t, seedling);
      } },
    { draw(k, t) {
        k.wall(t, FLOOR); k.light(t, { intensity: 1 + 0.25 * E.inOut(prog(t, A3 + 1.6, A3 + 3.6)) });
        const S = 1 + 0.05 * E.inOut(prog(t, X1, api.T.curtain));
        k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.ctx.translate(540, BOT); k.ctx.scale(S, S); k.ctx.translate(-540, -BOT);   // acercamiento con origen en la base del bancal
        for (const hg of hangers) k.hanging(t, hg);
        const sh = E.inOut(prog(t, A1 + 0.4, A1 + 2.6));
        k.castShadow((c) => { c.globalAlpha = sh; c.fillRect(BX0, BACK_TOP, BX1 - BX0, BOT - BACK_TOP); }, { alpha: 0.13 });
        k.floorShadow(BX0 + 20, BX1, BOT, 260, 0.2 * sh); k.contactShadow(540, BOT + 4, 500, 34, 0.32 * sh);
        // interior: pared trasera en sombra
        [[BACK_TOP, 180], [BACK_TOP + 188, 180], [BACK_TOP + 376, IN_BOT - BACK_TOP - 376]].forEach(([y, h], i) => {
          const s = settle(t, A1 + 0.9 + i * 0.25, 1.1); withA(k, s.a, () => k.plank(IN0, y + s.dy, IN1 - IN0, h, { seed: 100 + i, shade: i ? 0.42 : 0.16, nails: false, blur: 4 }));
        });
        // tierra en capas (con montículo bajo el chorro)
        const bump = (kd) => { const [a, b] = FILL[kd]; return t < a || t > b + 0.5 ? null : { x: tip(k, t)[0] - 10, w: 110, h: 20 * Math.sin(Math.PI * prog(t, a, b + 0.5)) }; };
        if (t > FILL.ramas[0]) k.layer('ramas', IN0, IN1, IN_BOT, level('ramas', t), FULL.ramas, bump('ramas'));
        if (t > FILL.composta[0]) k.layer('composta', IN0, IN1, FULL.ramas + 14, level('composta', t), FULL.composta, bump('composta'));
        if (t > FILL.tierra[0]) k.layer('tierra', IN0, IN1, FULL.composta + 14, level('tierra', t), FULL.tierra, bump('tierra'));
        for (const p of plants) if (t > p.grow[0]) k.plant(t, p);        // plantas DETRÁS de la tabla frontal
        for (const kd of KINDS) { const [s0, e0] = FILL[kd]; if (t >= s0 && t <= e0 + 1) k.pour(t, { kind: kd, t0: s0, t1: e0 - 0.1, rate: kd === 'ramas' ? 34 : kd === 'composta' ? 95 : 120, seed: kd.length * 13, emitter: (te) => tip(k, te), floor: (tt) => level(kd, tt) - 6, vx: -20 }); }
        // frente: zócalo, filas (la superior completa, 2 y 3 cortadas), postes y línea de corte
        const rail = settle(t, A1 + 0.1, 1.1); withA(k, rail.a, () => k.plank(IN0 - 4, IN_BOT + rail.dy, IN1 - IN0 + 8, BOT - IN_BOT, { seed: 90, color: k.C.woodMid }));
        ROWS.forEach(([y, h], i) => { const s = settle(t, A1 + 1.75 + i * 0.3, 1.0); withA(k, s.a, () => k.plank(IN0, y + s.dy, i ? WX - IN0 : IN1 - IN0, h, { seed: 300 + i * 7, cutEnd: i ? 'right' : null, stamp: i ? 0 : 34 })); });
        [[BX0, A1 + 0.45], [BX1 - POST, A1 + 0.7]].forEach(([x, t0]) => { const s = settle(t, t0, 1.1); withA(k, s.a, () => k.plank(x, TOP + s.dy, POST, BOT - TOP, { seed: 200 + x, color: '#D8B892' })); });
        const kc = E.inOut(prog(t, A1 + 2.8, A1 + 4.2));
        if (kc > 0) { const c = k.ctx, m = 7, P = [[WIN.x0 + m, WIN.y0 + m], [WIN.x1 - m, WIN.y0 + m], [WIN.x1 - m, WIN.y1 - m], [WIN.x0 + m, WIN.y1 - m], [WIN.x0 + m, WIN.y0 + m]];
          let left = kc * 2 * ((WIN.x1 - WIN.x0) + (WIN.y1 - WIN.y0) - 4 * m); c.save(); c.strokeStyle = 'rgba(245,239,228,0.8)'; c.lineWidth = 2.2; c.setLineDash([12, 9]); c.lineDashOffset = -t * 6; c.beginPath(); c.moveTo(...P[0]);
          for (let i = 1; i < P.length && left > 0; i++) { const [ax, ay] = P[i - 1], [bx, by] = P[i], L = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / L); c.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); left -= L; } c.stroke(); c.restore(); }
        const g = E.inOut(prog(t, A3 + 0.7, A3 + 1.9)); if (g > 0) { const c = k.ctx; c.save(); c.globalAlpha = 0.75; c.strokeStyle = k.C.moss; c.lineWidth = 2.5; c.setLineDash([14, 12]); c.lineDashOffset = -t * 10; c.beginPath(); c.moveTo(96, TOP - 18); c.lineTo(96 + (W - 192) * g, TOP - 18); c.stroke(); c.restore(); }
        // manos
        const pa = E.inOut(prog(t, A1 + 2.8, A1 + 3.5)) * (1 - E.inOut(prog(t, A1 + 4.4, A1 + 5.1)));
        if (pa > 0) k.hand(1052 + (1 - pa) * 260, TOP - 40 + Math.max(0, Math.sin(Math.PI * prog(t, A1 + 3.6, A1 + 4.2))) * 7, -0.36, HS, 'flat', { alpha: pa });
        const h = handState(t);
        if (h.a > 0) { let load = null, lk = 0; for (const kd of KINDS) { const [s0, e0] = FILL[kd]; if (t >= s0 - 0.45 && t < e0 + 0.1) { load = kd === 'ramas' ? k.C.ramas : kd === 'composta' ? k.C.compost : k.C.soil; lk = t < s0 ? E.out(prog(t, s0 - 0.45, s0 - 0.05)) : 1 - 0.85 * prog(t, s0, e0); } }
          k.hand(h.x, h.y, h.rot, HS, 'cup', { alpha: h.a, load, loadK: lk }); }
      } },
  ], { transitions: ['fundido'], dur: 1.1 });
});
