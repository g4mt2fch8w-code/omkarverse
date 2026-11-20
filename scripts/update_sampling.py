with open('scripts/generate_tiger_head.py') as f:
    s = f.read()

old_trim = """        eye_set = set(eye_indices)
        keep = []
        for i in range(len(points)):
            if i in eye_set:
                keep.append(i)
        for i in range(len(points)):
            if i not in eye_set and len(keep) < target_count:
                keep.append(i)"""

new_trim = """        eye_set = set(eye_indices)
        # Identify all points that belong to ANY hotspot
        hotspot_pts = set()
        for idx, (px, py, pz) in enumerate(points):
            for h in HOTSPOTS:
                hx, hy, hz = h['a']
                hr = h['r']
                test_x = abs(px) if h['side'] else px
                if math.hypot(test_x - hx, py - hy, pz - hz) < hr:
                    hotspot_pts.add(idx)
                    break

        priority_set = eye_set.union(hotspot_pts)
        keep = list(priority_set)
        
        # Remaining pool sampled uniformly
        remaining = [i for i in range(len(points)) if i not in priority_set]
        random.shuffle(remaining)
        needed = target_count - len(keep)
        if needed > 0:
            keep.extend(remaining[:needed])
        elif len(keep) > target_count:
            # If priority points exceed target, keep all eyes and sample hotspots
            eyes_list = list(eye_set)
            non_eyes_priority = list(hotspot_pts - eye_set)
            random.shuffle(non_eyes_priority)
            keep = eyes_list + non_eyes_priority[:target_count - len(eyes_list)]"""

s = s.replace(old_trim, new_trim)
with open('scripts/generate_tiger_head.py', 'w') as f:
    f.write(s)
print("Updated sampling successfully!")
