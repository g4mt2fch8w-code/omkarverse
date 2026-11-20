#!/usr/bin/env python3
"""
scripts/generate_tiger_head.py
Full-Density, Solid 3D Bengal Tiger Point Cloud from Reference Image.
All 14,500 points allocated directly to the frontal facial topology.
No hollow rear hemisphere; full lush orange coat, bold black stripes,
fanned white whiskers/ruffs, and piercing cyan-blue eyes.
"""

import zlib
import struct
import math
import random
import base64
import json

HOTSPOTS = [
  { 'id': 'ocelli', 'organ': 'Kaan (Ears / Pinnae & Ocelli)', 'a': [0.56, 0.72, 0.22], 'r': 0.22, 'side': True },
  { 'id': 'vibrissae', 'organ': 'Mishi / Whiskers (Vibrissae Array)', 'a': [0.36, -0.16, 0.82], 'r': 0.24, 'side': True },
  { 'id': 'jacobson', 'organ': 'Naak / Snout (Jacobson’s Organ)', 'a': [0.00, -0.06, 0.96], 'r': 0.20, 'side': False },
  { 'id': 'stripes', 'organ': 'Forehead Stripes (Biometric Cutaneous Matrix)', 'a': [0.00, 0.48, 0.70], 'r': 0.25, 'side': False },
  { 'id': 'canines', 'organ': 'Daant / Jabda (Canines & Bite Force)', 'a': [0.00, -0.42, 0.78], 'r': 0.22, 'side': False },
  { 'id': 'tapetum', 'organ': 'Aakhein (Eyes / Tapetum Lucidum Gaze)', 'a': [0.22, 0.18, 0.75], 'r': 0.18, 'side': True }
]

def read_png_rgba(filepath):
    with open(filepath, 'rb') as f:
        header = f.read(8)
        idat_chunks = []
        width = height = None
        while True:
            chunk = f.read(8)
            if not chunk or len(chunk) < 8:
                break
            length, chunk_type = struct.unpack('>I4s', chunk)
            data = f.read(length)
            crc = f.read(4)
            if chunk_type == b'IHDR':
                width, height, bit_depth, color_type, comp, filter_m, interlace = struct.unpack('>IIBBBBB', data)
            elif chunk_type == b'IDAT':
                idat_chunks.append(data)
            elif chunk_type == b'IEND':
                break
        raw_data = zlib.decompress(b''.join(idat_chunks))
        stride = width * 4
        pixels = bytearray(width * height * 4)
        prev_row = bytearray(stride)
        raw_idx = 0
        for y in range(height):
            filter_type = raw_data[raw_idx]
            raw_idx += 1
            row = bytearray(raw_data[raw_idx : raw_idx + stride])
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
        return width, height, pixels

def generate():
    random.seed(42)
    ref_path = '/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/.user_uploaded/media_1795196414354_002c0c02.png'
    w, h, pix = read_png_rgba(ref_path)
    
    eye_pixels = []
    stripe_pixels = []
    white_pixels = []
    orange_pixels = []

    for y in range(h):
        for x in range(w):
            idx = (y * w + x) * 4
            r, g, b, a = pix[idx:idx+4]
            if a < 35: continue
            if r > 246 and g > 246 and b > 246: continue # background
            
            # Center at (180, 185)
            nx = (x - 180.0) / 175.0 * 0.90
            ny = -(y - 185.0) / 175.0 * 0.90
            
            # High-precision classification
            if b > 110 and b > r + 30 and g > 70:
                eye_pixels.append((nx, ny, 'eye'))
            elif r < 65 and g < 65 and b < 75:
                stripe_pixels.append((nx, ny, 'stripe'))
            elif r > 185 and g > 185 and b > 185:
                white_pixels.append((nx, ny, 'white'))
            else:
                orange_pixels.append((nx, ny, 'orange'))

    print(f"Pool sizes: eyes={len(eye_pixels)}, stripes={len(stripe_pixels)}, whites={len(white_pixels)}, oranges={len(orange_pixels)}")

    # Full face allocation: exactly 14,500 points
    target_eyes = 800
    target_stripes = 3800
    target_whites = 2900
    target_oranges = 7000

    def sample_pool(pool, count):
        if len(pool) <= count:
            # Upsample with micro-jitter
            res = pool[:]
            needed = count - len(pool)
            for _ in range(needed):
                item = random.choice(pool)
                res.append((item[0] + random.gauss(0, 0.005), item[1] + random.gauss(0, 0.005), item[2]))
            return res
        step = len(pool) / float(count)
        return [pool[int(i * step)] for i in range(count)]

    samples = []
    samples.extend(sample_pool(eye_pixels, target_eyes))
    samples.extend(sample_pool(stripe_pixels, target_stripes))
    samples.extend(sample_pool(white_pixels, target_whites))
    samples.extend(sample_pool(orange_pixels, target_oranges))

    print(f"Total sampled points: {len(samples)}")

    points = []
    normals = []
    ao_list = []
    w_list = []
    eye_indices = []

    def compute_z_and_normal(x, y):
        r2 = (x / 0.92)**2 + (y / 0.88)**2
        z_base = 0.38 + 0.35 * math.sqrt(max(0.0, 1.0 - min(1.0, r2)))
        
        # Snout projection forward
        snout_dist2 = (x / 0.30)**2 + ((y + 0.12) / 0.28)**2
        z_snout = 0.32 * math.exp(-snout_dist2)
        
        # Eye orbits
        eye_dist_l = math.sqrt((x + 0.22)**2 + (y - 0.18)**2)
        eye_dist_r = math.sqrt((x - 0.22)**2 + (y - 0.18)**2)
        min_eye = min(eye_dist_l, eye_dist_r)
        z_eye = 0.06 * math.exp(-(min_eye / 0.10)**2)
        
        # Forehead plane
        z_forehead = 0.08 * max(0.0, 1.0 - abs(x) / 0.30) if (0.30 < y < 0.65) else 0.0
        
        # Cheek ruffs
        z_ruffs = -0.12 * (abs(x) / 0.85)**2 if abs(x) > 0.50 else 0.0
        
        z = z_base + z_snout + z_eye + z_forehead + z_ruffs
        
        # Normals face forward (+Z)
        nx = x * 0.4
        ny = y * 0.4
        nz = 1.0
        mag = math.sqrt(nx*nx + ny*ny + nz*nz)
        return z, nx/mag, ny/mag, nz/mag

    for (x, y, ftype) in samples:
        z, nx, ny, nz = compute_z_and_normal(x, y)
        idx = len(points)
        points.append((x, y, z))
        normals.append((nx, ny, nz))
        
        if ftype == 'eye':
            eye_indices.append(idx)
            ao_list.append(255)
            w_list.append(255)
        elif ftype == 'stripe':
            ao_list.append(40) # Stripe marker
            w_list.append(220)
        elif ftype == 'white':
            ao_list.append(250) # White fur marker
            w_list.append(240)
        else: # orange
            ao_list.append(160) # Orange coat marker
            w_list.append(180)

    total_count = len(points)
    print(f"Final Bengal Tiger point count: {total_count}")
    print(f"Final Eye vertices count: {len(eye_indices)}")

    # Check hotspots
    for h in HOTSPOTS:
        hx, hy, hz = h['a']
        hr = h['r']
        count = 0
        for (x, y, z) in points:
            px = abs(x) if h['side'] else x
            dist = math.hypot(px - hx, y - hy, z - hz)
            if dist < hr:
                count += 1
        print(f"  -> Hotspot {h['organ']}: {count} vertices (radius {hr})")

    # Quantize and encode to Base64
    pos_bytes = bytearray()
    for (x, y, z) in points:
        ix = max(-32767, min(32767, int(round(x * 20000.0))))
        iy = max(-32767, min(32767, int(round(y * 20000.0))))
        iz = max(-32767, min(32767, int(round(z * 20000.0))))
        pos_bytes.extend(struct.pack('<hhh', ix, iy, iz))

    nrm_bytes = bytearray()
    for (nx, ny, nz) in normals:
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

    tiger_head_payload = {
        'n': total_count,
        'pos': pos_b64,
        'nrm': nrm_b64,
        'ao': ao_b64,
        'w': w_b64,
        'eye': eye_indices,
        'c': 0.0
    }

    with open('scripts/tiger_head_data.json', 'w') as f:
        json.dump(tiger_head_payload, f)
    
    print("Exported scripts/tiger_head_data.json with full 14,500 face points!")

if __name__ == '__main__':
    generate()
