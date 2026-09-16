document.addEventListener('DOMContentLoaded', () => {
  const occasions = document.querySelector('#occasions');
  if (!occasions || document.querySelector('#budget-navigation')) return;

  const style = document.createElement('style');
  style.textContent = `
    #budget-navigation{padding:72px 0 82px;background:linear-gradient(180deg,rgba(255,250,246,.72),rgba(255,247,243,.9));border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden}
    .budget-heading{max-width:760px;margin-bottom:34px}
    .budget-heading h2{margin:0;font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.1rem,4vw,3.5rem);line-height:.98;letter-spacing:-.045em}
    .budget-heading h2 em{color:var(--accent);font-weight:600}
    .budget-heading p:last-child{max-width:620px;color:var(--muted);margin:13px 0 0;font-size:.92rem}
    .budget-track-wrap{position:relative;padding:22px 0 14px}
    .budget-track{position:absolute;left:3%;right:3%;top:97px;height:7px;border-radius:99px;background:linear-gradient(90deg,#e9b5c5,#e8a9a9,#e8c39b,#c8b1d9,#aebedb);box-shadow:0 2px 8px rgba(100,70,60,.08)}
    .budget-tree{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .budget-node{--budget-color:#e96b88;--budget-soft:#fff0f4;position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-between;min-height:174px;padding:22px 20px 20px;border:2px solid var(--budget-color);border-radius:22px;background:linear-gradient(145deg,#fff,var(--budget-soft));color:var(--ink);text-decoration:none;overflow:hidden;box-shadow:0 10px 24px rgba(38,32,25,.055);transition:transform .25s ease,box-shadow .25s ease}
    .budget-node:before{content:'';position:absolute;inset:auto -20px -36px auto;width:115px;height:115px;border-radius:50%;background:var(--budget-color);opacity:.12}
    .budget-node:after{content:'→';position:absolute;right:17px;bottom:15px;width:31px;height:31px;display:grid;place-items:center;border-radius:50%;background:var(--budget-color);color:#fff;font-size:1rem;font-weight:700;transition:transform .25s ease}
    .budget-node:hover{transform:translateY(-7px);box-shadow:0 20px 40px rgba(38,32,25,.13)}
    .budget-node:hover:after{transform:translateX(4px)}
    .budget-node small{font-size:.65rem;text-transform:uppercase;letter-spacing:.14em;color:var(--budget-color);font-weight:800}
    .budget-node strong{font-family:'Playfair Display',Georgia,serif;font-size:1.48rem;line-height:1.05;max-width:155px;position:relative}
    .budget-node span{font-size:.71rem;color:var(--muted);position:relative;padding-right:35px}
    .budget-node:nth-child(1){--budget-color:#df5b78;--budget-soft:#fff0f3}
    .budget-node:nth-child(2){--budget-color:#ef7181;--budget-soft:#fff0ed}
    .budget-node:nth-child(3){--budget-color:#e5a14d;--budget-soft:#fff7e9}
    .budget-node:nth-child(4){--budget-color:#8c70bd;--budget-soft:#f5f0fc}
    .budget-node:nth-child(5){--budget-color:#4f7db8;--budget-soft:#eef5ff}
    @media(max-width:1100px){.budget-tree{grid-template-columns:repeat(3,1fr)}.budget-track{display:none}.budget-node:nth-child(4),.budget-node:nth-child(5){margin-top:4px}}
    @media(max-width:760px){#budget-navigation{padding:56px 0 64px}.budget-heading{margin-bottom:24px}.budget-heading p:last-child{font-size:.84rem}.budget-track-wrap{padding:8px 0 2px;margin-right:-15px}.budget-tree{display:flex;gap:12px;overflow-x:auto;padding:4px 15px 18px 0;scroll-snap-type:x mandatory;scrollbar-width:none}.budget-tree::-webkit-scrollbar{display:none}.budget-node{flex:0 0 calc(100vw - 45px);min-height:155px;padding:20px;border-radius:21px;scroll-snap-align:start}.budget-node strong{font-size:1.55rem;max-width:220px}.budget-node span{font-size:.74rem}}
    @media(max-width:430px){.budget-node{flex-basis:calc(100vw - 40px);min-height:148px}.budget-heading h2{font-size:2.35rem}}
    @media(prefers-reduced-motion:reduce){.budget-node{transition:none}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'budget-navigation';
  section.className = 'section';
  section.innerHTML = `<div class="container"><div class="budget-heading"><p class="eyebrow">Shop by budget</p><h2>Find the right gift <em>for every budget.</em></h2><p>Choose your budget and continue directly to the matching gift categories and products.</p></div><div class="budget-track-wrap"><div class="budget-track" aria-hidden="true"></div><div class="budget-tree" aria-label="Gift budgets"><a class="budget-node" href="shop.html?price=under-999"><small>Budget 01</small><strong>Under ₹999</strong><span>Explore matching gifts</span></a><a class="budget-node" href="shop.html?price=999-1999"><small>Budget 02</small><strong>₹999 – ₹1,999</strong><span>Explore matching gifts</span></a><a class="budget-node" href="shop.html?price=1999-2999"><small>Budget 03</small><strong>₹1,999 – ₹2,999</strong><span>Explore matching gifts</span></a><a class="budget-node" href="shop.html?price=3000-4999"><small>Budget 04</small><strong>₹3,000 – ₹4,999</strong><span>Explore matching gifts</span></a><a class="budget-node" href="shop.html?price=5000-plus"><small>Budget 05</small><strong>₹5,000+</strong><span>Explore matching gifts</span></a></div></div></div>`;
  occasions.insertAdjacentElement('afterend', section);
});
