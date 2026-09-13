document.addEventListener('DOMContentLoaded', () => {
  const cartCount = document.querySelector('#cart-count');
  if (!cartCount) return;

  try {
    const cart = JSON.parse(localStorage.getItem('gifty-hamper-cart') || '[]');
    cartCount.textContent = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  } catch {
    cartCount.textContent = '0';
  }
});
