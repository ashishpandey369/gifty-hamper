document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;

  // Branded page loader: the Gifty Hamper logo softly brightens while the page loads.
  const loader = document.createElement('div');
  loader.setAttribute('aria-label', 'Loading Gifty Hamper');
  loader.setAttribute('role', 'status');
  loader.innerHTML = '<div class="gh-loader-logo-wrap"><img src="assets/gifty-hampers-landscape.png" alt="Gifty Hamper" class="gh-loader-logo"><span class="gh-loader-shine"></span></div><span class="gh-loader-text">Loading...</span>';
  loader.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:#fffdf9;opacity:1;visibility:visible;transition:opacity .45s ease,visibility .45s ease;pointer-events:auto;';
  const loaderStyle = document.createElement('style');
  loaderStyle.textContent = '@keyframes ghLogoPulse{0%,100%{filter:brightness(.72) drop-shadow(0 0 0 rgba(166,93,71,0));transform:scale(.985)}50%{filter:brightness(1.22) drop-shadow(0 0 18px rgba(166,93,71,.28));transform:scale(1.015)}}@keyframes ghShine{0%{left:-45%;opacity:0}18%{opacity:.85}55%{left:120%;opacity:.2}100%{left:120%;opacity:0}}@keyframes ghLoaderText{0%,100%{opacity:.45}50%{opacity:1}}.gh-loader-logo-wrap{position:relative;width:min(300px,72vw);overflow:hidden;display:flex;justify-content:center;align-items:center}.gh-loader-logo{width:100%;height:auto;display:block;object-fit:contain;animation:ghLogoPulse 1.55s ease-in-out infinite}.gh-loader-shine{position:absolute;top:-20%;left:-45%;width:25%;height:140%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.9),transparent);transform:skewX(-18deg);animation:ghShine 1.9s ease-in-out infinite;pointer-events:none}.gh-loader-text{font:600 .78rem/1.2 "DM Sans",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#706e68;animation:ghLoaderText 1.2s ease-in-out infinite}.gh-loader-hide{opacity:0!important;visibility:hidden!important;pointer-events:none!important}';
  document.head.appendChild(loaderStyle);
  document.body.prepend(loader);
  const hideLoader = () => { loader.classList.add('gh-loader-hide'); setTimeout(() => { loader.remove(); loaderStyle.remove(); }, 500); };
  if (document.readyState === 'complete') setTimeout(hideLoader, 250); else window.addEventListener('load', () => setTimeout(hideLoader, 250), { once: true });

  document.querySelectorAll('.brand-logo').forEach((logo) => {
    logo.style.width = 'auto'; logo.style.height = isMobile ? '60.5px' : '82.5px'; logo.style.maxWidth = isMobile ? '187px' : '231px'; logo.style.objectFit = 'contain'; logo.style.display = 'block';
    logo.addEventListener('error', () => { logo.style.display = 'none'; }, { once: true });
  });
  document.querySelectorAll('.announcement-bar').forEach((bar) => { bar.style.background = '#f3f3f3'; bar.style.color = '#20201e'; bar.style.fontSize = '0.86rem'; });
  document.querySelectorAll('.announcement-inner').forEach((inner) => { inner.style.minHeight = isMobile ? '38px' : '44px'; inner.style.justifyContent = isMobile ? 'center' : 'flex-start'; inner.style.gap = isMobile ? '8px 16px' : '24px'; inner.style.flexWrap = 'wrap'; });
  document.querySelectorAll('.site-header').forEach((header) => { header.style.minHeight = isMobile ? '76px' : '90px'; });
  document.querySelectorAll('.header-inner').forEach((inner) => { inner.style.minHeight = isMobile ? '76px' : '90px'; inner.style.gap = isMobile ? '12px' : '42px'; });
  document.querySelectorAll('.primary-nav').forEach((nav) => { nav.style.fontSize = isMobile ? '0.9rem' : '0.92rem'; nav.style.gap = isMobile ? '0' : '30px'; });
  document.querySelectorAll('.icon-button').forEach((button) => { button.style.width = isMobile ? '36px' : '42px'; button.style.height = isMobile ? '36px' : '42px'; button.style.fontSize = isMobile ? '1rem' : '1.15rem'; });
  document.querySelectorAll('.login-button').forEach((button) => { button.style.display = 'inline-flex'; button.style.alignItems = 'center'; button.style.justifyContent = 'center'; button.style.gap = '7px'; button.style.minHeight = isMobile ? '36px' : '42px'; button.style.padding = isMobile ? '0 9px' : '0 15px'; button.style.borderRadius = '999px'; button.style.background = '#f0eee9'; button.style.color = '#20201e'; button.style.fontSize = isMobile ? '0.82rem' : '0.9rem'; button.style.fontWeight = '600'; button.style.whiteSpace = 'nowrap'; button.style.border = '1px solid rgba(32,32,30,.06)'; });
  if (isMobile) document.querySelectorAll('.login-button span').forEach((label) => { label.style.display = 'none'; });

  document.querySelectorAll('.hero-copy').forEach((text) => { text.style.fontSize = isMobile ? '1.0528rem' : '1.176rem'; });
  document.querySelectorAll('.hero-actions .button, .hero-actions .text-link').forEach((link) => { link.style.fontSize = '0.9184rem'; });
  document.querySelectorAll('.hero-trust').forEach((trust) => { trust.style.fontSize = '0.8064rem'; });

  document.querySelectorAll('.site-footer').forEach((footer) => { footer.style.background = '#101010'; footer.style.color = '#fff'; footer.style.padding = isMobile ? '42px 0 18px' : '54px 0 18px'; });
  document.querySelectorAll('.site-footer .container').forEach((container) => { container.style.width = isMobile ? 'calc(100% - 30px)' : 'calc(100% - 160px)'; container.style.maxWidth = isMobile ? '1180px' : '1206px'; });
  document.querySelectorAll('.footer-grid').forEach((grid) => { grid.style.gridTemplateColumns = isMobile ? '1fr' : '290px 300px 305px 1fr'; grid.style.gap = isMobile ? '34px' : '20px'; grid.style.paddingBottom = isMobile ? '34px' : '44px'; });
  document.querySelectorAll('.footer-brand').forEach((brand) => { brand.style.display = 'flex'; brand.style.flexDirection = 'column'; brand.style.alignItems = 'flex-start'; brand.style.justifyContent = 'flex-start'; });
  document.querySelectorAll('.footer-brand .brand-logo').forEach((logo) => { logo.style.width = isMobile ? '285px' : '300px'; logo.style.height = 'auto'; logo.style.maxWidth = isMobile ? '285px' : '300px'; });
  document.querySelectorAll('.site-footer .footer-grid h3').forEach((heading) => { heading.style.fontFamily = "'DM Sans', Arial, sans-serif"; heading.style.textTransform = 'none'; heading.style.letterSpacing = '0'; heading.style.fontSize = isMobile ? '1.05rem' : '20px'; heading.style.fontWeight = '700'; heading.style.margin = '0 0 16px'; heading.style.color = '#fff'; });
  document.querySelectorAll('.site-footer .footer-grid > div:not(:first-child) > a').forEach((link) => { link.style.color = '#f2f2f2'; link.style.fontSize = isMobile ? '0.88rem' : '15px'; link.style.lineHeight = '1.45'; link.style.margin = '0 0 9px'; });
  document.querySelectorAll('.footer-follow').forEach((label) => { label.style.display = 'block'; label.style.marginTop = isMobile ? '12px' : '10px'; label.style.fontSize = isMobile ? '1.05rem' : '16px'; label.style.fontWeight = '700'; label.style.color = '#fff'; });
  document.querySelectorAll('.footer-socials').forEach((socials) => { socials.style.display = 'flex'; socials.style.alignItems = 'center'; socials.style.gap = '10px'; socials.style.marginTop = '10px'; });

  const socialAssets = { Facebook: 'assets/social-facebook.svg', X: 'assets/social-x.svg', Pinterest: 'assets/social-pinterest.svg', LinkedIn: 'assets/social-linkedin.svg' };
  const socialColors = { Facebook: '#1877F2', X: '#000000', Pinterest: '#E60023', LinkedIn: '#0A66C2' };
  document.querySelectorAll('.footer-social').forEach((social) => { const label = social.getAttribute('aria-label') || ''; if (socialAssets[label]) { social.textContent = ''; const image = document.createElement('img'); image.src = socialAssets[label]; image.alt = label; image.width = 18; image.height = 18; image.style.cssText = 'width:18px;height:18px;display:block;object-fit:contain;filter:brightness(0) invert(1)'; social.appendChild(image); } social.style.width = '34px'; social.style.height = '34px'; social.style.display = 'grid'; social.style.placeItems = 'center'; social.style.borderRadius = '50%'; social.style.background = socialColors[label] || '#242424'; social.style.color = '#fff'; social.style.padding = '0'; social.style.overflow = 'hidden'; });
  document.querySelectorAll('.footer-contact-details').forEach((details) => { details.style.display = 'grid'; details.style.gap = '18px'; });
  document.querySelectorAll('.footer-contact-details p').forEach((item) => { item.style.margin = '0'; item.style.color = '#f2f2f2'; item.style.fontSize = isMobile ? '0.88rem' : '15px'; item.style.lineHeight = '1.55'; });
  document.querySelectorAll('.footer-contact-details a').forEach((item) => { item.style.color = '#fff'; item.style.fontWeight = '600'; });
  document.querySelectorAll('.footer-bottom').forEach((bottom) => { bottom.style.borderTop = '1px solid #303030'; bottom.style.paddingTop = '18px'; bottom.style.color = '#d0d0d0'; bottom.style.fontSize = isMobile ? '0.76rem' : '14px'; bottom.style.gap = '16px'; bottom.style.flexWrap = 'wrap'; });
  document.querySelectorAll('.payment-badges').forEach((badges) => { badges.style.display = 'flex'; badges.style.alignItems = 'center'; badges.style.justifyContent = isMobile ? 'flex-start' : 'flex-end'; badges.style.flexWrap = 'wrap'; badges.style.gap = '5px'; });

  const paymentAssets = { VISA: 'assets/payment-visa.svg', MasterCard: 'assets/payment-mastercard.svg', PayPal: 'assets/payment-paypal.svg', RuPay: 'assets/payment-rupay.svg' };
  document.querySelectorAll('.payment-badges').forEach((badges) => {
    badges.querySelectorAll('.payment-badge').forEach((badge) => {
      const label = badge.textContent.trim().replace(/\s+/g, ' ');
      if (label === 'VISA Electron') { badge.remove(); }
    });
    if (!Array.from(badges.querySelectorAll('.payment-badge')).some((badge) => badge.textContent.trim().replace(/\s+/g, ' ') === 'UPI')) {
      const upiBadge = document.createElement('span'); upiBadge.className = 'payment-badge'; upiBadge.textContent = 'UPI'; badges.appendChild(upiBadge);
    }
    badges.querySelectorAll('.payment-badge').forEach((badge) => {
      const label = badge.textContent.trim().replace(/\s+/g, ' ');
      const asset = label === 'UPI' ? 'assets/payment-upi.svg' : paymentAssets[label];
      badge.textContent = '';
      if (asset) {
        const image = document.createElement('img'); image.src = asset; image.alt = label;
        image.style.maxWidth = label === 'UPI' ? '74px' : '64px'; image.style.maxHeight = label === 'UPI' ? '27px' : '22px'; image.style.width = 'auto'; image.style.height = 'auto'; image.style.display = 'block'; image.style.objectFit = 'contain'; badge.appendChild(image);
      }
      badge.style.minWidth = label === 'UPI' ? '82px' : '66px'; badge.style.height = '32px'; badge.style.padding = '4px 6px'; badge.style.display = 'grid'; badge.style.placeItems = 'center'; badge.style.background = '#fff'; badge.style.color = '#111'; badge.style.borderRadius = '3px'; badge.style.boxShadow = '0 1px 2px rgba(0,0,0,.2)'; badge.style.fontSize = '0.5rem'; badge.style.fontWeight = '800'; badge.style.lineHeight = '1';
    });
  });

  const year = new Date().getFullYear(); document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = year; });
  const cartCount = document.querySelector('#cart-count');
  if (cartCount) { try { const cart = JSON.parse(localStorage.getItem('gifty-hamper-cart') || '[]'); cartCount.textContent = cart.reduce((total, item) => total + Number(item.quantity || 0), 0); } catch { cartCount.textContent = '0'; } }
  const menuToggle = document.querySelector('.menu-toggle'); const primaryNav = document.querySelector('#primary-nav');
  if (menuToggle && primaryNav) { menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!open)); menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation'); primaryNav.classList.toggle('open', !open); }); primaryNav.querySelectorAll('a').forEach((link) => { link.addEventListener('click', () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); primaryNav.classList.remove('open'); }); }); }
});
