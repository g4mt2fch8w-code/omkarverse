#!/usr/bin/env python3
import json

with open('public/js/webgl-engine.js') as f:
    s = f.read()

with open('scripts/tiger_head_data.json') as f:
    tiger_data = json.load(f)

# 1. Update HEADS['smooth'] with full 14,500 points
idx_smooth = s.find("'smooth':{")
idx_hair = s.find("'hair':{")

smooth_obj = f"'smooth':{{'n':{tiger_data['n']},'pos':'{tiger_data['pos']}','nrm':'{tiger_data['nrm']}','ao':'{tiger_data['ao']}','w':'{tiger_data['w']}','eye':{json.dumps(tiger_data['eye'])},'c':{tiger_data['c']}}},"
s = s[:idx_smooth] + smooth_obj + s[idx_hair:]
print("Updated HEADS['smooth'] with full 14,500 points!")

# 2. Fix opacity and point size so NO part of the tiger face is dark/hollow/invisible
old_illum = """_0x53dd8b=_0x37d4fb<-0.2?0.03:Math[_0x2361(0x14d)](0x1,0.07+1.1*_0x42cc83+0.4*_0x2a8192),_0x519a5e=0x2*(0.4+1.6*_0x42cc83+0.35*_0x2a8192)*_0x50ba46*_0x3963d3*(0.55+0.45*_0x2e3d9c[_0x44a9f1]),_0x53dd8b*=0.4+0.6*_0x2e3d9c[_0x44a9f1];"""

new_illum = """_0x53dd8b=_0x5f55db===0x2?0.98:(_0x37d4fb<-0.2?0.03:Math[_0x2361(0x14d)](0x1,0.07+1.1*_0x42cc83+0.4*_0x2a8192)),_0x519a5e=_0x5f55db===0x2?(2.9*_0x50ba46):(0x2*(0.4+1.6*_0x42cc83+0.35*_0x2a8192)*_0x50ba46*_0x3963d3*(0.55+0.45*_0x2e3d9c[_0x44a9f1])),_0x5f55db!==0x2&&(_0x53dd8b*=0.4+0.6*_0x2e3d9c[_0x44a9f1]);"""

if old_illum in s:
    s = s.replace(old_illum, new_illum)
    print("Fixed illumination and full face opacity successfully!")
else:
    print("Warning: old_illum string not matched, searching...")
    idx_il = s.find("_0x53dd8b=_0x37d4fb<-0.2")
    print(s[idx_il:idx_il+200])

# 3. Update Day/Night tiger coloring so both modes are rich, bold, and fully visible
old_col = """if(_0x5f55db===0x2){if(_0x4ab674[_0x44a9f1]){_0xc3a33f[0x3*_0x44a9f1]=0.05;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.88;_0xc3a33f[0x3*_0x44a9f1+0x2]=1.0;_0x519a5e=3.2;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]<0.15){_0xc3a33f[0x3*_0x44a9f1]=0.04;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.03;_0xc3a33f[0x3*_0x44a9f1+0x2]=0.03;_0x53dd8b=0.95;}else if(_0x2a973c[_0x44a9f1]>0.82){_0xc3a33f[0x3*_0x44a9f1]=0.98;_0xc3a33f[0x3*_0x44a9f1+0x1]=0.96;_0xc3a33f[0x3*_0x44a9f1+0x2]=0.92;_0x53dd8b=1.0;}else{const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.92:(0.98+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.52:(0.60+0.08*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:(0.05+0.04*_tVar);}}"""

new_col = """if(_0x5f55db===0x2){if(_0x4ab674[_0x44a9f1]){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.02:0.05;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.55:0.90;_0xc3a33f[0x3*_0x44a9f1+0x2]=1.0;_0x519a5e=3.6;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]<0.15){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.08:0.18;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.08:0.14;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.09:0.12;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]>0.82){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.65:0.98;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.68:0.98;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.74:0.98;_0x53dd8b=1.0;}else{const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.94:(1.0+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.48:(0.62+0.06*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.06:(0.08+0.04*_tVar);_0x53dd8b=1.0;}}"""

if old_col in s:
    s = s.replace(old_col, new_col)
    print("Updated Day/Night coloring with high contrast successfully!")
else:
    print("Warning: old_col not matched, searching...")
    idx_col = s.find("if(_0x5f55db===0x2){")
    print(s[idx_col:idx_col+200])

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(s)
