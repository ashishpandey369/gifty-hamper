function getProductFromUrl() {
  const id = new URLSearchParams(window.location.search).get('id');
  return GIFTS.find(product => product.id === id) || GIFTS[0];
}

function renderProduct(product) {
  document.title = `${product.name} | Gifty Hamper`;
  document.querySelector('#breadcrumb-name').textContent = product.name;
  document.querySelector('#product-category').textContent = product.category;
  document.querySelector('#product-name').textContent = product.name;
  document.querySelector('#product-price').textContent = formatPrice(product.price);
  document.querySelector('#product-description').textContent = product.description;

  const visual = document.querySelector('#product-visual');
  visual.className = `product-visual ${product.imageClass}`;
  document.querySelector('#product-label').textContent = product.label;
  document.querySelector('#product-art').innerHTML = product.name.split(' ').slice(0, 2).join('<br>');
}

function addToCart(product, quantity) {
  const key = 'gifty-hamper-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { cart = []; }

  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, name: product.name, price: product.price, quantity });

  localStorage.setItem(key, JSON.stringify(cart));
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const count = document.querySelector('#cart-count');
  if (count) count.textContent = total;
}

function renderRelated(product) {
  const grid = document.querySelector('#related-products');
  if (!grid) return;
  const related = GIFTS.filter(item => item.id !== product.id && item.category === product.category).slice(0, 3);
  const fallback = GIFTS.filter(item => item.id !== product.id && !related.includes(item)).slice(0, 3 - related.length);
  [...related, ...fallback].forEach(item => {
    grid.insertAdjacentHTML('beforeend', `<article class="product-card"><a href="product.html?id=${encodeURIComponent(item.id)}"><div class="product-image ${item.imageClass}"><span>${item.label}</span><b>${item.name.split(' ').slice(0, 2).join('<br>')}</b></div><div class="product-info"><div><h3>${item.name}</h3><p>${item.description}</p></div><strong>${formatPrice(item.price)}</strong></div></a></article>`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const product = getProductFromUrl();
  renderProduct(product);
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
