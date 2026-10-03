#!/usr/bin/env python3
"""Arma un reel de VEJ: reel.json + scene.js + audios → mezcla + composition.html (lista para HyperFrames).

  python3 reels/build.py reels/<id>              # con los audios de voz en reels/<id>/audio/
  python3 reels/build.py reels/<id> --preview    # sin voz: tiempos estimados, sin audio (para iterar la imagen)

Salidas en reels/<id>/: composition.html, timing.json, build/{voice,music,mix}.wav
Corre en el sandbox de VEJ: python3 + numpy + ffmpeg, sin red. Ver reels/README.md.
"""
import argparse
import base64
import datetime
import html
import json
import os
import re
import subprocess
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(HERE, 'lib')
sys.path.insert(0, LIB)
import audio  # noqa: E402
import music  # noqa: E402

SETTINGS = ['ventana', 'balcon', 'jardin', 'mesa', 'cocina', 'invernadero', 'subsuelo', 'macro', 'pared']
LIGHTS = ['manana', 'dorada', 'nublado', 'noche']
STRUCTURES = ['ritual', 'error-solucion', 'mito-realidad', 'antes-despues', 'planta-cuenta', 'pregunta-respuesta']
TRANSITIONS = ['fundido', 'hoja', 'tierra', 'lluvia', 'estacion', 'match']
SIZE_WARN = 170_000


def norm(s):
    return unicodedata.normalize('NFD', str(s)).encode('ascii', 'ignore').decode().lower().strip()


def die(msg):
    sys.exit(f'✗ {msg}')


def load_reel(d):
    p = os.path.join(d, 'reel.json')
    if not os.path.exists(p):
        die(f'no existe {p}')
    R = json.load(open(p, encoding='utf-8'))
    R.setdefault('id', os.path.basename(os.path.abspath(d)))
    src = R.get('sources') or []
    if not (1 <= len(src) <= 2):
        die('sources debe tener 1 o 2 slugs de posts')
    if not (3 <= len(R.get('lines', [])) <= 5):
        die('lines: entre 3 y 5 frases')
    for i, l in enumerate(R['lines']):
        txt = l['text'] if isinstance(l, dict) else l
        if len(txt) > 400:
            die(f'línea {i + 1}: {len(txt)} caracteres (máximo 400, límite del MCP tts)')
    st = R.get('style') or die('falta style {setting, framing, light, structure, transition, music}')
    for k, allowed in (('setting', SETTINGS), ('light', LIGHTS), ('structure', STRUCTURES)):
        if norm(st.get(k, '')) not in allowed:
            die(f'style.{k} = {st.get(k)!r}; opciones: {", ".join(allowed)}')
    for tr in (st.get('transitions') or [st.get('transition', 'fundido')]):
        if norm(tr) not in TRANSITIONS:
            die(f'transición {tr!r}; opciones: {", ".join(TRANSITIONS)}')
    if not os.path.exists(os.path.join(d, R.get('scene', 'scene.js'))):
        die('falta scene.js (la escena la diseña el agente; ver reels/examples/)')
    return R


def history_check(R, strict=True):
    hp = os.path.join(HERE, 'history.json')
    H = json.load(open(hp, encoding='utf-8')) if os.path.exists(hp) else []
    st = R['style']; mu = st.get('music', {})
    combo = (norm(st['setting']), norm(st['structure']), norm(st['light']))
    recent = [h for h in H if h.get('id') != R['id']][-6:]
    for h in recent:
        if (norm(h['setting']), norm(h['structure']), norm(h['light'])) == combo:
            msg = f'combinación escenario+estructura+luz {combo} ya se usó en «{h["id"]}» (últimos 6 videos). Cambia al menos una.'
            die(msg) if strict else print('⚠', msg)
    if recent:
        last = recent[-1]
        same = [k for k in ('setting', 'framing', 'light', 'structure', 'transition') if norm(last.get(k, '')) == norm(st.get(k, ''))]
        if len(same) >= 3:
            print(f'⚠ se parece mucho al video anterior («{last["id"]}»): mismo {", ".join(same)}')
        if last.get('music') and all(str(last['music'].get(k)) == str(mu.get(k)) for k in ('key', 'lead')):
            print('⚠ misma tonalidad e instrumento que el video anterior: cambia uno')


def line_audio(d, i, l):
    if isinstance(l, dict) and l.get('audio'):
        return os.path.join(d, l['audio'])
    for ext in ('wav', 'mp3'):
        p = os.path.join(d, 'audio', f'line-{i + 1}.{ext}')
        if os.path.exists(p):
            return p
    die(f'falta el audio de la línea {i + 1} (reels/<id>/audio/line-{i + 1}.wav). Genera la voz con tts__speak o usa --preview.')


def captions_for(segs):
    """Una frase a la vez. Si una línea es larga (>72 caracteres) se parte en oraciones con tiempos proporcionales."""
    out = []
    for s in segs:
        txt, a, b = s['text'], s['start'], s['end']
        parts = [p.strip() for p in re.split(r'(?<=[.!?…])\s+', txt) if p.strip()] if len(txt) > 72 else [txt]
        chunks, cur = [], ''
        for p in parts:                                         # junta oraciones cortas hasta ~60 caracteres
            if cur and len(cur) + len(p) > 60:
                chunks.append(cur); cur = p
            else:
                cur = (cur + ' ' + p).strip()
        chunks.append(cur)
        total = sum(len(c) for c in chunks); t = a
        for j, c in enumerate(chunks):
            dt = (b - a) * len(c) / total
            out.append({'start': round(t + (0.1 if j else 0), 3), 'end': round(t + dt - (0.12 if j < len(chunks) - 1 else 0), 3), 'text': c})
            t += dt
    return out


def title_words(title):
    text, kw = title['text'], norm(title.get('keyword', ''))
    words = text.split()
    kws = set(norm(w) for w in kw.split()) if kw else set()
    size = 124 if len(text) <= 30 else 108 if len(text) <= 44 else 94
    spans = []
    for i, w in enumerate(words):
        cls = 'rv kw' if norm(re.sub(r'[^\w]', '', w)) in kws else 'rv'
        spans.append(f'<span class="{cls}" data-in="{0.6 + i * 0.14:.2f}" data-out="{i * 0.04:.2f}" style="opacity:0">{html.escape(w)}</span>')
    return ' '.join(spans), size


def fonts_css():
    def face(fam, fn, style):
        b64 = base64.b64encode(open(os.path.join(LIB, 'fonts', fn), 'rb').read()).decode()
        return f'  @font-face {{ font-family: "{fam}"; font-style: {style}; font-weight: 100 900; src: url(data:font/woff2;base64,{b64}) format("woff2"); }}'
    return face('Fraunces', 'fraunces-italic.woff2', 'italic') + '\n' + face('FrauncesLogo', 'fraunces-logo.woff2', 'normal')


def runtime_js():
    src = [os.path.join(LIB, 'js', f) for f in ('vej-kit.js', 'vej-prims.js', 'reel-runtime.js')]
    mini = os.path.join(LIB, 'runtime.min.js')
    if os.path.exists(mini) and os.path.getmtime(mini) >= max(os.path.getmtime(p) for p in src):
        return open(mini, encoding='utf-8').read()
    print('⚠ runtime.min.js desactualizado: uso las fuentes sin minificar (corre reels/lib/minify.sh si puedes)')
    return '\n'.join(open(p, encoding='utf-8').read() for p in src)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dir'); ap.add_argument('--preview', action='store_true'); ap.add_argument('--no-history', action='store_true')
    a = ap.parse_args()
    d = os.path.abspath(a.dir if os.path.isdir(a.dir) else os.path.dirname(a.dir))
    R = load_reel(d)
    if not a.no_history:
        history_check(R, strict=not a.preview)
    out = os.path.join(d, 'build'); os.makedirs(out, exist_ok=True)
    texts = [l['text'] if isinstance(l, dict) else l for l in R['lines']]
    mus_params = dict(R['style'].get('music', {}))

    if a.preview:                                               # tiempos estimados (~15 caracteres/s + pausas)
        t, segs = audio.LEAD, []
        for i, tx in enumerate(texts):
            if i:
                t += audio.PAUSES[i % len(audio.PAUSES)]
            dur = 0.3 + len(tx) / 15.0
            segs.append({'text': tx, 'start': round(t, 3), 'end': round(t + dur, 3)}); t += dur
        total = round(t + audio.TAIL, 3); mus = {}
    else:
        files = [line_audio(d, i, l) for i, l in enumerate(R['lines'])]
        segs, total, gain = audio.build_voice(files, texts, out, seed=int(mus_params.get('seed', 0)))
        for i, sg in enumerate(segs):                           # sin oído: la velocidad delata palabras comidas o relleno inventado
            rate = len(sg['text']) / max(0.1, sg['end'] - sg['start'])
            if not 10 <= rate <= 19:
                print(f'⚠ línea {i + 1}: {rate:.1f} caracteres/s (normal 12–17). Revisa ese audio y regenéralo con otra seed si hace falta.')
        mus = music.synth(total, segs[-1]['end'] + audio.LOGO_DONE, mus_params, os.path.join(out, 'music.wav'), out)
        mx = audio.mix(out, segs, total)
        I, pk = audio.lufs(os.path.join(out, 'mix.wav'))
        print(f'voz: ganancia fija {gain:+.1f} dB · música {mus["key"]} {mus["tempo"]} BPM {mus["lead"]} ({mus["prog"]}, patrón {mus["pattern"]}, batería {mus["drums"]}) · cierre +{mx["tail_up_db"]} dB')
        print(f'mezcla: {I:.1f} LUFS · pico {pk:.1f} dBFS')
    voice_end = segs[-1]['end']
    if not 18 <= total <= 31:
        print(f'⚠ duración {total:.1f} s fuera de 18–30 s: ajusta el número o el largo de las líneas')
    T = {'id': R['id'], 'total': total, 'lines': segs, 'voice_end': voice_end,
         'curtain_closed': round(voice_end + audio.CURTAIN_CLOSED, 3), 'logo_done': round(voice_end + audio.LOGO_DONE, 3),
         'title_out': round(segs[1]['start'] - 0.9, 3), 'captions': captions_for(segs), 'preview': a.preview, 'music': mus}
    json.dump(T, open(os.path.join(d, 'timing.json'), 'w'), ensure_ascii=False, indent=1)

    words, size = title_words(R['title'])
    dark = norm(R['title'].get('tone', 'dark')) == 'dark'
    page = open(os.path.join(LIB, 'template.html'), encoding='utf-8').read()
    reel_js = json.dumps({k: T[k] for k in ('total', 'lines', 'voice_end', 'curtain_closed', 'logo_done', 'title_out', 'captions')}, ensure_ascii=False)
    for k, v in {
        '{{FONTS}}': fonts_css(), '{{SLUG}}': html.escape(R['id']), '{{DUR}}': f'{total:.2f}',
        '{{TITLE_DUR}}': f'{T["title_out"] + 1.6:.2f}', '{{CARD_START}}': f'{T["curtain_closed"] - 0.1:.2f}',
        '{{CARD_DUR}}': f'{total - T["curtain_closed"] + 0.1:.2f}', '{{EYEBROW}}': html.escape(R.get('category', 'Vida en el Jardín')),
        '{{TITLE_WORDS}}': words, '{{TITLE_SIZE}}': str(size),
        '{{TITLE_COLOR}}': '#14302A' if dark else '#F5EFE4', '{{EYEBROW_COLOR}}': '#2D4A3F' if dark else '#E8E1D3',
        '{{PLATE}}': '<div class="plate"></div>' if R['title'].get('plate') else '',
        '{{PLATE_W}}': str(min(960, int(len(max(R['title']['text'].split(' '), key=len)) * size * 0.55) + 520)), '{{PLATE_H}}': str(int(size * (2 if len(R['title']['text']) <= 30 else 3) * 1.02 + 150)),
        '{{REEL}}': reel_js, '{{RUNTIME}}': runtime_js(), '{{SCENE}}': open(os.path.join(d, R.get('scene', 'scene.js')), encoding='utf-8').read(),
    }.items():
        page = page.replace(k, v)
    comp = os.path.join(d, 'composition.html')
    open(comp, 'w', encoding='utf-8').write(page)
    size_b = len(page.encode())
    print(f'composition.html: {size_b / 1024:.0f} KB · {total:.2f} s · {len(segs)} líneas · {len(T["captions"])} subtítulos'
          + (' · PREVIEW (sin voz)' if a.preview else ''))
    if size_b > SIZE_WARN:
        print(f'⚠ pesa más de {SIZE_WARN // 1000} KB: usa html_file en hyperframes (no pases el HTML inline)')
    print(f'siguiente: hyperframes__check / hyperframes__render con html_file="{comp}"')


if __name__ == '__main__':
    main()
