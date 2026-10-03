/* Muestrario: los 8 escenarios del kit con distintas horas y plantas de referencia (para QA y como ejemplo). */
VEJ.reel((api) => {
  const end = api.T.curtain, n = 8, d = end / n;
  const shots = [
    ['ventana', 'dorada', (k, t, S) => { k.pot(540, S.shelf - 250, S.shelf, 300, 220, { rimH: 40 }); k.preset('monstera', 540, S.shelf - 244, { t, scale: 1 }); }],
    ['balcon', 'manana', (k, t, S) => { k.planter(260, 820, S.floor - 230, S.floor, {}); k.preset('tomatera', 540, S.floor - 226, { t, scale: 1.1 }); }],
    ['jardin', 'dorada', (k, t, S) => { k.preset('helecho', 540, S.ground - 30, { t, scale: 1.3 }); k.ladybug(700, 1300, 1.2, 0.4, t); }],
    ['mesa', 'manana', (k, t, S) => { k.pot(480, S.table - 170, S.table, 240, 180, { rimH: 34, body: '#E8DCC8', rim: '#F1EBDD', dots: 'rgba(150,130,100,0.3)' }); k.preset('suculenta', 480, S.table - 164, { t, scale: 1.3 }); k.trowel(820, S.table - 20, 0.1, 1); k.stake(640, S.table - 180, 0.8); }],
    ['cocina', 'dorada', (k, t, S) => { k.pot(420, S.table - 200, S.table, 260, 200, { rimH: 36 }); k.preset('hierbas', 420, S.table - 194, { t, scale: 1.1 }); k.jar(780, S.table, 150, 240, { t, roots: 0.6 }); }],
    ['invernadero', 'nublado', (k, t, S) => { k.pot(540, S.table - 230, S.table, 280, 210, { rimH: 40 }); k.preset('cactus', 540, S.table - 226, { t, scale: 1.1 }); }],
    ['subsuelo', 'manana', (k, t, S) => { k.preset('hierbas', 540, S.surface, { t, scale: 1 }); k.worm(300, 1300, 260, t); k.worm(620, 1600, 200, t + 2, { color: '#B97A6A' }); }],
    ['macro', 'noche', (k, t, S) => { k.leafX(160, 1500, -0.9, 1000, 420, 1, { shape: 'monstera', color: '#3F8A63', dark: '#1F4A38' }); k.sparkle(620, 900, (t % 2) / 2, 30); k.ctx.setTransform(1, 0, 0, 1, 0, 0); k.night([{ x: 600, y: 900, r: 700 }], 0.9); k.glow(600, 900, 500, '255,214,150', 0.25); }, true],
  ].map(([set, mood, fn, lit], i) => ({ to: i === n - 1 ? undefined : (i + 1) * d, draw(k, t) { const S = k.set(set, t, { mood }); fn(k, t, S); k.ctx.setTransform(1, 0, 0, 1, 0, 0); if (!lit) k.grade(mood, 1); } }));
  shots.forEach((s, i) => api.label('m' + i, ['ventana · dorada', 'balcón · mañana', 'jardín · dorada', 'mesa · mañana', 'cocina · dorada', 'invernadero · nublado', 'subsuelo · mañana', 'macro · noche'][i], { style: 'tag', x: 96, y: 1250, at: [i * d + 0.4, (i + 1) * d - 0.4] }));
  return api.seq(shots, { transitions: Array(n - 1).fill('fundido'), dur: 0.6 });
});
