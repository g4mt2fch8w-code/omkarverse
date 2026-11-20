#!/usr/bin/env python3
"""
scripts/deploy_canopy_stage03.py
Deterministic injection of Stage 03 Tadoba Canopy Topographic Mesh.
"""

import json

print("Reading scripts/canopy_mesh_data.json...")
with open('scripts/canopy_mesh_data.json', 'r') as f:
    canopy_data = json.load(f)

with open('public/js/webgl-engine.js', 'r') as f:
    js = f.read()

# 1. Update HEADS to include 'canopy'
# Find the exact ending of 'smooth'
idx_heads = js.find("HEADS={'smooth':")
idx_heads_end = js.find(";((async()", idx_heads)

# In HEADS: {'smooth': {...}}
# Replace the trailing "}}" of HEADS with "},'canopy':{...}}"
idx_smooth_close = js.rfind("}}", idx_heads, idx_heads_end)
canopy_block = f",\n'canopy':{{'n':{canopy_data['n']},'pos':'{canopy_data['pos']}','nrm':'{canopy_data['nrm']}','ao':'{canopy_data['ao']}','w':'{canopy_data['w']}','eye':{json.dumps(canopy_data['eye'])},'c':0.0}}"
js = js[:idx_smooth_close+1] + canopy_block + js[idx_smooth_close+1:]
print("HEADS['canopy'] added!")

# 2. Add CANOPY_TELEMETRY_HOTSPOTS and shockwave helper functions
hotspots_code = f"""
// ==============================================================================
// STAGE 03: TADOBA CANOPY TOPOGRAPHIC MESH & SEISMIC SHOCKWAVE STATE
// ==============================================================================
const CANOPY_TELEMETRY_HOTSPOTS = {json.dumps(canopy_data['hotspots'])};
let _canopyShockwave = {{ active: false, cx: 0, cy: 0, t0: 0, A: 65.0, v: 480.0, sigma: 55.0 }};
let _currentCanopyHotspot = -1;

function _triggerSeismicShockwave(clientX, clientY) {{
  _canopyShockwave.active = true;
  _canopyShockwave.cx = clientX;
  _canopyShockwave.cy = clientY;
  _canopyShockwave.t0 = performance.now();
  if (typeof _0x197d28 === 'function') {{
    _0x197d28(75, 0.55, 'triangle', 0.12);
    setTimeout(() => _0x197d28(50, 0.40, 'sine', 0.08), 80);
  }}
}}

function _projectCanopyHotspot(idx) {{
  const hs = CANOPY_TELEMETRY_HOTSPOTS[idx];
  if (!hs) return [0, 0];
  const [hx, hy, hz] = hs.anchor;
  return _0x43daca(hx, hy - _0x3b7332, hz);
}}

function _checkCanopyHotspot(clientX, clientY, maxDist) {{
  let bestIdx = -1, bestDist = maxDist || 90;
  for (let i = 0; i < CANOPY_TELEMETRY_HOTSPOTS.length; i++) {{
    const [px, py] = _projectCanopyHotspot(i);
    const d = Math.hypot(px - clientX, py - clientY);
    if (d < bestDist) {{
      bestDist = d;
      bestIdx = i;
    }}
  }}
  return bestIdx;
}}

function _showCanopyHotspotFact(idx) {{
  if (_currentCanopyHotspot === idx && _0x4a5236.length > 0) {{
    _0x4a5236[0].t0 = performance.now() - 250;
    return;
  }}
  _currentCanopyHotspot = idx;
  const hs = CANOPY_TELEMETRY_HOTSPOTS[idx];
  const [px, py] = _projectCanopyHotspot(idx);
  
  while (_0x4a5236.length) {{
    const old = _0x4a5236.pop();
    if (old && old.el) old.el.remove();
  }}

  const el = document.createElement('div');
  el.className = 'ctr mono';
  el.style.maxWidth = '360px';
  el.innerHTML = '<span style="color:#FFB800;font-weight:700;letter-spacing:0.1em;">' + hs.label + '</span> · <span style="color:#10B981;">' + hs.metric + '</span><br>' + hs.line;
  _0x2b5fc9.appendChild(el);

  _0x4a5236.push({{
    zi: -1,
    t0: performance.now(),
    el: el,
    x: px,
    y: py,
    box: null,
    isCanopy: true,
    hsIdx: idx
  }});

  requestAnimationFrame(() => el.classList.add('on'));
  if (typeof _0x197d28 === 'function') _0x197d28(520 + idx * 80, 0.04, 'sine', 0.05);
}}

function _hideCanopyHotspotFact() {{
  if (_currentCanopyHotspot === -1 && _0x4a5236.length === 0) return;
  _currentCanopyHotspot = -1;
  _0xb498b5();
}}
"""

idx_show = js.find("function _showOrganFact")
js = js[:idx_show] + hotspots_code + "\n" + js[idx_show:]
print("Canopy Hotspots logic injected!")

# 3. Update scene transition in _0x5b5393
scene_target = "if(_0xdab3cb===0x2){if(!_0x5a6dd5||_0x5078f5==='heart')_0x10cc46();else{if(_0x5078f5!=='head'){_0x5078f5='head';const _0x32dc9a=performance['now']();for(let _0x4c3a69=0x0;_0x4c3a69<_0x4b167d;_0x4c3a69++){_0x2ca817[_0x4c3a69]=_0x32dc9a+Math['random']()*0x320,_0x3206a8[0x2*_0x4c3a69]=_0x4496e9[0x2*_0x4c3a69],_0x3206a8[0x2*_0x4c3a69+0x1]=_0x4496e9[0x2*_0x4c3a69+0x1],_0x3738c6['set'](_0x41aa08['site'],_0x4c3a69*0x3),_0xd1e705[_0x4c3a69]=0x0;}}}}"
scene_replacement = """if(_0xdab3cb===0x2){
  if(_0x40bc95!=='smooth'&&typeof _0x367953==='function')_0x367953('smooth');
  if(!_0x5a6dd5||_0x5078f5==='heart')_0x10cc46();
  else if(_0x5078f5!=='head'){
    _0x5078f5='head';
    const _0x32dc9a=performance['now']();
    for(let _0x4c3a69=0x0;_0x4c3a69<_0x4b167d;_0x4c3a69++){
      _0x2ca817[_0x4c3a69]=_0x32dc9a+Math['random']()*0x320;
      _0x3206a8[0x2*_0x4c3a69]=_0x4496e9[0x2*_0x4c3a69];
      _0x3206a8[0x2*_0x4c3a69+0x1]=_0x4496e9[0x2*_0x4c3a69+0x1];
      _0x3738c6['set'](_0x41aa08['site'],_0x4c3a69*0x3);
      _0xd1e705[_0x4c3a69]=0x0;
    }
  }
}
if(_0xdab3cb===0x3){
  if(_0x40bc95!=='canopy'&&typeof _0x367953==='function')_0x367953('canopy');
  _0x5078f5='head';
  _0x5a6dd5=true;
  _0x2144fe=0.4;
  const _cNow=performance.now();
  for(let _ci=0;_ci<_0x4b167d;_ci++){
    _0x2ca817[_ci]=_cNow+Math.random()*250;
    _0x3206a8[2*_ci]=_0x4496e9[2*_ci];
    _0x3206a8[2*_ci+1]=_0x4496e9[2*_ci+1];
  }
}"""

js = js.replace(scene_target, scene_replacement)
js = js.replace("if(_0xdab3cb===0x3||_0xdab3cb===0x4){_0x1e9f7b(),_0x5a6dd5=!![],_0x5078f5='line'", "if(_0xdab3cb===0x4){_0x1e9f7b(),_0x5a6dd5=!![],_0x5078f5='line'")
print("Scene transition in _0x5b5393 updated!")

# 4. Click shockwave in _0x5af738
click_target = "if(_0x5f55db===0x3&&(_0x2c8658[_0x2361(0xfa)]==='wait'||_0x2c8658['phase']==='rest')){_0x2c8658[_0x2361(0xfa)]=_0x2361(0x186),_0x2c8658['t0']=performance[_0x2361(0x151)]()-0x960,_0x197d28(0x294,0.2,'sine',0.08);return;}"
click_replacement = "if(_0x5f55db===0x3){ _triggerSeismicShockwave(_0x56e61a,_0x32b2a2); return; }"
js = js.replace(click_target, click_replacement)
print("Click shockwave updated!")

# 5. Pointermove hover tracking on Stage 03
pm_target = "if(_0x5f55db===0x2&&_0x5078f5===_0x2361(0xf1)){const _hIdx=_0x483c2c(_0x3e7f0e[_0x2361(0x177)],_0x3e7f0e['clientY'],85);if(_hIdx>=0){_showOrganFact(_hIdx);}else{_hideOrganFact();}}})"
pm_replacement = "if(_0x5f55db===0x2&&_0x5078f5===_0x2361(0xf1)){const _hIdx=_0x483c2c(_0x3e7f0e[_0x2361(0x177)],_0x3e7f0e['clientY'],85);if(_hIdx>=0){_showOrganFact(_hIdx);}else{_hideOrganFact();}}else if(_0x5f55db===0x3){const _chIdx=_checkCanopyHotspot(_0x3e7f0e.clientX,_0x3e7f0e.clientY,85);if(_chIdx>=0){_showCanopyHotspotFact(_chIdx);}else{_hideCanopyHotspotFact();}}})"
js = js.replace(pm_target, pm_replacement)
print("Pointermove hover tracking updated!")

# 6. Pointerleave hiding
pl_target = "if(_0x5d8817['pointerType']===_0x2361(0xd7)){_0x420853['on']=![];if(typeof _hideOrganFact==='function')_hideOrganFact();}"
pl_replacement = "if(_0x5d8817['pointerType']===_0x2361(0xd7)){_0x420853['on']=![];if(typeof _hideOrganFact==='function')_hideOrganFact();if(typeof _hideCanopyHotspotFact==='function')_hideCanopyHotspotFact();}"
js = js.replace(pl_target, pl_replacement)

# 7. Projected coordinates in _0x3e5fcb
cb_target = "const [_projX,_projY]=_0x559dd6(_item.zi);"
cb_replacement = "const [_projX,_projY]=_item.isCanopy?_projectCanopyHotspot(_item.hsIdx):_0x559dd6(_item.zi);"
js = js.replace(cb_target, cb_replacement)

# 8. Add wind sway in 3D vertex transform
sway_target = "const _0x5b87a6=_0xffdf09[0x3*_0x44a9f1],_0x5a2b3b=_0xffdf09[0x3*_0x44a9f1+0x1],_0x1834d8=_0xffdf09[0x3*_0x44a9f1+0x2],"
sway_replacement = """let _0x5b87a6=_0xffdf09[0x3*_0x44a9f1],_0x5a2b3b=_0xffdf09[0x3*_0x44a9f1+0x1],_0x1834d8=_0xffdf09[0x3*_0x44a9f1+0x2];
if(_0x5f55db===0x3){
  const _cTime=_0x40b7a*0.001;
  const _windSway=0.04*Math.sin(2.5*_0x5b87a6+3.0*_0x1834d8+1.8*_cTime);
  _0x5b87a6+=_0x6de5fc[0x3*_0x44a9f1]*_windSway;
  _0x5a2b3b+=_0x6de5fc[0x3*_0x44a9f1+0x1]*_windSway;
  _0x1834d8+=_0x6de5fc[0x3*_0x44a9f1+0x2]*_windSway;
}
"""
js = js.replace(sway_target, sway_replacement)
print("Wind sway in 3D transform loop added!")

# 9. Seismic shockwave in particle physics loop
shock_target = "if(_0x116f97)_0x39a341[_0x24d291]-=_0x116f97*0.05*_0xa8f36f[_0x3a1117];"
shock_replacement = """if(_0x116f97)_0x39a341[_0x24d291]-=_0x116f97*0.05*_0xa8f36f[_0x3a1117];
if(_0x5f55db===0x3&&_canopyShockwave.active){
  const _st=(performance.now()-_canopyShockwave.t0)/1000.0;
  if(_st<0.62){
    const _sdx=_0x18a179[_0x337e42]-_canopyShockwave.cx;
    const _sdy=_0x18a179[_0x24d291]-_canopyShockwave.cy;
    const _sdist=Math.hypot(_sdx,_sdy)||1.0;
    const _swaveFront=_canopyShockwave.v*_st;
    const _sdelta=_sdist-_swaveFront;
    const _sforce=_canopyShockwave.A*Math.exp(-(_sdelta*_sdelta)/(2.0*_canopyShockwave.sigma*_canopyShockwave.sigma));
    _0x39a341[_0x337e42]+=(_sdx/_sdist)*_sforce*0.14;
    _0x39a341[_0x24d291]+=((_sdy/_sdist)*_sforce-_sforce*0.35)*0.14;
  }else{
    _canopyShockwave.active=false;
  }
}
"""
js = js.replace(shock_target, shock_replacement)
print("Seismic shockwave particle physics added!")

# 10. Dual-Tone Tactical Foliage Palette
color_target = "else if(_0x5f55db===0x3){const _gVar=0.5+0.5*Math.sin(_0x44a9f1*0.08+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.04:(0.06+0.04*_gVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.65:(0.82+0.14*_gVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.28:(0.42+0.12*_gVar);}"
color_replacement = """else if(_0x5f55db===0x3){
  // Dual-Tone Tactical Foliage Palette
  const _elev = Math.min(1.0, Math.max(0.0, _0x2a973c[_0x44a9f1]));
  const _isHotspot = _0x4ab674[_0x44a9f1];
  
  if(_isHotspot){
    // Pulsing Solar Amber Hotspot Beacon (#FFB800)
    const _pulse = 0.5 + 0.5*Math.sin(_0x40b7a*0.008 + _0x44a9f1);
    _0xc3a33f[0x3*_0x44a9f1] = _isD ? 0.95 : 1.00;
    _0xc3a33f[0x3*_0x44a9f1+0x1] = _isD ? (0.50 + 0.25*_pulse) : (0.72 + 0.20*_pulse);
    _0xc3a33f[0x3*_0x44a9f1+0x2] = _isD ? 0.05 : 0.08;
    _0x519a5e = _isD ? 4.2 : 4.0;
    _0x53dd8b = 1.0;
  } else if(_elev > 0.65){
    // Moharli Ridge Peaks & Contour Lines: Sharp Solar Amber (#FFB800)
    const _pMix = (_elev - 0.65) / 0.35;
    _0xc3a33f[0x3*_0x44a9f1] = _isD ? (0.85 + 0.10*_pMix) : (0.95 + 0.05*_pMix);
    _0xc3a33f[0x3*_0x44a9f1+0x1] = _isD ? (0.45 + 0.15*_pMix) : (0.65 + 0.15*_pMix);
    _0xc3a33f[0x3*_0x44a9f1+0x2] = _isD ? 0.04 : (0.05 + 0.10*_pMix);
    _0x519a5e = _isD ? 3.2 : 3.0;
    _0x53dd8b = 0.96;
  } else if(_elev < 0.28){
    // Tadoba Lake Basin & Deep Valleys: Luminous Deep Cyan / Emerald (#10B981 to #06B6D4)
    const _lMix = _elev / 0.28;
    _0xc3a33f[0x3*_0x44a9f1] = _isD ? 0.02 : (0.04 + 0.04*_lMix);
    _0xc3a33f[0x3*_0x44a9f1+0x1] = _isD ? (0.55 + 0.15*_lMix) : (0.75 + 0.15*_lMix);
    _0xc3a33f[0x3*_0x44a9f1+0x2] = _isD ? (0.40 + 0.20*_lMix) : (0.60 + 0.25*(1.0-_lMix));
    _0x519a5e = _isD ? 3.0 : 2.8;
    _0x53dd8b = 0.95;
  } else {
    // Bamboo Valley Sinks: Lush Emerald Forest Canopy (#10B981)
    const _bMix = (_elev - 0.28) / 0.37;
    _0xc3a33f[0x3*_0x44a9f1] = _isD ? (0.06 + 0.25*_bMix) : (0.08 + 0.35*_bMix);
    _0xc3a33f[0x3*_0x44a9f1+0x1] = _isD ? 0.65 : 0.82;
    _0xc3a33f[0x3*_0x44a9f1+0x2] = _isD ? (0.28 - 0.10*_bMix) : (0.40 - 0.20*_bMix);
    _0x519a5e = _isD ? 2.8 : 2.6;
    _0x53dd8b = 0.92;
  }
}"""
js = js.replace(color_target, color_replacement)
print("Dual-tone tactical foliage coloring updated!")

# 11. Also update rotation in Stage 03 to gentle 2.3 deg contour scan
rot_target = "const _tigerSway=_0x5f55db===0x2?0.0698*Math.sin(_0x40b7a*0.00075):0.0;"
rot_replacement = "const _tigerSway=_0x5f55db===0x2?0.0698*Math.sin(_0x40b7a*0.00075):(_0x5f55db===0x3?0.04*Math.sin(_0x40b7a*0.0005):0.0);"
js = js.replace(rot_target, rot_replacement)

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(js)

print("public/js/webgl-engine.js deployed successfully!")
