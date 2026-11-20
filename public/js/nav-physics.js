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
    let isHovering = false;

    function movePillTo(element, isImmediate) {
      if (!element) return;
      const left = element.offsetLeft;
      const width = element.offsetWidth;
      if (isImmediate) {
        pill.style.transition = 'none';
      } else {
        pill.style.transition = 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), width 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease';
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
        const href = tab.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
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

    // Auto-update active tab and route tag on page scroll
    const sceneSections = ['s1', 's2', 's3', 's4'].map(id => document.getElementById(id)).filter(Boolean);
    const routeTag = document.getElementById('routeTag');

    const sceneRoutes = {
      s1: 'home',
      s2: 'forest',
      s3: 'tiger',
      s4: 'field',
      s5: 'core'
    };

    function onScroll() {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentId = 's1';
      for (const section of sceneSections) {
        if (section.offsetTop <= scrollPos) {
          currentId = section.id;
        }
      }
      const matchingTab = tabs.find(t => t.getAttribute('data-nav') === currentId);
      if (matchingTab && matchingTab !== activeTab) {
        tabs.forEach(t => t.classList.remove('active'));
        matchingTab.classList.add('active');
        activeTab = matchingTab;
        if (!isHovering) {
          movePillTo(activeTab);
        }
      }
      if (routeTag && sceneRoutes[currentId]) {
        const lbl = routeTag.querySelector('.lbl') || routeTag;
        lbl.innerHTML = `<i>/</i>${sceneRoutes[currentId]}`;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavCapsule();
      initLooksToggle();
    });
  } else {
    initNavCapsule();
    initLooksToggle();
  }
})();
