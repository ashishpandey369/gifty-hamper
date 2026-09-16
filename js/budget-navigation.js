document.addEventListener('DOMContentLoaded', () => {
  const occasions = document.querySelector('#occasions');
  if (!occasions || document.querySelector('#budget-navigation')) return;

  const style = document.createElement('style');
  style.textContent = `
    #budget-navigation{padding:78px 0 84px;background:rgba(255,250,246,.72);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
    .budget-heading{max-width:680px;margin-bottom:30px}
    .budget-heading h2{margin:0;font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.1rem,4vw,3.5rem);line-height:.98;letter-spacing:-.045em}
    .budget-heading h2 em{color:var(--accent);font-weight:600}
    .budget-heading p:last-child{max-width:600px;color:var(--muted);margin:13px 0 0;font-size:.9rem}
    .budget-tree{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .budget-node{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:150px;padding:22px;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.82);color:var(--ink);text-decoration:none;overflow:hidden;transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease}
    .budget-node:after{content:'→';position:absolute;right:18px;bottom:16px;font-size:1.15rem;transition:transform .24s ease}
    .budget-node:hover{transform:translateY(-4px);border-color:rgba(166,93,71,.3);box-shadow:0 18px 38px rgba(38,32,25,.09)}
    .budget-node:hover:after{transform:translateX(4px)}
    .budget-node small{font-size:.68rem;text-transform:uppercase;letter-spacing:.12em;color:#8b8278}
    .budget-node strong{font-family:'Playfair Display',Georgia,serif;font-size:1.55rem;line-height:1.05;max-width:130px}
    .budget-node span{font-size:.72rem;color:var(--muted)}
    @media(max-width:1000px){.budget-tree{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:760px){#budget-navigation{padding:58px 0 64px}.budget-tree{grid-template-columns:repeat(2,1fr);gap:11px}.budget-node{min-height:132px;padding:18px;border-radius:18px}.budget-node strong{font-size:1.3rem}}
    @media(max-width:430px){.budget-tree{grid-template-columns:1fr}.budget-node{min-height:112px}}
    @media(prefers-reduced-motion:reduce){.budget-node{transition:none}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'budget-navigation';
  section.className = 'section';
  section.innerHTML = `<div class="container"><div class="budget-heading"><p class="eyebrow">Shop by budget</p><h2>Find the right gift <em>for every budget.</em></h2><p>Choose a price range and continue directly to the matching gift categories and products.</p></div><div class="budget-tree" aria-label="Gift budgets"><a class="budget-node" href="shop.html?price=under-999"><small>Budget 01</small><strong>Under ₹999</strong><span>Explore categories →</span></a><a class="budget-node" href="shop.html?price=999-1999"><small>Budget 02</small><strong>₹999 – ₹1,999</strong><span>Explore categories →</span></a><a class="budget-node" href="shop.html?price=1999-2999"><small>Budget 03</small><strong>₹1,999 – ₹2,999</strong><span>Explore categories →</span></a><a class="budget-node" href="shop.html?price=3000-4999"><small>Budget 04</small><strong>₹3,000 – ₹4,999</strong><span>Explore categories →</span></a><a class="budget-node" href="shop.html?price=5000-plus"><small>Budget 05</small><strong>₹5,000+</strong><span>Explore categories →</span></a></div></div>`;
  occasions.insertAdjacentElement('afterend', section);
});
