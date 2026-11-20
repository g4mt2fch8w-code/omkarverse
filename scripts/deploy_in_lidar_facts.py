import json
import subprocess

# Reset from git HEAD first to ensure clean state
subprocess.run(['git', 'checkout', 'HEAD', '--', 'public/js/webgl-engine.js'], check=True)

with open('public/js/webgl-engine.js', 'r') as f:
    js = f.read()

# 1. Replace HEADS['smooth'] with full tiger face points
with open('scripts/tiger_head_data.json', 'r') as f:
    tiger_data = json.load(f)

idx_smooth = js.find("'smooth':{")
idx_hair = js.find("'hair':{")
smooth_obj = f"'smooth':{{'n':{tiger_data['n']},'pos':'{tiger_data['pos']}','nrm':'{tiger_data['nrm']}','ao':'{tiger_data['ao']}','w':'{tiger_data['w']}','eye':{json.dumps(tiger_data['eye'])},'c':{tiger_data['c']}}},"
js = js[:idx_smooth] + smooth_obj + js[idx_hair:]
print('1. Replaced HEADS["smooth"] with full tiger face!')

# 2. Replace _0x2e6c1 with the exact 6 organs, max 2 lines in English (NO NUMBERS)
idx_2e = js.find('const _0x2e6c1=[')
idx_2e_end = js.find(',_0x8ea966=new Int8Array')

new_2e6c1 = '''const _0x2e6c1=[
  {
    'id':'ocelli',
    'organ':'OCELLI & PINNAE',
    'a':[0.56,0.72,0.22],
    'r':0.22,
    'side':true,
    'verb':'Dual 180° rotatable acoustic pinnae lock infrasound up to 3 km.<br>Posterior white ocelli guide cubs through zero-light thickets.'
  },
  {
    'id':'vibrissae',
    'organ':'VIBRISSAE ARRAY',
    'a':[0.36,-0.16,0.82],
    'r':0.24,
    'side':true,
    'verb':'Tactile whiskers detect microscopic air pressure differentials.<br>Enables silent stalking through zero-visibility undergrowth.'
  },
  {
    'id':'jacobson',
    'organ':"JACOBSON'S ORGAN",
    'a':[0.00,-0.06,0.96],
    'r':0.20,
    'side':false,
    'verb':"Vomeronasal Jacobson's organ decodes territorial spray.<br>Identifies rival scent trails and claw marks weeks prior."
  },
  {
    'id':'stripes',
    'organ':'BIOMETRIC STRIPE ID',
    'a':[0.00,0.48,0.70],
    'r':0.25,
    'side':false,
    'verb':'100% unique cutaneous biometric stripe matrix.<br>Zero duplicate patterns in history, training TIGRIS AI.'
  },
  {
    'id':'canines',
    'organ':'MANDIBULAR CANINE LOCK',
    'a':[0.00,-0.42,0.78],
    'r':0.22,
    'side':false,
    'verb':'1,050 PSI crushing bite force delivered through 3-inch canines.<br>Severing cervical vertebrae in under 0.2 seconds.'
  },
  {
    'id':'tapetum',
    'organ':'TAPETUM LUCIDUM GAZE',
    'a':[0.22,0.18,0.75],
    'r':0.18,
    'side':true,
    'verb':'Reflective retinal tapetum doubles starlight photon absorption.<br>Predatory binocular gaze locks onto real-time coordinates.'
  }
]'''

js = js[:idx_2e] + new_2e6c1 + js[idx_2e_end:]
print('2. Updated _0x2e6c1 with max 2-line English telemetry facts!')

# 3. Replace _0x13f45f, _0x5b2971, _0xb498b5, _0x3e5fcb
# Only show fact WHILE pointer is hovering; dismiss immediately when pointer leaves
idx_13 = js.find('function _0x13f45f(')
idx_13_end = js.find('function _0x483c2c(', idx_13)

new_13f_and_3e = '''let _currentHoveredOrgan = -1;

function _showOrganFact(_idx){
  if(_currentHoveredOrgan === _idx && _0x4a5236.length > 0){
    _0x4a5236[0].t0 = performance.now() - 250;
    _0x4d245a[_idx] = 1.0;
    return;
  }
  _currentHoveredOrgan = _idx;
  _0x13f45f(_idx, true);
}

function _hideOrganFact(){
  if(_currentHoveredOrgan === -1 && _0x4a5236.length === 0) return;
  _currentHoveredOrgan = -1;
  _0xb498b5();
}

function _0x13f45f(_0x1071da,_0x606db6,_0x2ce41a={}){
  while(_0x4a5236.length){
    const _old=_0x4a5236.pop();
    if(_old && _old.el) _old.el.remove();
  }
  if(_0x606db6)_0x2c91e8=true;
  const _organ=_0x2e6c1[_0x1071da];
  const [_b51c58,_4aaa6a]=_0x559dd6(_0x1071da);
  const _57eef9=performance.now();

  const _el=document.createElement('div');
  _el.className='ctr mono';
  _el.innerHTML=_organ.verb;
  _0x2b5fc9.appendChild(_el);

  _0x4a5236.push({
    'zi': _0x1071da,
    't0': _57eef9,
    'el': _el,
    'x': _b51c58,
    'y': _4aaa6a,
    'box': null
  });

  _0x4d245a.fill(0);
  _0x4d245a[_0x1071da]=1.0;
  _0x40d7fe=_57eef9;
  requestAnimationFrame(()=>_el.classList.add('on'));
  if(typeof _0x197d28==='function')_0x197d28(0x4b0+_0x1071da*0x80,0.04,'sine',0.04);
}
function _0x5b2971(_0x32e678){
  if(_0x32e678 && _0x32e678.el){
    _0x32e678.el.classList.remove('on');
    setTimeout(()=>{ if(_0x32e678.el) _0x32e678.el.remove(); }, 200);
  }
}
function _0xb498b5(){
  while(_0x4a5236.length){
    const _it=_0x4a5236.pop();
    _0x5b2971(_it);
  }
}
function _0x3e5fcb(_0x11dec0){
  for(let _i=_0x4a5236.length-1;_i>=0;_i--){
    const _item=_0x4a5236[_i];
    const _elapsed=_0x11dec0-_item.t0;

    // Update projected 3D coordinates every frame
    const [_projX,_projY]=_0x559dd6(_item.zi);
    _item.x=Math.max(140,Math.min(_0x230601-140,_projX));
    _item.y=Math.max(60,Math.min(_0x118624-60,_projY));
    if(_item.el){
      _item.el.style.transform='translate(' + _item.x + 'px, ' + _item.y + 'px)';
    }

    // Carve out the negative space box in the LiDAR point cloud around the text
    const _fade=Math.min(1.0, _elapsed/180.0);
    const _elW=(_item.el && _item.el.offsetWidth) || 280;
    const _elH=(_item.el && _item.el.offsetHeight) || 40;
    const _padX=24;
    const _padY=14;
    _item.box=[
      _item.x - _elW/2 - _padX,
      _item.y - _elH/2 - _padY,
      _item.x + _elW/2 + _padX,
      _item.y + _elH/2 + _padY,
      _fade
    ];
  }
  for(let _k=0;_k<_0x4d245a.length;_k++)_0x4d245a[_k]*=0.95;
  // NOTE: No background auto-cycling! Only shows while pointer is hovering on the organ!
}
'''

js = js[:idx_13] + new_13f_and_3e + js[idx_13_end:]
print('3. Updated _0x13f45f and _0x3e5fcb for pointer-hover only interaction!')

# 4. Update pointermove hover tracking
idx_pm = js.find("if(_0x5f55db===0x2&&_0x5078f5===_0x2361(0xf1)&&performance['now']()-_0x40d7fe>0x1c2){const _0xef2f95=_0x483c2c(_0x3e7f0e[_0x2361(0x177)],_0x3e7f0e['clientY'],0x3c);if(_0xef2f95>=0x0)_0x13f45f(_0xef2f95,!![]);}")
new_pm = "if(_0x5f55db===0x2&&_0x5078f5===_0x2361(0xf1)){const _hIdx=_0x483c2c(_0x3e7f0e[_0x2361(0x177)],_0x3e7f0e['clientY'],85);if(_hIdx>=0){_showOrganFact(_hIdx);}else{_hideOrganFact();}}"

if idx_pm != -1:
    js = js.replace("if(_0x5f55db===0x2&&_0x5078f5===_0x2361(0xf1)&&performance['now']()-_0x40d7fe>0x1c2){const _0xef2f95=_0x483c2c(_0x3e7f0e[_0x2361(0x177)],_0x3e7f0e['clientY'],0x3c);if(_0xef2f95>=0x0)_0x13f45f(_0xef2f95,!![]);}", new_pm)
    print('4. Hooked up real-time hover tracking to pointermove!')
else:
    print('WARNING: idx_pm not found')

# In pointerleave, hide organ fact
idx_pl = js.find("document['documentElement']['addEventListener']('pointerleave',_0x5d8817=>{if(_0x5d8817['pointerType']===_0x2361(0xd7))_0x420853['on']=![];});")
new_pl = "document['documentElement']['addEventListener']('pointerleave',_0x5d8817=>{if(_0x5d8817['pointerType']===_0x2361(0xd7)){_0x420853['on']=![];if(typeof _hideOrganFact==='function')_hideOrganFact();}});"

if idx_pl != -1:
    js = js.replace("document['documentElement']['addEventListener']('pointerleave',_0x5d8817=>{if(_0x5d8817['pointerType']===_0x2361(0xd7))_0x420853['on']=![];});", new_pl)
    print('4b. Hooked up pointerleave dismissal!')
else:
    print('WARNING: idx_pl not found')

# 5. Update Stage 02 colors & remove blue
idx_col_start = js.find('if(_0x5f55db===0x2){')
idx_col_end = js.find('else if(_0x5f55db===0x3){', idx_col_start)

new_col = '''if(_0x5f55db===0x2){
  if(_0x4ab674[_0x44a9f1]){
    // Radiant amber topaz gaze - ZERO BLUE!
    _0xc3a33f[0x3*_0x44a9f1]=_isD?0.88:1.00;
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.55:0.78;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.02:0.08;
    _0x519a5e=_isD?3.8:3.6;
    _0x53dd8b=1.0;
  }else if(_0x2a973c[_0x44a9f1]<0.10){
    // Solid obsidian black stripes
    _0xc3a33f[0x3*_0x44a9f1]=_isD?0.08:0.10;
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.08:0.09;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.10:0.08;
    _0x519a5e=_isD?3.2:3.0;
    _0x53dd8b=0.98;
  }else if(_0x2a973c[_0x44a9f1]>0.75){
    // Clean cream ivory white fur (whiskers, cheek ruffs, chin) - ZERO BLUE!
    _0xc3a33f[0x3*_0x44a9f1]=_isD?0.85:1.00;
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.83:0.98;
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.80:0.95;
    _0x519a5e=_isD?3.2:3.2;
    _0x53dd8b=1.0;
  }else{
    // Royal Bengal golden amber coat - solid and full
    const _t=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);
    _0xc3a33f[0x3*_0x44a9f1]=_isD?0.96:(1.00+0.02*_t);
    _0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.48:(0.60+0.08*_t);
    _0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:(0.04+0.04*_t);
    _0x519a5e=_isD?3.4:3.2;
    _0x53dd8b=1.0;
  }
}'''

js = js[:idx_col_start] + new_col + js[idx_col_end:]
print('5. Updated Stage 02 coloring with authentic Bengal tiger palette!')

# 6. Negative space box clearing right before saving _0x33bb20 and _0x236d95
old_save = "_0x33bb20[_0x44a9f1]=_0x519a5e,_0x236d95[_0x44a9f1]=_0x53dd8b;"
new_save = """for(let _bIdx=0;_bIdx<_0x4a5236.length;_bIdx++){
  const _b=_0x4a5236[_bIdx].box;
  if(_b && !_0x4ab674[_0x44a9f1] && _0x4496e9[2*_0x44a9f1]>_b[0] && _0x4496e9[2*_0x44a9f1]<_b[2] && _0x4496e9[2*_0x44a9f1+1]>_b[1] && _0x4496e9[2*_0x44a9f1+1]<_b[3]){
    _0x53dd8b *= Math.max(0.0, 1.0 - 0.96 * _b[4]);
    _0x519a5e *= Math.max(0.2, 1.0 - 0.7 * _b[4]);
  }
}
_0x33bb20[_0x44a9f1]=_0x519a5e;
_0x236d95[_0x44a9f1]=_0x53dd8b;"""

if old_save in js:
    js = js.replace(old_save, new_save)
    print('6. Attached guaranteed negative space box clearing to point output!')
else:
    print('WARNING: old_save not matched')

# 7. Lively interactive spring repulsion physics on Stage 02 ("with apne points wali physics")
# Change (_0x5f55db===0x2?0.6:...) to (_0x5f55db===0x2?2.0:...)
js = js.replace("(_0x5f55db===0x2?0.6:", "(_0x5f55db===0x2?2.0:")
print('7. Enabled lively spring repulsion physics on Stage 02!')

# 8. Fix hotspot pulse color so it pulses in golden amber flame, not blue!
js = js.replace("_0x41aa08['you'][0x0]*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x407920)+_0x41aa08['you'][0x1]*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x407920)+_0x41aa08['you'][0x2]*_0x407920",
                "(_0x5f55db===0x2?1.0:_0x41aa08['you'][0x0])*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x407920)+(_0x5f55db===0x2?0.75:_0x41aa08['you'][0x1])*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x407920)+(_0x5f55db===0x2?0.0:_0x41aa08['you'][0x2])*_0x407920")

# 9. Eye blink blend: replace blue with golden amber
js = js.replace("_0x4ab674[_0x44a9f1]&&_0x37d4fb>0x0&&(_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x2ca603)+_0x41aa08['you'][0x0]*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x2ca603)+_0x41aa08['you'][0x1]*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x2ca603)+_0x41aa08['you'][0x2]*_0x2ca603",
                "_0x4ab674[_0x44a9f1]&&_0x37d4fb>0x0&&(_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x2ca603)+(_0x5f55db===0x2?1.0:_0x41aa08['you'][0x0])*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x2ca603)+(_0x5f55db===0x2?0.78:_0x41aa08['you'][0x1])*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x2ca603)+(_0x5f55db===0x2?0.08:_0x41aa08['you'][0x2])*_0x2ca603")

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(js)

print('Successfully written updated public/js/webgl-engine.js!')
