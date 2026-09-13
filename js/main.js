document.addEventListener('DOMContentLoaded', () => {
  // The supplied Gifty Hamper logo already contains the icon and wordmark, so use it as the complete brand lockup.
  document.querySelectorAll('.brand-logo').forEach((logo) => {
    logo.style.width = 'auto';
    logo.style.height = '44px';
    logo.style.maxWidth = '190px';
    logo.style.objectFit = 'contain';
    logo.style.display = 'block';
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    }, { once: true });
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
