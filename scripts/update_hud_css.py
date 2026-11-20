with open('public/styles.css') as f:
    s = f.read()

idx = s.find("/* TIGER TELEMETRY HUD SENSORY OVERLAYS */")
if idx != -1:
    s = s[:idx]

new_css = """/* TIGER TELEMETRY HUD SENSORY OVERLAYS */
.tiger-telemetry-hud {
  position: fixed;
  z-index: 100;
  background: rgba(3, 14, 30, 0.94);
  border: 1px solid rgba(229, 169, 60, 0.65);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(229, 169, 60, 0.25);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  padding: 14px 18px;
  max-width: 440px;
  width: min(90vw, 440px);
  white-space: normal !important;
  pointer-events: none;
  font-family: var(--f-mono, monospace);
  color: #fff;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.tiger-telemetry-hud.on {
  opacity: 0.98 !important;
  transform: translate(-50%, -50%) scale(1) !important;
}
.tiger-hud-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(229, 169, 60, 0.25);
  padding-bottom: 9px;
  margin-bottom: 10px;
}
.tiger-hud-icon {
  font-size: 22px;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(255, 184, 0, 0.5));
}
.tiger-hud-titles {
  flex: 1;
}
.tiger-hud-organ {
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: #ffb800;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 2px;
}
.tiger-hud-hudtitle {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255, 184, 0, 0.35);
}
.tiger-hud-metric {
  font-size: 10px;
  color: #00f0ff;
  letter-spacing: 0.06em;
  font-weight: 700;
  padding: 3px 8px;
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.35);
  border-radius: 4px;
  white-space: nowrap;
}
.tiger-hud-fact {
  font-size: 11px;
  line-height: 1.5;
  color: #ffffff;
  letter-spacing: 0.02em;
  margin-bottom: 10px;
  font-style: italic;
}
.tiger-hud-hindi {
  font-size: 10.5px;
  line-height: 1.45;
  color: rgba(229, 169, 60, 0.95);
  background: rgba(229, 169, 60, 0.08);
  border-left: 2px solid #ffb800;
  padding: 6px 10px;
  border-radius: 0 6px 6px 0;
  letter-spacing: 0.02em;
}
.tiger-hud-hindi .hindi-tag {
  color: #ffb800;
  font-weight: 700;
  letter-spacing: 0.05em;
}
"""

with open('public/styles.css', 'w') as f:
    f.write(s + new_css)
print("Updated public/styles.css successfully!")
