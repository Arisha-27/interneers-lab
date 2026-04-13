const API_BASE = 'https://dummyjson.com';

function buildStars(r) { r = Math.round(r); return '★'.repeat(r) + '☆'.repeat(5 - r); }
function formatPrice(p) { return '$' + Number(p).toFixed(2); }
function truncate(t, n = 90) { return t.length > n ? t.slice(0, n) + '…' : t; }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const cart = {
  items: {},

  add(product) {
    const id = String(product.id);
    this.items[id] ? this.items[id].qty++ : (this.items[id] = { product, qty: 1 });
    this.render();
    console.log('%c🛒 Cart updated:', 'color:#00e676;font-weight:bold;', this.summary());
  },

  remove(id) { delete this.items[String(id)]; this.render(); },

  totalQty() { return Object.values(this.items).reduce((s, { qty }) => s + qty, 0); },
  totalPrice() { return Object.values(this.items).reduce((s, { product, qty }) => s + product.price * qty, 0).toFixed(2); },

  summary() {
    return Object.values(this.items).map(({ product, qty }) =>
      `${product.title.slice(0, 25)} ×${qty} = ${formatPrice(product.price * qty)}`);
  },

  render() {
    const badge = document.getElementById('cart-badge');
    const qty = this.totalQty();
    badge.textContent = qty;
    badge.style.display = qty > 0 ? 'flex' : 'none';

    const list = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');

    if (qty === 0) {
      list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      total.textContent = '$0.00';
      return;
    }

    list.innerHTML = Object.values(this.items).map(({ product, qty }) => `
      <div class="cart-item">
        <img src="${escapeHtml(product.thumbnail)}" alt="" class="cart-item-img"/>
        <div class="cart-item-info">
          <p class="cart-item-title">${escapeHtml(product.title.slice(0, 30))}…</p>
          <p class="cart-item-meta">${formatPrice(product.price)} × ${qty} = ${formatPrice(product.price * qty)}</p>
        </div>
        <button class="cart-remove-btn" data-remove="${product.id}">✕</button>
      </div>`).join('');

    total.textContent = `$${this.totalPrice()}`;

    list.querySelectorAll('[data-remove]').forEach(btn =>
      btn.addEventListener('click', () => this.remove(btn.dataset.remove)));
  }
};

const els = {
  statusText: document.getElementById('status-text'),
  cartBtn: document.getElementById('cart-btn'),
  cartBadge: document.getElementById('cart-badge'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartOverlay: document.getElementById('cart-overlay'),
  cartClose: document.getElementById('cart-close'),
  checkoutBtn: document.getElementById('checkout-btn'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalItems: document.getElementById('modal-items'),
  modalTotal: document.getElementById('modal-total'),
  modalOrderId: document.getElementById('modal-order-id'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  productIdInput: document.getElementById('product-id-input'),
  fetchBtn: document.getElementById('fetch-btn'),
  apiLog: document.getElementById('api-log'),
  apiCard: document.getElementById('api-product-card'),
  apiImg: document.getElementById('api-img'),
  apiCategory: document.getElementById('api-category'),
  apiTitle: document.getElementById('api-title'),
  apiDesc: document.getElementById('api-desc'),
  apiStars: document.getElementById('api-stars'),
  apiRatingCount: document.getElementById('api-rating-count'),
  apiPrice: document.getElementById('api-price'),
  apiCta: document.getElementById('api-cta'),
  gridLoading: document.getElementById('grid-loading'),
  productGrid: document.getElementById('product-grid'),
  filterBar: document.getElementById('filter-bar'),
};

function logLine(text, type = 'line') {
  const ph = els.apiLog.querySelector('.log-placeholder');
  if (ph) ph.remove();
  const p = document.createElement('p');
  p.className = `log-${type}`;
  p.textContent = text;
  els.apiLog.appendChild(p);
  els.apiLog.scrollTop = els.apiLog.scrollHeight;
}

async function apiFetch(endpoint) {
  const url = API_BASE + endpoint;
  logLine(`→ GET ${url}`, 'key');
  console.log(`%c→ GET ${url}`, 'color:#00e5ff;font-weight:bold;');

  try {
    const response = await fetch(url);               
    logLine(`  Status: ${response.status} ${response.statusText}`, 'val');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();              
    logLine(`  ✓ ${JSON.stringify(data).slice(0, 100)}…`, 'line');
    console.log('  ↳ Data:', data);
    return data;
  } catch (err) {
    logLine(`  ✗ ${err.message}`, 'error');
    console.error('API Error:', err);
    throw err;
  }
}

let currentApiProduct = null;

async function fetchAndDisplayProduct(id) {
  els.fetchBtn.disabled = true;
  els.fetchBtn.textContent = 'Loading…';
  els.apiCta.disabled = true;
  els.apiTitle.textContent = 'Fetching…';
  els.apiCategory.textContent = '…';
  els.apiImg.src = '';

  try {
    const product = await apiFetch(`/products/${id}`);

    console.table({
      id: product.id, title: product.title, price: product.price,
      rating: product.rating, category: product.category, stock: product.stock
    });

    updateProductCard(product);
    currentApiProduct = product;

  } catch {
    els.apiCard.classList.add('shake');
    setTimeout(() => els.apiCard.classList.remove('shake'), 500);
    els.apiTitle.textContent = 'Failed — try another ID';
  } finally {
    els.fetchBtn.disabled = false;
    els.fetchBtn.textContent = 'Fetch';
  }
}

function updateProductCard(product) {
  els.apiImg.src = product.thumbnail;
  els.apiImg.alt = product.title;
  els.apiCategory.textContent = product.category + (product.brand ? ` · ${product.brand}` : '');
  els.apiTitle.textContent = product.title;
  els.apiDesc.textContent = truncate(product.description, 110);
  els.apiStars.textContent = buildStars(Math.round(product.rating));
  els.apiRatingCount.textContent = `(${product.rating.toFixed(1)} · ${product.stock} in stock)`;

  els.apiPrice.textContent = formatPrice(product.price);
  els.apiPrice.classList.remove('price-pop');
  void els.apiPrice.offsetWidth;        
  els.apiPrice.classList.add('price-pop');

  els.apiCta.disabled = false;
  els.apiCta.textContent = 'Add to Cart';
  els.apiCard.classList.add('is-visible');
}

let allProducts = [];

async function fetchAndRenderAllProducts() {
  try {
    
    const data = await apiFetch('/products?limit=20');
    allProducts = data.products;

    console.log('%c✓ Products loaded:', 'color:#00e5ff;font-weight:bold;', allProducts.length);
    console.table(allProducts.map(p => ({
      id: p.id, title: p.title.slice(0, 30), price: p.price,
      category: p.category, rating: p.rating,
    })));

    buildFilterButtons(allProducts);
    els.gridLoading.classList.add('hidden');
    renderProductCards(allProducts);

    document.body.classList.add('status-live');
    els.statusText.textContent = `${allProducts.length} products live`;

  } catch (err) {
    els.gridLoading.innerHTML =
      `<p style="color:var(--text-second);font-family:var(--font-mono);font-size:.85rem;padding:2rem;grid-column:1/-1">✗ ${err.message}</p>`;
  }
}

function renderProductCards(products) {
  els.productGrid.innerHTML = '';
  if (!products.length) {
    els.productGrid.innerHTML =
      '<p style="color:var(--text-second);font-family:var(--font-mono);font-size:.85rem;padding:2rem;grid-column:1/-1">No products.</p>';
    return;
  }

  products.forEach((product, index) => {
    const card = buildCard(product);
    els.productGrid.appendChild(card);

    setTimeout(() => requestAnimationFrame(() => card.classList.add('is-visible')), index * 60);
  });
}

function buildCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card';
  article._productData = product;   

  const discount = product.discountPercentage >= 5
    ? `<div class="card-discount">-${Math.round(product.discountPercentage)}%</div>` : '';

  const origPrice = product.discountPercentage >= 5
    ? `<span class="card-original-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>` : '';

  article.innerHTML = `
    ${discount}
    <div class="card-img-wrap">
      <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.title)}"
           class="card-img" loading="lazy"/>
    </div>
    <div class="card-body">
      <span class="card-category">${escapeHtml(product.category)}</span>
      <h2 class="card-title">${escapeHtml(product.title)}</h2>
      <p class="card-desc">${escapeHtml(truncate(product.description))}</p>
      <div class="card-rating">
        <span class="stars">${buildStars(Math.round(product.rating))}</span>
        <span class="rating-count">(${product.rating.toFixed(1)} · ${product.stock} left)</span>
      </div>
      <div class="card-footer">
        <div class="price-stack">
          <span class="card-price">${formatPrice(product.price)}</span>
          ${origPrice}
        </div>
        <button class="btn btn-primary" data-action="add-to-cart">Add to Cart</button>
      </div>
    </div>`;

  article.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;
    cart.add(article._productData);
    btn.textContent = '✓ Added!';
    btn.style.cssText = 'background:#00e676;color:#000';
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.cssText = ''; }, 1500);
  });

  return article;
}

function buildFilterButtons(products) {
  const cats = [...new Set(products.map(p => p.category))].sort();
  els.filterBar.querySelector('[data-filter="all"]').addEventListener('click', handleFilter);
  cats.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'filter-btn'; b.textContent = cat; b.dataset.filter = cat;
    b.addEventListener('click', handleFilter);
    els.filterBar.appendChild(b);
  });
}

function handleFilter(e) {
  const f = e.target.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderProductCards(f === 'all' ? allProducts : allProducts.filter(p => p.category === f));
}

function openCart() {
  els.cartDrawer.classList.add('open');
  els.cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  els.cartDrawer.classList.remove('open');
  els.cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

els.cartBtn.addEventListener('click', openCart);
els.cartClose.addEventListener('click', closeCart);
els.cartOverlay.addEventListener('click', closeCart);

els.apiCta.addEventListener('click', () => {
  if (!currentApiProduct) return;
  cart.add(currentApiProduct);
  els.apiCta.textContent = '✓ Added!';
  els.apiCta.style.cssText = 'background:#00e676;color:#000';
  setTimeout(() => { els.apiCta.textContent = 'Add to Cart'; els.apiCta.style.cssText = ''; }, 1500);
});

const featuredBtn = document.querySelector('#featured-product [data-action="add-to-cart"]');
if (featuredBtn) {
  featuredBtn.addEventListener('click', () => {
    cart.add({
      id: 'static-jacket',
      title: "Men's Cotton Jacket",
      price: 55.99,
      thumbnail: document.querySelector('#featured-product .card-img').src,
      category: "men's clothing",
    });
    featuredBtn.textContent = '✓ Added!';
    featuredBtn.style.cssText = 'background:#00e676;color:#000';
    setTimeout(() => { featuredBtn.textContent = 'Add to Cart'; featuredBtn.style.cssText = ''; }, 1500);
  });
}

els.fetchBtn.addEventListener('click', () => {
  const id = parseInt(els.productIdInput.value, 10);
  if (id >= 1 && id <= 100) fetchAndDisplayProduct(id);
  else logLine('✗ Enter a valid ID (1–100)', 'error');
});
els.productIdInput.addEventListener('keydown', e => { if (e.key === 'Enter') els.fetchBtn.click(); });

function placeOrder() {
  if (cart.totalQty() === 0) {
    alert('Your cart is empty!');
    return;
  }

  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const items = Object.values(cart.items);

  els.modalOrderId.textContent = orderId;
  els.modalTotal.textContent = `$${cart.totalPrice()}`;
  els.modalItems.innerHTML = items.map(({ product, qty }) => `
    <div class="modal-item">
      <img src="${escapeHtml(product.thumbnail)}" alt="" class="modal-item-img"/>
      <div>
        <p class="modal-item-title">${escapeHtml(product.title.slice(0, 35))}</p>
        <p class="modal-item-meta">${formatPrice(product.price)} × ${qty} = ${formatPrice(product.price * qty)}</p>
      </div>
    </div>`).join('');

  console.group('%c📦 Order Placed!', 'color:#00e676;font-size:1.1em;font-weight:bold;');
  console.log('Order ID:', orderId);
  console.table(items.map(({ product, qty }) => ({
    product: product.title.slice(0, 30), qty,
    unitPrice: product.price,
    lineTotal: (product.price * qty).toFixed(2),
  })));
  console.log('Total: $' + cart.totalPrice());
  console.groupEnd();

  els.modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  closeCart();
  cart.items = {};
  cart.render();
}

els.checkoutBtn.addEventListener('click', placeOrder);

function closeModal() {
  els.modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

els.modalCloseBtn.addEventListener('click', closeModal);
els.modalOverlay.addEventListener('click', e => { if (e.target === els.modalOverlay) closeModal(); });

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

async function init() {
  console.group('%c🚀 Week 6 — StoreOS', 'font-size:1.1em;color:#00e5ff;font-weight:bold;');
  console.log('API:', API_BASE, '✓ CORS enabled');
  console.log('Tip: open F12 → Network tab to watch live API requests');
  console.groupEnd();

  await Promise.all([
    fetchAndDisplayProduct(1),       
    fetchAndRenderAllProducts(),     
  ]);
}

init();