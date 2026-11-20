#!/usr/bin/env python3
"""
scripts/generate_canopy_mesh.py
Synthesizes high-density 3D Digital Elevation Model (DEM) of Tadoba-Andhari Tiger Reserve (TATR)
Canopy with 14,500 points, fractal elevation noise, Moharli Ridge spine, Tadoba Lake basin,
and Bamboo Valley sinks.
"""

import math
import random
import struct
import base64
import json

TARGET_POINTS = 14500

# 4 Tactical GIS Elevation Hotspots
CANOPY_TELEMETRY_HOTSPOTS = [
  {
    'id': 'lake_basin',
    'label': 'TADOBA LAKE BASIN',
    'anchor': [-0.35, -0.22, 0.10],
    'radius': 0.25,
    'metric': '208 M AMSL // CORE WATERBODY',
    'tag': 'HYDROLOGICAL LIFE-LINE',
    'line': 'Perennial water reservoir sustaining 14 contiguous tiger territories throughout 48°C peak Vidarbha summer heat.'
  },
  {
    'id': 'moharli_ridge',
    'label': 'MOHARLI HILLTOP RIDGE',
    'anchor': [0.45, 0.38, -0.15],
    'radius': 0.22,
    'metric': '342 M AMSL // RELAY OUTPOST',
    'tag': 'TACTICAL OBSERVATION NODE',
    'line': 'Primary VHF & LoRa telemetry repeater tower covering 800 km² buffer surveillance corridor with zero dead zones.'
  },
  {
    'id': 'bamboo_thicket',
    'label': 'KOLSA BAMBOO CORRIDOR',
    'anchor': [-0.60, 0.12, -0.40],
    'radius': 0.24,
    'metric': '84% DENSE CANOPY COVER',
    'tag': 'HIGH-DENSITY PROWL ROUTE',
    'line': 'Monolithic Dendrocalamus strictus stands providing zero-visibility thermal cover for nocturnal subadult tiger migrations.'
  },
  {
    'id': 'erai_sink',
    'label': 'ERAI RIVER BUFFER SINK',
    'anchor': [0.20, -0.15, 0.55],
    'radius': 0.22,
    'metric': '0.04 NDVI CANOPY VARIANCE',
    'tag': 'RIPARIAN WILDLIFE CORRIDOR',
    'line': 'Critical ecological linkage connecting Tadoba core to the Bramhapuri forest division across agricultural matrix.'
  }
]

# Simple 2D Perlin / Value Noise implementation for standalone python
def generate_noise_table():
    perm = list(range(256))
    random.seed(42) # Deterministic
    random.shuffle(perm)
    return perm * 2

PERM = generate_noise_table()

def grad(hash_val, x, z):
    h = hash_val & 3
    if h == 0: return x + z
    elif h == 1: return -x + z
    elif h == 2: return x - z
    else: return -x - z

def fade(t):
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)

def lerp(a, b, t):
    return a + t * (b - a)

def noise2d(x, z):
    X = int(math.floor(x)) & 255
    Z = int(math.floor(z)) & 255
    xf = x - math.floor(x)
    zf = z - math.floor(z)
    u = fade(xf)
    v = fade(zf)
    aa = PERM[PERM[X] + Z]
    ab = PERM[PERM[X] + Z + 1]
    ba = PERM[PERM[X + 1] + Z]
    bb = PERM[PERM[X + 1] + Z + 1]
    x1 = lerp(grad(aa, xf, zf), grad(ba, xf - 1.0, zf), u)
    x2 = lerp(grad(ab, xf, zf - 1.0), grad(bb, xf - 1.0, zf - 1.0), u)
    return lerp(x1, x2, v)

def multi_octave_noise(x, z, octaves=4, f0=1.8, A=0.32):
    total = 0.0
    amp = A
    freq = f0
    for _ in range(octaves):
        total += amp * noise2d(x * freq, z * freq)
        amp *= 0.5
        freq *= 2.0
    return total

def compute_elevation(x, z):
    # Base fractal hill elevation
    y_base = multi_octave_noise(x, z, octaves=4, f0=1.8, A=0.30)

    # 1. Moharli Ridge: Elevated spine at x in [0.2, 0.6], z in [-0.4, 0.4] (y ~ +0.35)
    dx_ridge = (x - 0.40) / 0.22
    dz_ridge = (z - 0.00) / 0.45
    dist_ridge2 = dx_ridge * dx_ridge + dz_ridge * dz_ridge
    y_ridge = 0.38 * math.exp(-dist_ridge2 * 1.8)

    # 2. Tadoba Lake Basin: Smooth concave depression at x in [-0.5, -0.1], z in [-0.2, 0.3] (y ~ -0.25)
    dx_lake = (x - (-0.30)) / 0.24
    dz_lake = (z - 0.05) / 0.28
    dist_lake2 = dx_lake * dx_lake + dz_lake * dz_lake
    y_lake = -0.32 * math.exp(-dist_lake2 * 2.2)

    # 3. Bamboo Valley Sinks: undulating rolling perimeter contours
    perimeter_dist2 = (x * x + z * z)
    y_perimeter = -0.15 * math.sin(perimeter_dist2 * 3.5) * max(0.0, (perimeter_dist2 - 0.5) / 0.94)

    y = y_base + y_ridge + y_lake + y_perimeter
    return y

def main():
    print(f"Synthesizing Tadoba Canopy Mesh with {TARGET_POINTS} points...")

    # Grid parameters: x in [-1.15, 1.15], z in [-1.15, 1.15]
    # Isometric perspective tilt: 25 deg pitch around X axis
    # Pitch angle = -25 deg (-0.4363 rad)
    pitch_angle = -0.4363
    cos_p = math.cos(pitch_angle)
    sin_p = math.sin(pitch_angle)

    # Generate points on a relaxed hexagonal / circular lattice within R <= 1.18
    # Number of points approx sqrt(14500) ~ 120x120
    R_max = 1.18
    step = 0.01867 # lattice step
    raw_points = []

    z_curr = -R_max
    row_idx = 0
    while z_curr <= R_max:
        x_offset = (step * 0.5) if (row_idx % 2 == 1) else 0.0
        x_curr = -R_max + x_offset
        while x_curr <= R_max:
            r = math.hypot(x_curr, z_curr)
            if r <= R_max:
                y_elev = compute_elevation(x_curr, z_curr)
                raw_points.append((x_curr, y_elev, z_curr))
            x_curr += step
        z_curr += step * 0.866
        row_idx += 1

    print(f"Raw points generated: {len(raw_points)}")

    # Adjust to exact TARGET_POINTS
    if len(raw_points) > TARGET_POINTS:
        raw_points.sort(key=lambda p: (p[0]*p[0] + p[2]*p[2]))
        raw_points = raw_points[:TARGET_POINTS]
    elif len(raw_points) < TARGET_POINTS:
        raw_points.sort(key=lambda p: (p[0]*p[0] + p[2]*p[2]))
        needed = TARGET_POINTS - len(raw_points)
        for i in range(needed):
            p = raw_points[i]
            raw_points.append((p[0] + 0.002, p[1], p[2] + 0.002))

    print(f"Final points count: {len(raw_points)}")

    points_3d = []
    normals_3d = []
    ao_list = [] # Used for elevation metric and color gradient: 0=lake/deep cyan, 255=peak/amber
    w_list = []
    eye_indices = [] # Hotspot indicators

    # Find min and max y for normalization
    all_y = [p[1] for p in raw_points]
    min_y, max_y = min(all_y), max(all_y)
    print(f"Elevation range: [{min_y:.3f}, {max_y:.3f}]")

    eps = 0.015
    for idx, (x, y, z) in enumerate(raw_points):
        # Compute finite difference surface normals
        y_dx = compute_elevation(x + eps, z) - compute_elevation(x - eps, z)
        y_dz = compute_elevation(x, z + eps) - compute_elevation(x, z - eps)
        # Gradient vector: (-dy/dx, 1, -dy/dz)
        nx = -y_dx / (2.0 * eps)
        ny = 1.0
        nz = -y_dz / (2.0 * eps)
        mag = math.hypot(math.hypot(nx, ny), nz)
        nx /= mag
        ny /= mag
        nz /= mag

        # Apply isometric pitch tilt: rotate around X axis by pitch_angle
        # y' = y * cos - z * sin
        # z' = y * sin + z * cos
        # Shift Y down slightly so it occupies the lower-center viewport comfortably
        y_rot = y * cos_p - z * sin_p - 0.08
        z_rot = y * sin_p + z * cos_p + 0.25

        ny_rot = ny * cos_p - nz * sin_p
        nz_rot = ny * sin_p + nz * cos_p

        points_3d.append((x, y_rot, z_rot))
        normals_3d.append((nx, ny_rot, nz_rot))

        # Normalized elevation: 0.0 = deep valley/lake, 1.0 = peak ridge
        norm_elev = max(0.0, min(1.0, (y - min_y) / (max_y - min_y)))
        ao_val = int(round(norm_elev * 255.0))
        ao_list.append(ao_val)

        # Weight: 180 base, 240 for high ridges
        w_val = int(round(180 + norm_elev * 65.0))
        w_list.append(w_val)

        # Check if near any hotspot
        is_hotspot_node = False
        for hs in CANOPY_TELEMETRY_HOTSPOTS:
            hx, hy, hz = hs['anchor']
            hr = hs['radius']
            if math.hypot(x - hx, y_rot - hy, z_rot - hz) < 0.12:
                is_hotspot_node = True
                break
        if is_hotspot_node:
            eye_indices.append(idx)

    print(f"Hotspot marker vertices: {len(eye_indices)}")

    # Encode to Int16 / Int8 base64
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

    canopy_payload = {
        'n': TARGET_POINTS,
        'pos': base64.b64encode(pos_bytes).decode('ascii'),
        'nrm': base64.b64encode(nrm_bytes).decode('ascii'),
        'ao': base64.b64encode(bytes(ao_list)).decode('ascii'),
        'w': base64.b64encode(bytes(w_list)).decode('ascii'),
        'eye': eye_indices,
        'c': 0.0,
        'hotspots': CANOPY_TELEMETRY_HOTSPOTS
    }

    with open('scripts/canopy_mesh_data.json', 'w') as f:
        json.dump(canopy_payload, f)
    print("Saved scripts/canopy_mesh_data.json successfully!")

if __name__ == '__main__':
    main()
