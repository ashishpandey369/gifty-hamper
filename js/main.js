document.addEventListener('DOMContentLoaded', () => {
  // Use the real Gifty Hamper logo everywhere the shared brand-mark exists.
  document.querySelectorAll('.brand-mark').forEach((mark) => {
    const logo = document.createElement('img');
    logo.src = 'assets/gifty-hampers.png';
    logo.alt = 'Gifty Hamper';
    logo.className = 'brand-logo';
    logo.style.width = '38px';
    logo.style.height = '38px';
    logo.style.objectFit = 'contain';
    logo.style.display = 'block';
    mark.replaceWith(logo);
  });

  document.querySelectorAll('.brand-logo').forEach((logo) => {
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
