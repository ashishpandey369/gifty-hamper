document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.location-button');
  if (!button) return;

  const style = document.createElement('style');
  style.textContent = `
    .location-button{display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 13px;border:1px solid rgba(32,32,30,.08);border-radius:999px;background:#f0eee9;color:#20201e;font:600 .86rem/1 'DM Sans',Arial,sans-serif;cursor:pointer;white-space:nowrap;transition:background .2s ease,transform .2s ease}
    .location-button:hover{background:#e8e5df;transform:translateY(-1px)}
    .location-button small{font:500 .68rem/1 'DM Sans',Arial,sans-serif;color:#77716a}
    .gh-location-backdrop{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:rgba(32,32,30,.34);backdrop-filter:blur(7px);opacity:0;animation:ghLocationIn .22s ease forwards}
    .gh-location-modal{width:min(440px,100%);padding:30px;border-radius:24px;background:#fffdf9;box-shadow:0 28px 80px rgba(32,32,30,.22);position:relative}
    .gh-location-close{position:absolute;right:14px;top:12px;width:34px;height:34px;border:0;border-radius:50%;background:#f0eee9;color:#20201e;font-size:1.25rem;cursor:pointer}
    .gh-location-modal .eyebrow{margin-bottom:9px}.gh-location-modal h2{margin:0;font:700 2rem/1.05 'Playfair Display',Georgia,serif;letter-spacing:-.035em}.gh-location-copy{margin:10px 0 20px;color:#706e68;font-size:.84rem}
    .gh-location-form{display:flex;gap:9px}.gh-location-form input{flex:1;min-width:0;height:48px;padding:0 15px;border:1px solid #d8d1c6;border-radius:12px;background:#fff;color:#20201e;font:500 .9rem 'DM Sans',Arial,sans-serif;outline:none}.gh-location-form input:focus{border-color:#a65d47;box-shadow:0 0 0 3px rgba(166,93,71,.1)}
    .gh-location-form button{height:48px;padding:0 18px;border:0;border-radius:12px;background:#20201e;color:#fff;font:700 .82rem 'DM Sans',Arial,sans-serif;cursor:pointer}.gh-location-note{margin:12px 0 0;color:#8a857d;font-size:.72rem}
    @keyframes ghLocationIn{to{opacity:1}}
    @media(max-width:760px){.location-button{width:36px;height:36px;min-height:36px;padding:0;justify-content:center;font-size:1rem}.location-button span,.location-button small{display:none}.gh-location-modal{padding:26px 20px}.gh-location-modal h2{font-size:1.7rem}.gh-location-form{flex-direction:column}.gh-location-form button{width:100%}}
    @media(prefers-reduced-motion:reduce){.location-button{transition:none}.gh-location-backdrop{animation:none;opacity:1}}
  `;
  document.head.appendChild(style);

  const saved = localStorage.getItem('gifty-hamper-location') || '';
  const updateLabel = () => {
    const value = localStorage.getItem('gifty-hamper-location') || '';
    button.querySelector('[data-location-label]').textContent = value || 'Set location';
  };
  updateLabel();

  const close = (backdrop) => backdrop?.remove();
  const open = () => {
    const backdrop = document.createElement('div');
    backdrop.className = 'gh-location-backdrop';
    backdrop.innerHTML = '<div class="gh-location-modal" role="dialog" aria-modal="true" aria-labelledby="gh-location-title"><button class="gh-location-close" type="button" aria-label="Close location selector">×</button><p class="eyebrow">Delivery location</p><h2 id="gh-location-title">Where should we deliver?</h2><p class="gh-location-copy">Enter the recipient PIN code so we can prepare location-based delivery options.</p><form class="gh-location-form"><input name="pincode" inputmode="numeric" autocomplete="postal-code" maxlength="6" placeholder="Enter 6-digit PIN code" required><button type="submit">Save location</button></form><p class="gh-location-note">This currently saves your preference on this device. Delivery availability will connect to WooCommerce later.</p></div>';
    document.body.appendChild(backdrop);
    const modal = backdrop.querySelector('.gh-location-modal');
    const input = backdrop.querySelector('input');
    input.value = saved || localStorage.getItem('gifty-hamper-location') || '';
    input.focus();
    backdrop.querySelector('.gh-location-close').addEventListener('click', () => close(backdrop));
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(backdrop); });
    backdrop.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!/^\d{6}$/.test(value)) { input.setCustomValidity('Please enter a valid 6-digit PIN code.'); input.reportValidity(); return; }
      input.setCustomValidity('');
      localStorage.setItem('gifty-hamper-location', value);
      updateLabel();
      close(backdrop);
    });
    modal.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(backdrop); });
  };

  button.addEventListener('click', open);
});
