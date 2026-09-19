document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'gifty-hamper-catalog';
  const CAT_KEY = 'gifty-hamper-categories';
  const MAJOR_CAT_KEY = 'gifty-hamper-major-categories';
  const DEFAULT_CATS = ['Appreciation Gifts','Celebration Gifts','Eco Friendly Gifts','Employee Gifts','Festive Gifts','Gadgets and Electronic Gifts','Gift Sets','MR Gifts','Office Accessories','Premium Gifts'];
  const DEFAULT_MAJOR_CATS = ['Gifts'];
  const OCC = ['Birthday','Anniversary','Rakhi','Corporate','Festive','Thank You','Personalized','Wedding','Other'];
  const DEFAULT_ADMIN_PRODUCTS = [
    {id:'little-joy',name:'The Little Joy Hamper',description:'Thoughtful everyday gifting',price:1499,occasion:'Birthday',categories:['Gift Sets','Appreciation Gifts'],label:'Everyday',imageClass:'image-sage'},
    {id:'good-things',name:'Good Things Gift Box',description:'A warm collection of favourites',price:1999,occasion:'Thank You',categories:['Gift Sets','Premium Gifts'],label:'Curated',imageClass:'image-sand'},
    {id:'just-for-you',name:'Just For You Hamper',description:'Made for meaningful moments',price:2499,occasion:'Birthday',categories:['Gift Sets','Celebration Gifts'],label:'Special',imageClass:'image-rose'},
    {id:'signature-luxe',name:'Signature Luxe Hamper',description:'Premium gifting, beautifully packed',price:3999,occasion:'Corporate',categories:['Premium Gifts','Employee Gifts','Gift Sets'],label:'Premium',imageClass:'image-night'},
    {id:'festive-glow',name:'Festive Glow Box',description:'A bright celebration in a box',price:1799,occasion:'Festive',categories:['Festive Gifts','Gift Sets'],label:'Festive',imageClass:'image-sand'},
    {id:'office-cheer',name:'Office Cheer Hamper',description:'A polished team appreciation gift',price:2299,occasion:'Corporate',categories:['Office Accessories','Employee Gifts','Appreciation Gifts'],label:'Teams',imageClass:'image-sage'},
    {id:'warm-thanks',name:'Warm Thanks Box',description:'A simple way to say thank you',price:1299,occasion:'Thank You',categories:['Appreciation Gifts','Gift Sets'],label:'Thoughtful',imageClass:'image-rose'},
    {id:'grand-celebration',name:'Grand Celebration Hamper',description:'A premium gift for big moments',price:4999,occasion:'Festive',categories:['Celebration Gifts','Premium Gifts','Gift Sets'],label:'Premium',imageClass:'image-night'}
  ];

  const $ = (selector) => document.querySelector(selector);
  const money = (value) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(Number(value) || 0);

  const normaliseProduct = (product) => ({
    ...product,
    stock: product.stock ?? 10,
    salePrice: product.salePrice ?? '',
    lowStock: product.lowStock ?? 5,
    featured: product.featured ?? false,
    active: product.active ?? true,
    majorCategory: product.majorCategory || 'Gifts',
    images: Array.isArray(product.images) && product.images.length
      ? product.images
      : (product.image ? [product.image] : [])
  });

  const defaults = () => DEFAULT_ADMIN_PRODUCTS.map(normaliseProduct);

  const readCatalog = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      return Array.isArray(saved) && saved.length ? saved.map(normaliseProduct) : defaults();
    } catch (_) {
      return defaults();
    }
  };

  const readCategories = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(CAT_KEY) || 'null');
      return Array.isArray(saved) && saved.length ? saved : [...DEFAULT_CATS];
    } catch (_) {
      return [...DEFAULT_CATS];
    }
  };

  const saveCatalog = (items) => localStorage.setItem(KEY, JSON.stringify(items));
  const saveCategories = (items) => localStorage.setItem(CAT_KEY, JSON.stringify(items));
  const saveMajorCategories = (items) => localStorage.setItem(MAJOR_CAT_KEY, JSON.stringify(items));

  let catalog = readCatalog();
  let categories = readCategories();
  let majorCategories = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MAJOR_CAT_KEY) || 'null');
      return Array.isArray(saved) && saved.length ? saved : [...DEFAULT_MAJOR_CATS];
    } catch (_) { return [...DEFAULT_MAJOR_CATS]; }
  })();
  let editingId = '';

  function fillOccasions() {
    $('#product-occasion').innerHTML = OCC.map(value => '<option value="' + value + '">' + value + '</option>').join('');
  }

  function renderMajorCategorySelect(selected = '') {
    const current = selected || majorCategories[0] || '';
    $('#product-major-category').innerHTML = majorCategories.map(category =>
      '<option value="' + category.replace(/"/g, '&quot;') + '"' + (category === current ? ' selected' : '') + '>' + category + '</option>'
    ).join('') || '<option value="">Create a major category first</option>';
  }

  function renderMinorCategoryChecks(selected = []) {
    $('#product-categories').innerHTML = categories.map(category =>
      '<label class="category-check"><input type="checkbox" value="' + category.replace(/"/g, '&quot;') + '"' +
      (selected.includes(category) ? ' checked' : '') + '><span>' + category + '</span></label>'
    ).join('') || '<p class="admin-help">Create a minor category first.</p>';
  }

  function renderCategoryManager() {
    $('#category-list').innerHTML = categories.map(category =>
      '<div class="category-chip"><span>' + category + '</span><button type="button" data-delete-category="' + category.replace(/"/g, '&quot;') + '" aria-label="Delete ' + category.replace(/"/g, '&quot;') + '">×</button></div>'
    ).join('');
    $('#major-category-list').innerHTML = majorCategories.map(category =>
      '<div class="category-chip"><span>' + category + '</span><button type="button" data-delete-major-category="' + category.replace(/"/g, '&quot;') + '" aria-label="Delete ' + category.replace(/"/g, '&quot;') + '">×</button></div>'
    ).join('');
    renderMajorCategorySelect($('#product-major-category')?.value || '');
    renderMinorCategoryChecks(getSelectedCategories());
  }

  function getSelectedCategories() {
    return [...document.querySelectorAll('#product-categories input[type="checkbox"]:checked')].map(input => input.value);
  }

  function stats() {
    const active = catalog.filter(product => product.active !== false);
    $('#stat-products').textContent = catalog.length;
    $('#stat-active').textContent = active.length;
    $('#stat-low').textContent = catalog.filter(product => Number(product.stock) > 0 && Number(product.stock) <= Number(product.lowStock ?? 5)).length;
    $('#stat-out').textContent = catalog.filter(product => Number(product.stock) <= 0).length;
  }

  function render() {
    const query = ($('#admin-search').value || '').toLowerCase().trim();
    const status = $('#admin-status').value;

    const rows = catalog.filter(product => {
      const searchable = [product.name, product.id, product.description, ...(product.categories || [])].join(' ').toLowerCase();
      const statusMatch = status === 'all' || (status === 'active' ? product.active !== false : product.active === false);
      return (!query || searchable.includes(query)) && statusMatch;
    });

    $('#admin-product-list').innerHTML = rows.map(product => {
      const stock = Number(product.stock) || 0;
      const stockClass = stock <= 0 ? 'stock-out' : stock <= Number(product.lowStock ?? 5) ? 'stock-low' : 'stock-ok';
      const image = product.images?.[0];
      return '<tr>' +
        '<td><div class="admin-product-cell">' + (image ? '<img src="' + image + '" alt="">' : '<span class="admin-thumb-placeholder">🎁</span>') +
        '<div><div class="admin-product-name">' + product.name + '</div><div class="admin-product-id">' + product.id + '</div></div></div></td>' +
        '<td><strong>' + (product.majorCategory || 'Gifts') + '</strong><br><small>' + ((product.categories || []).join(', ') || '—') + '</small></td>' +
        '<td>' + money(product.salePrice || product.price) + '</td>' +
        '<td class="' + stockClass + '">' + stock + '</td>' +
        '<td><span class="status-pill ' + (product.active === false ? 'draft' : '') + '">' + (product.active === false ? 'Draft' : 'Active') + '</span></td>' +
        '<td><div class="table-actions"><button type="button" data-edit="' + product.id + '">Edit</button><button type="button" data-delete="' + product.id + '">Delete</button></div></td>' +
      '</tr>';
    }).join('') || '<tr><td colspan="6">No products found.</td></tr>';

    stats();
  }

  function renderImagePreview() {
    const images = window.adminProductImages || [];
    $('#product-images-preview').innerHTML = images.map((src, index) =>
      '<div class="image-preview-card"><img src="' + src + '" alt="Product image ' + (index + 1) + '"><button type="button" data-remove-image="' + index + '" aria-label="Remove image">×</button>' +
      (index === 0 ? '<span>Main image</span>' : '<span>Image ' + (index + 1) + '</span>') + '</div>'
    ).join('');
  }

  function addImage(src) {
    if (!src || !/^((https?:)?\/\/|data:image\/)/i.test(src)) {
      alert('Please use a valid direct image URL or a PNG/JPG/WebP image file.');
      return;
    }
    window.adminProductImages = [...(window.adminProductImages || []), src];
    renderImagePreview();
  }

  function readImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
        reject(new Error('Only PNG, JPG and WebP images are supported.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function resetForm() {
    $('#product-form').reset();
    editingId = '';
    window.adminProductImages = [];
    $('#product-active').checked = true;
    $('#product-low-stock').value = 5;
    $('#editor-title').textContent = 'Add product';
    renderMajorCategorySelect('');
    renderMinorCategoryChecks([]);
    renderImagePreview();
  }

  function editProduct(id) {
    const product = catalog.find(item => item.id === id);
    if (!product) return;

    editingId = product.id;
    $('#product-name').value = product.name;
    $('#product-id').value = product.id;
    $('#product-price').value = product.price;
    $('#product-sale-price').value = product.salePrice ?? '';
    $('#product-stock').value = product.stock ?? 0;
    $('#product-low-stock').value = product.lowStock ?? 5;
    $('#product-occasion').value = product.occasion || OCC[0];
    $('#product-description').value = product.description || '';
    $('#product-label').value = product.label || '';
    $('#product-featured').checked = !!product.featured;
    $('#product-active').checked = product.active !== false;
    window.adminProductImages = [...(product.images || [])];
    renderMajorCategorySelect(product.majorCategory || '');
    renderMinorCategoryChecks(product.categories || []);
    renderImagePreview();
    $('#editor-title').textContent = 'Edit product';
    $('#product-editor').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  $('#product-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const id = $('#product-id').value.trim().toLowerCase().replace(/\s+/g, '-');
    const selectedCategories = getSelectedCategories();
    const selectedMajorCategory = $('#product-major-category').value;

    if (!id || !$('#product-name').value.trim() || !Number($('#product-price').value)) {
      alert('Please enter a product name, Product ID / SKU and price.');
      return;
    }

    if (!selectedMajorCategory) {
      alert('Please select a major category.');
      return;
    }

    if (!selectedCategories.length) {
      alert('Please select at least one minor category.');
      return;
    }

    const product = {
      id,
      name: $('#product-name').value.trim(),
      description: $('#product-description').value.trim(),
      price: Number($('#product-price').value) || 0,
      salePrice: $('#product-sale-price').value ? Number($('#product-sale-price').value) : '',
      stock: Number($('#product-stock').value) || 0,
      lowStock: Number($('#product-low-stock').value) || 5,
      occasion: $('#product-occasion').value,
      majorCategory: selectedMajorCategory,
      categories: selectedCategories,
      label: $('#product-label').value.trim() || 'Gift',
      images: [...(window.adminProductImages || [])],
      featured: $('#product-featured').checked,
      active: $('#product-active').checked,
      imageClass: 'image-sage'
    };

    if (editingId) {
      const index = catalog.findIndex(item => item.id === editingId);
      if (index >= 0) catalog[index] = product;
    } else {
      if (catalog.some(item => item.id === id)) {
        alert('That Product ID / SKU already exists.');
        return;
      }
      catalog.unshift(product);
    }

    saveCatalog(catalog);
    resetForm();
    render();
    alert('Product saved successfully.');
  });

  $('#admin-product-list').addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit]');
    const deleteButton = event.target.closest('[data-delete]');

    if (editButton) editProduct(editButton.dataset.edit);

    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      if (confirm('Delete this product from the catalog?')) {
        catalog = catalog.filter(product => product.id !== id);
        saveCatalog(catalog);
        render();
      }
    }
  });

  $('#product-images-preview').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-image]');
    if (!button) return;
    window.adminProductImages.splice(Number(button.dataset.removeImage), 1);
    renderImagePreview();
  });

  $('#add-image-url').addEventListener('click', () => {
    const input = $('#product-image-url');
    const url = input.value.trim();
    addImage(url);
    input.value = '';
  });

  $('#product-image-files').addEventListener('change', async (event) => {
    for (const file of [...event.target.files]) {
      try {
        addImage(await readImageFile(file));
      } catch (error) {
        alert(error.message);
      }
    }
    event.target.value = '';
  });

  $('#create-major-category').addEventListener('click', () => {
    const input = $('#new-major-category');
    const name = input.value.trim();
    if (!name) return;
    if (majorCategories.some(category => category.toLowerCase() === name.toLowerCase())) {
      alert('That major category already exists.');
      return;
    }
    majorCategories.push(name);
    saveMajorCategories(majorCategories);
    input.value = '';
    renderCategoryManager();
  });

  $('#create-category').addEventListener('click', () => {
    const input = $('#new-category');
    const name = input.value.trim();
    if (!name) return;
    if (categories.some(category => category.toLowerCase() === name.toLowerCase())) {
      alert('That category already exists.');
      return;
    }
    categories.push(name);
    saveCategories(categories);
    input.value = '';
    renderCategoryManager();
  });

  $('#major-category-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-major-category]');
    if (!button) return;
    const category = button.dataset.deleteMajorCategory;
    if (majorCategories.length <= 1) {
      alert('Keep at least one major category so products can be organised.');
      return;
    }
    if (!confirm('Delete the major category "' + category + '"? Products using it will be moved to the first remaining major category.')) return;
    majorCategories = majorCategories.filter(item => item !== category);
    const fallback = majorCategories[0];
    catalog = catalog.map(product => ({ ...product, majorCategory: product.majorCategory === category ? fallback : (product.majorCategory || fallback) }));
    saveMajorCategories(majorCategories);
    saveCatalog(catalog);
    renderCategoryManager();
    render();
  });

  $('#category-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-category]');
    if (!button) return;
    const category = button.dataset.deleteCategory;
    if (!confirm('Delete the category "' + category + '"? Products using it will keep their other categories.')) return;

    categories = categories.filter(item => item !== category);
    catalog = catalog.map(product => ({
      ...product,
      categories: (product.categories || []).filter(item => item !== category)
    }));
    saveCategories(categories);
    saveCatalog(catalog);
    renderCategoryManager();
    render();
  });

  $('#admin-search').addEventListener('input', render);
  $('#admin-status').addEventListener('change', render);

  $('#new-product').addEventListener('click', () => {
    resetForm();
    $('#product-editor').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  $('#reset-form').addEventListener('click', resetForm);
  $('#cancel-edit').addEventListener('click', resetForm);

  $('#admin-refresh').addEventListener('click', () => {
    catalog = readCatalog();
    categories = readCategories();
    try {
      const savedMajor = JSON.parse(localStorage.getItem(MAJOR_CAT_KEY) || 'null');
      majorCategories = Array.isArray(savedMajor) && savedMajor.length ? savedMajor : [...DEFAULT_MAJOR_CATS];
    } catch (_) { majorCategories = [...DEFAULT_MAJOR_CATS]; }
    renderCategoryManager();
    render();
  });

  $('#export-catalog').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type:'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gifty-hamper-catalog.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  $('#reset-catalog').addEventListener('click', () => {
    if (!confirm('Reset the catalog to the original demo products?')) return;
    catalog = defaults();
    saveCatalog(catalog);
    render();
    resetForm();
  });

  fillOccasions();
  renderCategoryManager();
  resetForm();
  render();
});