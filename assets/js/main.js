(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const drop = document.querySelector('.nav-dropdown');
  const dropToggle = document.querySelector('.nav-drop-toggle');

  if (drop && dropToggle) {
    dropToggle.addEventListener('click', () => {
      const open = drop.classList.toggle('is-open');
      dropToggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (event) => {
      if (!drop.contains(event.target)) {
        drop.classList.remove('is-open');
        dropToggle.setAttribute('aria-expanded', 'false');
      }
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
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const stage = document.querySelector('[data-parallax-stage]');
  const canParallax = stage &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !reduceMotion;

  if (canParallax) {
    const items = [...stage.querySelectorAll('[data-parallax-item]')];

    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      items.forEach((item) => {
        const strength = Number(item.dataset.parallaxItem || 0);
        const tx = Math.max(-8, Math.min(8, x * strength));
        const ty = Math.max(-8, Math.min(8, y * strength));
        item.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      });
    });

    stage.addEventListener('pointerleave', () => {
      items.forEach((item) => {
        item.style.transform = '';
      });
    });
  }
})();