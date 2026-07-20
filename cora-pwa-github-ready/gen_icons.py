from PIL import Image, ImageDraw
import math

INK1 = (18, 33, 31)
INK2 = (12, 26, 24)
GOLD = (201, 169, 106)

def make_icon(size, maskable=False):
    img = Image.new("RGB", (size, size), INK1)
    d = ImageDraw.Draw(img)

    # diagonal gradient approximation (simple vertical blend)
    for y in range(size):
        t = y / size
        r = int(INK2[0] + (INK1[0] - INK2[0]) * t)
        g = int(INK2[1] + (INK1[1] - INK2[1]) * t)
        b = int(INK2[2] + (INK1[2] - INK2[2]) * t)
        d.line([(0, y), (size, y)], fill=(r, g, b))

    cx = cy = size / 2
    # padding bigger for maskable icons (safe zone)
    pad = size * (0.22 if maskable else 0.14)
    r_outer = (size / 2) - pad
    r_inner = r_outer * 0.83

    w_outer = max(2, size * 0.012)
    w_inner = max(3, size * 0.028)

    d.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=GOLD, width=int(w_outer))
    d.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], outline=GOLD, width=int(w_inner))

    # balance arrows (simplified from the SVG emblem, scaled to icon size)
    scale = r_inner / 40.0  # original emblem inner radius ~40 at 120 viewbox
    ox, oy = cx, cy
    def pt(x, y):
        # original coords centered at 60,60 in a 120x120 box
        return (ox + (x - 60) * scale, oy + (y - 60) * scale)

    lw = max(2, size * 0.02)
    d.line([pt(42, 53), pt(75, 53)], fill=GOLD, width=int(lw))
    d.line([pt(75, 53), pt(69, 49.4)], fill=GOLD, width=int(lw * 0.85))
    d.line([pt(78, 67), pt(45, 67)], fill=GOLD, width=int(lw))
    d.line([pt(45, 67), pt(51, 70.6)], fill=GOLD, width=int(lw * 0.85))

    dot_r = size * 0.018
    d.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=GOLD)

    return img

import os
os.makedirs("public/icons", exist_ok=True)

make_icon(192).save("public/icons/icon-192.png")
make_icon(512).save("public/icons/icon-512.png")
make_icon(512, maskable=True).save("public/icons/icon-512-maskable.png")
print("icons generated")
