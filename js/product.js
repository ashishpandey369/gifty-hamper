import {
  DEFAULT_CATALOG,
  getDiscountPercent,
  loadPublicCatalog,
  recordRecentlyViewed
} from "./catalog-store.js?v=2";

let GIFTS = DEFAULT_CATALOG.map(product => ({ ...product }));

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function getProductFromUrl() {
  const id = new URLSearchParams(window.location.search).get('id');
  return GIFTS.find(product => product.id === id) || GIFTS[0];
}

function renderProduct(product) {
  document.title = `${product.name} | Gifty Hamper`;
  document.querySelector('#breadcrumb-name').textContent = product.name;
  document.querySelector('#product-category').textContent = product.occasion || product.majorCategory || 'Gifting';
  document.querySelector('#product-name').textContent = product.name;

  const priceElement = document.querySelector('#product-price');
  const originalPrice = Number(product.price) || 0;
  const currentPrice = Number(product.salePrice || product.price) || 0;
  const discount = getDiscountPercent(product);

  if (discount) {
    priceElement.innerHTML =
      '<span class="product-original-price">' + formatPrice(originalPrice) + '</span>' +
      '<strong class="product-sale-price">' + formatPrice(currentPrice) + '</strong>' +
      '<span class="product-discount">' + discount + '% OFF</span>';
  } else {
    priceElement.innerHTML = '<strong class="product-sale-price">' + formatPrice(currentPrice) + '</strong>';
  }

  document.querySelector('#product-description').textContent = product.description;
  const skuElement = document.querySelector('#product-sku');
  if (skuElement) skuElement.textContent = product.sku ? 'SKU: ' + product.sku : '';

  const visual = document.querySelector('#product-visual');
  visual.className = `product-visual ${product.imageClass || ''}`;

  const images = Array.isArray(product.images) && product.images.length
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

  const label = document.querySelector('#product-label');
  const art = document.querySelector('#product-art');
  const thumbnails = document.querySelector('#product-thumbnails');

  function selectImage(index) {
    const image = images[index];
    if (!image) return;

    visual.style.backgroundImage = `url("${image.replace(/"/g, '%22')}")`;
    visual.style.backgroundSize = 'cover';
    visual.style.backgroundPosition = 'center';
    visual.style.backgroundRepeat = 'no-repeat';
    if (label) label.textContent = product.label || '';
    if (art) art.innerHTML = '';
    visual.classList.add('has-product-image');

    thumbnails?.querySelectorAll('[data-image-index]').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.imageIndex) === index);
      button.setAttribute('aria-current', Number(button.dataset.imageIndex) === index ? 'true' : 'false');
    });
  }

  if (images.length) {
    selectImage(0);

    if (thumbnails) {
      thumbnails.innerHTML = images.map((image, index) => `
        <button type="button" class="product-thumbnail${index === 0 ? ' active' : ''}" data-image-index="${index}" aria-label="View image ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}">
          <img src="${image.replace(/"/g, '&quot;')}" alt="${product.name} image ${index + 1}" loading="lazy">
        </button>
      `).join('');

      thumbnails.querySelectorAll('[data-image-index]').forEach(button => {
        button.addEventListener('click', () => selectImage(Number(button.dataset.imageIndex)));
      });
      thumbnails.hidden = images.length < 2;
    }
  } else {
    visual.style.backgroundImage = '';
    if (label) label.textContent = product.label || '';
    if (art) art.innerHTML = product.name.split(' ').slice(0, 2).join('<br>');
    visual.classList.remove('has-product-image');
    if (thumbnails) {
      thumbnails.innerHTML = '';
      thumbnails.hidden = true;
    }
  }
}

function addToCart(product, quantity) {
  const key = 'gifty-hamper-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { cart = []; }

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
    existing.price = Number(product.salePrice || product.price) || 0;
    existing.originalPrice = Number(product.price) || 0;
  } else {
    cart.push({
      id: product.id,
      sku: product.sku || '',
      image: Array.isArray(product.images) && product.images.length ? product.images[0] : (product.image || ''),
      name: product.name,
      price: Number(product.salePrice || product.price) || 0,
      originalPrice: Number(product.price) || 0,
      quantity
    });
  }

  localStorage.setItem(key, JSON.stringify(cart));
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const count = document.querySelector('#cart-count');
  if (count) count.textContent = total;
}

function renderRelated(product) {
  const grid = document.querySelector('#related-products');
  if (!grid) return;
  const related = GIFTS.filter(item => item.id !== product.id && item.occasion === product.occasion).slice(0, 3);
  const fallback = GIFTS.filter(item => item.id !== product.id && !related.includes(item)).slice(0, 3 - related.length);
  [...related, ...fallback].forEach(item => {
    const originalPrice = Number(item.price) || 0;
    const currentPrice = Number(item.salePrice || item.price) || 0;
    const discount = getDiscountPercent(item);
    const priceMarkup = discount
      ? '<div class="product-card-price"><del>' + formatPrice(originalPrice) + '</del><strong>' + formatPrice(currentPrice) + '</strong><span>' + discount + '% OFF</span></div>'
      : '<div class="product-card-price"><strong>' + formatPrice(currentPrice) + '</strong></div>';

    grid.insertAdjacentHTML('beforeend', `<article class="product-card"><a href="product.html?id=${encodeURIComponent(item.id)}"><div class="product-image ${item.imageClass || ''}"><span>${item.label || ''}</span><b>${item.name.split(' ').slice(0, 2).join('<br>')}</b></div><div class="product-info"><div><h3>${item.name}</h3><p>${item.description}</p></div>${priceMarkup}</div></a></article>`);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const sharedCatalog = await loadPublicCatalog();
    if (sharedCatalog.length) GIFTS = sharedCatalog;
  } catch (error) {
    console.error('Shared catalog load error:', error);
  }
  const product = getProductFromUrl();
  renderProduct(product);
  recordRecentlyViewed(product.id);
  renderRelated(product);

  const input = document.querySelector('#quantity');
  document.querySelector('[data-quantity="decrease"]')?.addEventListener('click', () => { input.value = Math.max(1, Number(input.value || 1) - 1); });
  document.querySelector('[data-quantity="increase"]')?.addEventListener('click', () => { input.value = Math.max(1, Number(input.value || 1) + 1); });
  input?.addEventListener('change', () => { input.value = Math.max(1, Math.floor(Number(input.value) || 1)); });

  document.querySelector('#add-to-cart')?.addEventListener('click', () => {
    const quantity = Math.max(1, Math.floor(Number(input.value) || 1));
    addToCart(product, quantity);
    const feedback = document.querySelector('#cart-feedback');
    if (feedback) feedback.textContent = `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`;
  });
});
