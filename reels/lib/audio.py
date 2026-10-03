"""Voz + mezcla de los reels VEJ (numpy + ffmpeg; corre en el sandbox de VEJ, sin red).

Voz (medido en el prototipo, v3–v5):
  - Chatterbox a speed 1.0; el ritmo pausado sale de PAUSAS entre frases, no de estirar la voz.
  - Cada línea se recorta al final del habla: se descartan colas cortas separadas por silencio
    (Chatterbox a veces agrega un «¡Eh!» o una respiración al final) y se aplica un fade de 40 ms.
  - La voz se normaliza UNA vez (ganancia fija a -17 LUFS sobre la pista completa) + control de picos.
Mezcla: música a -22 dB bajo la voz mientras se habla, +4 dB en pausas (rampas de 400 ms), y al
terminar la voz sube hasta 4 dB bajo el nivel de la voz para acompañar la cortina y el logo; fade final.
"""
import os
import subprocess

import numpy as np

SR = 48000
LEAD, TAIL, FADE = 0.9, 5.7, 0.04
PAUSES = [1.15, 1.25, 1.2, 1.3]
VOICE_LUFS = -17.0
UNDER_DB, PAUSE_UP_DB, RAMP = 22.0, 4.0, 0.4
TAIL_UNDER_VOICE_DB, TAIL_RAMP, END_FADE = 4.0, 1.5, 1.5
CURTAIN_CLOSED, LOGO_DONE = 1.30, 3.60      # s después del fin de la voz


def sh(*cmd):
    subprocess.run(cmd, check=True)


def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).copy()
    return x.reshape(-1, ch) if ch > 1 else x


def save(path, x, ch=1):
    tmp = path + '.f32'
    x.astype(np.float32).tofile(tmp)
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(ch), '-i', tmp, '-c:a', 'pcm_s24le', path)
    os.remove(tmp)


def lufs(path):
    out = subprocess.run(['ffmpeg', '-v', 'info', '-i', path, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    I = float([l for l in out.splitlines() if l.strip().startswith('I:')][-1].split()[1])
    pk = [l for l in out.splitlines() if l.strip().startswith('Peak:')]
    return I, (float(pk[-1].split()[1]) if pk else None)


def speech_regions(x, thr_db=-40.0, min_gap=0.22):
    """Regiones con voz (ventanas de 20 ms sobre -40 dBFS), uniendo huecos menores a min_gap."""
    hop = int(0.02 * SR)
    n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    on = 20 * np.log10(rms) > thr_db
    regs, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]:
                j += 1
            regs.append([i * hop / SR, j * hop / SR]); i = j
        else:
            i += 1
    merged = []
    for r in regs:
        if merged and r[0] - merged[-1][1] < min_gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return merged


def trim_line(x):
    regs = speech_regions(x)
    if not regs:
        raise SystemExit('Una línea de voz salió muda: regenera ese audio.')
    # colas alucinadas / respiraciones: región final corta (<0.6 s) separada ≥0.2 s del resto
    while len(regs) > 1 and regs[-1][1] - regs[-1][0] < 0.6 and regs[-1][0] - regs[-2][1] >= 0.2:
        regs.pop()
    a, b = max(0.0, regs[0][0] - 0.03), min(len(x) / SR, regs[-1][1] + 0.06)
    y = x[int(a * SR): int(b * SR)].copy()
    f = int(FADE * SR)
    y[-f:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, f))
    y[: int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR))
    return y


def build_voice(files, texts, out_dir, seed=0):
    out, t, segs = [], 0.0, []
    for i, (fpath, text) in enumerate(zip(files, texts)):
        y = trim_line(load(fpath))
        pause = LEAD if i == 0 else PAUSES[(i + seed) % len(PAUSES)]
        out.append(np.zeros(int(pause * SR), np.float32)); t += pause
        out.append(y)
        segs.append({'text': text, 'start': round(t, 3), 'end': round(t + len(y) / SR, 3)})
        t += len(y) / SR
    out.append(np.zeros(int(TAIL * SR), np.float32))
    v = np.concatenate(out)
    tmp = os.path.join(out_dir, 'voice-raw.wav'); save(tmp, v)
    gain = VOICE_LUFS - lufs(tmp)[0]; os.remove(tmp)
    v = v * 10 ** (gain / 20)
    f32 = os.path.join(out_dir, 'voice.f32'); v.astype(np.float32).tofile(f32)
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', f32,
       '-af', 'alimiter=limit=0.8414:attack=5:release=80:level=disabled', '-c:a', 'pcm_s24le', os.path.join(out_dir, 'voice.wav'))
    os.remove(f32)
    total = round(len(v) / SR, 3)
    return segs, total, gain


def mix(out_dir, segs, total):
    v = load(os.path.join(out_dir, 'voice.wav')); m = load(os.path.join(out_dir, 'music.wav'), 2)
    n = min(len(v), len(m)); v, m = v[:n], m[:n]
    t = np.arange(n) / SR
    speech = np.zeros(n, bool)
    for p in segs:
        speech[int(p['start'] * SR):int(p['end'] * SR)] = True
    rms = lambda x: np.sqrt(np.mean(np.square(x)) + 1e-12)
    ramp = lambda u: 0.5 - 0.5 * np.cos(np.pi * np.clip(u, 0, 1))
    base = 20 * np.log10(rms(v[speech])) - UNDER_DB - 20 * np.log10(rms(m[speech].mean(1)))
    up = np.full(n, PAUSE_UP_DB)
    for p in segs:
        s0, e0 = p['start'] - 0.05, p['end'] + 0.05
        down = ramp((t - (s0 - RAMP)) / RAMP) * (1 - ramp((t - e0) / RAMP))
        up = np.minimum(up, PAUSE_UP_DB * (1 - down))
    E = segs[-1]['end'] + 0.05
    pl = (t >= E + TAIL_RAMP) & (t < total - END_FADE)
    tail_up = (20 * np.log10(rms(v[speech])) - TAIL_UNDER_VOICE_DB) - (base + 20 * np.log10(rms(m[pl].mean(1)) if pl.any() else -60))
    up = np.where(t >= E, tail_up * ramp((t - E) / TAIL_RAMP), up)
    g = 10 ** ((base + up) / 20)
    fade = np.minimum(1, t / 1.2) * ramp((total - t) / END_FADE)
    out = v[:, None] + m * (g * fade)[:, None]
    peak = np.abs(out).max()
    if peak > 0.87:
        out *= 0.87 / peak
    save(os.path.join(out_dir, 'mix.wav'), out.reshape(-1), ch=2)
    return {'tail_up_db': round(float(tail_up), 1)}
