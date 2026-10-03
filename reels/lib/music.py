"""Cama musical original de cada reel VEJ (numpy + ffmpeg, sin red, sin licencias de terceros).

Misma FAMILIA en todos los videos (lo-fi / jazz suave, swing, vinilo, cinta), pero con semilla:
  key      tonalidad mayor: C C# D Eb E F F# G Ab A Bb B
  tempo    68–84 BPM
  lead     rhodes | vibrafono | nylon | piano      (instrumento principal: acordes + melodía)
  prog     ii-V-I-VI | I-vi-ii-V | IV-iii-ii-V | I-IV-iii-VI
  pattern  A (1 y "y" del 2) | B (1, 3, "y" del 4) | arpegio | sostenido
  drums    escobillas | rim | ninguna
  seed     entero: decide lo que no se fije (melodía, variaciones, patrón y batería si no vienen)
Estructura fija: el penúltimo compás es la dominante (V13) y el último, la tónica (Imaj9), que empieza
EXACTAMENTE en `tonic_at` (cuando el logo termina de dibujarse) y queda sonando hasta el final.
"""
import os
import subprocess

import numpy as np

SR = 48000
KEYS = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'Eb': 3, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'Ab': 8, 'G#': 8, 'A': 9, 'Bb': 10, 'A#': 10, 'B': 11}
SCALE = [0, 2, 4, 5, 7, 9, 11]
VOICING = {'maj9': [4, 7, 11, 14], 'm9': [3, 7, 10, 14], 'm7': [3, 7, 10, 15], '13': [4, 9, 10, 14],
           '13sus': [5, 9, 10, 14], '7b13': [4, 8, 10, 13]}
PROGS = {'ii-V-I-VI': [(2, 'm9'), (5, '13'), (1, 'maj9'), (6, '7b13')],
         'I-vi-ii-V': [(1, 'maj9'), (6, 'm9'), (2, 'm9'), (5, '13')],
         'IV-iii-ii-V': [(4, 'maj9'), (3, 'm7'), (2, 'm9'), (5, '13sus')],
         'I-IV-iii-VI': [(1, 'maj9'), (4, 'maj9'), (3, 'm7'), (6, '7b13')]}
LEADS = ['rhodes', 'vibrafono', 'nylon', 'piano']


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def _env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def _release(e, s=0.1):
    r = min(len(e), int(s * SR))
    if r > 0:
        e[-r:] *= np.linspace(1, 0, r)
    return e


# ---------------- instrumentos ----------------
def rhodes(f, dur, vel, decay=1.9, rng=None):
    n = int(dur * SR); t = np.arange(n) / SR
    idx = 1.6 * vel * np.exp(-t / 0.35) + 0.25
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) + 0.18 * vel * np.sin(2 * np.pi * f * 14 * t) * np.exp(-t / 0.05)
    return x * _release(_env(n, 0.004, decay) * (1 + 0.06 * np.sin(2 * np.pi * 4.2 * t))) * vel


def vibrafono(f, dur, vel, decay=2.8, rng=None):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.4) + 0.06 * np.sin(2 * np.pi * f * 9.7 * t) * np.exp(-t / 0.08)
    trem = 1 - 0.28 * (0.5 + 0.5 * np.sin(2 * np.pi * 5.4 * t))
    click = (rng.standard_normal(n) if rng is not None else 0) * np.exp(-t / 0.004) * 0.08
    return (x * trem + click) * _release(_env(n, 0.002, decay)) * vel


def nylon(f, dur, vel, decay=1.6, rng=None):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 11):
        amp = abs(np.sin(np.pi * k * 0.18)) / k ** 1.1
        x += amp * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t / (decay / (1 + 0.35 * k)))
    pluck = (rng.standard_normal(n) if rng is not None else 0) * np.exp(-t / 0.006) * 0.12
    return (x + pluck) * _release(np.minimum(1, t / 0.002)) * vel


def piano(f, dur, vel, decay=2.2, rng=None):          # piano de fieltro: suave, apagado, con golpe de martillo afieltrado
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 9):
        for det in (-0.0005, 0.0005):
            x += (0.5 / k ** 1.6) * np.sin(2 * np.pi * f * k * (1 + det) * t) * np.exp(-t / (decay / (1 + 0.25 * k)))
    thump = np.convolve(rng.standard_normal(n) if rng is not None else np.zeros(n), np.ones(40) / 40, 'same') * np.exp(-t / 0.03) * 0.25
    return (x + thump) * _release(np.minimum(1, t / 0.006)) * vel


INSTR = {'rhodes': rhodes, 'vibrafono': vibrafono, 'nylon': nylon, 'piano': piano}


def bass(f, dur, vel):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    return x * _release(_env(n, 0.012, 0.9), 0.08) * vel


def kick(vel):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 60 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) * vel


def noise_hit(rng, n_s, decay, vel, color):
    n = int(n_s * SR); x = rng.standard_normal(n)
    if color == 'brush':
        x = np.convolve(x, np.ones(6) / 6, 'same') - np.convolve(x, np.ones(40) / 40, 'same')
    elif color == 'rim':
        t = np.arange(n) / SR; x = 0.6 * np.sin(2 * np.pi * 1800 * t) + 0.4 * np.diff(x, prepend=0)
    else:
        x = np.diff(x, prepend=0)
    t = np.arange(n) / SR
    return x * np.minimum(1, t / 0.003) * np.exp(-t / decay) * vel


def place(buf, x, at):
    i = int(at * SR)
    if i < 0:
        x, i = x[-i:], 0
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


def voicing(root_pc, quality, lo=53, hi=77):
    iv = VOICING[quality]
    base = 48 + root_pc
    notes = [base + i for i in iv]
    while min(notes) < lo:
        notes = [n + 12 for n in notes]
    while max(notes) > hi:
        notes = [n - 12 for n in notes]
    return notes


def synth(total, tonic_at, params, out_path, tmp_dir):
    """Escribe out_path (wav estéreo 48 kHz). Devuelve los parámetros efectivos (para history.json)."""
    seed = int(params.get('seed', 7))
    rng = np.random.default_rng(seed)
    key = params.get('key') or list(KEYS)[int(rng.integers(12))]
    kpc = KEYS[key]
    tempo = float(params.get('tempo') or rng.integers(68, 85))
    tempo = min(84.0, max(68.0, tempo))
    lead = params.get('lead') or LEADS[int(rng.integers(4))]
    progname = params.get('prog') or list(PROGS)[int(rng.integers(len(PROGS)))]
    pattern = params.get('pattern') or {'rhodes': 'A', 'vibrafono': 'sostenido', 'nylon': 'arpegio', 'piano': 'B'}[lead]
    drums = params.get('drums') or ['escobillas', 'rim', 'escobillas', 'ninguna'][int(rng.integers(4))]
    inst = INSTR[lead]
    beat = 60 / tempo; bar = 4 * beat; swing = 0.58 + 0.08 * rng.random()
    dur = total + 1.0; n = int(dur * SR)
    keys_, low, drm, lead_t = np.zeros(n), np.zeros(n), np.zeros(n), np.zeros(n)
    FINAL = int(tonic_at // bar); OFF = tonic_at - FINAL * bar
    prog = PROGS[progname]
    pc = lambda deg: (kpc + SCALE[deg - 1]) % 12
    # compases: ...progresión en bucle..., V13 en FINAL-1, Imaj9 en FINAL
    bars = []
    for b in range(-1, FINAL):
        if b == FINAL - 1:
            bars.append((b, 5, '13'))
        else:
            deg, q = prog[(b - (FINAL - 1)) % 4]
            bars.append((b, deg, q))
    for b, deg, q in bars:
        t0 = OFF + b * bar
        notes = voicing(pc(deg), q); root = 36 + pc(deg) if pc(deg) >= 4 else 48 + pc(deg)
        vel = 0.5 + 0.05 * rng.random()
        if pattern == 'arpegio':
            seq = notes + notes[-2:0:-1]
            for i in range(8):
                at = t0 + (i // 2) * beat + (i % 2) * swing * beat
                place(keys_, inst(midi(seq[i % len(seq)]), beat * 1.6, 0.38 + 0.08 * (i % 2 == 0), rng=rng), at)
        elif pattern == 'sostenido':
            for k, m in enumerate(notes):
                place(keys_, inst(midi(m), bar * 1.05, 0.42, rng=rng), t0 + 0.03 * k)
            place(keys_, inst(midi(notes[-1]), beat * 1.2, 0.2, rng=rng), t0 + (2 + swing) * beat)
        else:
            hits = [(0, 'full', vel), (1 + swing, 'top', 0.28)] if pattern == 'A' else [(0, 'full', vel), (2, 'top', 0.3), (3 + swing, 'top', 0.2)]
            for pos, part, v in hits:
                chord = notes if part == 'full' else notes[2:]
                for k, m in enumerate(chord):
                    place(keys_, inst(midi(m), bar * (0.95 if part == 'full' else 0.4), v, rng=rng), t0 + pos * beat + 0.016 * k)
        nxt = pc(bars[min(len(bars) - 1, bars.index((b, deg, q)) + 1)][1]) if b < FINAL - 1 else pc(1)
        place(low, bass(midi(root), beat * 1.9, 0.9), t0)
        place(low, bass(midi(root + 7), beat * 1.4, 0.72), t0 + 2 * beat)
        place(low, bass(midi((36 if nxt >= 4 else 48) + nxt - 1), beat * 0.4, 0.5), t0 + (3 + swing) * beat)
        if drums != 'ninguna':
            place(drm, kick(0.75), t0); place(drm, kick(0.5), t0 + (1 + swing) * beat)
            if b % 2:
                place(drm, kick(0.32), t0 + (2 + swing) * beat)
            for bt in (1, 3):
                place(drm, noise_hit(rng, 0.5, 0.14, 0.3, 'brush') if drums == 'escobillas' else noise_hit(rng, 0.06, 0.012, 0.22, 'rim'), t0 + bt * beat + 0.01)
            for bt in range(4):
                place(drm, noise_hit(rng, 0.08, 0.02, 0.09, 'hat'), t0 + bt * beat)
                place(drm, noise_hit(rng, 0.06, 0.015, 0.055, 'hat'), t0 + (bt + swing) * beat)
    # melodía: frase corta con notas del acorde en los 4 compases antes de la tónica, y reposo en la tónica
    pent = [0, 2, 4, 7, 9]
    for b, deg, q in bars[-4:]:
        t0 = OFF + b * bar
        for j in range(int(rng.integers(2, 4))):
            pos = [0.5, 1.5, 2 + swing, 3][j] + 0.0
            m = 72 + (kpc + pent[int(rng.integers(5))]) % 12
            place(lead_t, inst(midi(m), beat * (1.2 + rng.random()), 0.32, rng=rng), t0 + pos * beat)
    tf = OFF + FINAL * bar                                  # tónica sostenida (resolución V→I en el logo)
    tonic = voicing(pc(1), 'maj9')
    for k, m in enumerate([36 + kpc if kpc >= 4 else 48 + kpc] + tonic):
        place(keys_, inst(midi(m), dur - tf, 0.46 if k else 0.3, decay=3.2, rng=rng), tf + 0.028 * k)
    place(low, bass(midi(36 + kpc if kpc >= 4 else 48 + kpc), dur - tf, 0.9), tf)
    if drums != 'ninguna':
        place(drm, kick(0.55), tf); place(drm, noise_hit(rng, 1.4, 0.5, 0.16, 'brush'), tf + 0.02)
    place(lead_t, inst(midi(72 + kpc % 12), dur - tf, 0.3, decay=3.0, rng=rng), tf + 0.2)
    hiss = np.convolve(rng.standard_normal(n), np.ones(12) / 12, 'same') * 0.012
    clicks = np.zeros(n)
    for at in rng.uniform(0, dur, int(dur * 8)):
        place(clicks, noise_hit(rng, 0.004, 0.0008, rng.uniform(0.05, 0.22), 'hat'), at)
    lvl = {'rhodes': 0.30, 'vibrafono': 0.26, 'nylon': 0.34, 'piano': 0.32}[lead]
    mix = lvl * keys_ + 0.26 * lead_t + 0.55 * low + 0.5 * drm + hiss + clicks
    t = np.arange(n) / SR
    mix = np.interp(t + 0.0012 * np.sin(2 * np.pi * 0.55 * t) / (2 * np.pi * 0.55), t, mix)   # wow de cinta
    mix = np.tanh(1.3 * mix) / 1.3
    raw = os.path.join(tmp_dir, 'music-raw.f32')
    (mix / (np.abs(mix).max() + 1e-9) * 0.8).astype(np.float32).tofile(raw)
    lp = {'rhodes': 4200, 'vibrafono': 5200, 'nylon': 4800, 'piano': 3800}[lead]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', raw, '-af',
                    f'highpass=f=35,lowpass=f={lp},lowpass=f=6500,aecho=0.8:0.5:37|61:0.22|0.14,'
                    f'aformat=channel_layouts=stereo,extrastereo=m=1.2,atrim=0:{total:.3f}',
                    '-ar', str(SR), '-c:a', 'pcm_s24le', out_path], check=True)
    os.remove(raw)
    return {'key': key, 'tempo': int(tempo), 'lead': lead, 'prog': progname, 'pattern': pattern, 'drums': drums, 'seed': seed,
            'tonic_at': round(tonic_at, 3), 'bar': round(bar, 3)}
