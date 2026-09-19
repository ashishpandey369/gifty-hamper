/* Temporary catalog data. This module is deliberately isolated so it can later be replaced by WooCommerce API data. */
const DEFAULT_GIFTS = [
  { id: 'little-joy', name: 'The Little Joy Hamper', description: 'Thoughtful everyday gifting', price: 1499, occasion: 'Birthday', categories: ['Gift Sets', 'Appreciation Gifts'], label: 'Everyday', imageClass: 'image-sage' },
  { id: 'good-things', name: 'Good Things Gift Box', description: 'A warm collection of favourites', price: 1999, occasion: 'Thank You', categories: ['Gift Sets', 'Premium Gifts'], label: 'Curated', imageClass: 'image-sand' },
  { id: 'just-for-you', name: 'Just For You Hamper', description: 'Made for meaningful moments', price: 2499, occasion: 'Birthday', categories: ['Gift Sets', 'Celebration Gifts'], label: 'Special', imageClass: 'image-rose' },
  { id: 'signature-luxe', name: 'Signature Luxe Hamper', description: 'Premium gifting, beautifully packed', price: 3999, occasion: 'Corporate', categories: ['Premium Gifts', 'Employee Gifts', 'Gift Sets'], label: 'Premium', imageClass: 'image-night' },
  { id: 'festive-glow', name: 'Festive Glow Box', description: 'A bright celebration in a box', price: 1799, occasion: 'Festive', categories: ['Festive Gifts', 'Gift Sets'], label: 'Festive', imageClass: 'image-sand' },
  { id: 'office-cheer', name: 'Office Cheer Hamper', description: 'A polished team appreciation gift', price: 2299, occasion: 'Corporate', categories: ['Office Accessories', 'Employee Gifts', 'Appreciation Gifts'], label: 'Teams', imageClass: 'image-sage' },
  { id: 'warm-thanks', name: 'Warm Thanks Box', description: 'A simple way to say thank you', price: 1299, occasion: 'Thank You', categories: ['Appreciation Gifts', 'Gift Sets'], label: 'Thoughtful', imageClass: 'image-rose' },
  { id: 'grand-celebration', name: 'Grand Celebration Hamper', description: 'A premium gift for big moments', price: 4999, occasion: 'Festive', categories: ['Celebration Gifts', 'Premium Gifts', 'Gift Sets'], label: 'Premium', imageClass: 'image-night' }
];

const PRICE_RANGES = [
  {id:'under-999', label:'Under ₹999', matches: price => price < 999},
  {id:'999-1999', label:'₹999 – ₹1,999', matches: price => price >= 999 && price <= 1999},
  {id:'1999-2999', label:'₹2,000 – ₹2,999', matches: price => price >= 2000 && price <= 2999},
  {id:'3000-4999', label:'₹3,000 – ₹4,999', matches: price => price >= 3000 && price <= 4999},
  {id:'5000-plus', label:'₹5,000+', matches: price => price >= 5000}
];

function getPriceRange(price) { return PRICE_RANGES.find(range => range.matches(Number(price) || 0)) || PRICE_RANGES[0]; }

const GIFTS = (() => { 
  try {
    const saved = JSON.parse(localStorage.getItem('gifty-hamper-catalog') || 'null');
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_GIFTS;
  } catch (_) {
    return DEFAULT_GIFTS;
  }
})();

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function productCard(product) {
  const slug = product.id;
  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []); const visual = images[0] ? `<img class="product-photo" src="${images[0]}" alt="${product.name.replace(/\"/g, '&quot;')}" loading="lazy"><span>${product.label}</span>` : `<span>${product.label}</span><b>${product.name.split(' ').slice(0, 2).join('<br>')}</b>`; return `<article class="product-card" data-product-id="${slug}"><a href="product.html?id=${encodeURIComponent(slug)}"><div class="product-image ${product.imageClass}">${visual}</div><div class="product-info"><div><h3>${product.name}</h3><p>${product.description}</p></div><strong>${formatPrice(product.salePrice || product.price)}</strong></div></a></article>`;
}

function applyBudgetFromUrl() {
  const key = new URLSearchParams(window.location.search).get('price');
  if (!key) return;
  const input = document.querySelector(`input[name="price"][value="${key}"]`);
  if (input) input.checked = true;

  const labels = {
    'under-999': 'Under ₹999',
    '999-1999': '₹999 – ₹1,999',
    '1999-2999': '₹2,000 – ₹2,999',
    '3000-4999': '₹3,000 – ₹4,999',
    'over-5000': '₹5,000+'
  };
  const heading = document.querySelector('.shop-hero h1');
  const eyebrow = document.querySelector('.shop-hero .eyebrow');
  if (heading && labels[key]) heading.innerHTML = `Gifts <em>${labels[key]}</em>`;
  if (eyebrow && labels[key]) eyebrow.textContent = 'Budget collection';
}

function renderCatalog() {
  const grid = document.querySelector('#catalog-products');
  if (!grid) return;

  const search = (document.querySelector('#catalog-search')?.value || '').trim().toLowerCase();
  const majorCategories = [...document.querySelectorAll('input[name="major-category"]:checked')].map(input => input.value);
  const categories = [...document.querySelectorAll('input[name="category"]:checked')].map(input => input.value);
  const occasions = [...document.querySelectorAll('input[name="occasion"]:checked')].map(input => input.value);
  const prices = [...document.querySelectorAll('input[name="price"]:checked')].map(input => input.value);
  const sort = document.querySelector('#sort-products')?.value || 'featured';

  let products = GIFTS.filter(product => {
    const searchable = `${product.name} ${product.description} ${product.occasion} ${(product.categories || []).join(' ')} ${product.majorCategory || 'Gifts for Everyone'}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    const matchesMajorCategory = !majorCategories.length || majorCategories.includes(product.majorCategory || 'Gifts for Everyone');
    const matchesCategory = !categories.length || categories.some(category => (product.categories || []).includes(category));
    const matchesOccasion = !occasions.length || occasions.includes(product.occasion);
    const matchesPrice = !prices.length || prices.some(range => PRICE_RANGES.some(item => item.id === range && item.matches(Number(product.salePrice || product.price) || 0)));
    return matchesSearch && matchesMajorCategory && matchesCategory && matchesOccasion && matchesPrice;
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
  const readList = (key, fallback) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(saved) && saved.length ? saved : fallback;
    } catch (_) { return fallback; }
  };

  const majorCategories = readList('gifty-hamper-major-categories', ['Gifts for Everyone']).map(item => item === 'Gifts' ? 'Gifts for Everyone' : item);
  const minorCategories = readList('gifty-hamper-categories', [...new Set(DEFAULT_GIFTS.flatMap(product => product.categories || []))]);

  const majorBox = document.querySelector('#major-category-filters');
  const minorBox = document.querySelector('#minor-category-filters');
  if (majorBox) {
    majorBox.innerHTML = majorCategories.map(value => '<label><input type="checkbox" name="major-category" value="' + value.replace(/"/g, '&quot;') + '"> ' + value + '</label>').join('');
  }
  if (minorBox) {
    minorBox.innerHTML = minorCategories.map(value => '<label><input type="checkbox" name="category" value="' + value.replace(/"/g, '&quot;') + '"> ' + value + '</label>').join('');
  }

  const priceGroup = document.querySelector('#filters input[name="price"]')?.closest('.filter-group');
  if (priceGroup) {
    priceGroup.querySelectorAll('label').forEach(label => label.remove());
    PRICE_RANGES.forEach(range => {
      const label = document.createElement('label');
      label.innerHTML = '<input type="checkbox" name="price" value="' + range.id + '"> ' + range.label;
      priceGroup.appendChild(label);
    });
  }

  applyBudgetFromUrl();
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