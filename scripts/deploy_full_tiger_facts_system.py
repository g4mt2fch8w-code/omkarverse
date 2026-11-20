#!/usr/bin/env python3
import re

# ==============================================================================
# 1. UPDATE public/js/webgl-engine.js
# ==============================================================================
with open('public/js/webgl-engine.js', 'r') as f:
    js = f.read()

# Make sure window.selectTigerOrgan exists and is wired
organ_func_code = """
window.selectTigerOrgan = function(idx) {
  if (typeof _0x2e6c1 === 'undefined' || idx < 0 || idx >= _0x2e6c1.length) return;
  if (typeof _0x4d245a !== 'undefined') {
    _0x4d245a.fill(0);
    _0x4d245a[idx] = 1.0;
  }
  const btns = document.querySelectorAll('.tiger-organ-btn');
  btns.forEach((b, i) => {
    b.classList.toggle('active', i === idx);
    b.setAttribute('aria-selected', String(i === idx));
  });
  const organ = _0x2e6c1[idx];
  const iconEl = document.getElementById('factIcon');
  const titleEl = document.getElementById('factTitle');
  const bodyEl = document.getElementById('factBody');
  const cardEl = document.getElementById('tigerFactCard');
  if (iconEl && titleEl && bodyEl) {
    iconEl.textContent = organ.icon;
    titleEl.textContent = organ.hudTitle;
    bodyEl.textContent = organ.fact;
  }
  if (cardEl) {
    cardEl.classList.remove('pulse');
    void cardEl.offsetWidth;
    cardEl.classList.add('pulse');
  }
  if (typeof _0x197d28 === 'function') {
    _0x197d28(0x4b0 + idx * 0xa0, 0.04, 'sine', 0.04);
  }
};
"""

# Attach window.selectTigerOrgan right before _0x13f45f
if "window.selectTigerOrgan" not in js:
    idx_13 = js.find("function _0x13f45f")
    js = js[:idx_13] + organ_func_code + "\n" + js[idx_13:]
    print("Added window.selectTigerOrgan function to webgl-engine.js!")

# In _0x13f45f, make sure it calls selectTigerOrgan
old_call_snippet = "function _0x13f45f(_0x1071da,_0x606db6,_0x2ce41a={}){"
new_call_snippet = """function _0x13f45f(_0x1071da,_0x606db6,_0x2ce41a={}){
  if (typeof window.selectTigerOrgan === 'function') window.selectTigerOrgan(_0x1071da);
"""
if old_call_snippet in js and "window.selectTigerOrgan(_0x1071da)" not in js:
    js = js.replace(old_call_snippet, new_call_snippet, 1)
    print("Linked _0x13f45f to selectTigerOrgan!")

# Ensure clicking canvas on Stage 02 triggers selectTigerOrgan
# Add event listener for .tiger-organ-btn clicks on DOM load
init_clicks_code = """
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tiger-organ-btn');
    if (btn && typeof window.selectTigerOrgan === 'function') {
      const idx = parseInt(btn.dataset.organ, 10);
      window.selectTigerOrgan(idx);
    }
  });
});
"""
if "closest('.tiger-organ-btn')" not in js:
    js += "\n" + init_clicks_code

with open('public/js/webgl-engine.js', 'w') as f:
    f.write(js)
print("Updated webgl-engine.js successfully!")

# ==============================================================================
# 2. UPDATE public/index.html & public/body.html with Organ Bar & Fact Card
# ==============================================================================
s2_replacement_html = """  <section class="scene" id="s2" data-scene="2">
    <div class="row">
      <div class="copy">
        <p class="say">Apex <b>Sensory Matrix.</b></p>

        <!-- Interactive 6-Organ Selector Bar -->
        <div class="tiger-organ-bar" id="tigerOrganBar" role="tablist" aria-label="Bengal Tiger Sensory Organs">
          <button type="button" class="tiger-organ-btn active" data-organ="0" role="tab" aria-selected="true">👂 Kaan</button>
          <button type="button" class="tiger-organ-btn" data-organ="1" role="tab" aria-selected="false">🌾 Mishi</button>
          <button type="button" class="tiger-organ-btn" data-organ="2" role="tab" aria-selected="false">👃 Naak</button>
          <button type="button" class="tiger-organ-btn" data-organ="3" role="tab" aria-selected="false">🧬 Matha</button>
          <button type="button" class="tiger-organ-btn" data-organ="4" role="tab" aria-selected="false">🦷 Daant</button>
          <button type="button" class="tiger-organ-btn" data-organ="5" role="tab" aria-selected="false">👁️ Aakhein</button>
        </div>

        <!-- 3D Biometric Wildlife Fact Card -->
        <div class="tiger-fact-card" id="tigerFactCard" role="region" aria-live="polite">
          <div class="tiger-fact-header">
            <span class="tiger-fact-icon" id="factIcon">👂</span>
            <div class="tiger-fact-title-box">
              <span class="tiger-fact-organ-tag">ORGAN TELEMETRY</span>
              <div class="tiger-fact-title" id="factTitle">👂 KAAN // WHITE OCELLI & PINNAE</div>
            </div>
            <span class="tiger-fact-live-pill">LIVE RADAR</span>
          </div>
          <p class="tiger-fact-body" id="factBody">
            Tiger ke kaan ke piche do white dhabbe hote hain jinhe 'Ocelli' (False Eyes) kaha jata hai. Ghup andhere jungle me jab mother tigress aage chalti hai, toh cubs inhi do white dhabbon ko dekh kar piche-piche bina bhatke chalte hain. Iske alawa tiger ke dono kaan 180° alag-alag azaad ghoom sakte hain aur 20 Hz tak ka infrasound 3 kilometer door se sun sakte hain.
          </p>
        </div>

        <a href="/tiger" class="portal-link mono portal-tiger" aria-label="meet few of the famous wild tigers">
          <span class="portal-badge" aria-hidden="true">🐅</span>
          <span class="portal-text">meet few of the famous wild tigers</span>
          <span class="portal-arrow" aria-hidden="true">➔</span>
        </a>
      </div>
      <p class="mono hint" id="hint2">click organ / hover tiger face to decode sensory facts</p>
    </div>
  </section>"""

def replace_s2_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Match <section class="scene" id="s2" ... </section>
    pattern = r'<section class="scene" id="s2" data-scene="2">.*?</section>'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start()] + s2_replacement_html + content[match.end():]
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Replaced Stage 02 section in {filepath}!")
    else:
        print(f"Warning: Stage 02 section not matched in {filepath}!")

replace_s2_in_file('public/index.html')
replace_s2_in_file('public/body.html')

# ==============================================================================
# 3. UPDATE public/styles.css with high-contrast styling
# ==============================================================================
with open('public/styles.css', 'r') as f:
    css = f.read()

fact_css = """
/* ==========================================================================
   STAGE 02: 6-ORGAN WILDLIFE FACT HUD & TACTICAL BAR
   ========================================================================== */
.tiger-organ-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  margin-bottom: 14px;
  pointer-events: auto;
  z-index: 20;
}
.tiger-organ-btn {
  background: rgba(255, 184, 0, 0.08);
  border: 1px solid rgba(255, 184, 0, 0.35);
  color: var(--ink);
  font-family: var(--f-mono, monospace);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.22s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.tiger-organ-btn:hover {
  background: rgba(255, 184, 0, 0.22);
  border-color: #ffb800;
  color: #ffb800;
  transform: translateY(-1px);
}
.tiger-organ-btn.active {
  background: #ffb800 !important;
  border-color: #ffb800 !important;
  color: #0b111e !important;
  font-weight: 700 !important;
  box-shadow: 0 0 16px rgba(255, 184, 0, 0.55);
}

.tiger-fact-card {
  position: relative;
  background: rgba(4, 12, 24, 0.90);
  border: 1px solid rgba(255, 184, 0, 0.55);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 24px rgba(255, 184, 0, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 18px 22px;
  max-width: 540px;
  width: 100%;
  margin-bottom: 16px;
  pointer-events: auto;
  z-index: 20;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.tiger-fact-card.pulse {
  animation: factCardPulse 0.4s ease-out;
}
@keyframes factCardPulse {
  0% { transform: scale(0.98); opacity: 0.8; }
  50% { transform: scale(1.01); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.tiger-fact-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 184, 0, 0.25);
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.tiger-fact-icon {
  font-size: 24px;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(255, 184, 0, 0.6));
}
.tiger-fact-title-box {
  flex: 1;
}
.tiger-fact-organ-tag {
  display: block;
  font-family: var(--f-mono, monospace);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  color: #ffb800;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 2px;
}
.tiger-fact-title {
  font-family: var(--f-mono, monospace);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #ffffff;
}
.tiger-fact-live-pill {
  font-family: var(--f-mono, monospace);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: #10b981;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 3px 8px;
  border-radius: 999px;
  font-weight: 700;
}
.tiger-fact-body {
  font-family: var(--f-sans, sans-serif);
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.94);
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
}

/* Day Mode Theme for Tiger Fact Card */
html:not(.night) .tiger-fact-card {
  background: rgba(255, 255, 255, 0.97) !important;
  border: 1px solid rgba(220, 100, 10, 0.5) !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08), 0 0 20px rgba(220, 100, 10, 0.15) !important;
}
html:not(.night) .tiger-fact-header {
  border-bottom-color: rgba(220, 100, 10, 0.2) !important;
}
html:not(.night) .tiger-fact-organ-tag {
  color: #c95200 !important;
}
html:not(.night) .tiger-fact-title {
  color: #11141c !important;
}
html:not(.night) .tiger-fact-body {
  color: #20232c !important;
}
html:not(.night) .tiger-organ-btn {
  background: rgba(220, 100, 10, 0.08);
  border-color: rgba(220, 100, 10, 0.3);
  color: #181b24;
}
html:not(.night) .tiger-organ-btn.active {
  background: #ea6505 !important;
  border-color: #ea6505 !important;
  color: #ffffff !important;
  box-shadow: 0 0 16px rgba(234, 101, 5, 0.45) !important;
}
"""

if "STAGE 02: 6-ORGAN WILDLIFE FACT HUD" not in css:
    css += "\n" + fact_css
    with open('public/styles.css', 'w') as f:
        f.write(css)
    print("Appended tiger fact styling to public/styles.css!")
else:
    print("Styling already exists in public/styles.css!")

print("All components deployed successfully!")
