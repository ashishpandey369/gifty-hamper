document.addEventListener('DOMContentLoaded', () => {
  // Match the reference site's larger Gifty Hamper logo treatment while keeping it responsive.
  document.querySelectorAll('.brand-logo').forEach((logo) => {
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    logo.style.width = 'auto';
    logo.style.height = mobile ? '55px' : '75px';
    logo.style.maxWidth = mobile ? '170px' : '210px';
    logo.style.objectFit = 'contain';
    logo.style.display = 'block';
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    }, { once: true });
  });

  // Match the reference site's light contact-information ribbon.
  document.querySelectorAll('.announcement-bar').forEach((bar) => {
    bar.style.background = '#f3f3f3';
    bar.style.color = '#20201e';
  });
  document.querySelectorAll('.announcement-inner').forEach((inner) => {
    inner.style.minHeight = '40px';
    inner.style.justifyContent = 'flex-start';
    inner.style.gap = '22px';
    inner.style.flexWrap = 'wrap';
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
