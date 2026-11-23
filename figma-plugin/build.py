"""Assemble code.js = photo (base64) + src/main.js.
Lancer : python build.py  (depuis n'importe où)"""
import base64
import io
import sys
from pathlib import Path

from PIL import Image

ICI = Path(__file__).resolve().parent
PHOTO = ICI.parent / "assets" / "photo-enosh.jpg"

im = Image.open(PHOTO).convert("RGB")
im.thumbnail((900, 900))
tampon = io.BytesIO()
im.save(tampon, "JPEG", quality=85, optimize=True)
b64 = base64.b64encode(tampon.getvalue()).decode("ascii")

code = f'const PHOTO_B64 = "{b64}";\n' + (ICI / "src" / "main.js").read_text(encoding="utf-8")
(ICI / "code.js").write_text(code, encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")
print(f"code.js écrit ({len(code) // 1024} Ko, photo {len(b64) // 1024} Ko)")
