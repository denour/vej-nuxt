#!/usr/bin/env python3
"""Une el render de HyperFrames con la mezcla y registra el video en history.json.

  python3 reels/mux.py reels/<id>            # toma el hyperframes-*.mp4 más reciente de reels/<id>/
  python3 reels/mux.py reels/<id> --video X  # o uno concreto
Salida: reels/<id>/<id>.mp4 (H.264 + AAC 192k, faststart).
"""
import argparse, datetime, glob, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--video'); ap.add_argument('--no-history', action='store_true')
a = ap.parse_args()
d = os.path.abspath(a.dir)
R = json.load(open(os.path.join(d, 'reel.json'), encoding='utf-8')); rid = R.get('id', os.path.basename(d))
T = json.load(open(os.path.join(d, 'timing.json'), encoding='utf-8'))
if T.get('preview'):
    sys.exit('✗ timing.json es de un --preview (sin voz). Corre build.py sin --preview y renderiza de nuevo.')
vids = [a.video] if a.video else sorted(glob.glob(os.path.join(d, 'hyperframes-*.mp4')), key=os.path.getmtime)
if not vids:
    sys.exit('✗ no hay render: hyperframes__copy_to(job_id, dest_dir="%s")' % d)
video, mix, out = vids[-1], os.path.join(d, 'build', 'mix.wav'), os.path.join(d, f'{rid}.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out], check=True)
probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', out], capture_output=True, text=True).stdout)['format']
print(f'✓ {out} · {float(probe["duration"]):.2f} s · {int(probe["size"]) / 1e6:.1f} MB (render: {os.path.basename(video)})')
if not a.no_history:
    hp = os.path.join(HERE, 'history.json')
    H = json.load(open(hp, encoding='utf-8')) if os.path.exists(hp) else []
    st, mu = R['style'], T.get('music', {})
    entry = {'id': rid, 'date': datetime.date.today().isoformat(), 'sources': R['sources'], 'setting': st['setting'], 'framing': st.get('framing', ''),
             'light': st['light'], 'structure': st['structure'], 'transition': ', '.join(st.get('transitions') or [st.get('transition', '')]),
             'music': {k: mu.get(k) for k in ('key', 'tempo', 'lead', 'prog', 'pattern', 'drums', 'seed')}, 'duration': round(float(probe['duration']), 2)}
    H = [h for h in H if h.get('id') != rid] + [entry]
    json.dump(H, open(hp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'✓ registrado en history.json ({len(H)} videos)')
