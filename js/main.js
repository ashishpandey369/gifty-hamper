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

  // Footer treatment follows the supplied reference: logo and social row stacked on the left,
  // four balanced columns, generous vertical spacing, and a thin payment/copyright row.
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
  document.querySelectorAll('.footer-brand').forEach((brand) => {
    brand.style.display = 'flex';
    brand.style.flexDirection = 'column';
    brand.style.alignItems = 'flex-start';
    brand.style.justifyContent = 'flex-start';
  });
  document.querySelectorAll('.footer-brand .brand-logo').forEach((logo) => {
    logo.style.height = isMobile ? '92px' : '124px';
    logo.style.maxWidth = isMobile ? '285px' : '315px';
    logo.style.width = 'auto';
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
    label.style.display = 'block';
    label.style.marginTop = '18px';
    label.style.fontSize = isMobile ? '1.05rem' : '1.1rem';
    label.style.fontWeight = '700';
  });
  document.querySelectorAll('.footer-socials').forEach((socials) => {
    socials.style.display = 'flex';
    socials.style.alignItems = 'center';
    socials.style.gap = '10px';
    socials.style.marginTop = '10px';
  });

  // Brand icons are stored locally in /assets and sourced from the researched Simple Icons set.
  const socialAssets = {
    Facebook: 'assets/social-facebook.svg',
    X: 'assets/social-x.svg',
    Pinterest: 'assets/social-pinterest.svg',
    LinkedIn: 'assets/social-linkedin.svg'
  };
  document.querySelectorAll('.footer-social').forEach((social) => {
    const label = social.getAttribute('aria-label') || '';
    const asset = socialAssets[label];
    if (asset) {
      social.textContent = '';
      const image = document.createElement('img');
      image.src = asset;
      image.alt = label;
      image.width = 18;
      image.height = 18;
      image.style.width = '18px';
      image.style.height = '18px';
      image.style.display = 'block';
      image.style.objectFit = 'contain';
      social.appendChild(image);
    }
    social.style.width = isMobile ? '34px' : '34px';
    social.style.height = isMobile ? '34px' : '34px';
    social.style.display = 'grid';
    social.style.placeItems = 'center';
    social.style.borderRadius = '50%';
    social.style.background = '#242424';
    social.style.color = '#fff';
    social.style.fontSize = '0.78rem';
    social.style.fontWeight = '700';
    social.style.padding = '0';
    social.style.overflow = 'hidden';
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

  // Payment marks use Simple Icons CDN artwork instead of manually typed brand names.
  const paymentAssets = {
    VISA: 'https://cdn.simpleicons.org/visa/1a1f71',
    MasterCard: 'https://cdn.simpleicons.org/mastercard/eb001b',
    PayPal: 'https://cdn.simpleicons.org/paypal/003087',
    AMEX: 'https://cdn.simpleicons.org/americanexpress/2e77bc',
    RuPay: 'https://cdn.simpleicons.org/rupay/005baa'
  };
  document.querySelectorAll('.payment-badge').forEach((badge) => {
    const label = badge.textContent.trim().replace(/\s+/g, ' ');
    const asset = paymentAssets[label];
    if (asset) {
      badge.textContent = '';
      const image = document.createElement('img');
      image.src = asset;
      image.alt = label;
      image.style.maxWidth = '54px';
      image.style.maxHeight = '18px';
      image.style.width = 'auto';
      image.style.height = 'auto';
      image.style.display = 'block';
      badge.appendChild(image);
    }
    badge.style.minWidth = '64px';
    badge.style.height = '32px';
    badge.style.padding = '5px 7px';
    badge.style.display = 'grid';
    badge.style.placeItems = 'center';
    badge.style.background = '#fff';
    badge.style.color = '#111';
    badge.style.borderRadius = '3px';
    badge.style.boxShadow = '0 1px 2px rgba(0,0,0,.2)';
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
