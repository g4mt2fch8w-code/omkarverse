import React from "react";

export function GlobalNav({ active = "field" }: { active?: string }) {
  return (
    <header className="top">
      {/* Zone 1: Left Zone (Brand Lockup with Geometric Tiger Pugmark) */}
      <div className="top-zone top-zone-left">
        <a href="/" className="brand-group brand-logo" aria-label="THE OMKAR DEN, home">
          <span className="pugmark-icon" aria-hidden="true">
            <svg
              className="pugmark-svg"
              viewBox="0 0 32 36"
              width="26"
              height="29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Core Constant Gold Tiger Pugmark Gradients */}
                <linearGradient id="navPugmarkGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#E5A93C" />
                </linearGradient>
                <linearGradient id="navPugmarkClawGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF0" />
                  <stop offset="35%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>

                {/* Aliases ensuring constant gold in both Day and Night modes */}
                <linearGradient id="pugmarkGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#E5A93C" />
                </linearGradient>
                <linearGradient id="pugmarkClawGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF0" />
                  <stop offset="35%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <linearGradient id="pugmarkGoldDay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#E5A93C" />
                </linearGradient>
                <linearGradient id="pugmarkClawGoldDay" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF0" />
                  <stop offset="35%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
              </defs>

              {/* RETRACTABLE CLAWS */}
              <g className="pugmark-claws">
                <path className="pugmark-claw claw-1" d="M 5.0 12.0 L 4.0 6.0 L 5.5 2.5 L 6.8 5.5 L 7.0 12.0 Z" fill="url(#navPugmarkClawGold)" />
                <path className="pugmark-claw claw-2" d="M 11.2 7.5 L 11.0 1.5 L 12.5 0.2 L 13.8 2.5 L 13.6 7.5 Z" fill="url(#navPugmarkClawGold)" />
                <path className="pugmark-claw claw-3" d="M 18.4 7.5 L 18.2 2.5 L 19.5 0.2 L 21.0 1.5 L 20.8 7.5 Z" fill="url(#navPugmarkClawGold)" />
                <path className="pugmark-claw claw-4" d="M 25.0 12.0 L 25.2 5.5 L 26.5 2.5 L 28.0 6.0 L 27.0 12.0 Z" fill="url(#navPugmarkClawGold)" />
              </g>

              {/* TOE PADS */}
              <g className="pugmark-toes" fill="url(#navPugmarkGold)">
                <polygon className="pugmark-toe toe-1" points="4.2,14.5 5.2,11.8 7.8,11.0 9.2,13.2 8.8,16.0 6.5,17.0 4.8,16.0" />
                <polygon className="pugmark-toe toe-2" points="10.2,9.5 12.0,6.5 14.5,7.2 15.5,10.5 14.8,13.5 12.5,14.5 10.5,12.5" />
                <polygon className="pugmark-toe toe-3" points="17.5,7.2 20.0,6.5 21.8,9.5 21.5,12.5 19.5,14.5 17.2,13.5 16.5,10.5" />
                <polygon className="pugmark-toe toe-4" points="24.2,11.0 26.8,11.8 27.8,14.5 27.2,16.0 25.5,17.0 23.2,16.0 22.8,13.2" />
              </g>

              {/* MAIN HEEL PAD */}
              <g className="pugmark-heel" fill="url(#navPugmarkGold)">
                <polygon points="16,19.5 20.5,19.0 23.5,21.0 25.0,24.5 24.2,27.8 22.5,30.5 19.8,31.8 18.0,31.2 16.0,30.2 14.0,31.2 12.2,31.8 9.5,30.5 7.8,27.8 7.0,24.5 8.5,21.0 11.5,19.0" />
              </g>
            </svg>
          </span>

          <span className="brand-stack">
            <span className="brand-the">THE</span>
            <span className="brand-omkar">OMKAR</span>
            <span className="brand-den">DEN</span>
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation Capsule */}
      <div className="top-zone top-zone-center">
        <nav className="nav-capsule mono" id="navCapsule" role="navigation" aria-label="Core Navigation">
          <span className="nav-pill-bg" id="navPillBg" aria-hidden="true"></span>
          <a href="/" className={`nav-tab ${active === "core" ? "active" : ""}`} data-nav="core" data-route="/">
            <span className="reticle" aria-hidden="true">{active === "core" ? "◉" : "○"}</span> <span>Core</span>
          </a>
          <a href="/telemetry" className={`nav-tab ${active === "telemetry" ? "active" : ""}`} data-nav="telemetry" data-route="/telemetry">
            <span className="arrow">↗</span> <span>Telemetry</span>
          </a>
          <a href="/forest" className={`nav-tab ${active === "forest" ? "active" : ""}`} data-nav="forest" data-route="/forest">
            <span className="arrow">↗</span> <span>Forest</span>
          </a>
          <a href="/tiger" className={`nav-tab ${active === "tiger" ? "active" : ""}`} data-nav="tiger" data-route="/tiger">
            <span className="arrow">↗</span> <span>Tiger</span>
          </a>
          <a href="/field" className={`nav-tab ${active === "field" ? "active" : ""}`} data-nav="field" data-route="/field">
            <span className="reticle" aria-hidden="true">{active === "field" ? "◉" : "↗"}</span> <span>Field</span>
          </a>
        </nav>
      </div>

      {/* Zone 3: Far-Right Zone */}
      <div className="top-zone top-zone-right">
        <span className="looks mono" id="looksToggle" role="group" aria-label="Colours">
          <span className="looks-pill-bg" id="looksPillBg" aria-hidden="true"></span>
          <button type="button" data-look="night" aria-pressed="true">night</button>
          <button type="button" data-look="day" aria-pressed="false">day</button>
        </span>
        <button className="snd mono" type="button" id="snd" aria-pressed="false" title="Toggle audio">sound ○</button>
        <button className="ins-share" type="button" aria-label="Share this page" title="Share">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V3.5M8 7.5l4-4 4 4"></path>
            <path d="M8.5 10.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2h-1.5"></path>
          </svg>
        </button>
        <a className="cta mono" href="https://github.com/g4mt2fch8w-code/omkarverse" target="_blank" rel="noopener">↗ github</a>
      </div>
    </header>
  );
}
