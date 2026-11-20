#!/usr/bin/env python3
"""
deploy_rotunda_museum.py
Cleanly splices the 28 Deceased Tiger Immortals into the authentic Shutabug 3D Rotunda Room.
Validates that line 3b RSC JSON parses with 0 errors.
Removes all Mayowa Alabi references.
Enforces uniform exhibition layout (Zero intermediate plates - pure continuous 28 immortal gallery).
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

    # UNIFORM LAYOUT: 1 Single continuous grand collection of all 28 tigers
    # This eliminates all intermediate white boards/plates between tigers,
    # ensuring all 28 portraits flow consecutively and uniformly across the circular rotunda.
    prints = []
    for t in manifest:
        prints.append({
            "href": f"/tiger/dossier?id={t['id']}",
            "key": f"tiger-{t['number']}",
            "large": t["image"],
            "ratio": 1.5,
            "src": t["image"],
            "title": f"{t['name']} ({t['code']}) — {t['reserve']}"
        })

    bays = [{
        "count": len(prints),
        "description": "Tactical 3D Sensory Museum celebrating the 28 Fallen Apex Predators of India (1984 – 2023) · Central Provinces, Ranthambore, Tadoba & Kanha.",
        "href": "/tiger/dossier",
        "slug": "the-28-immortals",
        "title": "THE 28 IMMORTALS",
        "prints": prints
    }]

    print(f"Generated single uniform bay with {len(prints)} tigers (0 intermediate plates).")

    print("[3/5] Splicing collections JSON into RSC payload...")
    idx_start = 56621
    style_idx = raw.find(',\\"style\\":\\"rotunda\\"')
    if style_idx == -1:
        raise ValueError("Could not find style rotunda in raw template!")

    new_bays_json_escaped = json.dumps(bays, separators=(",", ":")).replace('"', '\\"')
    spliced = raw[:idx_start] + new_bays_json_escaped + raw[style_idx:]

    # Replace "artist":"Mayowa Alabi" with "artist":"THE OMKAR DEN" in RSC
    spliced = spliced.replace('\\"artist\\":\\"Mayowa Alabi\\"', '\\"artist\\":\\"THE OMKAR DEN\\"')

    # Validate line 3b in Script 32
    scripts = re.findall(r"<script[^>]*>(.*?)</script>", spliced, re.DOTALL)
    # Find script with flight data
    flight_script = None
    for s in scripts:
        if "self.__next_f.push([1," in s and "collections" in s:
            flight_script = s
            break

    if not flight_script:
        raise ValueError("Could not find flight data script!")

    m = re.search(r'self\.__next_f\.push\(\[1,\"(.*)\"\]\)', flight_script, re.DOTALL)
    if not m:
        raise ValueError("Could not match self.__next_f.push in flight script!")

    inner = m.group(1)
    validated = False
    for line in inner.split("\\n"):
        if "collections" in line and "rotunda" in line:
            colon = line.find(":")
            json_str = line[colon+1:].replace('\\"', '"').replace('\\\\', '\\')
            parsed = json.loads(json_str)
            if len(parsed[3]["collections"]) == 1 and parsed[3]["style"] == "rotunda":
                validated = True
                print("✓ RSC Flight payload successfully verified: 1 uniform bay (28 tigers), valid JSON syntax!")
                print(f"  Artist field verified: {parsed[3].get('artist')}")
            break

    if not validated:
        raise ValueError("Failed to validate spliced RSC payload!")

    print("[4/5] Scrubbing Mayowa Alabi and injecting clean styling & scripts...")
    # Global replacement of Mayowa Alabi and Shutabug descriptions
    spliced = spliced.replace("Mayowa Alabi", "The Omkar Den")
    spliced = spliced.replace("Shutabug | Black &amp; African Art Prints by Mayowa Alabi", "THE OMKAR DEN // 3D TIGER MUSEUM — THE 28 IMMORTALS")
    spliced = spliced.replace("Shutabug | Black & African Art Prints by Mayowa Alabi", "THE OMKAR DEN // 3D TIGER MUSEUM — THE 28 IMMORTALS")
    spliced = spliced.replace("Art prints celebrating Black and African culture, from Lagos to the diaspora. Original digital paintings by Mayowa Alabi. Ships worldwide.", "Tactical 3D Sensory Museum celebrating the 28 Fallen Apex Predators of India (1984 – 2023).")

    # Set audio track to stellar fission
    head_audio_script = """<script>
window.__OMKAR_TRACK__ = '/audio/stellar_fission.m4a';
window.__TIGER_MODE__ = true;
</script>
"""

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
"""
    head_pos = spliced.find("<head>")
    html_with_head = spliced[:head_pos + len("<head>")] + head_audio_script + clean_css + spliced[head_pos + len("<head>"):]

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
