import {
  auth,
  onAuthStateChanged,
  signOut
} from "./firebase-auth.js";

const KEY = "gifty-hamper-catalog";

const $ = (selector) => document.querySelector(selector);

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(Number(value) || 0);

const normaliseProduct = (product) => ({
  ...product,
  stock: product.stock ?? 10,
  active: product.active ?? true,
  salePrice: product.salePrice ?? "",
  images: Array.isArray(product.images) && product.images.length
    ? product.images
    : (product.image ? [product.image] : [])
});

function readCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    return Array.isArray(saved) ? saved.map(normaliseProduct) : [];
  } catch (_) {
    return [];
  }
}

let catalog = [];
let cart = new Map();

function showAccess(message, detail) {
  const box = $("#sale-access");
  box.hidden = false;
  box.innerHTML = "<strong>" + message + "</strong><span>" + detail + "</span>";
}

function renderProducts() {
  const query = ($("#sale-search").value || "").toLowerCase().trim();
  const products = catalog.filter(product => {
    if (product.active === false) return false;
    return !query || [
      product.name,
      product.id,
      product.description,
      ...(product.categories || [])
    ].join(" ").toLowerCase().includes(query);
  });

  $("#sale-product-list").innerHTML = products.map(product => {
    const stock = Math.max(0, Number(product.stock) || 0);
    const selected = cart.get(product.id) || 0;
    const image = product.images?.[0];

    return `<article class="sale-product-card">
      <div class="sale-product-image">
        ${image ? '<img src="' + image + '" alt="">' : '<span>🎁</span>'}
      </div>
      <div class="sale-product-info">
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.id)}</p>
        <strong>${money(product.salePrice || product.price)}</strong>
        <span class="sale-stock ${stock === 0 ? "out" : ""}">${stock === 0 ? "Out of stock" : stock + " in stock"}</span>
      </div>
      <div class="sale-quantity">
        <button type="button" data-minus="${escapeHtml(product.id)}" ${selected === 0 ? "disabled" : ""}>−</button>
        <strong>${selected}</strong>
        <button type="button" data-plus="${escapeHtml(product.id)}" ${selected >= stock ? "disabled" : ""}>+</button>
      </div>
    </article>`;
  }).join("") || '<div class="sale-empty">No active products found.</div>';
}

function renderCart() {
  const entries = [...cart.entries()]
    .map(([id, quantity]) => {
      const product = catalog.find(item => item.id === id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);

  const totalQuantity = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) =>
    sum + (Number(item.product.salePrice || item.product.price) || 0) * item.quantity, 0
  );

  $("#sale-item-count").textContent = entries.length + (entries.length === 1 ? " item" : " items");
  $("#sale-total-quantity").textContent = totalQuantity;
  $("#sale-total").textContent = money(total);
  $("#complete-sale").disabled = totalQuantity === 0;

  $("#sale-cart").innerHTML = entries.length
    ? entries.map(({ product, quantity }) => `
      <div class="sale-cart-row">
        <div>
          <strong>${escapeHtml(product.name)}</strong>
          <span>${quantity} × ${money(product.salePrice || product.price)}</span>
        </div>
        <div class="sale-cart-actions">
          <button type="button" data-cart-minus="${escapeHtml(product.id)}">−</button>
          <strong>${quantity}</strong>
          <button type="button" data-cart-plus="${escapeHtml(product.id)}">+</button>
        </div>
      </div>`).join("")
    : '<div class="sale-empty">No products selected yet.<br>Use the + button to add items.</div>';
}

function changeQuantity(id, delta) {
  const product = catalog.find(item => item.id === id);
  if (!product) return;

  const stock = Math.max(0, Number(product.stock) || 0);
  const current = cart.get(id) || 0;
  const next = Math.max(0, Math.min(stock, current + delta));

  if (next === 0) cart.delete(id);
  else cart.set(id, next);

  renderProducts();
  renderCart();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$("#sale-search").addEventListener("input", renderProducts);

$("#sale-product-list").addEventListener("click", (event) => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  if (plus) changeQuantity(plus.dataset.plus, 1);
  if (minus) changeQuantity(minus.dataset.minus, -1);
});

$("#sale-cart").addEventListener("click", (event) => {
  const plus = event.target.closest("[data-cart-plus]");
  const minus = event.target.closest("[data-cart-minus]");
  if (plus) changeQuantity(plus.dataset.cartPlus, 1);
  if (minus) changeQuantity(minus.dataset.cartMinus, -1);
});

$("#complete-sale").addEventListener("click", () => {
  alert("Sale selection is ready. PDF billing, Firestore sale recording and stock deduction are the next step.");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("admin-login.html");
    return;
  }

  try {
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role || "admin";

    $("#admin-user-email").textContent = (user.email || "Signed-in admin") + " • " + role;

    // Sale access is currently available to Admin, Owner and Super Admin.
    if (!["admin", "owner", "super_admin"].includes(role)) {
      showAccess("Access restricted", "Your account does not have permission to use sales.");
      return;
    }

    catalog = readCatalog();

    $("#sale-access").hidden = true;
    $("#sale-content").hidden = false;

    renderProducts();
    renderCart();
  } catch (error) {
    console.error("Sale page error:", error);
    showAccess("Unable to load sales", "Please refresh the page and try again.");
  }

  const logout = $("#admin-logout");
  if (logout) {
    logout.addEventListener("click", async () => {
      logout.disabled = true;
      logout.textContent = "Signing out…";
      await signOut(auth);
      window.location.replace("admin-login.html");
    });
  }
});
