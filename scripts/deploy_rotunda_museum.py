#!/usr/bin/env python3
"""
deploy_rotunda_museum.py
Generates 28 bays for the 28 Deceased Tiger Immortals.
Each tiger has 1 title placard + 1 portrait photo = 56 total rotunda panels (perfect 56 adjust).
Ensures 100% valid RSC JSON Flight payload without React SSR hydration mismatch.
Includes In-Scene Luxury Dossier Slide-Over Sheet and 3D Camera Glide Controller.
"""

import subprocess
import json
import re

def main():
    print("[1/5] Extracting clean 3D rotunda template from 4d182fc...")
    raw = subprocess.check_output(["git", "show", "4d182fc:public/shutabug/index.html"]).decode("utf-8", errors="ignore")

    print("[2/5] Reading 28 Deceased Tiger Immortals manifest...")
    with open("public/media/museum_tigers/immortals_manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # 28 Bays: Each tiger gets 1 Intro Placard Plate + 1 Portrait Photo = 56 items total
    bays = []
    for i in range(28):
        t = manifest[i]
        reserve = t['reserve']
        state = t['state']
        lifespan = t['lifespan']
        death = t['death_cause']
        bays.append({
            "count": 1,
            "description": f"{reserve}, {state} · {lifespan}. Fallen: {death}.",
            "href": f"/tiger/dossier?id={t['id']}",
            "slug": t["id"],
            "title": f"{t['name']} ({t['code']})",
            "prints": [{
                "href": f"/tiger/dossier?id={t['id']}",
                "key": f"tiger-{t['number']}",
                "large": t["image"],
                "ratio": 1.5,
                "src": t["image"],
                "title": f"{t['name']} ({t['code']}) — {t['title']}"
            }]
        })

    print(f"Generated {len(bays)} bays (28 plates + 28 photos = 56 rotunda items).")

    print("[3/5] Splicing collections JSON into RSC payload...")
    idx_start = 56621
    style_idx = raw.find(',\\"style\\":\\"rotunda\\"')
    if style_idx == -1:
        raise ValueError("Could not find style rotunda in raw template!")

    new_bays_json_escaped = json.dumps(bays, separators=(",", ":")).replace('"', '\\"')
    spliced = raw[:idx_start] + new_bays_json_escaped + raw[style_idx:]

    # Replace artist in Line 3b from "Mayowa Alabi" to "THE OMKAR DEN"
    spliced = spliced.replace('\\"artist\\":\\"Mayowa Alabi\\"', '\\"artist\\":\\"THE OMKAR DEN\\"')

    # Validate line 3b in Script 32
    scripts = re.findall(r"<script[^>]*>(.*?)</script>", spliced, re.DOTALL)
    s32 = scripts[32]
    m = re.match(r"self\.__next_f\.push\(\[1,\"(.*)\"\]\)", s32, re.DOTALL)
    if not m:
        raise ValueError("Could not match self.__next_f.push in script 32!")

    inner = m.group(1)
    validated = False
    for line in inner.split("\\n"):
        if "collections" in line and "rotunda" in line:
            colon = line.find(":")
            json_str = line[colon+1:].replace('\\"', '"').replace('\\\\', '\\')
            parsed = json.loads(json_str)
            if len(parsed[3]["collections"]) == 28 and parsed[3]["style"] == "rotunda":
                validated = True
                print("✓ RSC Flight payload successfully verified: 28 bays (56 items), valid JSON syntax!")
                print(f"  Artist field: {parsed[3].get('artist')}")
            break

    if not validated:
        raise ValueError("Failed to validate spliced RSC payload!")

    print("[4/5] Injecting clean CSS and scripts...")
    # Inject clean UI CSS to ensure canvas is visible, shutabug remnants hidden, and global navbar + luxury slide-over sheet applied
    clean_css = """
<style id="clean-tiger-ui">
/* Completely remove Shutabug third party header, Postcards from Lagos newsletter, and Gallery/List switch */
header.BAu-nW_top,
.BAu-nW_top,
header[class*="BAu-nW"],
[class*="BAu-nW"],
[class*="nri3Oa"],
section[class*="nri3Oa"],
._7NwgQq_switches,
._7NwgQq_switch,
[class*="_7NwgQq"],
footer.nBz1BW_foot,
[class*="nBz1BW"],
[aria-label*="Search"],
button[aria-label*="Search"],
.LzR3wG_hint {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Force 3D scene and WebGL canvas visible */
html, body, main, #main, .scene, [class*="immersiveScene"], [class*="immersive"] {
  opacity: 1 !important;
  visibility: visible !important;
}

.eqSSUG_sceneVeiled {
  opacity: 1 !important;
}

/* =========================================================
   IN-SCENE LUXURY DOSSIER SLIDE-OVER SHEET
   ========================================================= */

.inscene-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 99990;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.inscene-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.inscene-sheet {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(480px, 100vw);
  height: 100vh;
  height: 100dvh;
  background: rgba(4, 19, 41, 0.92);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-left: 1px solid rgba(245, 158, 11, 0.25);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  color: #f3f4f6;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
}

.inscene-sheet.active {
  transform: translateX(0);
}

/* Header */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 19, 41, 0.7);
  flex-shrink: 0;
}

.sheet-kicker {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sheet-kicker::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;
}

.sheet-close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.sheet-close-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.sheet-close-btn .esc-hint {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 4px;
  border-radius: 3px;
}

/* Scrollable Body */
.sheet-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 158, 11, 0.3) transparent;
}

.sheet-body::-webkit-scrollbar {
  width: 5px;
}
.sheet-body::-webkit-scrollbar-track {
  background: transparent;
}
.sheet-body::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.3);
  border-radius: 4px;
}

/* Hero Box */
.sheet-hero-box {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(245, 158, 11, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  background: #000;
  aspect-ratio: 16 / 10;
  flex-shrink: 0;
}

.sheet-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.sheet-hero-box:hover .sheet-hero-img {
  transform: scale(1.02);
}

.sheet-img-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(4, 19, 41, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
  font-weight: 600;
  text-transform: uppercase;
}

.sheet-img-wm {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  text-transform: uppercase;
}

/* Title & Meta */
.sheet-title-block {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sheet-tiger-name {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  color: #ffffff;
  line-height: 1.2;
}

.sheet-tiger-title {
  font-size: 13.5px;
  color: #94a3b8;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

/* Chips Row */
.sheet-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.sheet-chip {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  padding: 4px 9px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sheet-chip-amber {
  border-color: rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.06);
}

/* Section Headings */
.sheet-sec-heading {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: #f59e0b;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Spec Card */
.sheet-spec-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 8px;
}

.spec-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.spec-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.spec-val {
  font-size: 12.5px;
  color: #e2e8f0;
  line-height: 1.45;
  font-weight: 500;
}

/* Lore block */
.sheet-lore-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px 16px;
}

.sheet-lore {
  font-size: 13px;
  line-height: 1.65;
  color: #cbd5e1;
  margin: 0;
}

/* Footer & Controls */
.sheet-footer {
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 19, 41, 0.7);
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.sheet-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet-nav-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  padding: 7px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.sheet-nav-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.sheet-idx-badge {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.sheet-full-link {
  display: block;
  text-align: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: #f59e0b;
  text-decoration: none;
  padding: 7px;
  border-radius: 5px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.2);
  transition: all 0.2s ease;
}

.sheet-full-link:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

@media (max-width: 520px) {
  .inscene-sheet {
    width: 100vw;
  }
}
</style>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/css/omkar-navbar.css">
<script>
window.__OMKAR_TRACK__ = '/audio/stellar_fission.m4a';
window.__TIGER_MODE__ = true;
document.title = "THE OMKAR DEN // 3D TIGER MUSEUM — THE 28 IMMORTALS";
</script>
"""
    head_pos = spliced.find("<head>")
    html_with_head = spliced[:head_pos + len("<head>")] + clean_css + spliced[head_pos + len("<head>"):]

    # Remove data-booting attribute
    html_with_head = re.sub(r"document\.documentElement\.dataset\.booting\s*=\s*['\"][^'\"]*['\"];?", "", html_with_head)

    # In-Scene Luxury Dossier Markup + Controller Script
    slide_over_html = """
<!-- IN-SCENE LUXURY DOSSIER SLIDE-OVER SHEET -->
<div id="dossierBackdrop" class="inscene-backdrop" aria-hidden="true"></div>

<aside id="inSceneDossier" class="inscene-sheet" aria-label="Tiger Immortals Dossier" aria-hidden="true">
  <div class="sheet-header">
    <span class="sheet-kicker">IMMORTAL ARCHIVE // DOSSIER</span>
    <button id="sheetCloseBtn" class="sheet-close-btn" type="button" aria-label="Close dossier">
      ✕ <span class="esc-hint">ESC</span>
    </button>
  </div>

  <div class="sheet-body">
    <div class="sheet-hero-box">
      <img id="sheetHeroImg" class="sheet-hero-img" src="" alt="Tiger Immortal" />
      <div id="sheetStatusBadge" class="sheet-img-badge">FALLEN IMMORTAL</div>
      <div id="sheetImgWatermark" class="sheet-img-wm"></div>
    </div>

    <div class="sheet-title-block">
      <h1 id="sheetTigerName" class="sheet-tiger-name"></h1>
      <p id="sheetTigerTitle" class="sheet-tiger-title"></p>
      <div class="sheet-chips-row">
        <span id="sheetChipGender" class="sheet-chip sheet-chip-amber"></span>
        <span id="sheetChipLifespan" class="sheet-chip"></span>
        <span id="sheetChipState" class="sheet-chip"></span>
      </div>
    </div>

    <div>
      <h3 class="sheet-sec-heading">BIOLOGICAL &amp; TERRITORIAL TELEMETRY</h3>
      <div class="sheet-spec-card">
        <div class="spec-row">
          <span class="spec-label">NATIONAL PARK / RESERVE</span>
          <span id="sheetSpecReserve" class="spec-val"></span>
        </div>
        <div class="spec-row">
          <span class="spec-label">TERRITORIAL CORE ZONE</span>
          <span id="sheetSpecTerritory" class="spec-val"></span>
        </div>
        <div class="spec-row">
          <span class="spec-label">LIFESPAN / TIMELINE</span>
          <span id="sheetSpecLifespan" class="spec-val"></span>
        </div>
        <div class="spec-row">
          <span class="spec-label">LINEAGE &amp; DYNASTY</span>
          <span id="sheetSpecLineage" class="spec-val"></span>
        </div>
        <div class="spec-row">
          <span class="spec-label">STATUS DETAILS</span>
          <span id="sheetSpecStatus" class="spec-val"></span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="sheet-sec-heading">LEGEND &amp; HISTORICAL CHRONICLE</h3>
      <div class="sheet-lore-card">
        <p id="sheetSignificanceLore" class="sheet-lore"></p>
      </div>
    </div>
  </div>

  <div class="sheet-footer">
    <div class="sheet-nav-row">
      <button id="sheetPrevBtn" class="sheet-nav-btn" type="button">← PREV TIGER</button>
      <span id="sheetTigerCount" class="sheet-idx-badge">01 / 28</span>
      <button id="sheetNextBtn" class="sheet-nav-btn" type="button">NEXT TIGER →</button>
    </div>
    <a id="sheetFullPageLink" class="sheet-full-link" href="/tiger/dossier">OPEN DEDICATED FULL PAGE ↗</a>
  </div>
</aside>

<script>
(function() {
  var currentTigerIndex = 0;
  var tigersManifest = [];

  function fetchManifest() {
    fetch('/media/museum_tigers/immortals_manifest.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        tigersManifest = data;
      })
      .catch(function(err) {
        console.error("Failed to load tiger manifest:", err);
      });
  }
  fetchManifest();

  function renderDossier(tiger, idx) {
    if (!tiger) return;
    currentTigerIndex = idx;

    var heroImg = document.getElementById('sheetHeroImg');
    if (heroImg) {
      heroImg.src = tiger.image || '';
      heroImg.alt = tiger.name || 'Tiger';
    }

    var nameEl = document.getElementById('sheetTigerName');
    if (nameEl) {
      nameEl.textContent = (tiger.name || '') + (tiger.code ? ' (' + tiger.code + ')' : '');
    }

    var titleEl = document.getElementById('sheetTigerTitle');
    if (titleEl) {
      titleEl.textContent = tiger.title || '';
    }

    var wmEl = document.getElementById('sheetImgWatermark');
    if (wmEl) {
      wmEl.textContent = tiger.reserve || '';
    }

    var chipGender = document.getElementById('sheetChipGender');
    if (chipGender) {
      chipGender.textContent = tiger.gender || 'WILD TIGER';
    }

    var chipLifespan = document.getElementById('sheetChipLifespan');
    if (chipLifespan) {
      var ls = tiger.lifespan || '';
      if (ls.indexOf('(') !== -1) {
        ls = ls.split('(')[1].replace(')', '');
      }
      chipLifespan.textContent = ls || tiger.lifespan || 'IMMORTAL';
    }

    var chipState = document.getElementById('sheetChipState');
    if (chipState) {
      chipState.textContent = tiger.state || tiger.reserve || '';
    }

    var specReserve = document.getElementById('sheetSpecReserve');
    if (specReserve) {
      specReserve.textContent = (tiger.reserve || '') + (tiger.state ? ', ' + tiger.state : '');
    }

    var specTerritory = document.getElementById('sheetSpecTerritory');
    if (specTerritory) {
      specTerritory.textContent = tiger.territory_zone || 'Core Forest Reserve';
    }

    var specLifespan = document.getElementById('sheetSpecLifespan');
    if (specLifespan) {
      specLifespan.textContent = tiger.lifespan || 'Historic';
    }

    var specLineage = document.getElementById('sheetSpecLineage');
    if (specLineage) {
      var lineageStr = '';
      if (tiger.lineage) {
        if (typeof tiger.lineage === 'string') {
          lineageStr = tiger.lineage;
        } else {
          var parts = [];
          if (tiger.lineage.mother || tiger.lineage.father) {
            var parents = [tiger.lineage.mother, tiger.lineage.father].filter(Boolean).join(' & ');
            parts.push('Parents: ' + parents);
          }
          if (tiger.lineage.consort) {
            parts.push('Consort: ' + tiger.lineage.consort);
          }
          if (tiger.lineage.offspring && Array.isArray(tiger.lineage.offspring)) {
            parts.push('Dynasty Offspring: ' + tiger.lineage.offspring.join(', '));
          }
          lineageStr = parts.join(' · ') || 'Royal Wild Bloodline';
        }
      } else {
        lineageStr = 'Dominant Reserve Dynasty';
      }
      specLineage.textContent = lineageStr;
    }

    var specStatus = document.getElementById('sheetSpecStatus');
    if (specStatus) {
      specStatus.textContent = (tiger.status || 'DECEASED / FALLEN IMMORTAL') + (tiger.death_cause ? ' — ' + tiger.death_cause : '');
    }

    var loreEl = document.getElementById('sheetSignificanceLore');
    if (loreEl) {
      loreEl.textContent = tiger.significance || '';
    }

    var countEl = document.getElementById('sheetTigerCount');
    if (countEl) {
      var pad = String(idx + 1).padStart(2, '0');
      var tot = String(tigersManifest.length || 28).padStart(2, '0');
      countEl.textContent = pad + ' / ' + tot;
    }

    var fullPageLink = document.getElementById('sheetFullPageLink');
    if (fullPageLink) {
      fullPageLink.href = '/tiger/dossier?id=' + (tiger.id || '');
    }
  }

  window.openInSceneDossier = function(idOrIdx) {
    if (!tigersManifest || !tigersManifest.length) {
      fetch('/media/museum_tigers/immortals_manifest.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          tigersManifest = data;
          window.openInSceneDossier(idOrIdx);
        });
      return;
    }

    var idx = 0;
    if (typeof idOrIdx === 'number') {
      idx = (idOrIdx % tigersManifest.length + tigersManifest.length) % tigersManifest.length;
    } else if (typeof idOrIdx === 'string') {
      var q = idOrIdx.toLowerCase().trim();
      var found = tigersManifest.findIndex(function(t) {
        return t.id === q || t.name.toLowerCase() === q || (t.code && t.code.toLowerCase().indexOf(q) !== -1);
      });
      idx = found !== -1 ? found : 0;
    } else if (typeof window.__getCurrentTigerIndex === 'function') {
      var act = window.__getCurrentTigerIndex();
      idx = (Math.round(act) % tigersManifest.length + tigersManifest.length) % tigersManifest.length;
    }

    var tiger = tigersManifest[idx];
    renderDossier(tiger, idx);

    var backdrop = document.getElementById('dossierBackdrop');
    var sheet = document.getElementById('inSceneDossier');
    if (backdrop) backdrop.classList.add('active');
    if (sheet) sheet.classList.add('active');
  };

  window.closeInSceneDossier = function() {
    var backdrop = document.getElementById('dossierBackdrop');
    var sheet = document.getElementById('inSceneDossier');
    if (backdrop) backdrop.classList.remove('active');
    if (sheet) sheet.classList.remove('active');

    // Natively dispatch Escape to let Three.js scene smoothly reset camera to circular walking track
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
  };

  // Event Listeners
  var closeBtn = document.getElementById('sheetCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeInSceneDossier);
  }

  var backdrop = document.getElementById('dossierBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', window.closeInSceneDossier);
  }

  var prevBtn = document.getElementById('sheetPrevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (!tigersManifest || !tigersManifest.length) return;
      var newIdx = (currentTigerIndex - 1 + tigersManifest.length) % tigersManifest.length;
      window.openInSceneDossier(newIdx);
      // Trigger navigation in rotunda by clicking previous button if present
      var prevRotundaBtn = document.querySelector('button[aria-label="Previous collection"]');
      if (prevRotundaBtn) prevRotundaBtn.click();
    });
  }

  var nextBtn = document.getElementById('sheetNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (!tigersManifest || !tigersManifest.length) return;
      var newIdx = (currentTigerIndex + 1) % tigersManifest.length;
      window.openInSceneDossier(newIdx);
      // Trigger navigation in rotunda by clicking next button if present
      var nextRotundaBtn = document.querySelector('button[aria-label="Next collection"]');
      if (nextRotundaBtn) nextRotundaBtn.click();
    });
  }

  window.addEventListener('keydown', function(e) {
    var sheet = document.getElementById('inSceneDossier');
    if (sheet && sheet.classList.contains('active')) {
      if (e.key === 'Escape') {
        window.closeInSceneDossier();
      } else if (e.key === 'ArrowLeft') {
        if (prevBtn) prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        if (nextBtn) nextBtn.click();
      }
    }
  });

  // Capture phase link click interception for seamless in-scene transitions
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href*="/tiger/dossier"]');
    if (link && link.id === 'sheetFullPageLink') {
      return; // Allow dedicated full page link to open normally
    }
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      try {
        var u = new URL(link.getAttribute('href'), window.location.origin);
        var id = u.searchParams.get('id');
        if (window.openInSceneDossier) {
          window.openInSceneDossier(id);
        }
      } catch(err) {
        console.error(err);
      }
      return false;
    }
  }, true);
})();
</script>
"""

    # Inject sound manager and nav physics before </body> if not present
    body_end = html_with_head.rfind("</body>")
    footer_scripts = slide_over_html + """
<script src="/js/sound-manager.js" defer></script>
<script src="/js/nav-physics.js" defer></script>
</body></html>
"""
    final_output = html_with_head[:body_end] + footer_scripts

    print("[5/5] Writing public/shutabug/index.html...")
    with open("public/shutabug/index.html", "w", encoding="utf-8") as f:
        f.write(final_output)

    print(f"SUCCESS! Wrote {len(final_output)} bytes cleanly to public/shutabug/index.html.")

if __name__ == "__main__":
    main()
