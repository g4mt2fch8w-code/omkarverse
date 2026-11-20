#!/usr/bin/env python3
"""
build_tiger_museum.py
Wires the 28 Deceased Tiger Immortals dataset into public/shutabug/index.html:
1. Top 12 Tigers on the 3D Clothesline wire curve (Machhli, Charger, Munna, Collarwali, Wagdoh, Bajrang, Jai, Ustad, Bheem, Matkasur, Yeda Anna, Gabbar)
2. All 28 Tigers in the collections / reserve drawers + responsive full-bleed Museum Gallery Grid
3. Full biographical & biometric milestones (Dates, Reserve, Territory, Lineage, Cause of Death, Legend)
4. Official Omkar Header with tiger pugmark claw physics, nav capsule, night/day physics, and Stellar Fission sound engine
"""

import subprocess
import json
import re
import os

def main():
    print("[1/5] Extracting clean 3D clothesline engine from git 4909f04...")
    raw_html = subprocess.check_output(["git", "show", "4909f04:public/shutabug/index.html"]).decode("utf-8", errors="ignore")

    print("[2/5] Reading immortals_manifest.json (28 tigers)...")
    with open("public/media/museum_tigers/immortals_manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)
    print(f"Loaded {len(manifest)} tigers.")

    top12 = manifest[:12]

    # Build Top 12 on the main 3D clothesline / wire curve
    covers = []
    for t in top12:
        cover_item = {
            "caption": f"{t['code']} · {t['lifespan']} · Tap for Dossier",
            "collectionSlug": "immortals",
            "href": f"/tiger/dossier?id={t['id']}",
            "image": {
                "kind": "image",
                "ratio": 1.5,
                "src": t["image"]
            },
            "imageLarge": t["image"],
            "key": f"cover-{t['number']}",
            "kind": "cover",
            "open": True,
            "price": None,
            "priceRange": None,
            "title": f"{t['name']} ({t['code']})"
        }
        covers.append(cover_item)

    # Group all 28 Tigers by Reserve collections
    reserves_map = {
        "ranthambore": {
            "title": "Ranthambore Apex Monarchs",
            "slug": "ranthambore-apex",
            "desc": "The supreme kings and queens of Ranthambore who forged India's tiger conservation renaissance."
        },
        "bandhavgarh": {
            "title": "Bandhavgarh Dynasty",
            "slug": "bandhavgarh-dynasty",
            "desc": "Colossal territorial titans of the Vindhya hills and Tala meadows."
        },
        "tadoba": {
            "title": "Tadoba Titans",
            "slug": "tadoba-titans",
            "desc": "Heavyweight apex rulers of the dry deciduous teak forests of Central India."
        },
        "central": {
            "title": "Kanha, Pench & Umred Legends",
            "slug": "kanha-pench-legends",
            "desc": "The Matriarchs and Wanderer kings of the Satpura and Vidarbha corridors."
        }
    }

    collections_list = []
    by_collection = {}

    for rkey, rinfo in reserves_map.items():
        collections_list.append({
            "description": rinfo["desc"],
            "slug": rinfo["slug"],
            "title": rinfo["title"]
        })
        by_collection[rinfo["slug"]] = []

    for t in manifest:
        r_str = t["reserve"].lower()
        if "ranthambore" in r_str:
            target_slug = "ranthambore-apex"
        elif "bandhavgarh" in r_str:
            target_slug = "bandhavgarh-dynasty"
        elif "tadoba" in r_str:
            target_slug = "tadoba-titans"
        else:
            target_slug = "kanha-pench-legends"

        prod_item = {
            "caption": f"{t['reserve']} · {t['lifespan']}",
            "href": f"/tiger/dossier?id={t['id']}",
            "image": {
                "kind": "image",
                "ratio": 1.5,
                "src": t["image"]
            },
            "imageLarge": t["image"],
            "key": f"tiger-{t['number']}",
            "kind": "product",
            "open": True,
            "price": None,
            "priceRange": None,
            "title": f"{t['name']} ({t['code']})"
        }
        by_collection[target_slug].append(prod_item)

    # Also add "immortals" collection containing all 28
    collections_list.insert(0, {
        "description": "Tactical Biometric Memorial of India's Fallen Apex Predators (1984 – 2023).",
        "slug": "immortals",
        "title": "The 28 Immortals"
    })
    by_collection["immortals"] = []
    for t in manifest:
        by_collection["immortals"].append({
            "caption": f"{t['code']} · {t['reserve']} · {t['lifespan']}",
            "href": f"/tiger/dossier?id={t['id']}",
            "image": {
                "kind": "image",
                "ratio": 1.5,
                "src": t["image"]
            },
            "imageLarge": t["image"],
            "key": f"immortal-{t['number']}",
            "kind": "product",
            "open": True,
            "price": None,
            "priceRange": None,
            "title": f"{t['name']} ({t['code']})"
        })

    print("[3/5] Splicing Top 12 and collections into RSC stream...")
    # Serialize JSON with quotes escaped for Next.js RSC string
    new_coll_escaped = json.dumps(collections_list, separators=(',', ':')).replace('"', '\\"')
    new_runs_escaped = json.dumps({
        "byCollection": by_collection,
        "covers": covers
    }, separators=(',', ':')).replace('"', '\\"')

    # 1. Splice collections
    needle_coll = '\"collections\":['.replace('\"', '\\\\\"')
    idx_coll = raw_html.find(needle_coll)
    needle_grouped = '\"grouped\":true'.replace('\"', '\\\\\"')
    idx_grouped = raw_html.find(needle_grouped, idx_coll)

    part_before_coll = raw_html[:idx_coll + len(needle_coll) - 1]
    part_after_coll = raw_html[idx_grouped - 2:]
    html_step1 = part_before_coll + new_coll_escaped + part_after_coll

    # 2. Splice runs
    needle_runs = '\"runs\":{\"byCollection\"'.replace('\"', '\\\\\"')
    idx_runs = html_step1.find(needle_runs)
    idx_end_runs = html_step1.find('}}]]', idx_runs)

    part_before_runs = html_step1[:idx_runs + len('\"runs\":'.replace('\"', '\\\\\"'))]
    part_after_runs = html_step1[idx_end_runs + 1:]
    html_step2 = part_before_runs + new_runs_escaped + part_after_runs

    # Remove booting attribute setter that hides the canvas
    html_step2 = re.sub(r"document\.documentElement\.dataset\.booting\s*=\s*['\"][^'\"]*['\"];?", "", html_step2)

    # Branding replacements
    branding_replacements = [
        ("Prints | Shutabug", "THE OMKAR DEN // SHUTABUG TIGER MUSEUM — THE 28 IMMORTALS"),
        ("Fine art prints.", "Tactical Biometric Memorial of India's Fallen Apex Predators (1984 – 2023)"),
        ("https://shutabug.com", "http://localhost:3000/tiger"),
        (">Prints<", ">THE 28 IMMORTALS<"),
    ]
    for old_val, new_val in branding_replacements:
        html_step2 = html_step2.replace(old_val, new_val)

    print("[4/5] Building Museum Gallery Grid with full biographical details...")
    cards_html = []
    for t in manifest:
        card = f"""
    <div class="immortal-card" data-tiger-id="{t['id']}">
      <div class="immortal-card-media">
        <img src="{t['image']}" alt="{t['name']}" loading="lazy" class="immortal-card-photo" />
        <div class="immortal-badge-top">
          <span class="immortal-id-chip">#{t['number']:02d} // {t['code']}</span>
          <span class="immortal-reserve-chip">{t['reserve'].split()[0]}</span>
        </div>
      </div>
      <div class="immortal-card-content">
        <div class="immortal-header-row">
          <h3 class="immortal-name">{t['name']}</h3>
          <span class="immortal-life-badge">{t['lifespan']}</span>
        </div>
        <div class="immortal-title-line">{t['title']}</div>
        <div class="immortal-telemetry-grid">
          <div class="telemetry-item">
            <span class="telemetry-label">RESERVE & CORE TERRITORY</span>
            <span class="telemetry-val">{t['reserve']}, {t['state']} · {t['territory_zone']}</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">LINEAGE & OFFSPRING</span>
            <span class="telemetry-val">{t['lineage']}</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">LEGEND & BIOLOGICAL MILESTONES</span>
            <span class="telemetry-val">{t['significance']}</span>
          </div>
          <div class="telemetry-item death-item">
            <span class="telemetry-label">DOCUMENTED CAUSE OF DEATH</span>
            <span class="telemetry-val">{t['death_cause']}</span>
          </div>
        </div>
        <a href="/tiger/dossier?id={t['id']}" class="immortal-open-dossier-btn">OPEN TACTICAL DOSSIER →</a>
      </div>
    </div>
"""
        cards_html.append(card)

    gallery_grid_section = f"""
<!-- ======================================================== -->
<!-- 28 DECEASED IMMORTALS REPOSITORY & BIOMETRIC MEMORIAL    -->
<!-- ======================================================== -->
<section id="immortals-museum-section" class="immortals-museum-wrapper">
  <div class="museum-header-block">
    <div class="museum-hud-tag">TACTICAL BIOMETRIC MEMORIAL // 1984 – 2023</div>
    <h2 class="museum-hud-headline">THE 28 IMMORTALS OF INDIA'S JUNGLE DYNASTIES</h2>
    <p class="museum-hud-sub">All 28 verified historical monarchs of Tadoba, Ranthambore, Kanha, Bandhavgarh, and Pench. Scroll along the 3D line above or explore the full-bleed biographical dossier cards below.</p>
  </div>
  <div class="immortals-cards-grid">
    {''.join(cards_html)}
  </div>
</section>
"""

    custom_css = """
<style id="clean-tiger-ui">
:root, html, body, [data-theme], main {
  --bg: #041329 !important;
  --ink: #F8F8F8 !important;
  --dim: #8E98B8 !important;
  --line: rgba(255, 184, 0, 0.22) !important;
  --line-field: rgba(255, 184, 0, 0.35) !important;
  --focus: #FFB800 !important;
  --veil: rgba(4, 19, 41, 0.92) !important;
  --veil-solid: #041329 !important;
  --panel: rgba(10, 28, 56, 0.95) !important;
  --font-display: "JetBrains Mono", monospace !important;
  --font-body: "Inter", sans-serif !important;
  --font-mono: "JetBrains Mono", monospace !important;
  background-color: #041329 !important;
  color: #F8F8F8 !important;
  color-scheme: dark !important;
}

body {
  background-color: #041329 !important;
  color: #F8F8F8 !important;
  font-family: "Inter", sans-serif !important;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Ensure 3D Clothesline is completely visible */
html, body, main, #main, .scene {
  opacity: 1 !important;
  visibility: visible !important;
}

html[data-booting] main,
html[data-booting] #main,
html[data-booting] .scene {
  opacity: 1 !important;
  visibility: visible !important;
}

.scene {
  position: relative !important;
  width: 100vw !important;
  height: 80vh !important;
  min-height: 580px !important;
  display: block !important;
  margin-top: 64px;
}

canvas {
  background: transparent !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}

/* HIDE THIRD-PARTY SHUTABUG OVERLAYS (User: "remove this shit") */
header.BAu-nW_top,
header[class*="top"]:not(.omkar-top),
div[class*="switches"],
fieldset[class*="switch"],
div[class*="newsletter"],
div[class*="_newsletter"],
aside[class*="panel"],
div[aria-label*="Search"],
button[aria-label*="Search"],
.LzR3wG_hint,
[data-theme] header:not(.omkar-top),
.eqSSUG_cursorTip,
[class*="cursorTip"] {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}

/* OMKAR HEADER (FIXED TOP) */
header.omkar-top {
  display: flex !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 64px !important;
  z-index: 9999 !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: rgba(4, 19, 41, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 184, 0, 0.2);
}

/* ======================================================== */
/* 28 IMMORTALS MUSEUM GALLERY GRID STYLING                 */
/* ======================================================== */
.immortals-museum-wrapper {
  position: relative;
  z-index: 20;
  background: linear-gradient(180deg, rgba(4, 19, 41, 0.98) 0%, #030d1c 100%);
  padding: 60px 32px 140px 32px;
  border-top: 1px solid rgba(255, 184, 0, 0.3);
  max-width: 1440px;
  margin: 0 auto;
}

.museum-header-block {
  text-align: center;
  margin-bottom: 50px;
}

.museum-hud-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #FFB800;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.museum-hud-headline {
  font-family: "Inter", sans-serif;
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #F8F8F8;
  margin: 0 0 16px 0;
}

.museum-hud-sub {
  font-family: "Inter", sans-serif;
  font-size: 14.5px;
  color: #8E98B8;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.6;
}

.immortals-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

.immortal-card {
  background: rgba(10, 28, 56, 0.8);
  border: 1px solid rgba(255, 184, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(14px);
}

.immortal-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 184, 0, 0.65);
  box-shadow: 0 16px 36px rgba(255, 184, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.5);
}

.immortal-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #020812;
}

.immortal-card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.immortal-card:hover .immortal-card-photo {
  transform: scale(1.06);
}

.immortal-badge-top {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.immortal-id-chip {
  background: rgba(4, 19, 41, 0.88);
  color: #FFB800;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 184, 0, 0.35);
  letter-spacing: 0.08em;
}

.immortal-reserve-chip {
  background: rgba(255, 184, 0, 0.2);
  color: #FFFFFF;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
}

.immortal-card-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.immortal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.immortal-name {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #F8F8F8;
  margin: 0;
  letter-spacing: -0.01em;
}

.immortal-life-badge {
  font-family: "JetBrains Mono", monospace;
  font-size: 11.5px;
  color: #8E98B8;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 12px;
}

.immortal-title-line {
  font-family: "JetBrains Mono", monospace;
  font-size: 11.5px;
  color: #FFB800;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.immortal-telemetry-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
  flex: 1;
}

.telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.telemetry-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: #8E98B8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.telemetry-val {
  font-family: "Inter", sans-serif;
  font-size: 12.5px;
  color: #D3DCF5;
  line-height: 1.5;
}

.death-item .telemetry-val {
  color: #E5A93C;
  font-weight: 500;
}

.immortal-open-dossier-btn {
  display: block;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 12px 16px;
  background: rgba(255, 184, 0, 0.08);
  border: 1px solid rgba(255, 184, 0, 0.35);
  border-radius: 6px;
  color: #FFB800;
  font-family: "JetBrains Mono", monospace;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.25s ease;
  margin-top: auto;
}

.immortal-open-dossier-btn:hover {
  background: #FFB800;
  color: #041329;
  border-color: #FFB800;
  box-shadow: 0 4px 18px rgba(255, 184, 0, 0.35);
}
</style>
"""

    omkar_header = """
<header class="top omkar-top">
  <!-- Zone 1: Left Brand Lockup with Tiger Pugmark & Claw Hover Physics -->
  <div class="top-zone top-zone-left">
    <a href="/" class="brand-lockup" aria-label="Omkarverse Home">
      <div class="brand-mark-box">
        <svg class="pugmark-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="19" rx="6.5" ry="5.2" fill="currentColor"/>
          <ellipse cx="8.5" cy="11.5" rx="2.5" ry="3.5" transform="rotate(-18 8.5 11.5)" fill="currentColor"/>
          <ellipse cx="13.2" cy="8.2" rx="2.4" ry="3.6" transform="rotate(-6 13.2 8.2)" fill="currentColor"/>
          <ellipse cx="18.8" cy="8.2" rx="2.4" ry="3.6" transform="rotate(6 18.8 8.2)" fill="currentColor"/>
          <ellipse cx="23.5" cy="11.5" rx="2.5" ry="3.5" transform="rotate(18 23.5 11.5)" fill="currentColor"/>
          <path class="claw claw-1" d="M8 7.5 C8 4.5, 9 3.5, 9 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <path class="claw claw-2" d="M13 4.5 C13.2 2.2, 14 1.5, 14 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <path class="claw claw-3" d="M19 4.5 C18.8 2.2, 18 1.5, 18 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          <path class="claw claw-4" d="M24 7.5 C24 4.5, 23 3.5, 23 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">OMKAR BHOPLE</span>
        <span class="brand-sub">DEN // IMMORTALS</span>
      </div>
    </a>
  </div>

  <!-- Zone 2: Navigation Capsule with Sliding Pill Spring Physics -->
  <div class="top-zone top-zone-center">
    <nav class="top-nav" id="navCapsule" aria-label="Main Navigation">
      <div class="nav-pill-bg" id="navPillBg"></div>
      <a href="/" class="nav-tab" data-nav="core">CORE</a>
      <a href="/telemetry" class="nav-tab" data-nav="telemetry">TELEMETRY</a>
      <a href="/forest" class="nav-tab" data-nav="forest">FOREST</a>
      <a href="/tiger" class="nav-tab active" data-nav="tiger">TIGER</a>
      <a href="/field" class="nav-tab" data-nav="field">FIELD</a>
    </nav>
  </div>

  <!-- Zone 3: Interactive Controls (Night/Day Toggle & Audio Engine) -->
  <div class="top-zone top-zone-right">
    <div class="top-toggle" id="looksToggle" role="group" aria-label="Theme mode">
      <div class="toggle-pill-bg" id="looksPillBg"></div>
      <button type="button" class="toggle-btn" data-mode="night" id="btnNight">night</button>
      <button type="button" class="toggle-btn" data-mode="day" id="btnDay">day</button>
    </div>
    <button type="button" class="top-btn" id="snd" aria-pressed="false" title="Toggle Stellar Fission Audio">sound ○</button>
  </div>
</header>
"""

    head_injection = """
<script>
window.TURBOPACK_CHUNK_BASE_PATH = "/shutabug/_next/";
window.posthog = { init: function(){}, capture: function(){}, on: function(){} };

// Intercept fetch
const _origFetch = window.fetch;
window.fetch = async function(input, init) {
  const url = typeof input === "string" ? input : (input && input.url ? input.url : "");
  if (url.includes("/api/customers/me") || url.includes("/api/auth/me") || url.includes("/api/users/me")) {
    return new Response(JSON.stringify({ user: null, message: "Account" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (url.includes("/api/cart") || url.includes("/api/carts")) {
    return new Response(JSON.stringify({ doc: null, items: [] }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return _origFetch.apply(this, arguments);
};

// Next.js App Router hydration synchronization
try {
  history.replaceState(null, "", "/shop/prints");
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      try { history.replaceState(null, "", "/tiger"); } catch(e) {}
    }, 1500);
  });
} catch(e) {}

// Direct dossier navigation handler
document.addEventListener("click", function(e) {
  const a = e.target.closest('a[href*="/tiger/dossier"]');
  if (a) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = a.href;
  }
}, true);
</script>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/omkar-header.css">
""" + custom_css

    # Insert head_injection into <head> (right after opening <head>)
    idx_head = html_step2.find("<head>")
    html_step3 = html_step2[:idx_head + len("<head>")] + head_injection + html_step2[idx_head + len("<head>"):]

    # Insert Omkar Header right after <body>
    idx_body = html_step3.find("<body>")
    html_step4 = html_step3[:idx_body + len("<body>")] + omkar_header + html_step3[idx_body + len("<body>"):]

    # Insert Gallery Grid right after </main>
    idx_end_main = html_step4.find("</main>")
    if idx_end_main != -1:
        html_step5 = html_step4[:idx_end_main + len("</main>")] + gallery_grid_section + html_step4[idx_end_main + len("</main>"):]
    else:
        idx_end_body = html_step4.rfind("</body>")
        html_step5 = html_step4[:idx_end_body] + gallery_grid_section + html_step4[idx_end_body:]

    # Inject scripts before </body>
    idx_end_body = html_step5.rfind("</body>")
    body_scripts = """
<script src="/js/sound-manager.js" defer></script>
<script src="/js/nav-physics.js" defer></script>
"""
    final_html = html_step5[:idx_end_body] + body_scripts + html_step5[idx_end_body:]

    print("[5/5] Writing public/shutabug/index.html...")
    with open("public/shutabug/index.html", "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"SUCCESS! Wrote {len(final_html)} bytes to public/shutabug/index.html.")

if __name__ == "__main__":
    main()
