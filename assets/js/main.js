(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const drop = document.querySelector('.nav-dropdown');
  const dropToggle = document.querySelector('.nav-drop-toggle');
  if (drop && dropToggle) {
    dropToggle.addEventListener('click', () => {
      const open = drop.classList.toggle('is-open');
      dropToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      nav?.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      drop?.classList.remove('is-open');
      dropToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll('[role="tab"]')];
    const panels = [...tabs.querySelectorAll('[role="tabpanel"]')];

    function selectTab(button) {
      const key = button.dataset.tab;
      buttons.forEach((b) => b.setAttribute('aria-selected', String(b === button)));
      panels.forEach((panel) => {
        const active = panel.dataset.panel === key;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => selectTab(button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        buttons[next].focus();
        selectTab(buttons[next]);
      });
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();