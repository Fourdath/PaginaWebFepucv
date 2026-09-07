"""Remove the generated checkerboard, authorized by the user, preserving interiors.
Flood fill only near-neutral light background connected to the image boundary.
Normalize the three silhouettes to equal 384px cells for predictable collisions.
"""
from pathlib import Path
from collections import deque
import sys
import numpy as np
from PIL import Image, ImageFilter

source, destination = map(Path, sys.argv[1:3])
rgb = np.array(Image.open(source).convert('RGB'))
h, w, _ = rgb.shape
lo = rgb.min(axis=2).astype(int)
hi = rgb.max(axis=2).astype(int)
candidate = (lo > 205) & ((hi - lo) < 30)
seen = np.zeros((h, w), dtype=bool)
queue = deque()
for y, x in [(0, x) for x in range(w)] + [(h-1, x) for x in range(w)] + [(y, 0) for y in range(h)] + [(y, w-1) for y in range(h)]:
    if candidate[y, x] and not seen[y, x]:
        seen[y, x] = True
        queue.append((y, x))
while queue:
    y, x = queue.popleft()
    for ny, nx in ((y-1, x), (y+1, x), (y, x-1), (y, x+1)):
        if 0 <= ny < h and 0 <= nx < w and candidate[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True
            queue.append((ny, nx))
alpha = Image.fromarray(np.where(seen, 0, 255).astype('uint8'))
# Trim the light fringe while retaining fine hair and antialias after resampling.
alpha = alpha.filter(ImageFilter.MinFilter(3))
rgba = Image.fromarray(rgb).convert('RGBA')
rgba.putalpha(alpha)
atlas = Image.new('RGBA', (1152, 384))
for i in range(3):
    cell = rgba.crop((round(i*w/3), 0, round((i+1)*w/3), h))
    bbox = cell.getbbox()
    if not bbox:
        raise ValueError('Empty character')
    cell = cell.crop(bbox)
    cell.thumbnail((352, 352), Image.Resampling.LANCZOS)
    atlas.alpha_composite(cell, (i*384 + (384-cell.width)//2, (384-cell.height)//2))
destination.parent.mkdir(parents=True, exist_ok=True)
atlas.save(destination, optimize=True)
print(f'{destination.name}: {atlas.size}, RGBA, {destination.stat().st_size} bytes')
