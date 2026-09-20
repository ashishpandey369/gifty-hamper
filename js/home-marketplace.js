import { DEFAULT_CATALOG, getDiscountPercent, loadPublicCatalog } from "./catalog-store.js";

let catalog = DEFAULT_CATALOG.map(item => ({...item}));

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const imagesFor = product => (Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])).filter(Boolean);
const price = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value)||0);

function categoryIcon(name){
  const value = name.toLowerCase();
  if (value.includes('birthday')) return '🎂';
  if (value.includes('corporate') || value.includes('office') || value.includes('employee')) return '💼';
  if (value.includes('festive') || value.includes('festival')) return '✨';
  if (value.includes('premium') || value.includes('lux')) return '🎁';
  if (value.includes('eco')) return '🌿';
  if (value.includes('electronic') || value.includes('gadget')) return '⚡';
  if (value.includes('celebration')) return '🎉';
  if (value.includes('appreciation') || value.includes('thank')) return '💝';
  if (value.includes('gift set')) return '🎀';
  if (value.includes('accessor')) return '👜';
  return '🎁';
}

function renderCategories(){
  const target = document.querySelector('#home-categories');
  if (!target) return;
  const names = [];
  const add = value => {
    const clean = String(value || '').trim();
    if (clean && !names.some(item => item.toLowerCase() === clean.toLowerCase())) names.push(clean);
  };
  catalog.forEach(product => {
    add(product.majorCategory || 'Gifts for Everyone');
    (product.categories || []).forEach(add);
  });
  const categories = names.slice(0, 12);
  target.innerHTML = categories.map(name => {
    const count = catalog.filter(product => (product.categories || []).includes(name) || product.majorCategory === name).length;
    return '<a class="category-chip" href="shop.html?category=' + encodeURIComponent(name) + '">' +
      '<span class="category-chip-icon">' + categoryIcon(name) + '</span>' +
      '<strong>' + escapeHtml(name) + '</strong>' +
      '<small>' + count + ' ' + (count === 1 ? 'gift' : 'gifts') + '</small>' +
      '</a>';
  }).join('');
}

function productCard(product){
  const images = imagesFor(product);
  const current = Number(product.salePrice || product.price) || 0;
  const original = Number(product.price) || 0;
  const discount = getDiscountPercent(product);
  const imageMarkup = images.length
    ? '<img src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">'
    : '<div class="market-product-placeholder">' + escapeHtml((product.label || 'GIFT') + ' • ' + product.name) + '</div>';
  return '<a class="market-product-card" href="product.html?id=' + encodeURIComponent(product.id) + '">' +
    '<div class="market-product-image">' + imageMarkup + (product.label ? '<span class="market-product-label">' + escapeHtml(product.label) + '</span>' : '') + '</div>' +
    '<div class="market-product-body"><h3>' + escapeHtml(product.name) + '</h3><p>' + escapeHtml(product.description || 'Thoughtfully curated gift') + '</p>' +
    '<div class="market-product-price">' + (discount ? '<del>' + price(original) + '</del>' : '') + '<strong>' + price(current) + '</strong>' + (discount ? '<span>' + discount + '% OFF</span>' : '') + '</div></div>' +
    '</a>';
}

function renderProducts(){
  const target = document.querySelector('#home-products');
  if (!target) return;
  let recentIds = [];
  try { recentIds = JSON.parse(localStorage.getItem('gifty-hamper-recently-viewed') || '[]'); } catch (_) {}
  const recent = recentIds.map(id => catalog.find(product => product.id === id)).filter(Boolean);
  const title = document.querySelector('#home-products-title');
  const products = recent.length ? recent.slice(0, 6) : catalog.filter(product => product.featured || product.active !== false).slice(0, 6);
  if (title) title.textContent = recent.length ? 'Recently viewed' : 'Featured gifts';
  target.innerHTML = products.map(productCard).join('');
}

function runSearch(form){
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const input = form.querySelector('input');
    const value = input?.value.trim() || '';
    if (value) window.location.href = 'shop.html?search=' + encodeURIComponent(value);
    else window.location.href = 'shop.html';
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const shared = await loadPublicCatalog();
    if (shared.length) catalog = shared;
  } catch (error) {
    console.error('Home catalog load error:', error);
  }
  renderCategories();
  renderProducts();
  runSearch(document.querySelector('#home-search'));
  runSearch(document.querySelector('#header-search'));
});
