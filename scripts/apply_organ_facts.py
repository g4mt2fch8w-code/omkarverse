#!/usr/bin/env python3
import json

with open('public/js/webgl-engine.js') as f:
    s = f.read()

# 1. Exact 6 Organ Biometric Nodes requested by user
new_hotspots_js = """const _0x2e6c1=[
  {
    'id':'ocelli',
    'icon':'👂',
    'organ':'Kaan (Ears / Pinnae & Ocelli)',
    'hudTitle':'OCELLI // INFRASONIC RADAR',
    'metric':'20 Hz – 65 kHz',
    'fact':"Dual 180° rotatable acoustic pinnae lock onto infrasonic roars up to 3 km away; posterior white 'false eyes' guide cubs through pitch-black bamboo thickets.",
    'hindi':'Kaan ke piche ke white spots (ocelli) raat me ghaney jungle me cubs ko follow karne ke liye "fake eyes" ka kaam karte hain, aur kaan 20 Hz tak ka infrasound 3 km door se sun sakte hain.',
    'a':[0.56,0.72,0.22],
    'r':0.22,
    'side':true,
    'verb':'OCELLI // INFRASONIC RADAR',
    'v':65000,
    'inc':[120,480]
  },
  {
    'id':'vibrissae',
    'icon':'🌾',
    'organ':'Mishi / Whiskers (Vibrissae Array)',
    'hudTitle':'VIBRISSAE // TACTILE PRESSURE SENSORS',
    'metric':'5 μm Sensitivity',
    'fact':'Deeply innervated tactile whiskers detect microscopic air pressure differentials and blade-of-grass deflections, enabling silent stalking through zero-visibility forest undergrowth.',
    'hindi':'Mishi ke roots me high-density nerves hoti hain jo hawa ke halkay se pressure wave aur ghaas ke hilne ko 5 micron ki accuracy se sense karke andhere me bina aawaz ke chalne me madad karti hain.',
    'a':[0.36,-0.16,0.82],
    'r':0.24,
    'side':true,
    'verb':'VIBRISSAE // TACTILE SENSORS',
    'v':5,
    'inc':[1,5]
  },
  {
    'id':'jacobson',
    'icon':'👃',
    'organ':'Naak / Snout (Jacobson’s Organ)',
    'hudTitle':"JACOBSON'S ORGAN // FLEHMEN DECODER",
    'metric':'100M+ Chemoreceptors',
    'fact':'Vomeronasal chemoreception decodes territorial boundary marking, spray signatures, and estrus pheromones scraped into teak bark weeks prior.',
    'hindi':'Flehmen response ke zariye pedo par kiye gaye claw marks aur border spray ke chemical pheromones ko tiger hafto baad bhi sugh kar territory aur rival tiger ki presence decode kar leta hai.',
    'a':[0.00,-0.06,0.96],
    'r':0.20,
    'side':false,
    'verb':"JACOBSON'S // FLEHMEN DECODER",
    'v':100000000,
    'inc':[500000,2000000]
  },
  {
    'id':'stripes',
    'icon':'🧬',
    'organ':'Forehead Stripes (Biometric Cutaneous Matrix)',
    'hudTitle':'BIOMETRIC STRIPE MATRIX // CUTANEOUS ID',
    'metric':'UNIQUE ID: 100% // T-15 (MAYA)',
    'fact':'Zero duplicate pattern in history; every stripe formation is an unforgeable cutaneous biometric signature, forming the algorithmic training core of TIGRIS AI computer vision.',
    'hindi':'Jaise insaan ka fingerprint unique hota hai, waise hi tiger ke forehead stripes 100% unique hote hain — yahi anti-poaching camera traps aur AI software (TIGRIS / ExtractCompare) ka core identifier hai.',
    'a':[0.00,0.48,0.70],
    'r':0.25,
    'side':false,
    'verb':'BIOMETRIC STRIPE MATRIX',
    'v':105,
    'inc':[1,10]
  },
  {
    'id':'canines',
    'icon':'🦷',
    'organ':'Daant / Jabda (Canines & Bite Force)',
    'hudTitle':'MANDIBULAR CANINE LOCK // CRUSHING FORCE',
    'metric':'1,050 PSI // 7.5 cm Lock',
    'fact':'Massive sagittal crest anchors deliver 1,050 PSI crushing pressure through 3-inch surgical canines, severing cervical vertebrae in <0.2 seconds.',
    'hindi':'Sagittal crest (khopdi ki muscle) se aane wala 1,050 PSI ka bite force aur 3-inch ke canines prey ki gardan ki haddi (cervical vertebrae) ko 0.2 second me tod kar paralyze kar dete hain.',
    'a':[0.00,-0.42,0.78],
    'r':0.22,
    'side':false,
    'verb':'MANDIBULAR CANINE LOCK',
    'v':1050,
    'inc':[50,150]
  },
  {
    'id':'tapetum',
    'icon':'👁️',
    'organ':'Aakhein (Eyes / Tapetum Lucidum Gaze)',
    'hudTitle':'TAPETUM LUCIDUM // NOCTURNAL OPTICAL RADAR',
    'metric':'6x Scotopic Gain',
    'fact':'Reflective retinal tapetum doubles photon absorption in starlight; real-time predatory eye tracking locks onto user viewport coordinates.',
    'hindi':'Tiger ki aankhon ke piche tapetum lucidum layer hoti hai jo raat me 6 guna zyada light reflect karti hai (isiliye andhere me aakhein chamakti hain) aur user ke cursor par predator eye-lock banati hai.',
    'a':[0.22,0.18,0.75],
    'r':0.18,
    'side':true,
    'verb':'TAPETUM LUCIDUM // OPTICAL RADAR',
    'v':6,
    'inc':[1,3]
  }
]"""

idx1 = s.find("const _0x2e6c1=")
idx1_end = s.find("],_0x8ea966=", idx1)
s = s[:idx1] + new_hotspots_js + s[idx1_end+1:]
print("Updated _0x2e6c1 hotspots successfully!")

# 2. Update _0x13f45f to render full facts HUD card and NO particle numbers
old_func_start = "function _0x13f45f("
idx_f = s.find(old_func_start)
idx_f_end = s.find("function _0x5b2971", idx_f)

new_func = """function _0x13f45f(_0x1071da,_0x606db6,_0x2ce41a={}){
  if(_0x4a5236['some'](_0x29cca7=>_0x29cca7['zi']===_0x1071da)||_0x4a5236['length']>=1)return;
  if(_0x606db6)_0x2c91e8=true;
  const _0x58b8ae=_0x2e6c1[_0x1071da];
  const [_0xb51c58,_0x4aaa6a]=_0x559dd6(_0x1071da);
  const _0x57eef9=performance['now']();
  
  const _0x40177d=document.createElement('div');
  _0x40177d.className = 'ctr tiger-telemetry-hud';
  _0x40177d.innerHTML = `
    <div class="tiger-hud-header">
      <span class="tiger-hud-icon">${_0x58b8ae.icon}</span>
      <div class="tiger-hud-titles">
        <div class="tiger-hud-organ">${_0x58b8ae.organ}</div>
        <div class="tiger-hud-hudtitle">${_0x58b8ae.hudTitle}</div>
      </div>
      <div class="tiger-hud-metric">${_0x58b8ae.metric}</div>
    </div>
    <div class="tiger-hud-fact">"${_0x58b8ae.fact}"</div>
    <div class="tiger-hud-hindi">
      <span class="hindi-tag">Hindi Samajh:</span> ${_0x58b8ae.hindi}
    </div>
  `;
  _0x2b5fc9.appendChild(_0x40177d);
  
  // Keep card on screen for 10 seconds for comfortable reading, NO particle numbers!
  _0x4a5236.push({
    'zi': _0x1071da,
    'from': 0,
    'to': 0,
    't0': _0x57eef9,
    'idx': [],
    'fs': 18,
    'el': _0x40177d,
    'str': '',
    'x': _0xb51c58,
    'y': _0x4aaa6a,
    'roll': 5000,
    'hold': 6000
  });
  
  _0x4d245a[_0x1071da]=1.0;
  _0x40d7fe=_0x57eef9;
  requestAnimationFrame(()=>_0x40177d.classList.add('on'));
  _0x197d28(0x4b0+_0x1071da*0xa0, 0.05, 'sine', 0.05);
}"""

s = s[:idx_f] + new_func + s[idx_f_end:]
print("Updated _0x13f45f function successfully without particle numbers!")

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(s)
