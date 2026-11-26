(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
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
