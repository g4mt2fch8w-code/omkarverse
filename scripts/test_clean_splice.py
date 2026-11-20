import subprocess
import json
import re

raw = subprocess.check_output(["git", "show", "4d182fc:public/shutabug/index.html"]).decode("utf-8", errors="ignore")
idx_start = 56621
style_idx = raw.find(',\\"style\\":\\"rotunda\\"')

with open("public/media/museum_tigers/immortals_manifest.json") as f:
    manifest = json.load(f)

# ALL 28 TIGERS AS INDIVIDUAL BAYS:
# Each tiger has 1 title plate + 1 portrait photo = 56 items total (28 plates + 28 photos)
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

new_bays_json_escaped = json.dumps(bays, separators=(",", ":")).replace('"', '\\"')
spliced = raw[:idx_start] + new_bays_json_escaped + raw[style_idx:]

scripts = re.findall(r"<script[^>]*>(.*?)</script>", spliced, re.DOTALL)
s32 = scripts[32]
m = re.match(r"self\.__next_f\.push\(\[1,\"(.*)\"\]\)", s32, re.DOTALL)
inner = m.group(1)
for line in inner.split("\\n"):
    if "collections" in line and "rotunda" in line:
        colon = line.find(":")
        json_str = line[colon+1:].replace('\\"', '"').replace('\\\\', '\\')
        parsed = json.loads(json_str)
        print("SUCCESS! Line parsed perfectly!")
        print("Collections count:", len(parsed[3]["collections"]))
        print("Style:", parsed[3]["style"])
        print("First bay title:", parsed[3]["collections"][0]["title"])
        print("Last bay title:", parsed[3]["collections"][-1]["title"])
