document.addEventListener('DOMContentLoaded', () => {
  const cartCount = document.querySelector('#cart-count');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  // Use the approved brand asset everywhere instead of the temporary text mark.
  document.querySelectorAll('.brand').forEach((brand) => {
    const mark = brand.querySelector('.brand-mark');
    if (!mark) return;
    mark.outerHTML = '<img class="brand-logo" src="assets/gifty-hampers.png" alt="Gifty Hamper" width="42" height="42">';
  });

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
