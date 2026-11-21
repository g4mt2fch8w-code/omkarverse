// Omkarverse Unified Navigation Capsule & Theme Pointer Physics (108.supply style)
(function () {
  'use strict';

  function initNavCapsule() {
    const capsule = document.getElementById('navCapsule');
    const pill = document.getElementById('navPillBg');
    if (!capsule || !pill) return;

    const tabs = Array.from(capsule.querySelectorAll('.nav-tab'));
    if (!tabs.length) return;

    let activeTab = tabs.find(t => t.classList.contains('active')) || tabs[0];
    if (window.location.pathname.startsWith('/tiger')) {
      const tigerTab = tabs.find(t => t.getAttribute('data-nav') === 'tiger');
      if (tigerTab) {
        tabs.forEach(t => t.classList.remove('active'));
        tigerTab.classList.add('active');
        activeTab = tigerTab;
      }
    } else if (window.location.pathname.startsWith('/field')) {
      const fieldTab = tabs.find(t => t.getAttribute('data-nav') === 'field');
      if (fieldTab) {
        tabs.forEach(t => t.classList.remove('active'));
        fieldTab.classList.add('active');
        activeTab = fieldTab;
      }
    } else if (window.location.pathname.startsWith('/telemetry')) {
      const telemetryTab = tabs.find(t => t.getAttribute('data-nav') === 'telemetry');
      if (telemetryTab) {
        tabs.forEach(t => t.classList.remove('active'));
        telemetryTab.classList.add('active');
        activeTab = telemetryTab;
      }
    }
    let isHovering = false;

    function movePillTo(element, isImmediate) {
      if (!element) return;
      const left = element.offsetLeft;
      const width = element.offsetWidth;
      if (isImmediate) {
        pill.style.transition = 'none';
      } else {
        pill.style.transition = 'transform 0.36s cubic-bezier(0.25, 1, 0.35, 1), width 0.36s cubic-bezier(0.25, 1, 0.35, 1), opacity 0.2s ease';
      }
      pill.style.transform = `translate3d(${left}px, 0, 0)`;
      pill.style.width = `${width}px`;
      pill.style.opacity = '1';
      if (isImmediate) {
        pill.getBoundingClientRect(); // flush
        pill.style.transition = '';
      }
    }

    // Set initial position
    movePillTo(activeTab, true);
    // Double check after fonts/layout settle
    setTimeout(() => movePillTo(activeTab, true), 100);

    const navTargets = {
      core: { route: '/', targetId: 's1' },
      telemetry: { route: '/telemetry', targetId: 's4' },
      forest: { route: '/forest', targetId: 's3' },
      tiger: { route: '/tiger', targetId: 's2' },
      field: { route: '/field', targetId: 's5' }
    };

    tabs.forEach(tab => {
      tab.addEventListener('mouseenter', () => {
        isHovering = true;
        movePillTo(tab);
      });
      tab.addEventListener('focus', () => {
        isHovering = true;
        movePillTo(tab);
      });
      tab.addEventListener('click', (e) => {
        const navKey = tab.getAttribute('data-nav') || 'core';
        const isTigerPage = window.location.pathname.startsWith('/tiger');
        const isFieldPage = window.location.pathname.startsWith('/field');
        const isTelemetryPage = window.location.pathname.startsWith('/telemetry');

        if (navKey === 'telemetry') {
          if (!isTelemetryPage) {
            window.location.href = '/telemetry';
            return;
          }
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (navKey === 'tiger') {
          if (!isTigerPage) {
            window.location.href = '/tiger';
            return;
          }
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (navKey === 'field') {
          if (!isFieldPage) {
            window.location.href = '/field';
            return;
          }
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (isTigerPage || isFieldPage || isTelemetryPage) {
          if (navKey === 'core') {
            window.location.href = '/';
            return;
          } else if (navKey === 'forest') {
            window.location.href = '/#s3';
            return;
          }
        }

        e.preventDefault();
        const route = tab.getAttribute('data-route') || (navTargets[navKey] ? navTargets[navKey].route : '/');
        const targetId = navTargets[navKey] ? navTargets[navKey].targetId : 's1';
        const href = tab.getAttribute('href');
        let target = document.getElementById(targetId);
        if (!target && href && href.startsWith('#')) {
          try {
            target = document.querySelector(href);
          } catch (err) {}
        }

        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }

        try {
          if (window.location.pathname !== route) {
            history.pushState({ nav: navKey }, '', route);
          }
        } catch (err) {}

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab;
        movePillTo(tab);
      });
    });

    capsule.addEventListener('mouseleave', () => {
      isHovering = false;
      movePillTo(activeTab);
    });

    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      const tabForPath = tabs.find(t => t.getAttribute('data-route') === path);
      if (tabForPath) {
        tabs.forEach(t => t.classList.remove('active'));
        tabForPath.classList.add('active');
        activeTab = tabForPath;
        movePillTo(tabForPath);
      }
    });

    // Auto-update active tab and route tag on page scroll
    function onScroll() {
      if (window.location.pathname.startsWith('/tiger') || window.location.pathname.startsWith('/telemetry')) return;
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentNav = 'core';

      const s1 = document.getElementById('s1');
      const s2 = document.getElementById('s2');
      const s3 = document.getElementById('s3');
      const s4 = document.getElementById('s4');
      const s5 = document.getElementById('s5');

      if (s5 && s5.offsetTop <= scrollPos) {
        currentNav = 'field';
      } else if (s4 && s4.offsetTop <= scrollPos) {
        currentNav = 'telemetry';
      } else if (s3 && s3.offsetTop <= scrollPos) {
        currentNav = 'forest';
      } else if (s2 && s2.offsetTop <= scrollPos) {
        currentNav = 'tiger';
      } else {
        currentNav = 'core';
      }

      const matchingTab = tabs.find(t => t.getAttribute('data-nav') === currentNav);
      if (matchingTab && matchingTab !== activeTab) {
        tabs.forEach(t => t.classList.remove('active'));
        matchingTab.classList.add('active');
        activeTab = matchingTab;
        if (!isHovering) {
          movePillTo(activeTab);
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => movePillTo(activeTab, true), { passive: true });
  }

  function initLooksToggle() {
    const looks = document.getElementById('looksToggle') || document.querySelector('.looks');
    const pill = document.getElementById('looksPillBg');
    if (!looks || !pill) return;

    const buttons = Array.from(looks.querySelectorAll('button[data-look]'));
    if (!buttons.length) return;

    function movePillTo(btn, isImmediate) {
      if (!btn) return;
      const left = btn.offsetLeft;
      const width = btn.offsetWidth;
      if (isImmediate) {
        pill.style.transition = 'none';
      } else {
        pill.style.transition = 'transform 0.32s cubic-bezier(0.23, 1, 0.32, 1), width 0.32s cubic-bezier(0.23, 1, 0.32, 1)';
      }
      pill.style.transform = `translate3d(${left}px, 0, 0)`;
      pill.style.width = `${width}px`;
      pill.style.opacity = '1';
      if (isImmediate) {
        pill.getBoundingClientRect();
        pill.style.transition = '';
      }
    }

    function getActiveBtn() {
      const currentLook = document.documentElement.getAttribute('data-look') || 'night';
      return buttons.find(b => b.getAttribute('data-look') === currentLook) || buttons[0];
    }

    movePillTo(getActiveBtn(), true);
    setTimeout(() => movePillTo(getActiveBtn(), true), 100);

    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        movePillTo(btn);
      });
      btn.addEventListener('click', () => {
        const look = btn.getAttribute('data-look');
        document.documentElement.setAttribute('data-look', look);
        try { localStorage.setItem('ins.look', look); } catch(e) {}
        buttons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        movePillTo(btn);
      });
    });

    looks.addEventListener('mouseleave', () => {
      movePillTo(getActiveBtn());
    });

    // Observer on html[data-look] attribute changes
    const observer = new MutationObserver(() => {
      movePillTo(getActiveBtn());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-look'] });
    window.addEventListener('resize', () => movePillTo(getActiveBtn(), true), { passive: true });
  }

  function initGlobeClickScroll() {
    const hint1 = document.getElementById('hint1');
    const s2 = document.getElementById('s2');

    function scrollToNext() {
      if (s2) {
        s2.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }

    if (hint1) {
      hint1.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToNext();
      });
    }

    // Globe click detection on canvas / stage 1
    // Differentiate between clicking (trigger scroll) vs dragging to rotate the globe
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDown = false;

    window.addEventListener('pointerdown', (e) => {
      // Ignore if clicking on interactive UI controls
      if (e.target && e.target.closest && e.target.closest('a, button, input, summary, select, .top, .nav-capsule, .looks, .stage-cta, #stage01Cta')) {
        isDown = false;
        return;
      }
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      isDown = true;
    }, { passive: true });

    window.addEventListener('pointerup', (e) => {
      if (!isDown) return;
      isDown = false;
      const dx = Math.hypot(e.clientX - startX, e.clientY - startY);
      const dt = Date.now() - startTime;

      // If user moved less than 12px within 450ms, it is a click, not a rotation drag
      if (dx < 12 && dt < 450) {
        // Only trigger scroll when in the top hero/globe section
        if (window.scrollY < window.innerHeight * 0.75) {
          scrollToNext();
        }
      }
    }, { passive: true });
  }

  function initFieldDossierGateway() {
    const dossierBtn = document.getElementById('openFieldDossier');
    if (!dossierBtn) return;

    dossierBtn.addEventListener('click', (e) => {
      if (window.omkarverseAudio && typeof window.omkarverseAudio.playStellarFissionCue === 'function') {
        window.omkarverseAudio.playStellarFissionCue();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavCapsule();
      initLooksToggle();
      initGlobeClickScroll();
      initFieldDossierGateway();
    });
  } else {
    initNavCapsule();
    initLooksToggle();
    initGlobeClickScroll();
    initFieldDossierGateway();
  }
})();
