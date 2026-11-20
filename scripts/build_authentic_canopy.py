#!/usr/bin/env python3
"""
scripts/build_authentic_canopy.py
Builds an authentic 3D LiDAR Forest Canopy point cloud (14,500 points) of Tadoba-Andhari
Tiger Reserve from NASA SRTM elevation data + procedural multilayer tree crowns.
"""

import math
import random
import struct
import base64
import json

TARGET_POINTS = 14500

with open('public/tatr_full_dossier.json', 'r') as f:
    tatr_data = json.load(f)

elevation_grid = tatr_data['elevation_grid']
N = len(elevation_grid) # 80

# Bilinear interpolation of terrain elevation
def get_terrain_elev(u, v):
    u = max(0.0, min(1.0, u))
    v = max(0.0, min(1.0, v))
    x = u * (N - 1)
    z = v * (N - 1)
    i0 = int(math.floor(x))
    i1 = min(N - 1, i0 + 1)
    j0 = int(math.floor(z))
    j1 = min(N - 1, j0 + 1)
    fx = x - i0
    fz = z - j0
    e00 = elevation_grid[i0][j0]
    e10 = elevation_grid[i1][j0]
    e01 = elevation_grid[i0][j1]
    e11 = elevation_grid[i1][j1]
    return (e00 * (1 - fx) + e10 * fx) * (1 - fz) + (e01 * (1 - fx) + e11 * fx) * fz

# Seed for reproducible organic forest distribution
random.seed(42)

# Generate ~350 individual 3D tree crowns across the Tadoba terrain
# Each tree has (cx, cz, radius, height, species: 'teak', 'bamboo', 'mahua')
trees = []
for _ in range(420):
    u = random.uniform(0.08, 0.92)
    v = random.uniform(0.08, 0.92)
    elev = get_terrain_elev(u, v)
    
    # Tadoba / Telia Lake basins (elev < 215m) are open water - NO tall trees in water!
    is_water = elev < 215.0
    if is_water and random.random() < 0.88:
        continue # Leave lake basin open
    
    # Tree dimensions in normalized space
    t_radius = random.uniform(0.035, 0.085)
    t_height = random.uniform(0.06, 0.14) if not is_water else 0.02
    t_type = random.choice(['teak', 'teak', 'bamboo', 'bamboo', 'mahua'])
    
    # Normalized coordinates centered at [-0.85, 0.85]
    cx = (u - 0.5) * 1.8
    cz = (v - 0.5) * 1.8
    trees.append({
        'u': u, 'v': v, 'cx': cx, 'cz': cz,
        'elev': elev, 'r': t_radius, 'h': t_height,
        'type': t_type, 'is_water': is_water
    })

print(f"Generated {len(trees)} tree crown clusters.")

points_raw = []

# 1. Distribute points into tree crowns (organic volumetric leaf canopy)
points_per_tree = int(TARGET_POINTS * 0.72) // len(trees) # ~25 points per tree
for tree in trees:
    base_y = (tree['elev'] - 200.0) * 0.0035 - 0.15
    for _ in range(points_per_tree):
        # Sample points on domed tree canopy (semi-ellipsoid)
        theta = random.uniform(0, 2 * math.pi)
        phi = random.uniform(0, math.pi * 0.5) # Upper hemisphere
        r_frac = random.uniform(0.65, 1.05) # Volume fill + crown perimeter
        
        px = tree['cx'] + math.cos(theta) * math.sin(phi) * tree['r'] * r_frac
        pz = tree['cz'] + math.sin(theta) * math.sin(phi) * tree['r'] * r_frac
        # Crown dome height
        py = base_y + math.cos(phi) * tree['h'] * r_frac + random.gauss(0, 0.006)
        
        # Normals point outward from crown center
        nx = px - tree['cx']
        ny = py - base_y
        nz = pz - tree['cz']
        n_len = math.hypot(math.hypot(nx, ny), nz) or 1.0
        
        # Color tier / AO:
        # 1.0 = crown peak (sunlit amber), 0.5 = mid canopy (emerald), 0.2 = understory
        crown_frac = max(0.0, min(1.0, (py - base_y) / max(0.01, tree['h'])))
        elev_norm = max(0.0, min(1.0, (tree['elev'] - 208.0) / (382.0 - 208.0)))
        
        ao = int(round((0.35 * crown_frac + 0.65 * elev_norm) * 255.0))
        # Weight controls foliage density / sway responsiveness:
        # Crown tips (high crown_frac) sway slightly in breeze; trunks do not
        w = int(round(crown_frac * 255.0))
        
        points_raw.append({
            'pos': (px, py, pz),
            'norm': (nx / n_len, ny / n_len, nz / n_len),
            'ao': ao,
            'w': w,
            'is_water': tree['is_water'],
            'is_hotspot': False
        })

# 2. Add ground terrain / waterbody surface points (~28% of total)
remaining_points = TARGET_POINTS - len(points_raw)
for _ in range(remaining_points):
    u = random.uniform(0.02, 0.98)
    v = random.uniform(0.02, 0.98)
    elev = get_terrain_elev(u, v)
    is_water = elev < 215.0
    
    px = (u - 0.5) * 1.8 + random.gauss(0, 0.004)
    pz = (v - 0.5) * 1.8 + random.gauss(0, 0.004)
    py = (elev - 200.0) * 0.0035 - 0.15 + (0.002 if is_water else random.gauss(0, 0.005))
    
    elev_norm = max(0.0, min(1.0, (elev - 208.0) / (382.0 - 208.0)))
    ao = int(round(elev_norm * 180.0 if not is_water else 25.0)) # low AO = deep water cyan
    w = 0 # Ground points have 0 sway!
    
    points_raw.append({
        'pos': (px, py, pz),
        'norm': (0.0, 1.0, 0.0),
        'ao': ao,
        'w': w,
        'is_water': is_water,
        'is_hotspot': False
    })

print(f"Total points generated: {len(points_raw)}")

# Trim or pad to exact TARGET_POINTS
if len(points_raw) > TARGET_POINTS:
    points_raw = points_raw[:TARGET_POINTS]
elif len(points_raw) < TARGET_POINTS:
    needed = TARGET_POINTS - len(points_raw)
    for i in range(needed):
        p = points_raw[i]
        points_raw.append({
            'pos': (p['pos'][0] + 0.002, p['pos'][1], p['pos'][2] + 0.002),
            'norm': p['norm'],
            'ao': p['ao'],
            'w': p['w'],
            'is_water': p['is_water'],
            'is_hotspot': False
        })

# Hotspot anchors in normalized space
HOTSPOTS = [
    {"id": "lake_basin", "pos": (-0.25, -0.10, 0.10)},
    {"id": "moharli_ridge", "pos": (0.35, 0.25, -0.15)},
    {"id": "kolsa_bamboo", "pos": (-0.45, 0.05, -0.30)},
    {"id": "erai_sink", "pos": (0.15, -0.08, 0.40)}
]

eye_indices = []
for hs in HOTSPOTS:
    hx, hy, hz = hs['pos']
    # Find 15 closest points around this hotspot
    dists = []
    for idx, p in enumerate(points_raw):
        px, py, pz = p['pos']
        d = math.hypot(math.hypot(px - hx, py - hy), pz - hz)
        dists.append((d, idx))
    dists.sort()
    for _, idx in dists[:16]:
        points_raw[idx]['is_hotspot'] = True
        eye_indices.append(idx)

# Pack into Int16 / Int8 buffers
pos_bytes = bytearray()
nrm_bytes = bytearray()
ao_list = []
w_list = []

for p in points_raw:
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

with open('scripts/authentic_canopy_data.json', 'w') as f:
    json.dump(payload, f)

print(f"Successfully created authentic canopy payload with {TARGET_POINTS} points and {len(eye_indices)} beacon points!")
