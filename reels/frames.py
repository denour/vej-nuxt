#!/usr/bin/env python3
"""Cuadros para control de calidad: los extrae de un mp4 y arma una hoja de contacto que el agente puede ver (Read).

  python3 reels/frames.py reels/<id>                 # tiempos automáticos: título, cada línea de voz, cortina y logo
  python3 reels/frames.py reels/<id> 2.5 7 12.3      # tiempos concretos
Usa el mp4 más reciente de reels/<id>/ (hyperframes-*.mp4 o <id>.mp4). Salida: reels/<id>/frames/*.png y frames/hoja.png
"""
import glob, json, os, subprocess, sys

d = os.path.abspath(sys.argv[1]); times = [float(x) for x in sys.argv[2:]]
vids = sorted(glob.glob(os.path.join(d, 'hyperframes-*.mp4')) + glob.glob(os.path.join(d, '*.mp4')), key=os.path.getmtime)
if not vids:
    sys.exit('✗ no hay mp4 en ' + d)
video = vids[-1]
if not times:
    T = json.load(open(os.path.join(d, 'timing.json'), encoding='utf-8'))
    L = T['lines']
    times = [min(2.4, L[0]['end'] - 0.2)] + [round((l['start'] + l['end']) / 2, 2) for l in L[1:]] + [round((T['voice_end'] + T['curtain_closed']) / 2, 2), round(T['total'] - 0.3, 2)]
fd = os.path.join(d, 'frames'); os.makedirs(fd, exist_ok=True)
outs = []
for t in times:
    p = os.path.join(fd, f'f-{t:05.2f}.png'.replace('.', 's', 1))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', video, '-frames:v', '1', p], check=True); outs.append(p)
args = []
for p in outs:
    args += ['-i', p]
sheet = os.path.join(fd, 'hoja.png')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', f'hstack=inputs={len(outs)},scale={min(2400, 360 * len(outs))}:-1', sheet], check=True)
print(f'✓ {len(outs)} cuadros de {os.path.basename(video)} en {fd}/  ·  hoja: {sheet}')
print('   tiempos:', ', '.join(f'{t:.2f}' for t in times))
