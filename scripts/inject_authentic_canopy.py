#!/usr/bin/env python3
import json
import re

with open('scripts/authentic_canopy_data.json', 'r') as f:
    canopy_data = json.load(f)

with open('public/js/webgl-engine.js', 'r') as f:
    code = f.read()

# 1. Replace HEADS['canopy'] data
canopy_json_str = f"'canopy':{json.dumps(canopy_data)}"

# Find old 'canopy':{...}
p_start = code.find("'canopy':")
if p_start == -1:
    print("Could not find 'canopy': in webgl-engine.js")
    exit(1)

# Find end of canopy object
depth = 0
p_end = -1
for i in range(code.find('{', p_start), len(code)):
    if code[i] == '{':
        depth += 1
    elif code[i] == '}':
        depth -= 1
        if depth == 0:
            p_end = i + 1
            break

code = code[:p_start] + canopy_json_str + code[p_end:]
print("Replaced HEADS['canopy'] with authentic tree crown point cloud!")

# 2. Replace rolling sine wave windSway with natural organic leaf flutter
old_wind = """if(_0x5f55db===0x3){
  const _cTime=_0x40b7a*0.001;
  const _windSway=0.04*Math.sin(2.5*_0x5b87a6+3.0*_0x1834d8+1.8*_cTime);
  _0x5b87a6+=_0x6de5fc[0x3*_0x44a9f1]*_windSway;
  _0x5a2b3b+=_0x6de5fc[0x3*_0x44a9f1+0x1]*_windSway;
  _0x1834d8+=_0x6de5fc[0x3*_0x44a9f1+0x2]*_windSway;
}"""

new_wind = """if(_0x5f55db===0x3){
  const _leafW=_0x2e3d9c[_0x44a9f1];
  if(_leafW>0.3){
    const _flutter=0.006*_leafW*Math.sin(_0x40b7a*0.003+((_0x44a9f1*37)%100)*0.0628);
    _0x5a2b3b+=_flutter;
    _0x5b87a6+=_flutter*0.35;
  }
}"""

if old_wind in code:
    code = code.replace(old_wind, new_wind)
    print("Replaced rolling sine-wave wind with per-leaf canopy flutter!")
else:
    print("WARNING: old_wind pattern not found directly, looking for _windSway")
    # Pattern match
    code = re.sub(
        r'if\(_0x5f55db===0x3\)\{[^}]*_windSway[^}]*\}',
        new_wind,
        code
    )
    print("Replaced via regex!")

# 3. Update the color grading in the particle loop
old_palette_start = code.find("}else if(_0x5f55db===0x3){")
p_brace = code.find("{", old_palette_start)
depth = 1
old_palette_end = -1
for i in range(p_brace + 1, len(code)):
    if code[i] == '{': depth += 1
    elif code[i] == '}':
        depth -= 1
        if depth == 0:
            old_palette_end = i + 1
            break

new_palette = """}else if(_0x5f55db===0x3){
  const _elevNorm=Math.min(1.0,Math.max(0.0,_0x2a973c[_0x44a9f1]));
  const _isHotspot=_0x4ab674[_0x44a9f1];
  const _crownTip=_0x2e3d9c[_0x44a9f1];
  if(_isHotspot){
    const _pulse=0.5+0.5*Math.sin(_0x40b7a*0.008+_0x44a9f1);
    _0xc3a33f[0x3*_0x44a9f1]=1.0;
    _0xc3a33f[0x3*_0x44a9f1+0x1]=0.72+0.20*_pulse;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=0.06;
    _0x519a5e=3.8;
    _0x53dd8b=1.0;
  }else if(_elevNorm<0.14&&_crownTip<0.25){
    _0xc3a33f[0x3*_0x44a9f1]=_isD?0.02:0.04;
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.65:0.80;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.78:0.95;
    _0x519a5e=_isD?2.4:2.2;
    _0x53dd8b=0.96;
  }else if(_crownTip>0.72||_elevNorm>0.68){
    const _sMix=_crownTip;
    _0xc3a33f[0x3*_0x44a9f1]=_isD?(0.82+0.12*_sMix):(0.94+0.06*_sMix);
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?(0.55+0.18*_sMix):(0.72+0.15*_sMix);
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:0.08;
    _0x519a5e=_isD?3.0:2.8;
    _0x53dd8b=0.96;
  }else{
    const _eMix=_elevNorm;
    _0xc3a33f[0x3*_0x44a9f1]=_isD?(0.05+0.18*_eMix):(0.08+0.25*_eMix);
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.68:0.85;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?(0.32-0.12*_eMix):(0.42-0.18*_eMix);
    _0x519a5e=_isD?2.8:2.6;
    _0x53dd8b=0.94;
  }
}"""

code = code[:old_palette_start] + new_palette + code[old_palette_end:]
print("Updated Stage 03 color palette!")

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(code)

print("Saved updated public/js/webgl-engine.js!")
