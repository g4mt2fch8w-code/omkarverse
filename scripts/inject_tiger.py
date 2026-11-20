#!/usr/bin/env python3
import json

with open('public/js/webgl-engine.js') as f:
    engine_src = f.read()

# Make backup
with open('public/js/webgl-engine.js.bak', 'w') as f:
    f.write(engine_src)

with open('scripts/tiger_head_data.json') as f:
    tiger_data = json.load(f)

# 1. Replace HEADS['smooth']
idx_smooth = engine_src.find("'smooth':{")
idx_hair = engine_src.find("'hair':{")

smooth_obj_str = f"'smooth':{{'n':{tiger_data['n']},'pos':'{tiger_data['pos']}','nrm':'{tiger_data['nrm']}','ao':'{tiger_data['ao']}','w':'{tiger_data['w']}','eye':{json.dumps(tiger_data['eye'])},'c':{tiger_data['c']}}},"

engine_src = engine_src[:idx_smooth] + smooth_obj_str + engine_src[idx_hair:]

# 2. Replace _0x2e6c1 with the 6 biometric organ hotspots
idx_hotspots = engine_src.find("const _0x2e6c1=")
idx_hotspots_end = engine_src.find("],_0x8ea966=", idx_hotspots)

new_hotspots_js = """const _0x2e6c1=[
  {
    'id':'ocelli',
    'organ':'OCELLI & PINNAE',
    'a':[0.62,0.78,0.15],
    'r':0.22,
    'side':true,
    'verb':'OCELLI & PINNAE',
    'metric':'20 Hz – 65 kHz',
    'tag':'INFRASONIC TELEMETRY',
    'line':'Dual 180° rotatable acoustic pinnae lock onto infrasonic roars up to 3 km away; posterior white \\'false eyes\\' guide cubs through zero-light bamboo thickets.',
    'fx':'pulse-ear',
    'v':65000,
    'inc':[120,480]
  },
  {
    'id':'vibrissae',
    'organ':'VIBRISSAE ARRAY',
    'a':[0.38,-0.18,0.78],
    'r':0.24,
    'side':true,
    'verb':'VIBRISSAE ARRAY',
    'metric':'5 μm Sensitivity',
    'tag':'TACTILE PRESSURE SENSORS',
    'line':'Follicular nerve plexus detects microscopic air pressure waves and blade-of-grass deflections, guiding silent stalking through dense forest undergrowth.',
    'fx':'whisker-vibe',
    'v':5,
    'inc':[1,5]
  },
  {
    'id':'jacobson',
    'organ':"JACOBSON'S ORGAN",
    'a':[0.00,-0.08,0.92],
    'r':0.20,
    'side':false,
    'verb':"JACOBSON'S ORGAN",
    'metric':'100M+ Chemoreceptors',
    'tag':'FLEHMEN PHEROMONE DECODER',
    'line':'Vomeronasal chemoreception decodes territorial boundary marking, spray signatures, and estrus pheromones scraped into teak bark weeks prior.',
    'fx':'chemical-glow',
    'v':100000000,
    'inc':[500000,2000000]
  },
  {
    'id':'stripes',
    'organ':'FOREHEAD STRIPES',
    'a':[0.00,0.52,0.68],
    'r':0.25,
    'side':false,
    'verb':'FOREHEAD STRIPES',
    'metric':'UNIQUE ID: 100% // T-105',
    'tag':'BIOMETRIC CUTANEOUS MATRIX',
    'line':'Natural cutaneous barcode with zero duplicates across history; forms the algorithmic training core of TIGRIS AI computer vision.',
    'fx':'laser-scan',
    'v':105,
    'inc':[1,10]
  },
  {
    'id':'canines',
    'organ':'MANDIBULAR CANINE LOCK',
    'a':[0.00,-0.48,0.72],
    'r':0.22,
    'side':false,
    'verb':'MANDIBULAR CANINE LOCK',
    'metric':'1,050 PSI // 7.5 cm Lock',
    'tag':'CERVICAL DISLOCATION FORCE',
    'line':'Massive sagittal crest anchors deliver 1,050 PSI crushing pressure through 3-inch surgical canines, severing cervical vertebrae in <0.2 seconds.',
    'fx':'snap-clamp',
    'v':1050,
    'inc':[50,150]
  },
  {
    'id':'tapetum',
    'organ':'TAPETUM LUCIDUM',
    'a':[0.24,0.22,0.70],
    'r':0.18,
    'side':true,
    'verb':'TAPETUM LUCIDUM',
    'metric':'6x Scotopic Gain',
    'tag':'NOCTURNAL OPTICAL RADAR',
    'line':'Reflective retinal layer doubles photon absorption in starlight; real-time predatory eye tracking locks targets with zero visible signature.',
    'fx':'eye-glow',
    'v':6,
    'inc':[1,3]
  }
]"""

engine_src = engine_src[:idx_hotspots] + new_hotspots_js + engine_src[idx_hotspots_end+1:]

# 3. Enhance HUD Card text generation in _0x13f45f
# Find where _0x40177d is constructed
hud_find = "_0x40177d['textContent']=_0x58b8ae[_0x2361(0xcb)]"
if hud_find in engine_src:
    hud_replace = """_0x40177d.className = 'ctr mono tiger-telemetry-hud';
_0x40177d.innerHTML = '<div class="hud-tag">' + (_0x58b8ae['tag'] || 'SENSORY NODE') + '</div><div class="hud-organ">' + (_0x58b8ae['organ'] || _0x58b8ae['verb']) + '</div><div class="hud-metric">' + (_0x58b8ae['metric'] || '') + '</div><div class="hud-line">' + (_0x58b8ae['line'] || '') + '</div>'"""
    engine_src = engine_src.replace(hud_find, hud_replace)
    print("Replaced HUD formatting successfully!")
else:
    print("Warning: hud_find not found, searching alternative...")
    idx_hud = engine_src.find("_0x40177d['textContent']=")
    print("Found at:", idx_hud, engine_src[idx_hud:idx_hud+60])

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(engine_src)

print("Injected Bengal Tiger point cloud & sensory hotspots into public/js/webgl-engine.js!")
