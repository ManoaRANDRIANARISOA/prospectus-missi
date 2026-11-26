/* ==========================================================================
   MISSI INNOVATION — LOCAL MARKET SCRIPT (v3.1)
   - Onglets interactifs accessibles (ARIA)
   - Menu mobile accessible
   ========================================================================== */
(function () {
  'use strict';

  function switchTab(tabId) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach((panel) => {
      const isActive = panel.id === tabId;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        if (target) {
          switchTab(target);
          if (history.replaceState) {
            history.replaceState(null, '', '#' + target);
          }
        }
      });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const map = {
        scolaire: 'tab-education',
        education: 'tab-education',
        hotellerie: 'tab-hotellerie',
        resipro: 'tab-hotellerie',
        entreprises: 'tab-entreprises',
        erp: 'tab-entreprises',
        tourisme: 'tab-tourisme',
      };
      const targetId =
        map[hash] ||
        (document.getElementById(hash) && document.getElementById(hash).classList.contains('tab-panel')
          ? hash
          : null);
      if (targetId) {
        switchTab(targetId);
      }
    }

    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('site-menu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navMenu.classList.toggle('is-open', !expanded);
      });
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          menuBtn.setAttribute('aria-expanded', 'false');
          navMenu.classList.remove('is-open');
        });
      });
    }
  });
})();
