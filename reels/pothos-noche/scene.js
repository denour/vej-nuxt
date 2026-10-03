/* «Lo que tu pothos quiere decirte» — cocina de noche, una lámpara colgante, habla la planta.
 * Planos: (1) travelling lateral por la cocina · (2) primer plano: riego con la tierra casi seca
 *         (3) corte de un esqueje que cae en un frasco · (4) raíces nuevas bajo la luna, la planta sigue cayendo.
 * Transiciones: hoja que barre → match-cut (maceta → frasco) → fundido.
 */
VEJ.reel((api) => {
  const { W, H, u } = api;
  const { clamp, lerp, prog, E } = u;
  const LAMP = { x: 1010, y: 560 };                       // lámpara (mundo)
  const POT = { x: 540, rim: 1060, base: 1250, top: 280, bot: 210 };
  const COUNTER = 1250;
  const potStyle = { body: '#EFE6D6', rim: '#F7F1E6', dots: 'rgba(160,140,110,0.32)', rimH: 40, seed: 3 };
  const toScreen = (c, x, y) => [W / 2 + (x - c.x) * c.z, H / 2 + (y - c.y) * c.z];

  function kitchen(k, t) {                                // cocina: azulejo crema, cubierta de madera, gabinetes verdes
    k.tiles(-420, -300, 1500, COUNTER, { size: 96, accent: '#DCE6DA', seed: 5 });
    const c = k.ctx;
    c.fillStyle = '#3F5F52'; c.fillRect(-420, COUNTER + 60, 1920, 900);
    c.strokeStyle = 'rgba(245,239,228,0.18)'; c.lineWidth = 3;
    for (let x = -400; x < 1500; x += 300) { c.strokeRect(x + 18, COUNTER + 96, 264, 520); c.fillStyle = '#C9A961'; c.beginPath(); c.arc(x + 250, COUNTER + 330, 7, 0, 7); c.fill(); }
    k.plank(-420, COUNTER, 1920, 64, { seed: 560, color: '#D4B189', nails: false, blur: 22 });
    k.contactShadow(POT.x, POT.base + 2, 170, 16, 0.35);
  }
  function lamp(k, t) { return k.lamp(LAMP.x, LAMP.y, t, { color: '#D2725A', scale: 1.05 }); }
  // noche: todo oscuro salvo el charco de luz que la lámpara deja sobre la planta y la cubierta
  function nightFor(k, cam, extra = [], focus = POT) {
    k.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const [lx, ly] = toScreen(cam, LAMP.x, LAMP.y + 30), [px, py] = toScreen(cam, focus.x + 40, focus.rim + 40);
    k.night([{ x: px, y: py, r: 600 * cam.z }, { x: lx, y: ly, r: 240 * cam.z }, ...extra], 1.12);
    k.glow(px, py - 60 * cam.z, 520 * cam.z, '255,206,140', 0.16);
    k.glow(lx, ly, 200 * cam.z, '255,214,150', 0.7);
  }

  // una guía corta con 4 hojas: el esqueje (coordenadas locales: base en 0,0 y cuelga hacia abajo)
  function cutting(k, x, y, rot, s = 1) {
    const c = k.ctx; c.save(); c.translate(x, y); c.rotate(rot);
    c.strokeStyle = k.C.moss; c.lineWidth = 5 * s; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(10 * s, 60 * s, -12 * s, 120 * s, 6 * s, 190 * s); c.stroke();
    [[4, 40, 1], [-4, 85, -1], [6, 130, 1], [0, 178, -1]].forEach(([dx, dy, sd], i) =>
      k.leafX(dx * s, dy * s, Math.PI / 2 + sd * 1.05, (86 - i * 6) * s, (50 - i * 3) * s, 1, { shape: 'corazon', color: i % 2 ? '#6FAE86' : k.C.bright, blur: 8 }));
    c.restore();
  }

  const s1 = api.at(1) - 0.35, s2 = api.at(2) - 0.35, s3 = api.at(3) - 0.35;

  return api.seq([
    { // 1 · travelling lateral lento por la cocina (arriba queda libre para el título)
      to: s1, draw(k, t, lt, p) {
        const cam = api.cam(k, [{ t: 0, x: 470, y: 1030, z: 1.0 }, { t: s1 + 0.6, x: 610, y: 1000, z: 1.1 }], t);
        kitchen(k, t);
        k.pot(POT.x, POT.rim, POT.base, POT.top, POT.bot, potStyle);
        k.preset('pothos', POT.x, POT.rim + 8, { g: 0.72 + 0.2 * E.inOut(p), t, rimW: POT.top, drape: 520, seed: 4 });
        lamp(k, t);
        nightFor(k, cam);
      } },
    { // 2 · primer plano: riego sólo cuando la tierra está casi seca
      to: s2, match: { a: { x: 508, y: 1056 }, b: { x: 804, y: 1116 } }, draw(k, t, lt, p) {
        const cam = api.cam(k, [{ t: s1 - 0.6, x: 560, y: 1010, z: 1.58 }, { t: s2 + 0.6, x: 575, y: 1030, z: 1.66 }], t);
        kitchen(k, t);
        k.pot(POT.x, POT.rim, POT.base, POT.top, POT.bot, potStyle);
        const wet = E.inOut(prog(p, 0.38, 0.8));
        if (wet > 0) { const c = k.ctx; c.save(); c.globalAlpha = 0.6 * wet; c.fillStyle = '#1E140E'; c.beginPath(); c.ellipse(POT.x, POT.rim + 6, POT.top * 0.44, 10, 0, 0, 7); c.fill(); c.restore(); }
        k.preset('pothos', POT.x, POT.rim + 8, { g: 0.92, t, rimW: POT.top, drape: 520, seed: 4 });
        // regadera: entra, se inclina, riega, se va
        const inA = E.inOut(prog(p, 0.05, 0.28)) * (1 - E.inOut(prog(p, 0.82, 1.0)));
        const tilt = -0.52 * E.inOut(prog(p, 0.25, 0.38)) * (1 - E.inOut(prog(p, 0.76, 0.88)));
        const cx = lerp(1060, 830, inA), cy = 880;
        const rose = k.wateringCan(cx, cy, tilt, 0.72, { color: '#D2725A', dark: '#9E4E3B' });
        const pour = clamp(Math.min(prog(p, 0.34, 0.4), 1 - prog(p, 0.74, 0.8)));
        if (pour > 0) {
          const vx = -160, vy = 40, g = 1500, dy = POT.rim + 4 - rose[1], T = (-vy + Math.sqrt(vy * vy + 2 * g * dy)) / g;
          k.stream(rose[0], rose[1], vx, vy, { dur: T, g, width: 7, alpha: pour });
          k.drops(t, { t0: s1 + 0.34 * (s2 - s1), t1: s1 + 0.78 * (s2 - s1), rate: 26, emitter: () => [rose[0] + vx * T, POT.rim + 2], vx: 0, vy: -140, spread: 180, g: 1400, floor: () => POT.rim + 10, size: 3.2, seed: 9 });
        }
        lamp(k, t);
        nightFor(k, cam);
      } },
    { // 3 · el esqueje: tijeras, corte, cae en un frasco con agua
      to: s3, draw(k, t, lt, p) {
        const cam = api.cam(k, [{ t: s2 - 0.6, x: 580, y: 1000, z: 1.22 }, { t: s3 + 0.6, x: 590, y: 1010, z: 1.28 }], t);
        kitchen(k, t);
        const P2 = { ...POT, x: 380 };
        k.pot(P2.x, P2.rim, P2.base, P2.top, P2.bot, potStyle);
        k.preset('pothos', P2.x, P2.rim + 8, { g: 0.95, t, rimW: P2.top, drape: 500, seed: 4 });
        const jar = { x: 790, base: COUNTER, w: 150, h: 250 };
        // esqueje: cuelga de la guía, se corta en p=0.36 y viaja en arco al frasco
        const cut = E.inOut(prog(p, 0.4, 0.72)), sink = E.out(prog(p, 0.7, 0.85));
        const x0 = 600, y0 = 1010, x1 = jar.x - 4, y1 = jar.base - jar.h + 40 + 60 * sink;
        const cx = lerp(x0, x1, cut), cy = lerp(y0, y1, cut) - Math.sin(Math.PI * cut) * 180;
        if (cut < 0.02) { const c = k.ctx; c.save(); c.strokeStyle = k.C.moss; c.lineWidth = 5; c.beginPath(); c.moveTo(P2.x + 120, P2.rim + 4); c.quadraticCurveTo(560, 960, x0, y0); c.stroke(); c.restore(); }
        const w = k.jar(jar.x, jar.base, jar.w, jar.h, { t, water: 0.62 });
        cutting(k, cx, cy, lerp(-0.4, 0.05, cut), 0.9);
        k.splash(jar.x, w.waterY, prog(p, 0.74, 0.92), { r: 30 });
        // tijeras: se acercan abiertas, cortan y se van
        const sIn = E.inOut(prog(p, 0.08, 0.3)) * (1 - E.inOut(prog(p, 0.45, 0.62)));
        const open = 0.55 * (1 - E.inOut(prog(p, 0.3, 0.38)));
        if (sIn > 0.01) k.scissors(lerp(1180, 700, sIn), lerp(860, 1000, sIn), 0.25, 0.9, open);
        nightFor(k, cam, [], { x: 600, rim: 1040 });
      } },
    { // 4 · raíces nuevas bajo la luna; la planta sigue cayendo
      draw(k, t, lt, p) {
        const cam = api.cam(k, [{ t: s3 - 0.6, x: 600, y: 900, z: 1.16 }, { t: api.T.curtain, x: 590, y: 930, z: 1.0 }], t);
        kitchen(k, t);
        k.windowFrame(640, 220, 400, 460, t, { mood: 'noche', city: true, hills: false, frame: '#E8E1D3', sunX: 900, sunY: 320, sunR: 44 });
        const P2 = { ...POT, x: 380 };
        k.pot(P2.x, P2.rim, P2.base, P2.top, P2.bot, potStyle);
        k.preset('pothos', P2.x, P2.rim + 8, { g: 1, t, rimW: P2.top, drape: lerp(500, 640, E.inOut(p)), seed: 4 });
        const w = k.jar(790, COUNTER, 150, 250, { t, water: 0.62, roots: 0.1 + 0.9 * E.inOut(prog(p, 0.05, 0.8)) });
        cutting(k, 786, COUNTER - 250 + 100, 0.05, 0.9);
        k.ctx.setTransform(1, 0, 0, 1, 0, 0);
        const [wx, wy] = toScreen(cam, 840, 450);
        nightFor(k, cam, [{ x: wx, y: wy + 120, r: 520 * cam.z }], { x: 600, rim: 1080 });
        k.glow(wx, wy, 380 * cam.z, '215,228,222', 0.28);          // luz fría de luna por la ventana
      } },
  ], { transitions: ['hoja', 'match', 'fundido'], dur: 1.1 });
});
