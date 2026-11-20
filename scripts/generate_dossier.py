import json

with open('public/media/museum_tigers/immortals_manifest.json') as f:
    manifest = json.load(f)

manifest_json = json.dumps(manifest, ensure_ascii=False)

html = f"""<!DOCTYPE html>
<html lang="en" data-look="night">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Omkar Den // Tiger Dossier — 28 Legendary Monarchs</title>
  <meta name="description" content="Tactical biological dossier of India's 28 immortal wild tigers. In-depth chronicles, territories, and dynasties." />
  <link rel="stylesheet" href="/omkar-header.css" />
  <style>
    :root {{
      --bg: #041329;
      --bg-card: rgba(10, 28, 56, 0.75);
      --bg-card-hover: rgba(15, 38, 75, 0.85);
      --ink: #F8F8F8;
      --dim: #8E98B8;
      --gold: #FFB800;
      --gold-dim: rgba(255, 184, 0, 0.25);
      --line: rgba(255, 184, 0, 0.18);
      --f-mono: 'JetBrains Mono', monospace;
      --f-sans: 'Inter', sans-serif;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      background-color: var(--bg);
      color: var(--ink);
      font-family: var(--f-sans);
      min-height: 100vh;
      overflow-x: hidden;
      padding-top: 88px;
    }}

    .dossier-container {{
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px 32px 80px;
    }}

    /* Top Breadcrumb & Quick Nav */
    .dossier-top-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
    }}

    .back-btn {{
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--gold);
      text-decoration: none;
      font-family: var(--f-mono);
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid var(--gold-dim);
      background: rgba(255, 184, 0, 0.06);
      transition: all 0.2s ease;
    }}

    .back-btn:hover {{
      background: rgba(255, 184, 0, 0.16);
      border-color: var(--gold);
      transform: translateX(-3px);
    }}

    .tiger-selector-control {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .tiger-select-dropdown {{
      background: var(--bg-card);
      color: var(--ink);
      border: 1px solid var(--line);
      padding: 8px 16px;
      border-radius: 8px;
      font-family: var(--f-mono);
      font-size: 0.8rem;
      outline: none;
      cursor: pointer;
    }}

    .tiger-select-dropdown option {{
      background: #041329;
      color: #F8F8F8;
    }}

    .nav-arrow-btn {{
      background: var(--bg-card);
      border: 1px solid var(--line);
      color: var(--gold);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
    }}

    .nav-arrow-btn:hover {{
      border-color: var(--gold);
      background: var(--bg-card-hover);
    }}

    /* Main Grid Layout */
    .dossier-grid {{
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 40px;
      align-items: start;
    }}

    @media (max-width: 980px) {{
      .dossier-grid {{
        grid-template-columns: 1fr;
      }}
    }}

    /* Left Column: Visual Card */
    .portrait-pane {{
      position: sticky;
      top: 104px;
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(16px);
    }}

    .portrait-wrapper {{
      position: relative;
      width: 100%;
      height: 340px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 184, 0, 0.2);
      background: #000;
    }}

    .portrait-img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }}

    .portrait-wrapper:hover .portrait-img {{
      transform: scale(1.03);
    }}

    .portrait-badge {{
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(4, 19, 41, 0.85);
      border: 1px solid var(--gold);
      color: var(--gold);
      font-family: var(--f-mono);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      padding: 4px 10px;
      border-radius: 4px;
      backdrop-filter: blur(8px);
      text-transform: uppercase;
    }}

    .quick-meta-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 18px;
    }}

    .meta-box {{
      background: rgba(4, 19, 41, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
    }}

    .meta-label {{
      font-family: var(--f-mono);
      font-size: 0.64rem;
      color: var(--dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }}

    .meta-value {{
      font-family: var(--f-mono);
      font-size: 0.84rem;
      color: var(--ink);
      font-weight: 500;
    }}

    /* Right Column: Detailed Intelligence */
    .intel-pane {{
      display: flex;
      flex-direction: column;
      gap: 24px;
    }}

    .header-badge-row {{
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }}

    .tag-pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--f-mono);
      font-size: 0.72rem;
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.04);
      color: var(--dim);
    }}

    .tag-pill.gold {{
      border-color: var(--gold-dim);
      background: rgba(255, 184, 0, 0.08);
      color: var(--gold);
    }}

    .tiger-title {{
      font-family: var(--f-mono);
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      line-height: 1.1;
    }}

    .tiger-subtitle {{
      font-family: var(--f-sans);
      font-size: 1.15rem;
      color: var(--gold);
      font-weight: 400;
    }}

    .telemetry-card {{
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 24px;
      backdrop-filter: blur(14px);
    }}

    .telemetry-card h3 {{
      font-family: var(--f-mono);
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--gold);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .spec-table {{
      width: 100%;
      border-collapse: collapse;
      font-family: var(--f-mono);
      font-size: 0.82rem;
    }}

    .spec-table tr {{
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }}

    .spec-table tr:last-child {{
      border-bottom: none;
    }}

    .spec-table td {{
      padding: 10px 0;
      vertical-align: top;
    }}

    .spec-table td:first-child {{
      width: 32%;
      color: var(--dim);
      text-transform: uppercase;
      font-size: 0.72rem;
      letter-spacing: 0.06em;
    }}

    .spec-table td:last-child {{
      color: var(--ink);
    }}

    .narrative-card {{
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 28px;
      line-height: 1.7;
      font-size: 1rem;
      color: #DDE2EE;
    }}

    .narrative-card h3 {{
      font-family: var(--f-mono);
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--gold);
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .narrative-text {{
      font-family: var(--f-sans);
      font-size: 0.98rem;
      color: #CFD8EC;
      line-height: 1.75;
    }}
  </style>
</head>
<body>
  <!-- Header Bar -->
  <header class="top">
    <div class="top-zone top-zone-left">
      <a href="/" class="brand-group brand-logo" aria-label="THE OMKAR DEN, back to home">
        <span class="pugmark-icon" aria-hidden="true">
          <svg class="pugmark-svg" viewBox="0 0 32 36" width="26" height="29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pugmarkGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFB800" />
                <stop offset="100%" stop-color="#E5A93C" />
              </linearGradient>
            </defs>
            <path class="pug-pad" d="M 16.0 16.2 C 12.0 16.2, 8.4 18.2, 7.6 22.0 C 6.8 25.8, 9.4 29.5, 12.8 30.8 C 14.2 31.3, 17.8 31.3, 19.2 30.8 C 22.6 29.5, 25.2 25.8, 24.4 22.0 C 23.6 18.2, 20.0 16.2, 16.0 16.2 Z" fill="url(#pugmarkGold)" />
            <ellipse class="pug-toe toe-1" cx="6.0" cy="12.8" rx="2.6" ry="3.8" transform="rotate(-28 6.0 12.8)" fill="url(#pugmarkGold)" />
            <ellipse class="pug-toe toe-2" cx="12.2" cy="8.8" rx="2.8" ry="4.4" transform="rotate(-10 12.2 8.8)" fill="url(#pugmarkGold)" />
            <ellipse class="pug-toe toe-3" cx="19.8" cy="8.8" rx="2.8" ry="4.4" transform="rotate(10 19.8 8.8)" fill="url(#pugmarkGold)" />
            <ellipse class="pug-toe toe-4" cx="26.0" cy="12.8" rx="2.6" ry="3.8" transform="rotate(28 26.0 12.8)" fill="url(#pugmarkGold)" />
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-the">THE</span>
          <span class="brand-name">OMKAR</span>
          <span class="brand-den">DEN</span>
        </span>
      </a>
    </div>

    <div class="top-zone top-zone-center">
      <nav class="nav-capsule" aria-label="Primary Sections">
        <div class="capsule-shell">
          <span class="capsule-pill" aria-hidden="true"></span>
          <a href="/" class="nav-tab" data-nav="core" data-section="s1">Core</a>
          <a href="/#s3" class="nav-tab" data-nav="telemetry" data-section="s3">Telemetry</a>
          <a href="/#s4" class="nav-tab" data-nav="forest" data-section="s4">Forest</a>
          <a href="/tiger" class="nav-tab is-active active" data-nav="tiger" data-section="tiger"><span class="tab-dot" aria-hidden="true"></span>Tiger</a>
          <a href="/#s5" class="nav-tab" data-nav="field" data-section="s5">Field</a>
        </div>
      </nav>
    </div>

    <div class="top-zone top-zone-right">
      <div class="look-toggle" role="group" aria-label="Theme">
        <span class="look-pill" aria-hidden="true"></span>
        <button type="button" class="look-btn is-active" data-look="night">night</button>
        <button type="button" class="look-btn" data-look="day">day</button>
      </div>
      <a href="https://github.com/onkarbhople" class="top-link" target="_blank" rel="noopener noreferrer">github</a>
    </div>
  </header>

  <!-- Dossier Content Container -->
  <main class="dossier-container">
    <div class="dossier-top-bar">
      <a href="/tiger" class="back-btn">
        <span>←</span>
        <span>Return to 3D Matrix</span>
      </a>

      <div class="tiger-selector-control">
        <button type="button" class="nav-arrow-btn" id="prevBtn" title="Previous Tiger (ArrowLeft)">←</button>
        <select class="tiger-select-dropdown" id="tigerSelect"></select>
        <button type="button" class="nav-arrow-btn" id="nextBtn" title="Next Tiger (ArrowRight)">→</button>
      </div>
    </div>

    <div class="dossier-grid">
      <!-- Left Column: Portrait & Quick Meta -->
      <aside class="portrait-pane">
        <div class="portrait-wrapper">
          <img id="tigerImg" class="portrait-img" src="" alt="Tiger Portrait" />
          <div id="tigerStatusBadge" class="portrait-badge">APEX MONARCH</div>
        </div>

        <div class="quick-meta-grid">
          <div class="meta-box">
            <div class="meta-label">Reserve</div>
            <div id="metaReserveShort" class="meta-value">-</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Status</div>
            <div id="metaStatusShort" class="meta-value">-</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Gender / Code</div>
            <div id="metaCodeGender" class="meta-value">-</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Lifespan</div>
            <div id="metaLifespan" class="meta-value">-</div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Full Telemetry & Historical Chronicle -->
      <section class="intel-pane">
        <div class="header-badge-row">
          <span class="tag-pill gold" id="badgeNumber">TIGER #01 OF 28</span>
          <span class="tag-pill" id="badgeCode">CODE: -</span>
          <span class="tag-pill" id="badgeState">STATE: -</span>
        </div>

        <div>
          <h1 id="tigerName" class="tiger-title">-</h1>
          <div id="tigerMoniker" class="tiger-subtitle">-</div>
        </div>

        <div class="telemetry-card">
          <h3><span>⚡</span> Biological & Territorial Telemetry</h3>
          <table class="spec-table">
            <tbody>
              <tr>
                <td>National Park / Reserve</td>
                <td id="specReserve">-</td>
              </tr>
              <tr>
                <td>Territorial Core Zone</td>
                <td id="specTerritory">-</td>
              </tr>
              <tr>
                <td>Lifespan / Timeline</td>
                <td id="specLifespan">-</td>
              </tr>
              <tr>
                <td>Lineage & Dynasty</td>
                <td id="specLineage">-</td>
              </tr>
              <tr>
                <td>Status Details</td>
                <td id="specStatusDetails">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="narrative-card">
          <h3><span>📜</span> Legend & Historical Chronicle</h3>
          <p id="narrativeLore" class="narrative-text">-</p>
        </div>
      </section>
    </div>
  </main>

  <script>
    const TIGERS = {manifest_json};

    function getSelectedTiger() {{
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || params.get('tiger');
      if (id) {{
        const match = TIGERS.find(t => t.id.toLowerCase() === id.toLowerCase() || String(t.number) === id || t.code.toLowerCase().includes(id.toLowerCase()));
        if (match) return match;
      }}
      return TIGERS[0];
    }}

    function renderTiger(tiger) {{
      document.title = `${{tiger.name}} (${{tiger.code}}) // The Omkar Den Dossier`;
      
      document.getElementById('tigerImg').src = tiger.image;
      document.getElementById('tigerImg').alt = `${{tiger.name}} - ${{tiger.title}}`;
      
      const isDead = tiger.status.includes('DECEASED');
      document.getElementById('tigerStatusBadge').textContent = isDead ? 'FALLEN IMMORTAL' : 'APEX MONARCH';
      document.getElementById('tigerStatusBadge').style.borderColor = isDead ? 'rgba(255, 184, 0, 0.4)' : '#FFB800';

      document.getElementById('metaReserveShort').textContent = tiger.reserve.split(' ')[0];
      document.getElementById('metaStatusShort').textContent = isDead ? 'Fallen' : 'Active';
      document.getElementById('metaCodeGender').textContent = `${{tiger.code}} · ${{tiger.gender}}`;
      document.getElementById('metaLifespan').textContent = tiger.lifespan.split('(')[0].trim();

      document.getElementById('badgeNumber').textContent = `TIGER #${{String(tiger.number).padStart(2, '0')}} OF 28`;
      document.getElementById('badgeCode').textContent = `CODE: ${{tiger.code}}`;
      document.getElementById('badgeState').textContent = `STATE: ${{tiger.state}}`;

      document.getElementById('tigerName').textContent = tiger.name;
      document.getElementById('tigerMoniker').textContent = tiger.title;

      document.getElementById('specReserve').textContent = `${{tiger.reserve}}, ${{tiger.state}}`;
      document.getElementById('specTerritory').textContent = tiger.territory_zone;
      document.getElementById('specLifespan').textContent = tiger.lifespan;

      const lineageParts = [];
      if (tiger.lineage) {{
        if (tiger.lineage.mother) lineageParts.push(`Mother: ${{tiger.lineage.mother}}`);
        if (tiger.lineage.father) lineageParts.push(`Father: ${{tiger.lineage.father}}`);
        if (tiger.lineage.offspring && tiger.lineage.offspring.length) {{
          lineageParts.push(`Noted Offspring: ${{tiger.lineage.offspring.join(', ')}}`);
        }}
      }}
      document.getElementById('specLineage').textContent = lineageParts.length ? lineageParts.join(' | ') : 'Wild Heritage Lineage';

      let statusFull = tiger.status;
      if (tiger.death_cause) {{
        statusFull += ` — ${{tiger.death_cause}}`;
      }}
      document.getElementById('specStatusDetails').textContent = statusFull;

      document.getElementById('narrativeLore').textContent = tiger.significance;

      document.getElementById('tigerSelect').value = tiger.id;
    }}

    // Populate dropdown
    const selectEl = document.getElementById('tigerSelect');
    TIGERS.forEach(t => {{
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `#${{String(t.number).padStart(2, '0')}} ${{t.name}} (${{t.code}})`;
      selectEl.appendChild(opt);
    }});

    function navigateTiger(tiger) {{
      const url = new URL(window.location);
      url.searchParams.set('id', tiger.id);
      window.history.pushState({{}}, '', url);
      renderTiger(tiger);
    }}

    selectEl.addEventListener('change', (e) => {{
      const t = TIGERS.find(x => x.id === e.target.value);
      if (t) navigateTiger(t);
    }});

    document.getElementById('prevBtn').addEventListener('click', () => {{
      const current = getSelectedTiger();
      const idx = TIGERS.findIndex(t => t.id === current.id);
      const prevIdx = (idx - 1 + TIGERS.length) % TIGERS.length;
      navigateTiger(TIGERS[prevIdx]);
    }});

    document.getElementById('nextBtn').addEventListener('click', () => {{
      const current = getSelectedTiger();
      const idx = TIGERS.findIndex(t => t.id === current.id);
      const nextIdx = (idx + 1) % TIGERS.length;
      navigateTiger(TIGERS[nextIdx]);
    }});

    window.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowLeft') {{
        document.getElementById('prevBtn').click();
      }} else if (e.key === 'ArrowRight') {{
        document.getElementById('nextBtn').click();
      }}
    }});

    window.addEventListener('popstate', () => {{
      renderTiger(getSelectedTiger());
    }});

    // Initial render
    renderTiger(getSelectedTiger());
  </script>
  <script src="/js/nav-physics.js" defer></script>
</body>
</html>"""

with open('public/shutabug/dossier.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Generated public/shutabug/dossier.html cleanly!')
