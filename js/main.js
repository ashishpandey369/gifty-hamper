document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;

  // Header sizing: increase the current logo treatment by another 10%.
  document.querySelectorAll('.brand-logo').forEach((logo) => {
    logo.style.width = 'auto';
    logo.style.height = isMobile ? '60.5px' : '82.5px';
    logo.style.maxWidth = isMobile ? '187px' : '231px';
    logo.style.objectFit = 'contain';
    logo.style.display = 'block';
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    }, { once: true });
  });

  // Reference-style contact ribbon, with a 10% larger information treatment.
  document.querySelectorAll('.announcement-bar').forEach((bar) => {
    bar.style.background = '#f3f3f3';
    bar.style.color = '#20201e';
    bar.style.fontSize = '0.86rem';
  });
  document.querySelectorAll('.announcement-inner').forEach((inner) => {
    inner.style.minHeight = isMobile ? '38px' : '44px';
    inner.style.justifyContent = isMobile ? 'center' : 'flex-start';
    inner.style.gap = isMobile ? '8px 16px' : '24px';
    inner.style.flexWrap = 'wrap';
  });

  // Slightly enlarge the main header controls and navigation.
  document.querySelectorAll('.site-header').forEach((header) => {
    header.style.minHeight = isMobile ? '76px' : '90px';
  });
  document.querySelectorAll('.header-inner').forEach((inner) => {
    inner.style.minHeight = isMobile ? '76px' : '90px';
    inner.style.gap = isMobile ? '12px' : '42px';
  });
  document.querySelectorAll('.primary-nav').forEach((nav) => {
    nav.style.fontSize = isMobile ? '0.9rem' : '0.92rem';
    nav.style.gap = isMobile ? '0' : '30px';
  });
  document.querySelectorAll('.icon-button').forEach((button) => {
    button.style.width = isMobile ? '36px' : '42px';
    button.style.height = isMobile ? '36px' : '42px';
    button.style.fontSize = isMobile ? '1rem' : '1.15rem';
  });

  // Account button is UI-only for now. Authentication and order history will be added later.
  document.querySelectorAll('.login-button').forEach((button) => {
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.gap = '7px';
    button.style.minHeight = isMobile ? '36px' : '42px';
    button.style.padding = isMobile ? '0 9px' : '0 15px';
    button.style.borderRadius = '999px';
    button.style.background = '#f0eee9';
    button.style.color = '#20201e';
    button.style.fontSize = isMobile ? '0.82rem' : '0.9rem';
    button.style.fontWeight = '600';
    button.style.whiteSpace = 'nowrap';
    button.style.border = '1px solid rgba(32,32,30,.06)';
  });
  if (isMobile) {
    document.querySelectorAll('.login-button span').forEach((label) => {
      label.style.display = 'none';
    });
  }

  const cartCount = document.querySelector('#cart-count');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  if (cartCount) {
    try {
      const cart = JSON.parse(localStorage.getItem('gifty-hamper-cart') || '[]');
      cartCount.textContent = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    } catch {
      cartCount.textContent = '0';
    }
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      primaryNav.classList.toggle('open', !open);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        primaryNav.classList.remove('open');
      });
    });
  }
});
