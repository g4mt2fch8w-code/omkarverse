#!/usr/bin/env python3
import json

with open('public/js/webgl-engine.js') as f:
    engine_src = f.read()

with open('scripts/tiger_head_data.json') as f:
    tiger_data = json.load(f)

# 1. Update HEADS['smooth']
idx_smooth = engine_src.find("'smooth':{")
idx_hair = engine_src.find("'hair':{")

smooth_obj_str = f"'smooth':{{'n':{tiger_data['n']},'pos':'{tiger_data['pos']}','nrm':'{tiger_data['nrm']}','ao':'{tiger_data['ao']}','w':'{tiger_data['w']}','eye':{json.dumps(tiger_data['eye'])},'c':{tiger_data['c']}}},"
engine_src = engine_src[:idx_smooth] + smooth_obj_str + engine_src[idx_hair:]
print("Updated HEADS['smooth'] successfully!")

# 2. Reset initial yaw from -1.45 to 0.0
engine_src = engine_src.replace('_0x5c04fc=-1.45', '_0x5c04fc=0.0')
print("Reset initial yaw to 0.0!")

# 3. Replace target yaw calculation to keep tiger 100% FRONT-FACING (0° Yaw)
old_yaw_calc = """let _0x431e20=-1.45*_0x28c169,_0x4ca3b0=0x0;const _0x43ef46=_0x40b7a-_0x26e44a>0x3a98&&_0x5f55db===0x3&&_0x2c8658[_0x2361(0xfa)]==='wait';if(_0x43ef46)_0x431e20=-0.9+0.12*Math[_0x2361(0x136)](_0x40b7a/0xa28),_0x4ca3b0=0.12;else{if(_0x5b59e9['on']&&!_0x18ab5f)_0x431e20+=(0x1-_0x28c169)*_0x5b59e9['x']*0.7,_0x4ca3b0+=(0x1-_0x28c169)*_0x5b59e9['y']*0.32;else _0x420853['on']&&(_0x121031||_0x18ab5f)?(_0x431e20+=(0x1-_0x28c169)*Math['max'](-0.65,Math['min'](0.65,(_0x420853['x']-_0x22e323['cx'])/_0x230601*1.7)),_0x4ca3b0+=(0x1-_0x28c169)*Math['max'](-0.32,Math['min'](0.32,(_0x420853['y']-_0x22e323['cy'])/_0x118624*1.1))):(_0x431e20+=(0x1-_0x28c169)*0.2*Math['sin'](_0x40b7a/0x8fc));}"""

new_yaw_calc = """let _0x431e20=0.0,_0x4ca3b0=0.0;if(_0x5b59e9['on']&&!_0x18ab5f){_0x431e20=_0x5b59e9['x']*0.45;_0x4ca3b0=_0x5b59e9['y']*0.25;}else if(_0x420853['on']&&(_0x121031||_0x18ab5f)){_0x431e20=Math['max'](-0.45,Math['min'](0.45,(_0x420853['x']-_0x22e323['cx'])/_0x230601*1.2));_0x4ca3b0=Math['max'](-0.25,Math['min'](0.25,(_0x420853['y']-_0x22e323['cy'])/_0x118624*0.8));}else{_0x431e20=0.04*Math['sin'](_0x40b7a/0xa28);_0x4ca3b0=0.02*Math['cos'](_0x40b7a/0xd48);}"""

if old_yaw_calc in engine_src:
    engine_src = engine_src.replace(old_yaw_calc, new_yaw_calc)
    print("Replaced yaw calculation successfully!")
else:
    print("Warning: old_yaw_calc string not matched exactly, checking substring...")
    idx_y = engine_src.find("let _0x431e20=")
    print(engine_src[idx_y:idx_y+200])

# 4. Enhance Stage 02 coloring: Onyx Black Stripes, Glowing Amber Tapetum Eyes, Gleaming White Whiskers/Canines
old_color_block = """if(_0x5f55db===0x2){const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.88:(0.98+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.50:(0.64+0.12*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:(0.06+0.05*_tVar);}"""

new_color_block = """if(_0x5f55db===0x2){if(_0x4ab674[_0x44a9f1]){_0xc3a33f[0x3*_0x44a9f1]=1.0;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.85;_0xc3a33f[0x3*_0x44a9f1+0x2]=0.08;_0x519a5e=3.2;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]<0.15){_0xc3a33f[0x3*_0x44a9f1]=0.04;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.03;_0xc3a33f[0x3*_0x44a9f1+0x2]=0.03;_0x53dd8b=0.95;}else if(_0x2a973c[_0x44a9f1]>0.82){_0xc3a33f[0x3*_0x44a9f1]=0.98;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.96;_0xc3a33f[0x3*_0x44a9f1+0x2]=0.92;_0x53dd8b=1.0;}else{const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.92:(0.98+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.52:(0.60+0.08*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:(0.05+0.04*_tVar);}}"""

if old_color_block in engine_src:
    engine_src = engine_src.replace(old_color_block, new_color_block)
    print("Replaced Stage 02 color block successfully!")
else:
    print("Warning: old_color_block not matched exactly")

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(engine_src)

print("All front-facing tiger adjustments written to public/js/webgl-engine.js!")
