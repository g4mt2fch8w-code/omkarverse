import json
import math

HOTSPOTS = [
  { 'id': 'ocelli', 'organ': 'OCELLI & PINNAE', 'a': [0.62, 0.78, 0.15], 'r': 0.22, 'side': True },
  { 'id': 'vibrissae', 'organ': 'VIBRISSAE ARRAY', 'a': [0.38, -0.18, 0.78], 'r': 0.24, 'side': True },
  { 'id': 'jacobson', 'organ': "JACOBSON'S ORGAN", 'a': [0.00, -0.08, 0.92], 'r': 0.20, 'side': False },
  { 'id': 'stripes', 'organ': 'FOREHEAD STRIPES', 'a': [0.00, 0.52, 0.68], 'r': 0.25, 'side': False },
  { 'id': 'canines', 'organ': 'MANDIBULAR CANINE LOCK', 'a': [0.00, -0.48, 0.72], 'r': 0.22, 'side': False },
  { 'id': 'tapetum', 'organ': 'TAPETUM LUCIDUM', 'a': [0.24, 0.22, 0.70], 'r': 0.18, 'side': True }
]

def check(pts):
    for h in HOTSPOTS:
        hx, hy, hz = h['a']
        hr = h['r']
        count = 0
        for (x, y, z) in pts:
            px = abs(x) if h['side'] else x
            dist = math.hypot(px - hx, y - hy, z - hz)
            if dist < hr:
                count += 1
        print(f"Hotspot {h['organ']} ({h['id']}): {count} vertices within radius {hr}")

