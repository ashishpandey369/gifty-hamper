(() => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ghGiftEnter { 0% { transform: translateY(80px) scale(.72) rotate(-4deg); opacity:0; } 55% { transform: translateY(-8px) scale(1.04) rotate(1deg); opacity:1; } 100% { transform: translateY(0) scale(1) rotate(0); opacity:1; } }
    @keyframes ghGiftLid { 0%,45% { transform: translateY(0) rotate(0); } 70%,100% { transform: translateY(-48px) rotate(-14deg); } }
    @keyframes ghGiftGlow { 0%,100% { opacity:.25; transform:scale(.8); } 50% { opacity:.9; transform:scale(1.25); } }
    @keyframes ghGiftSpark { 0% { transform:translate(0,20px) scale(.2); opacity:0; } 35% { opacity:1; } 100% { transform:translate(var(--x),var(--y)) scale(1); opacity:0; } }
    @keyframes ghGiftClose { to { opacity:0; } }
    .gh-transition { position:fixed; inset:0; z-index:100000; display:flex; align-items:center; justify-content:center; background:rgba(255,253,249,.96); backdrop-filter:blur(7px); opacity:1; animation:ghGiftClose .35s ease 1.15s forwards; pointer-events:auto; }
    .gh-transition-box { position:relative; width:150px; height:125px; animation:ghGiftEnter .6s cubic-bezier(.2,.8,.2,1) both; }
    .gh-gift-glow { position:absolute; left:50%; top:55%; width:210px; height:150px; transform:translate(-50%,-50%); border-radius:50%; background:rgba(166,93,71,.2); filter:blur(30px); animation:ghGiftGlow 1s ease-in-out infinite; }
    .gh-gift-body { position:absolute; left:18px; right:18px; bottom:8px; height:82px; border-radius:8px 8px 12px 12px; background:linear-gradient(135deg,#b86b50,#93472f); box-shadow:0 18px 35px rgba(88,45,33,.2); overflow:hidden; }
    .gh-gift-body:before { content:''; position:absolute; left:50%; top:0; bottom:0; width:18px; transform:translateX(-50%); background:#e4b08f; }
    .gh-gift-lid { position:absolute; left:8px; right:8px; top:30px; height:28px; border-radius:7px; background:linear-gradient(135deg,#c77a5d,#9d4e35); box-shadow:0 8px 15px rgba(88,45,33,.16); transform-origin:15% 90%; z-index:3; animation:ghGiftLid .9s cubic-bezier(.2,.8,.2,1) both; }
    .gh-gift-lid:after { content:''; position:absolute; left:50%; top:-5px; width:18px; height:38px; transform:translateX(-50%); background:#e4b08f; border-radius:4px; }
    .gh-gift-ribbon { position:absolute; left:50%; top:10px; width:5px; height:25px; transform:translateX(-50%); background:#f0c4a7; z-index:4; border-radius:5px; }
    .gh-gift-spark { position:absolute; left:50%; top:38%; color:#b35f45; font-size:24px; font-weight:700; animation:ghGiftSpark 1s ease-out both; }
    .gh-spark-1 { --x:-110px; --y:-90px; animation-delay:.35s; }
    .gh-spark-2 { --x:105px; --y:-80px; animation-delay:.45s; }
    .gh-spark-3 { --x:-85px; --y:80px; animation-delay:.55s; font-size:17px; }
    .gh-spark-4 { --x:95px; --y:70px; animation-delay:.65s; font-size:17px; }
    @media (prefers-reduced-motion: reduce) { .gh-transition *, .gh-transition { animation-duration:.01ms !important; animation-iteration-count:1 !important; } }
  `;
  document.head.appendChild(style);

  function navigateWithGift(url) {
    if (!url || location.href === url) return;
    const overlay = document.createElement('div');
    overlay.className = 'gh-transition';
    overlay.setAttribute('aria-label', 'Opening gift');
    overlay.setAttribute('role', 'status');
    overlay.innerHTML = '<div class="gh-transition-box"><div class="gh-gift-glow"></div><div class="gh-gift-body"></div><div class="gh-gift-lid"></div><div class="gh-gift-ribbon"></div><span class="gh-gift-spark gh-spark-1">✦</span><span class="gh-gift-spark gh-spark-2">✦</span><span class="gh-gift-spark gh-spark-3">✧</span><span class="gh-gift-spark gh-spark-4">✧</span></div>';
    document.body.appendChild(overlay);
    setTimeout(() => { window.location.href = url; }, 950);
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const raw = link.getAttribute('href');
    if (!raw || raw === '#' || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;
    const url = new URL(raw, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    event.preventDefault();
    navigateWithGift(url.href);
  });
})();
