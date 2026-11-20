#!/usr/bin/env python3
"""
scripts/generate_maya_pointcloud.py
Deterministic 3D Point Cloud Synthesizer for Queen Maya (T-15)
Source: /Users/onkarbhople/Named Tiger Photographic Profiles/Maya/Maya_Face.png
1. Decodes full high-res 2630x2240 PNG image.
2. Extracts Maya's facial bounding box: X=[490, 2436], Y=[86, 2238], Center=(1463, 1162).
3. 2D morphological boundary cleaning to eliminate scattered noise and color mixing.
4. Symmetrical ocular orbit gaze (0° Yaw, looking directly into viewport).
5. Hexagonal relaxed lattice sampling to produce exactly 14,500 crisp, evenly-spaced points.
6. 3D depth topology (+Z snout projection, curved skull envelope).
7. Base64 encoding and direct injection into HEADS['smooth'] in public/js/webgl-engine.js.
"""

import sys
import zlib
import struct
import math
import base64
import json
from collections import Counter

IMG_PATH = '/Users/onkarbhople/Named Tiger Photographic Profiles/Maya/Maya_Face.png'
TARGET_POINTS = 14500

print(f"Loading Maya photograph from: {IMG_PATH}...")
with open(IMG_PATH, 'rb') as f:
    f.seek(8)
    idat = []
    while True:
        chunk = f.read(8)
        if not chunk: break
        length, chunk_type = struct.unpack('>I4s', chunk)
        data = f.read(length)
        crc = f.read(4)
        if chunk_type == b'IDAT': idat.append(data)
        elif chunk_type == b'IEND': break

decomp = zlib.decompress(b''.join(idat))
w, h = 2630, 2240
stride = w * 4

# Target analysis grid resolution: 400x340
GW = 400
GH = int(round(h * (GW / float(w)))) # 341
print(f"Decoding and downsampling to analysis grid: {GW}x{GH}...")

scale_x = w / float(GW)
scale_y = h / float(GH)

# Unfilter on the fly for sampled rows
# Since PNG filtering depends on prev row, we unfilter full image into pixels
pixels = bytearray(w * h * 4)
prev_row = bytearray(stride)
raw_idx = 0

for y in range(h):
    filter_type = decomp[raw_idx]
    raw_idx += 1
    row = bytearray(decomp[raw_idx : raw_idx + stride])
    raw_idx += stride
    if filter_type == 1:
        for x in range(4, stride): row[x] = (row[x] + row[x - 4]) & 0xFF
    elif filter_type == 2:
        for x in range(stride): row[x] = (row[x] + prev_row[x]) & 0xFF
    elif filter_type == 3:
        for x in range(stride):
            left = row[x - 4] if x >= 4 else 0
            row[x] = (row[x] + ((left + prev_row[x]) >> 1)) & 0xFF
    elif filter_type == 4:
        for x in range(stride):
            a = row[x - 4] if x >= 4 else 0
            b = prev_row[x]
            c = prev_row[x - 4] if x >= 4 else 0
            p = a + b - c
            pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
            pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
            row[x] = (row[x] + pr) & 0xFF
    pixels[y * stride : (y + 1) * stride] = row
    prev_row = row

print("Image decoded. Building classified material grid...")

# Sample grid: 0=bg, 1=stripe (black), 2=white fur, 3=golden amber coat, 4=golden topaz eye
grid = [[0]*GW for _ in range(GH)]

# Bounding box in full res: X=[490, 2436], Y=[86, 2238], Center=(1463, 1162)
# Center in GW, GH:
cx_grid = 1463.0 / scale_x
cy_grid = 1162.0 / scale_y
radius_grid = (2436 - 490) / 2.0 / scale_x

for gy in range(GH):
    orig_y = min(h - 1, int(round(gy * scale_y)))
    row_offset = orig_y * stride
    for gx in range(GW):
        orig_x = min(w - 1, int(round(gx * scale_x)))
        idx = row_offset + orig_x * 4
        r = pixels[idx]
        g = pixels[idx + 1]
        b = pixels[idx + 2]
        a = pixels[idx + 3]

        if a < 45:
            continue

        # Normalized coordinates from center (-1.0 to 1.0)
        norm_x = (gx - cx_grid) / radius_grid
        norm_y = -(gy - cy_grid) / radius_grid

        # Check eye orbits (symmetrical, frontal)
        # Maya's ocular orbits: norm_x ~ +/- 0.22, norm_y ~ 0.18
        is_left_eye = (-0.29 <= norm_x <= -0.15) and (0.12 <= norm_y <= 0.25)
        is_right_eye = (0.15 <= norm_x <= 0.29) and (0.12 <= norm_y <= 0.25)

        # Classify by authentic tiger color physics:
        # Luminance / brightness
        lum = 0.299 * r + 0.587 * g + 0.114 * b

        if is_left_eye or is_right_eye:
            # Inside eye box:
            if lum < 55:
                grid[gy][gx] = 1 # Black eye eyeliner / pupil
            elif r > 110 and g > 85 and b < 95:
                grid[gy][gx] = 4 # Golden topaz iris
            else:
                grid[gy][gx] = 4 # Golden iris
        elif lum < 58 or (r < 65 and g < 60 and b < 55):
            grid[gy][gx] = 1 # Obsidian black stripes
        elif (lum > 170 and abs(r - g) < 30 and abs(g - b) < 35) or (norm_y < -0.15 and lum > 140 and r > 130 and g > 130):
            grid[gy][gx] = 2 # Clean ivory white fur (whiskers, chin, cheek ruffs)
        else:
            grid[gy][gx] = 3 # Royal golden amber coat

print("Applying 2-stage morphological boundary cleanup...")
# Pass 1: Remove isolated noise speckles
m1 = [row[:] for row in grid]
for gy in range(1, GH - 1):
    for gx in range(1, GW - 1):
        c = grid[gy][gx]
        if c == 4: continue # preserve eyes
        nbrs = [grid[ny][nx] for ny in range(gy-1, gy+2) for nx in range(gx-1, gx+2)]
        non_zero = [v for v in nbrs if v > 0]
        if len(non_zero) <= 2:
            m1[gy][gx] = 0
            continue
        if c > 0:
            top, cnt = Counter(non_zero).most_common(1)[0]
            if cnt >= 5: m1[gy][gx] = top

# Pass 2: Smooth boundary ribbons
m2 = [row[:] for row in m1]
for gy in range(2, GH - 2):
    for gx in range(2, GW - 2):
        c = m1[gy][gx]
        if c == 4 or c == 0: continue
        nbrs = [m1[ny][nx] for ny in range(gy-2, gy+3) for nx in range(gx-2, gx+3) if m1[ny][nx] > 0]
        if len(nbrs) >= 12:
            top, cnt = Counter(nbrs).most_common(1)[0]
            if cnt >= 15: m2[gy][gx] = top

print("Sampling hexagonal relaxed point lattice...")
# Symmetrical front-facing point cloud
def sample_points(step):
    pts = []
    y = 0.0
    row_idx = 0
    while y < GH:
        x_offset = (step * 0.5) if (row_idx % 2 == 1) else 0.0
        x = x_offset
        while x < GW:
            ix, iy = int(round(x)), int(round(y))
            if 0 <= ix < GW and 0 <= iy < GH:
                c = m2[iy][ix]
                if c > 0:
                    # Convert to normalized 3D coords
                    nx = (x - cx_grid) / radius_grid * 0.88
                    ny = -(y - cy_grid) / radius_grid * 0.88
                    pts.append((nx, ny, c))
            x += step
        y += step * 0.866
        row_idx += 1
    return pts

# Binary search step for TARGET_POINTS
low, high = 1.6, 2.6
best_step = 2.0
for _ in range(18):
    mid = (low + high) / 2.0
    pts = sample_points(mid)
    if len(pts) == TARGET_POINTS:
        best_step = mid
        break
    elif len(pts) > TARGET_POINTS:
        low = mid
    else:
        high = mid

pts = sample_points(best_step)
print(f"Sampled {len(pts)} points at step {best_step:.4f}")

# Trim or pad to exact TARGET_POINTS
if len(pts) > TARGET_POINTS:
    pts.sort(key=lambda p: (p[0]**2 + p[1]**2))
    pts = pts[:TARGET_POINTS]
elif len(pts) < TARGET_POINTS:
    pts.sort(key=lambda p: (p[0]**2 + p[1]**2))
    needed = TARGET_POINTS - len(pts)
    for k in range(needed):
        p = pts[k]
        pts.append((p[0] + 0.003, p[1] + 0.003, p[2]))

print(f"Final exact points count: {len(pts)}")

# Compute 3D Depth & Normal Vectors for frontal cranium
# Symmetrical 0° Yaw, facing directly toward camera (+Z)
points_3d = []
normals_3d = []
ao_list = []
w_list = []
eye_indices = []

for idx, (nx, ny, c) in enumerate(pts):
    # Spherical cranium envelope
    r2 = (nx / 0.88)**2 + (ny / 0.86)**2
    z_base = 0.40 + 0.38 * math.sqrt(max(0.0, 1.0 - min(1.0, r2)))

    # Protruding muzzle/snout
    snout_dist2 = (nx / 0.28)**2 + ((ny + 0.14) / 0.26)**2
    z_snout = 0.34 * math.exp(-snout_dist2)

    # Recessed eye sockets
    eye_l = math.hypot(nx + 0.21, ny - 0.18)
    eye_r = math.hypot(nx - 0.21, ny - 0.18)
    z_eye = -0.04 * math.exp(-(min(eye_l, eye_r) / 0.08)**2)

    # Forehead slope
    z_forehead = 0.06 * max(0.0, 1.0 - abs(nx) / 0.28) if (0.28 < ny < 0.62) else 0.0

    z = z_base + z_snout + z_eye + z_forehead

    # Normal vector facing outward (+Z forward)
    norm_x = nx * 0.45
    norm_y = ny * 0.45
    norm_z = 1.0
    mag = math.hypot(math.hypot(norm_x, norm_y), norm_z)
    nx_hat, ny_hat, nz_hat = norm_x / mag, norm_y / mag, norm_z / mag

    points_3d.append((nx, ny, z))
    normals_3d.append((nx_hat, ny_hat, nz_hat))

    if c == 4: # Eye
        eye_indices.append(idx)
        ao_list.append(255)
        w_list.append(255)
    elif c == 1: # Stripe
        ao_list.append(25)  # AO for stripe (< 0.10 in engine)
        w_list.append(210)
    elif c == 2: # White fur
        ao_list.append(250) # AO for white fur (> 0.75 in engine)
        w_list.append(245)
    else: # c == 3, Golden amber coat
        ao_list.append(155) # AO for coat (0.35 in engine)
        w_list.append(185)

print(f"Material breakdown: {len(eye_indices)} eye points, {sum(1 for a in ao_list if a == 25)} stripe points, {sum(1 for a in ao_list if a == 250)} white fur points, {sum(1 for a in ao_list if a == 155)} coat points.")

# Quantize to Int16 / Int8 and Base64 encode
pos_bytes = bytearray()
for (x, y, z) in points_3d:
    ix = max(-32767, min(32767, int(round(x * 20000.0))))
    iy = max(-32767, min(32767, int(round(y * 20000.0))))
    iz = max(-32767, min(32767, int(round(z * 20000.0))))
    pos_bytes.extend(struct.pack('<hhh', ix, iy, iz))

nrm_bytes = bytearray()
for (nx, ny, nz) in normals_3d:
    inx = max(-127, min(127, int(round(nx * 127.0))))
    iny = max(-127, min(127, int(round(ny * 127.0))))
    inz = max(-127, min(127, int(round(nz * 127.0))))
    nrm_bytes.extend(struct.pack('<bbb', inx, iny, inz))

ao_bytes = bytes(ao_list)
w_bytes = bytes(w_list)

pos_b64 = base64.b64encode(pos_bytes).decode('ascii')
nrm_b64 = base64.b64encode(nrm_bytes).decode('ascii')
ao_b64 = base64.b64encode(ao_bytes).decode('ascii')
w_b64 = base64.b64encode(w_bytes).decode('ascii')

maya_payload = {
    'n': TARGET_POINTS,
    'pos': pos_b64,
    'nrm': nrm_b64,
    'ao': ao_b64,
    'w': w_b64,
    'eye': eye_indices,
    'c': 0.0
}

with open('scripts/tiger_head_data.json', 'w') as f:
    json.dump(maya_payload, f)
print("Saved scripts/tiger_head_data.json!")

# Inject into public/js/webgl-engine.js
print("Injecting Maya cranium into public/js/webgl-engine.js...")
with open('public/js/webgl-engine.js', 'r') as f:
    engine_js = f.read()

idx_smooth = engine_js.find("'smooth':{")
idx_hair = engine_js.find("'hair':{")

smooth_obj = f"'smooth':{{'n':{TARGET_POINTS},'pos':'{pos_b64}','nrm':'{nrm_b64}','ao':'{ao_b64}','w':'{w_b64}','eye':{json.dumps(eye_indices)},'c':0.0}},"

if idx_hair != -1:
    engine_js = engine_js[:idx_smooth] + smooth_obj + engine_js[idx_hair:]
else:
    # If hair not present, find closing of smooth
    idx_end = engine_js.find("}},", idx_smooth)
    if idx_end != -1:
        engine_js = engine_js[:idx_smooth] + smooth_obj[:-1] + engine_js[idx_end+1:]
    else:
        # Fallback regex or end of heads
        idx_heads_end = engine_js.find(";((async()", idx_smooth)
        engine_js = engine_js[:idx_smooth] + smooth_obj[:-1] + "}" + engine_js[idx_heads_end:]

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(engine_js)

print("Injected into public/js/webgl-engine.js successfully!")
