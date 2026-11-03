"""Makes one html file (dist/elemental-five.html) with all css, js, images,
videos and sounds inside, so it works offline and can go on WordPress.

Run: python build.py
"""
import base64
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'
DIST = ROOT / 'dist'
MIME = {'.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg'}


def data_uri(path):
    return f'data:{MIME[path.suffix]};base64,' + base64.b64encode(path.read_bytes()).decode()


def folder(name):
    d = SRC / 'assets' / name
    return {p.stem: data_uri(p) for p in sorted(d.glob('*')) if p.suffix in MIME} if d.exists() else {}


def main():
    html = (SRC / 'index.html').read_text(encoding='utf-8')
    read = lambda rel: (SRC / rel).read_text(encoding='utf-8')

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
                  lambda m: '<style>\n' + read(m[1]) + '</style>', html)

    embed = ''.join(f'window.{k} = {json.dumps(v)};\n' for k, v in
                    [('__IMGS__', folder('img')), ('__VIDS__', folder('vid')), ('__SFX__', folder('snd'))] if v)
    html = html.replace('<script src=', '<script>\n' + embed + '</script>\n<script src=', 1)
    html = re.sub(r'<script src="([^"]+)"></script>',
                  lambda m: '<script>\n' + read(m[1]) + '</script>', html)

    DIST.mkdir(exist_ok=True)
    out = DIST / 'elemental-five.html'
    out.write_text(html, encoding='utf-8')
    print(f'built {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
