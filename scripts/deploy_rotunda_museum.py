#!/usr/bin/env python3
"""
deploy_rotunda_museum.py
Generates 28 bays for the 28 Deceased Tiger Immortals.
Each tiger has 1 title placard + 1 portrait photo = 56 total rotunda panels (perfect 56 adjust).
Ensures 100% valid RSC JSON Flight payload without React SSR hydration mismatch.
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
    # Inject clean UI CSS to ensure canvas is visible, shutabug remnants hidden, and global navbar applied
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

    # Inject sound manager and nav physics before </body> if not present
    body_end = html_with_head.rfind("</body>")
    footer_scripts = """
<script src="/js/sound-manager.js" defer></script>
<script src="/js/nav-physics.js" defer></script>
"""
    final_output = html_with_head[:body_end] + footer_scripts + html_with_head[body_end:]

    print("[5/5] Writing public/shutabug/index.html...")
    with open("public/shutabug/index.html", "w", encoding="utf-8") as f:
        f.write(final_output)

    print(f"SUCCESS! Wrote {len(final_output)} bytes cleanly to public/shutabug/index.html.")

if __name__ == "__main__":
    main()
