#!/usr/bin/env python3
"""
scripts/generate_banyan_tree.py
Generates an authentic, breathtaking 3D Banyan Tree (Ficus benghalensis) point cloud (14,500 points):
- Gnarled fluted central trunk with bark texture
- Iconic vertical prop roots (pillar aerial roots) descending from high boughs into the earth
- Expansive radiating horizontal limbs and branch network
- Volumetric parasol canopy domes with multilayered leaf clusters
- Rich dual-tone palette: warm bark bronze/amber to vibrant jungle emeralds & golden crests
"""

import math
import random
import struct
import base64
import json

TARGET_POINTS = 14500
random.seed(108)

points = []

# ==============================================================================
# 1. CENTRAL MAIN TRUNK (Fluted, gnarled, ancient)
# ==============================================================================
# Trunk height from y = -0.85 to y = -0.15
# Trunk radius flares at base (buttress roots) from r = 0.22 at base to 0.12 at main branch split
NUM_TRUNK_POINTS = 2400
for _ in range(NUM_TRUNK_POINTS):
    t = random.uniform(0.0, 1.0)
    y = -0.85 + t * 0.70 # y in [-0.85, -0.15]
    
    # Fluted buttress base
    flare = 1.0 + 1.8 * math.exp(-t * 4.5)
    base_r = (0.13 - 0.03 * t) * flare
    
    # Fluting ridges (5-6 natural vertical grooves)
    angle = random.uniform(0, 2 * math.pi)
    flute = 1.0 + 0.18 * math.sin(5.0 * angle + y * 4.0) + 0.08 * math.cos(3.0 * angle - y * 6.0)
    
    # Bark surface with micro-jitter
    r = base_r * flute + random.gauss(0, 0.005)
    
    # Slight ancient lean and twist
    cx = 0.04 * math.sin(y * 2.2)
    cz = 0.03 * math.cos(y * 2.0)
    
    px = cx + math.cos(angle) * r
    pz = cz + math.sin(angle) * r
    py = y
    
    # Normals point outward
    nx = math.cos(angle)
    ny = 0.15
    nz = math.sin(angle)
    nlen = math.hypot(math.hypot(nx, ny), nz)
    
    # AO: 0-60 for bark (bronze/brown tones)
    ao = int(round(30 + 35 * t + random.uniform(-5, 5)))
    w = 0 # Trunk is completely anchored, 0 wind sway!
    
    points.append({
        'pos': (px, py, pz),
        'norm': (nx/nlen, ny/nlen, nz/nlen),
        'ao': ao,
        'w': w,
        'type': 'trunk'
    })

# ==============================================================================
# 2. PILLAR PROP ROOTS (Aerial Roots touching ground)
# ==============================================================================
# 8-10 major descending pillar prop roots and 12-14 thinner hanging roots
PROP_ROOT_POSITIONS = [
    # (x_bough, z_bough, start_y, x_ground, z_ground, thickness, num_pts)
    (-0.35, -0.15, 0.10, -0.38, -0.18, 0.038, 280),
    (0.38, -0.12, 0.12, 0.42, -0.14, 0.036, 280),
    (-0.25, 0.32, 0.08, -0.28, 0.35, 0.032, 260),
    (0.30, 0.30, 0.10, 0.34, 0.32, 0.034, 260),
    (-0.55, 0.05, 0.22, -0.58, 0.08, 0.030, 240),
    (0.55, 0.08, 0.25, 0.60, 0.10, 0.032, 240),
    (0.05, -0.42, 0.15, 0.06, -0.46, 0.028, 220),
    (-0.08, 0.48, 0.18, -0.10, 0.52, 0.028, 220),
    # Additional thinner hanging curtain roots
    (-0.18, -0.28, 0.20, -0.19, -0.30, 0.016, 140),
    (0.20, -0.25, 0.22, 0.22, -0.26, 0.016, 140),
    (-0.42, -0.30, 0.28, -0.44, -0.32, 0.018, 150),
    (0.45, -0.28, 0.28, 0.48, -0.30, 0.018, 150),
    (-0.38, 0.20, 0.26, -0.40, 0.22, 0.016, 130),
    (0.40, 0.22, 0.28, 0.42, 0.24, 0.016, 130),
    (0.00, 0.38, 0.30, 0.00, 0.40, 0.018, 140)
]

for xb, zb, y_top, xg, zg, thick, count in PROP_ROOT_POSITIONS:
    for _ in range(count):
        t = random.uniform(0.0, 1.0) # 0 at bottom, 1 at top
        py = -0.85 + t * (y_top - (-0.85))
        
        # Slight twisting cable curve
        curl_x = 0.015 * math.sin(t * 8.0)
        curl_z = 0.015 * math.cos(t * 8.0)
        
        rx_center = xg + t * (xb - xg) + curl_x
        rz_center = zg + t * (zb - zg) + curl_z
        
        angle = random.uniform(0, 2 * math.pi)
        # Thicker at base where it roots into ground
        cur_thick = thick * (1.0 + 0.8 * math.exp(-t * 4.0))
        dist = random.uniform(0.5, 1.0) * cur_thick
        
        px = rx_center + math.cos(angle) * dist
        pz = rz_center + math.sin(angle) * dist
        
        nx = math.cos(angle)
        ny = 0.1
        nz = math.sin(angle)
        nlen = math.hypot(nx, nz) or 1.0
        
        # Prop roots: glowing amber/bronze filaments (AO 45-80)
        ao = int(round(45 + 35 * t + random.uniform(-4, 4)))
        w = int(round(t * 50)) # Very slight sway at upper ends only
        
        points.append({
            'pos': (px, py, pz),
            'norm': (nx/nlen, ny, nz/nlen),
            'ao': ao,
            'w': w,
            'type': 'prop_root'
        })

print(f"Points after trunk & prop roots: {len(points)}")

# ==============================================================================
# 3. PRIMARY RADIATING LIMBS & BRANCH BOUGHS
# ==============================================================================
# 6 major limbs branching horizontally outward from central trunk
NUM_BRANCH_POINTS = 3200
MAIN_BOUGHS = [
    # (angle_deg, pitch_deg, length, start_r, end_r)
    (25, 18, 0.82, 0.09, 0.035),
    (85, 22, 0.86, 0.09, 0.035),
    (145, 16, 0.78, 0.08, 0.032),
    (205, 20, 0.88, 0.09, 0.036),
    (265, 18, 0.84, 0.08, 0.034),
    (325, 24, 0.90, 0.09, 0.036)
]

branch_pts_per_bough = NUM_BRANCH_POINTS // len(MAIN_BOUGHS)
bough_ends = []

for b_idx, (b_ang_deg, b_pitch_deg, b_len, r_start, r_end) in enumerate(MAIN_BOUGHS):
    b_rad = math.radians(b_ang_deg)
    b_pitch = math.radians(b_pitch_deg)
    
    start_x = 0.0
    start_y = -0.15
    start_z = 0.0
    
    for _ in range(branch_pts_per_bough):
        t = random.uniform(0.0, 1.0) # distance along branch
        
        # S-curve bough arch (rises, then dips under heavy canopy weight)
        arch_y = math.sin(t * math.pi) * 0.12 - 0.04 * (t**2)
        
        dist = t * b_len
        bx = start_x + math.cos(b_rad) * dist * math.cos(b_pitch)
        bz = start_z + math.sin(b_rad) * dist * math.cos(b_pitch)
        by = start_y + dist * math.sin(b_pitch) + arch_y
        
        # Branch radius tapers with distance
        r_cur = r_start * (1 - t) + r_end * t
        
        # Ring distribution around limb
        th = random.uniform(0, 2 * math.pi)
        dr = random.uniform(0.7, 1.0) * r_cur
        
        px = bx + (-math.sin(b_rad) * math.cos(th) * dr)
        pz = bz + (math.cos(b_rad) * math.cos(th) * dr)
        py = by + math.sin(th) * dr
        
        nx = px - bx
        ny = py - by
        nz = pz - bz
        nlen = math.hypot(math.hypot(nx, ny), nz) or 1.0
        
        # AO 70-130: Transitional limb bronze to deep forest bark
        ao = int(round(70 + 60 * t + random.uniform(-6, 6)))
        w = int(round(t * 110)) # Outer branches sway lightly
        
        points.append({
            'pos': (px, py, pz),
            'norm': (nx/nlen, ny/nlen, nz/nlen),
            'ao': ao,
            'w': w,
            'type': 'branch'
        })
    
    # Store end of bough for foliage clusters
    end_x = start_x + math.cos(b_rad) * b_len * math.cos(b_pitch)
    end_z = start_z + math.sin(b_rad) * b_len * math.cos(b_pitch)
    end_y = start_y + b_len * math.sin(b_pitch) + 0.08
    bough_ends.append((end_x, end_y, end_z))

print(f"Points after limbs: {len(points)}")

# ==============================================================================
# 4. VOLUMETRIC PARASOL LEAF CANOPY (Emerald foliage & golden sunlit crests)
# ==============================================================================
# Banyan canopy forms a vast, wide, domed parasol spreading outward (R up to 1.15)
REMAINING_POINTS = TARGET_POINTS - len(points)
print(f"Generating {REMAINING_POINTS} canopy foliage points...")

# Foliage cluster centers: 6 around bough ends, plus 12 secondary outer clusters, plus 1 large crown center
CROWN_CLUSTERS = []
# Central top crown
CROWN_CLUSTERS.append({'x': 0.0, 'y': 0.48, 'z': 0.0, 'rx': 0.42, 'ry': 0.22, 'rz': 0.42, 'weight': 1.6})

# Major bough end clusters
for bx, by, bz in bough_ends:
    CROWN_CLUSTERS.append({'x': bx, 'y': by + 0.08, 'z': bz, 'rx': 0.34, 'ry': 0.18, 'rz': 0.34, 'weight': 1.0})

# Mid-tier foliage pads between boughs
for i in range(10):
    ang = (i / 10.0) * 2 * math.pi + 0.3
    r_pad = random.uniform(0.45, 0.85)
    px = math.cos(ang) * r_pad
    pz = math.sin(ang) * r_pad
    py = random.uniform(0.18, 0.42)
    CROWN_CLUSTERS.append({'x': px, 'y': py, 'z': pz, 'rx': random.uniform(0.24, 0.36), 'ry': 0.16, 'rz': random.uniform(0.24, 0.36), 'weight': 0.9})

# Distribute remaining points into these organic leaf clusters
weights = [c['weight'] for c in CROWN_CLUSTERS]
total_w = sum(weights)

for _ in range(REMAINING_POINTS):
    # Pick a cluster weighted
    rnd = random.uniform(0, total_w)
    accum = 0.0
    cluster = CROWN_CLUSTERS[0]
    for c in CROWN_CLUSTERS:
        accum += c['weight']
        if rnd <= accum:
            cluster = c
            break
    
    # Sample point inside cluster ellipsoid (denser on surface)
    theta = random.uniform(0, 2 * math.pi)
    phi = random.uniform(-0.3, math.pi * 0.5) # Upper dome bias
    rad = random.uniform(0.4, 1.05) ** 0.5 # Surface concentration
    
    px = cluster['x'] + math.cos(theta) * math.cos(phi) * cluster['rx'] * rad + random.gauss(0, 0.012)
    pz = cluster['z'] + math.sin(theta) * math.cos(phi) * cluster['rz'] * rad + random.gauss(0, 0.012)
    py = cluster['y'] + math.sin(phi) * cluster['ry'] * rad + random.gauss(0, 0.010)
    
    # Normals point outward from cluster center
    nx = px - cluster['x']
    ny = py - cluster['y']
    nz = pz - cluster['z']
    nlen = math.hypot(math.hypot(nx, ny), nz) or 1.0
    
    # Height normalized: y in [-0.85, 0.65]
    h_norm = max(0.0, min(1.0, (py - (-0.15)) / (0.65 - (-0.15))))
    
    # AO: 160-255 for leaf canopy (emerald foliage to golden sunlit crests)
    # Crown peaks (high py) get AO > 220 (Solar Amber crests)
    ao = int(round(160 + 95 * h_norm + random.uniform(-8, 8)))
    ao = max(140, min(255, ao))
    
    # Foliage sway weight: upper leaves have responsive flutter (w = 180-255)
    w = int(round(180 + 75 * h_norm))
    
    points.append({
        'pos': (px, py, pz),
        'norm': (nx/nlen, ny/nlen, nz/nlen),
        'ao': ao,
        'w': w,
        'type': 'foliage'
    })

print(f"Total points generated: {len(points)}")

# Trim or pad to exact TARGET_POINTS
if len(points) > TARGET_POINTS:
    points = points[:TARGET_POINTS]
elif len(points) < TARGET_POINTS:
    needed = TARGET_POINTS - len(points)
    for i in range(needed):
        p = points[i]
        points.append({
            'pos': (p['pos'][0] + 0.002, p['pos'][1], p['pos'][2] + 0.002),
            'norm': p['norm'],
            'ao': p['ao'],
            'w': p['w'],
            'type': p['type']
        })

# Beacon hotspot points: Highlight sacred banyan prop roots & crown node
HOTSPOT_ANCHORS = [
    (0.0, 0.52, 0.0),    # Sacred Crown Crest
    (-0.35, -0.15, 0.10), # West Pillar Prop Root
    (0.38, -0.12, 0.12),  # East Pillar Prop Root
    (0.0, -0.75, 0.0)     # Ancient Root Foundation
]

eye_indices = []
for hx, hy, hz in HOTSPOT_ANCHORS:
    dists = []
    for idx, p in enumerate(points):
        px, py, pz = p['pos']
        d = math.hypot(math.hypot(px - hx, py - hy), pz - hz)
        dists.append((d, idx))
    dists.sort()
    for _, idx in dists[:16]:
        eye_indices.append(idx)

# Pack into Int16 / Int8 buffers
pos_bytes = bytearray()
nrm_bytes = bytearray()
ao_list = []
w_list = []

for p in points:
    px, py, pz = p['pos']
    nx, ny, nz = p['norm']
    
    ix = max(-32767, min(32767, int(round(px * 20000.0))))
    iy = max(-32767, min(32767, int(round(py * 20000.0))))
    iz = max(-32767, min(32767, int(round(pz * 20000.0))))
    pos_bytes.extend(struct.pack('<hhh', ix, iy, iz))
    
    inx = max(-127, min(127, int(round(nx * 127.0))))
    iny = max(-127, min(127, int(round(ny * 127.0))))
    inz = max(-127, min(127, int(round(nz * 127.0))))
    nrm_bytes.extend(struct.pack('<bbb', inx, iny, inz))
    
    ao_list.append(p['ao'])
    w_list.append(p['w'])

payload = {
    'n': TARGET_POINTS,
    'pos': base64.b64encode(pos_bytes).decode('ascii'),
    'nrm': base64.b64encode(nrm_bytes).decode('ascii'),
    'ao': base64.b64encode(bytes(ao_list)).decode('ascii'),
    'w': base64.b64encode(bytes(w_list)).decode('ascii'),
    'eye': eye_indices,
    'c': 0.0
}

with open('scripts/banyan_tree_data.json', 'w') as f:
    json.dump(payload, f)

print(f"Successfully generated authentic 3D Banyan Tree with {TARGET_POINTS} points and {len(eye_indices)} beacon points!")
