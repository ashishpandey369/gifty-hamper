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

  // Reference-inspired footer treatment: dark, spacious and readable.
  document.querySelectorAll('.site-footer').forEach((footer) => {
    footer.style.background = '#101010';
    footer.style.color = '#fff';
    footer.style.padding = isMobile ? '48px 0 18px' : '58px 0 18px';
  });
  document.querySelectorAll('.footer-grid').forEach((grid) => {
    grid.style.gridTemplateColumns = isMobile ? '1fr' : '1.35fr 1.15fr 1.15fr 1.25fr';
    grid.style.gap = isMobile ? '34px' : '52px';
    grid.style.paddingBottom = isMobile ? '38px' : '48px';
  });
  document.querySelectorAll('.footer-brand .brand-logo').forEach((logo) => {
    logo.style.height = isMobile ? '72px' : '96px';
    logo.style.maxWidth = isMobile ? '235px' : '300px';
  });
  document.querySelectorAll('.site-footer .footer-brand p, .site-footer .footer-grid > div:last-child p').forEach((text) => {
    text.style.color = '#c8c8c8';
    text.style.fontSize = isMobile ? '0.86rem' : '0.9rem';
    text.style.lineHeight = '1.7';
  });
  document.querySelectorAll('.site-footer .footer-grid h3').forEach((heading) => {
    heading.style.fontFamily = "'DM Sans', Arial, sans-serif";
    heading.style.textTransform = 'none';
    heading.style.letterSpacing = '0';
    heading.style.fontSize = isMobile ? '1.05rem' : '1.12rem';
    heading.style.fontWeight = '700';
    heading.style.margin = '0 0 18px';
  });
  document.querySelectorAll('.site-footer .footer-grid > div:not(:first-child) > a').forEach((link) => {
    link.style.color = '#f2f2f2';
    link.style.fontSize = isMobile ? '0.88rem' : '0.9rem';
    link.style.lineHeight = '1.45';
    link.style.margin = '0 0 11px';
  });
  document.querySelectorAll('.site-footer .footer-contact').forEach((link) => {
    link.style.color = '#fff';
    link.style.fontSize = '0.9rem';
  });
  document.querySelectorAll('.footer-follow').forEach((label) => {
    label.style.display = 'inline-block';
    label.style.marginTop = '18px';
    label.style.fontSize = isMobile ? '1.05rem' : '1.1rem';
    label.style.fontWeight = '700';
  });
  document.querySelectorAll('.footer-socials').forEach((socials) => {
    socials.style.display = 'flex';
    socials.style.alignItems = 'center';
    socials.style.gap = '8px';
    socials.style.marginTop = '8px';
  });
  document.querySelectorAll('.footer-social').forEach((social) => {
    social.style.width = '30px';
    social.style.height = '30px';
    social.style.display = 'grid';
    social.style.placeItems = 'center';
    social.style.borderRadius = '50%';
    social.style.background = '#242424';
    social.style.color = '#fff';
    social.style.fontSize = '0.78rem';
    social.style.fontWeight = '700';
  });
  document.querySelectorAll('.footer-contact-details').forEach((details) => {
    details.style.display = 'grid';
    details.style.gap = '18px';
  });
  document.querySelectorAll('.footer-contact-details p').forEach((item) => {
    item.style.margin = '0';
    item.style.color = '#f2f2f2';
    item.style.fontSize = isMobile ? '0.88rem' : '0.9rem';
    item.style.lineHeight = '1.65';
  });
  document.querySelectorAll('.footer-contact-details a').forEach((item) => {
    item.style.color = '#fff';
    item.style.fontWeight = '600';
  });
  document.querySelectorAll('.footer-bottom').forEach((bottom) => {
    bottom.style.borderTop = '1px solid #303030';
    bottom.style.paddingTop = '18px';
    bottom.style.color = '#d0d0d0';
    bottom.style.fontSize = isMobile ? '0.76rem' : '0.8rem';
    bottom.style.gap = '16px';
    bottom.style.flexWrap = 'wrap';
  });
  document.querySelectorAll('.payment-badges').forEach((badges) => {
    badges.style.display = 'flex';
    badges.style.alignItems = 'center';
    badges.style.justifyContent = isMobile ? 'flex-start' : 'flex-end';
    badges.style.flexWrap = 'wrap';
    badges.style.gap = '6px';
  });
  document.querySelectorAll('.payment-badge').forEach((badge) => {
    badge.style.minWidth = '43px';
    badge.style.height = '25px';
    badge.style.padding = '3px 5px';
    badge.style.display = 'grid';
    badge.style.placeItems = 'center';
    badge.style.background = '#fff';
    badge.style.color = '#111';
    badge.style.borderRadius = '2px';
    badge.style.fontSize = '0.5rem';
    badge.style.fontWeight = '800';
    badge.style.lineHeight = '1';
  });

  const year = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = year;
  });

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
