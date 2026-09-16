/* Temporary catalog data. This module is deliberately isolated so it can later be replaced by WooCommerce API data. */
const GIFTS = [
  { id: 'little-joy', name: 'The Little Joy Hamper', description: 'Thoughtful everyday gifting', price: 1499, occasion: 'Birthday', categories: ['Gift Sets', 'Appreciation Gifts'], label: 'Everyday', imageClass: 'image-sage' },
  { id: 'good-things', name: 'Good Things Gift Box', description: 'A warm collection of favourites', price: 1999, occasion: 'Thank You', categories: ['Gift Sets', 'Premium Gifts'], label: 'Curated', imageClass: 'image-sand' },
  { id: 'just-for-you', name: 'Just For You Hamper', description: 'Made for meaningful moments', price: 2499, occasion: 'Birthday', categories: ['Gift Sets', 'Celebration Gifts'], label: 'Special', imageClass: 'image-rose' },
  { id: 'signature-luxe', name: 'Signature Luxe Hamper', description: 'Premium gifting, beautifully packed', price: 3999, occasion: 'Corporate', categories: ['Premium Gifts', 'Employee Gifts', 'Gift Sets'], label: 'Premium', imageClass: 'image-night' },
  { id: 'festive-glow', name: 'Festive Glow Box', description: 'A bright celebration in a box', price: 1799, occasion: 'Festive', categories: ['Festive Gifts', 'Gift Sets'], label: 'Festive', imageClass: 'image-sand' },
  { id: 'office-cheer', name: 'Office Cheer Hamper', description: 'A polished team appreciation gift', price: 2299, occasion: 'Corporate', categories: ['Office Accessories', 'Employee Gifts', 'Appreciation Gifts'], label: 'Teams', imageClass: 'image-sage' },
  { id: 'warm-thanks', name: 'Warm Thanks Box', description: 'A simple way to say thank you', price: 1299, occasion: 'Thank You', categories: ['Appreciation Gifts', 'Gift Sets'], label: 'Thoughtful', imageClass: 'image-rose' },
  { id: 'grand-celebration', name: 'Grand Celebration Hamper', description: 'A premium gift for big moments', price: 4999, occasion: 'Festive', categories: ['Celebration Gifts', 'Premium Gifts', 'Gift Sets'], label: 'Premium', imageClass: 'image-night' }
];

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function productCard(product) {
  const slug = product.id;
  return `<article class="product-card" data-product-id="${slug}"><a href="product.html?id=${encodeURIComponent(slug)}"><div class="product-image ${product.imageClass}"><span>${product.label}</span><b>${product.name.split(' ').slice(0, 2).join('<br>')}</b></div><div class="product-info"><div><h3>${product.name}</h3><p>${product.description}</p></div><strong>${formatPrice(product.price)}</strong></div></a></article>`;
}

function renderCatalog() {
  const grid = document.querySelector('#catalog-products');
  if (!grid) return;

  const search = (document.querySelector('#catalog-search')?.value || '').trim().toLowerCase();
  const categories = [...document.querySelectorAll('input[name="category"]:checked')].map(input => input.value);
  const occasions = [...document.querySelectorAll('input[name="occasion"]:checked')].map(input => input.value);
  const prices = [...document.querySelectorAll('input[name="price"]:checked')].map(input => input.value);
  const sort = document.querySelector('#sort-products')?.value || 'featured';

  let products = GIFTS.filter(product => {
    const searchable = `${product.name} ${product.description} ${product.occasion} ${product.categories.join(' ')}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    const matchesCategory = !categories.length || categories.some(category => product.categories.includes(category));
    const matchesOccasion = !occasions.length || occasions.includes(product.occasion);
    const matchesPrice = !prices.length || prices.some(range => {
      if (range === 'under-999') return product.price < 999;
      if (range === '999-1999') return product.price >= 999 && product.price <= 1999;
      if (range === '1999-2999') return product.price >= 1999 && product.price <= 2999;
      if (range === '3000-4999') return product.price >= 3000 && product.price <= 4999;
      if (range === 'over-5000') return product.price >= 5000;
      return false;
    });
    return matchesSearch && matchesCategory && matchesOccasion && matchesPrice;
  });

  if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
  if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = products.map(productCard).join('');
  const count = document.querySelector('#product-count');
  if (count) count.textContent = `${products.length} ${products.length === 1 ? 'gift' : 'gifts'}`;
  const empty = document.querySelector('#empty-state');
  if (empty) empty.hidden = products.length !== 0;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  document.querySelector('#catalog-search')?.addEventListener('input', renderCatalog);
  document.querySelector('#sort-products')?.addEventListener('change', renderCatalog);
  document.querySelectorAll('#filters input').forEach(input => input.addEventListener('change', renderCatalog));
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    document.querySelectorAll('#filters input').forEach(input => { input.checked = false; });
    const search = document.querySelector('#catalog-search');
    if (search) search.value = '';
    renderCatalog();
  });
  document.querySelector('[data-filter-toggle]')?.addEventListener('click', () => document.querySelector('#filters')?.classList.toggle('open'));
});
