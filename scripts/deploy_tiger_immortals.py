#!/usr/bin/env python3
"""
deploy_tiger_immortals.py
Generates public/shutabug/index.html by taking the clean 3D clothesline engine from 4909f04
and wiring all 28 Deceased Tiger Immortals into the 3D wire + museum gallery grid.
"""

import subprocess
import json
import re
import os

def main():
    print("[1/6] Extracting clean 3D clothesline template from git commit 4909f04...")
    raw_html = subprocess.check_output(["git", "show", "4909f04:public/shutabug/index.html"]).decode("utf-8", errors="ignore")
    
    print("[2/6] Loading 28 Deceased Tiger Immortals manifest...")
    manifest_path = "public/media/museum_tigers/immortals_manifest.json"
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    print(f"Loaded {len(manifest)} tigers from manifest.")

    top12 = manifest[:12]
    
    # 1. Build runs["covers"] for the Top 12 Tigers on the 3D clothesline
    covers = []
    for t in top12:
        cover_item = {
            "caption": f"{t['code']} // Tap for Dossier",
            "collectionSlug": "top-12-immortals",
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

    # 2. Group the 28 Tigers by reserve into collections
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
            "caption": f"{t['reserve']} // {t['lifespan']}",
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

    # 3. Serialize new JSON chunks
    new_collections_json = json.dumps(collections_list, separators=(',', ':'))
    new_runs_json = json.dumps({
        "byCollection": by_collection,
        "covers": covers
    }, separators=(',', ':'))

    print("[3/6] Splicing Top 12 Tigers and collections into RSC stream...")
    # Find boundary of collections
    idx_runs = raw_html.find("runs")
    idx_coll = raw_html.rfind("collections", 0, idx_runs)
    idx_grouped = raw_html.find("grouped", idx_coll)

    # Splicing collections
    part_before_coll = raw_html[:idx_coll + len("collections\":")]
    part_after_coll = raw_html[idx_grouped - 2:] # right after old collections array

    html_step1 = part_before_coll + new_collections_json + part_after_coll

    # Find boundary of runs in updated html
    idx_runs2 = html_step1.find("runs\":{")
    idx_end2 = html_step1.find("}}]]", idx_runs2)

    part_before_runs = html_step1[:idx_runs2 + len("runs\":")]
    part_after_runs = html_step1[idx_end2 + 2:] # after }}

    html_step2 = part_before_runs + new_runs_json + part_after_runs

    print("[4/6] Updating branding and page metadata...")
    branding_replacements = [
        ("Prints | Shutabug", "THE OMKAR DEN // SHUTABUG TIGER MUSEUM — THE 28 IMMORTALS"),
        ("Fine art prints.", "Tactical Biometric Memorial of India's Fallen Apex Predators (1984 – 2023)"),
        ("https://shutabug.com", "http://localhost:3000/tiger"),
        (">Prints<", ">THE 28 IMMORTALS<"),
    ]
    for old_val, new_val in branding_replacements:
        html_step2 = html_step2.replace(old_val, new_val)

    # 5. Build Museum Gallery Grid HTML
    gallery_cards_html = []
    for t in manifest:
        card = f"""
    <div class="tiger-card" data-tiger-id="{t['id']}">
      <div class="tiger-card-photo-wrap">
        <img src="{t['image']}" alt="{t['name']}" loading="lazy" class="tiger-card-img" />
        <div class="tiger-card-overlay">
          <span class="tiger-code-tag">#{t['number']:02d} // {t['code']}</span>
          <span class="tiger-reserve-tag">{t['reserve'].split()[0]}</span>
        </div>
      </div>
      <div class="tiger-card-body">
        <div class="tiger-card-header">
          <h3 class="tiger-card-name">{t['name']}</h3>
          <span class="tiger-lifespan-pill">{t['lifespan']}</span>
        </div>
        <div class="tiger-card-meta">
          <p class="tiger-reserve-full"><strong>Reserve:</strong> {t['reserve']}, {t['state']}</p>
          <p class="tiger-lineage"><strong>Lineage:</strong> {t['lineage']}</p>
          <p class="tiger-death"><strong>Fallen:</strong> {t['death_cause']}</p>
          <p class="tiger-significance">{t['significance']}</p>
        </div>
        <div class="tiger-card-actions">
          <a href="/tiger/dossier?id={t['id']}" class="tiger-card-btn">VIEW TACTICAL DOSSIER →</a>
        </div>
      </div>
    </div>
"""
        gallery_cards_html.append(card)

    gallery_grid_section = f"""
<!-- ========================================== -->
<!-- THE 28 DECEASED IMMORTALS MUSEUM GALLERY -->
<!-- ========================================== -->
<section id="immortals-gallery-grid" class="immortals-grid-section">
  <div class="immortals-grid-head">
    <div class="grid-hud-label">TACTICAL BIOMETRIC REPOSITORY // 28 DECEASED MONARCHS (1984 – 2023)</div>
    <h2 class="grid-hud-title">THE 28 IMMORTALS OF INDIA'S JUNGLE DYNASTIES</h2>
    <p class="grid-hud-sub">All 28 verified historical apex predators of Tadoba, Ranthambore, Kanha, Bandhavgarh, and Pench. Tap any immortal for the full telemetry dossier.</p>
  </div>
  <div class="immortals-grid-container">
    {''.join(gallery_cards_html)}
  </div>
</section>
"""

    print("[5/6] Injecting Omkar Header, Audio, Navigation, and CSS...")
    
    # Custom CSS
    clean_css = """
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

canvas {
  background: transparent !important;
}

/* ======================================================== */
/* HIDE THIRD PARTY SHUTABUG TRASH (User: "remove this shit") */
/* ======================================================== */
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
[data-theme] header:not(.omkar-top) {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}

/* ======================================================== */
/* 28 IMMORTALS MUSEUM GALLERY GRID STYLING                 */
/* ======================================================== */
.immortals-grid-section {
  position: relative;
  z-index: 10;
  background: linear-gradient(180deg, rgba(4, 19, 41, 0.95) 0%, #041329 100%);
  padding: 80px 32px 120px 32px;
  border-top: 1px solid rgba(255, 184, 0, 0.25);
  max-width: 1440px;
  margin: 0 auto;
}

.immortals-grid-head {
  text-align: center;
  margin-bottom: 56px;
}

.grid-hud-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #FFB800;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.grid-hud-title {
  font-family: "Inter", sans-serif;
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #F8F8F8;
  margin: 0 0 16px 0;
}

.grid-hud-sub {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #8E98B8;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

.immortals-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.tiger-card {
  background: rgba(10, 28, 56, 0.7);
  border: 1px solid rgba(255, 184, 0, 0.18);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(12px);
}

.tiger-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 184, 0, 0.55);
  box-shadow: 0 12px 32px rgba(255, 184, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.4);
}

.tiger-card-photo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #020b18;
}

.tiger-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.tiger-card:hover .tiger-card-img {
  transform: scale(1.05);
}

.tiger-card-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.tiger-code-tag {
  background: rgba(4, 19, 41, 0.85);
  color: #FFB800;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 184, 0, 0.3);
  letter-spacing: 0.08em;
}

.tiger-reserve-tag {
  background: rgba(255, 184, 0, 0.18);
  color: #FFF;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  backdrop-filter: blur(6px);
}

.tiger-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tiger-card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.tiger-card-name {
  font-family: "Inter", sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #F8F8F8;
  margin: 0;
  letter-spacing: -0.01em;
}

.tiger-lifespan-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: #8E98B8;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 12px;
}

.tiger-card-meta {
  font-size: 12.5px;
  color: #B2BBD6;
  line-height: 1.55;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
  flex: 1;
}

.tiger-card-meta p {
  margin: 0;
}

.tiger-card-meta strong {
  color: #E2E8F0;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tiger-significance {
  color: #8E98B8;
  font-style: italic;
  margin-top: 4px !important;
}

.tiger-card-actions {
  margin-top: auto;
}

.tiger-card-btn {
  display: block;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(255, 184, 0, 0.08);
  border: 1px solid rgba(255, 184, 0, 0.35);
  border-radius: 6px;
  color: #FFB800;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tiger-card-btn:hover {
  background: #FFB800;
  color: #041329;
  border-color: #FFB800;
  box-shadow: 0 4px 16px rgba(255, 184, 0, 0.35);
}
</style>
"""

    # Omkar Official Header
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

    # Head script
    head_script = """
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
</script>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/omkar-header.css">
"""

    # Replace head
    html_step3 = clean_css + head_script + html_step2

    # Inject Omkar Header right after <body>
    idx_body = html_step3.find("<body>")
    html_step4 = html_step3[:idx_body + len("<body>")] + omkar_header + html_step3[idx_body + len("<body>"):]

    # Inject Gallery Grid right after </main>
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

    print("[6/6] Writing final public/shutabug/index.html...")
    out_path = "public/shutabug/index.html"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"SUCCESS! Wrote {len(final_html)} bytes to {out_path}.")

if __name__ == "__main__":
    main()
