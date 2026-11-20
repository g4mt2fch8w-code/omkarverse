#!/usr/bin/env python3
import re

with open('public/js/webgl-engine.js', 'r') as f:
    engine_js = f.read()

# 1. Banish ALL BLUE from tiger coloring in Stage 02
old_tiger_col = """if(_0x5f55db===0x2){if(_0x4ab674[_0x44a9f1]){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.00:0.05;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.50:0.90;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.95:1.0;_0x519a5e=_isD?3.8:3.6;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]<0.15){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.04:0.18;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.04:0.14;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.05:0.12;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]>0.82){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.42:0.98;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.46:0.98;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.54:0.98;_0x53dd8b=1.0;}else{const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.96:(1.0+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.44:(0.62+0.06*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.03:(0.08+0.04*_tVar);_0x53dd8b=1.0;}}"""

new_tiger_col = """if(_0x5f55db===0x2){if(_0x4ab674[_0x44a9f1]){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.95:1.0;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.65:0.80;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.04:0.10;_0x519a5e=_isD?3.8:3.6;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]<0.15){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.04:0.08;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.04:0.08;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.05:0.09;_0x53dd8b=1.0;}else if(_0x2a973c[_0x44a9f1]>0.82){_0xc3a33f[0x3*_0x44a9f1]=_isD?0.88:1.0;_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.86:0.98;_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.82:0.95;_0x53dd8b=1.0;}else{const _tVar=0.5+0.5*Math.sin(_0x44a9f1*0.07+_0x40b7a*0.002);_0xc3a33f[0x3*_0x44a9f1]=_isD?0.96:(1.0+0.02*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x1]=_isD?0.46:(0.60+0.06*_tVar);_0xc3a33f[0x3*_0x44a9f1+0x2]=_isD?0.02:(0.05+0.03*_tVar);_0x53dd8b=1.0;}}"""

if old_tiger_col in engine_js:
    engine_js = engine_js.replace(old_tiger_col, new_tiger_col)
    print("1. Replaced tiger color palette: 0% blue, 100% Royal Bengal gold, jet black, and clean cream-white!")
else:
    print("Warning: old_tiger_col not found, searching...")

# 2. Banish blue from eye blend
old_eye_blend = "_0x4ab674[_0x44a9f1]&&_0x37d4fb>0x0&&(_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x2ca603)+_0x41aa08['you'][0x0]*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x2ca603)+_0x41aa08[_0x2361(0x159)][0x1]*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x2ca603)+_0x41aa08['you'][0x2]*_0x2ca603"

new_eye_blend = "_0x4ab674[_0x44a9f1]&&_0x37d4fb>0x0&&(_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x2ca603)+(_0x5f55db===0x2?1.0:_0x41aa08['you'][0x0])*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x2ca603)+(_0x5f55db===0x2?0.78:_0x41aa08[_0x2361(0x159)][0x1])*_0x2ca603,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x2ca603)+(_0x5f55db===0x2?0.08:_0x41aa08['you'][0x2])*_0x2ca603"

if old_eye_blend in engine_js:
    engine_js = engine_js.replace(old_eye_blend, new_eye_blend)
    print("2. Replaced eye blend with pure amber gold!")
else:
    print("Warning: old_eye_blend not found!")

# 3. Banish blue from hotspot pulse glow
old_hs_blend = "_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x407920)+_0x41aa08[_0x2361(0x159)][0x0]*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x407920)+_0x41aa08['you'][0x1]*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x407920)+_0x41aa08['you'][0x2]*_0x407920;"

new_hs_blend = "const _glowR=_0x5f55db===0x2?(!_0x41aa08['add']?0.95:1.0):_0x41aa08[_0x2361(0x159)][0x0],_glowG=_0x5f55db===0x2?(!_0x41aa08['add']?0.50:0.75):_0x41aa08['you'][0x1],_glowB=_0x5f55db===0x2?(!_0x41aa08['add']?0.00:0.08):_0x41aa08['you'][0x2];_0xc3a33f[0x3*_0x44a9f1]=_0xc3a33f[0x3*_0x44a9f1]*(0x1-_0x407920)+_glowR*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x1]=_0xc3a33f[0x3*_0x44a9f1+0x1]*(0x1-_0x407920)+_glowG*_0x407920,_0xc3a33f[0x3*_0x44a9f1+0x2]=_0xc3a33f[0x3*_0x44a9f1+0x2]*(0x1-_0x407920)+_glowB*_0x407920;"

if old_hs_blend in engine_js:
    engine_js = engine_js.replace(old_hs_blend, new_hs_blend)
    print("3. Replaced hotspot glow with fiery golden amber!")
else:
    print("Warning: old_hs_blend not found!")

# 4. Replace _0x2e6c1 with the exact 6 wildlife facts provided by the user
idx_start_array = engine_js.find("const _0x2e6c1=[")
idx_end_array = engine_js.find("],_0x8ea966=new Int8Array")

new_facts_array = """const _0x2e6c1=[
  {
    'id':'ocelli',
    'icon':'👂',
    'organ':'Kaan (Ears / White Ocelli)',
    'hudTitle':'👂 KAAN // WHITE OCELLI & PINNAE',
    'fact':"Tiger ke kaan ke piche do white dhabbe hote hain jinhe 'Ocelli' (False Eyes) kaha jata hai. Ghup andhere jungle me jab mother tigress aage chalti hai, toh cubs inhi do white dhabbon ko dekh kar piche-piche bina bhatke chalte hain. Iske alawa tiger ke dono kaan 180° alag-alag azaad ghoom sakte hain aur 20 Hz tak ka infrasound 3 kilometer door se sun sakte hain.",
    'a':[0.56,0.72,0.22],
    'r':0.22,
    'side':true,
    'verb':'👂 KAAN // WHITE OCELLI',
    'v':65000,
    'inc':[120,480]
  },
  {
    'id':'vibrissae',
    'icon':'🌾',
    'organ':'Mishi (Whiskers / Vibrissae)',
    'hudTitle':'🌾 MISHI // TACTILE VIBRISSAE RADAR',
    'fact':"Tiger ki mishi (whiskers) aam baal nahi hain, balki ek ultra-sensitive tactile radar hain. Inki jado (roots) me high-density nerves hoti hain jo hawa ke microscopic pressure aur sukhi ghaas ke hilne ko 5 micron ki accuracy se sense kar leti hain. Yahi wajah hai ki pitch-black raat me bhi tiger bina kisi ped ya tehni se takraye bilkul silent shikaar ke paas pahunch jata hai.",
    'a':[0.36,-0.16,0.82],
    'r':0.24,
    'side':true,
    'verb':'🌾 MISHI // TACTILE RADAR',
    'v':5,
    'inc':[1,5]
  },
  {
    'id':'jacobson',
    'icon':'👃',
    'organ':"Naak (Nose & Jacobson's Organ)",
    'hudTitle':"👃 NAAK // JACOBSON'S ORGAN & FLEHMEN",
    'fact':"Tiger ke talwe aur naak ke beech ek secret chemical decoder hota hai jise 'Jacobson's Organ' kehte hain. Jab tiger ajeeb sa munh bana kar jeebh bahar nikalta hai (jise Flehmen Response bolte hain), toh wo pedon par kiye gaye claw marks aur border spray ko smell kar raha hota hai — jisse use pata chalta hai ki yeh boundary kis rival tiger ki hai aur wo yahan se kitne din pehle guzra tha.",
    'a':[0.00,-0.06,0.96],
    'r':0.20,
    'side':false,
    'verb':"👃 NAAK // JACOBSON'S ORGAN",
    'v':100000000,
    'inc':[500000,2000000]
  },
  {
    'id':'stripes',
    'icon':'🧬',
    'organ':'Matha (Forehead Stripe Pattern)',
    'hudTitle':'🧬 MATHA // BIOMETRIC STRIPE ID',
    'fact':"Pure vishva me kisi bhi do tigers ke forehead ke stripes kabhi match nahi karte — yeh insaan ke fingerprint ki tarah 100% unique hote hain. Sabse hairatangez baat yeh hai ki agar tiger ke saare baal (fur) shave bhi kar diye jayein, tab bhi uski chamdi (skin) par yahi exact same stripe pattern chhapaa hota hai. Yahi anti-poaching camera traps me AI recognition ka core identifier hai.",
    'a':[0.00,0.48,0.70],
    'r':0.25,
    'side':false,
    'verb':'🧬 MATHA // BIOMETRIC ID',
    'v':105,
    'inc':[1,10]
  },
  {
    'id':'canines',
    'icon':'🦷',
    'organ':'Daant / Jabda (Canines & Sagittal Bite Lock)',
    'hudTitle':'🦷 DAANT & JABDA // 1,050 PSI BITE LOCK',
    'fact':"Bengal Tiger ka bite force 1,050 PSI hota hai (insaan ke bite force se lagbhag 7 guna zyada taaqatvar). Iske 3-inch (7.5 cm) lambe surgical canines shikaar ki trachea (saans ki nali) aur gardan ki haddi (cervical spine) ko direct crush kar dete hain, jisse shikaar 0.2 second ke andar bina aawaz kiye paralyze ho jata hai.",
    'a':[0.00,-0.42,0.78],
    'r':0.22,
    'side':false,
    'verb':'🦷 DAANT // 1,050 PSI LOCK',
    'v':1050,
    'inc':[50,150]
  },
  {
    'id':'tapetum',
    'icon':'👁️',
    'organ':'Aakhein (Eyes & Tapetum Lucidum Gaze)',
    'hudTitle':'👁️ AAKHEIN // TAPETUM LUCIDUM GAZE',
    'fact':"Raat ke andhere me tiger ki dekhne ki shamta insaan se 6 guna zyada hoti hai. Uski retina ke piche 'Tapetum Lucidum' naam ki ek natural reflective mirror layer hoti hai, jo raat me taaron aur chaand ki halki si roshni ko wapas reflect karti hai (isiliye andhere me tiger ki aakhein chamakti hain). Tiger hamesha shikaar ke saath direct eye-contact banakar uske agle move ko mathematically predict karta hai.",
    'a':[0.22,0.18,0.75],
    'r':0.18,
    'side':true,
    'verb':'👁️ AAKHEIN // OPTICAL RADAR',
    'v':6,
    'inc':[1,3]
  }
]"""

if idx_start_array != -1 and idx_end_array != -1:
    engine_js = engine_js[:idx_start_array] + new_facts_array + engine_js[idx_end_array:]
    print("4. Replaced _0x2e6c1 with the exact 6 wildlife facts!")
else:
    print("Warning: _0x2e6c1 bounds not found!")

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(engine_js)

print("Saved updated webgl-engine.js successfully!")
