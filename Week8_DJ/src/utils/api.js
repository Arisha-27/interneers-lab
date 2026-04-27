
const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics',  description: 'Gadgets, devices and tech accessories', color: '#6c63ff', icon: '⚡', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-2', name: 'Apparel',      description: 'Clothing, shoes and fashion items',     color: '#22d3a8', icon: '👕', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-3', name: 'Home & Garden',description: 'Furniture, decor and outdoor items',    color: '#f5a623', icon: '🏡', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-4', name: 'Books',        description: 'Fiction, non-fiction and educational',  color: '#ff5c5c', icon: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-5', name: 'Accessories',  description: 'Bags, watches and lifestyle items',     color: '#a29bfe', icon: '⌚️', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop' },
];

const SEED_PRODUCTS = [
  { id: 'p-1',  name: 'Wireless Earbuds Pro',   categoryId: 'cat-1', price: 129.99, stock: 42,  sku: 'EAR-001', description: 'Premium noise-cancelling earbuds with 30hr battery life.',  status: 'active', image: '/images/products/earbuds.png' },
  { id: 'p-2',  name: 'Mechanical Keyboard',    categoryId: 'cat-1', price: 189.00, stock: 15,  sku: 'KEY-002', description: 'TKL layout, hot-swap switches, RGB per-key lighting.',        status: 'active', image: '/images/products/keyboard.png' },
  { id: 'p-3',  name: '4K Webcam',              categoryId: 'cat-1', price: 99.99,  stock: 0,   sku: 'CAM-003', description: 'Ultra-sharp streaming camera with auto-focus & mic array.',  status: 'inactive', image: '/images/products/webcam.png' },
  { id: 'p-4',  name: 'Slim Fit Chinos',        categoryId: 'cat-2', price: 59.99,  stock: 88,  sku: 'CHN-001', description: 'Stretch-cotton blend, mid-rise, available in 8 colors.',     status: 'active', image: '/images/products/chinos.png' },
  { id: 'p-5',  name: 'Running Sneakers',       categoryId: 'cat-2', price: 110.00, stock: 32,  sku: 'SNK-002', description: 'Lightweight foam sole with breathable mesh upper.',           status: 'active', image: '/images/products/sneakers.png' },
  { id: 'p-6',  name: 'Merino Wool Jumper',     categoryId: 'cat-2', price: 85.00,  stock: 5,   sku: 'JMP-003', description: 'Fine 100% merino wool, anti-itch, machine washable.',        status: 'active', image: '/images/products/jumper.png' },
  { id: 'p-7',  name: 'Bamboo Desk Organiser',  categoryId: 'cat-3', price: 34.99,  stock: 60,  sku: 'DSK-001', description: 'Sustainable bamboo with 6 compartments and cable tray.',     status: 'active', image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-8',  name: 'String Lights 10m',      categoryId: 'cat-3', price: 22.00,  stock: 120, sku: 'LGT-002', description: 'Warm-white LED fairy lights, indoor/outdoor rated IP44.',    status: 'active', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-9',  name: 'Atomic Habits',          categoryId: 'cat-4', price: 16.99,  stock: 200, sku: 'BK-001',  description: 'James Clear. Build good habits and break bad ones.',         status: 'active', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-10', name: 'The Design of Everyday Things', categoryId: 'cat-4', price: 19.99, stock: 75, sku: 'BK-002', description: 'Don Norman. The bible of human-centred design.', status: 'active', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-11', name: 'Smart Watch Ultra',      categoryId: 'cat-5', price: 399.00, stock: 12,  sku: 'WTC-001', description: 'Advanced fitness tracking, GPS, and titanium case.',           status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-12', name: 'Leather Backpack',       categoryId: 'cat-5', price: 145.00, stock: 8,   sku: 'BAG-001', description: 'Handcrafted genuine leather with 15-inch laptop sleeve.',    status: 'active', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' },
  {id: 'p-13', name: 'Ceramic Table Lamp',     categoryId: 'cat-3', price: 79.99,  stock: 25,  sku: 'LMP-001', description: 'Modern minimalist design with textured ceramic base.',       status: 'active', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-14', name: 'Noise Cancelling Headphones', categoryId: 'cat-1', price: 299.00, stock: 20, sku: 'AUD-001', description: 'Industry leading noise cancellation with 40hr battery.',  status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
  { id: 'p-15', name: 'Cotton Bed Linen Set',   categoryId: 'cat-3', price: 120.00, stock: 45,  sku: 'BED-001', description: '400 thread count Egyptian cotton, king size, white.',       status: 'active', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop' },
];


const LS_CATS = 'pm_categories';
const LS_PRODS = 'pm_products';
const LS_VERSION = 'pm_schema_version';
const CURRENT_VERSION = '1';

function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch { return seed; }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initStore() {
  const existingCats = localStorage.getItem(LS_CATS);
  const existingProds = localStorage.getItem(LS_PRODS);
  const storedVersion = localStorage.getItem(LS_VERSION);

  if (!existingCats || !existingProds || storedVersion !== CURRENT_VERSION) {
    save(LS_CATS, SEED_CATEGORIES);
    save(LS_PRODS, SEED_PRODUCTS);
    localStorage.setItem(LS_VERSION, CURRENT_VERSION);
  }
}


const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));


export const categoryApi = {
  async list() {
    await delay();
    return load(LS_CATS, SEED_CATEGORIES);
  },
  async get(id) {
    await delay(200);
    const cats = load(LS_CATS, SEED_CATEGORIES);
    const cat = cats.find(c => c.id === id);
    if (!cat) throw new Error(`Category "${id}" not found`);
    return cat;
  },
  async create(data) {
    await delay();
    const cats = load(LS_CATS, SEED_CATEGORIES);
    if (cats.some(c => c.name.toLowerCase() === data.name.trim().toLowerCase())) {
      throw new Error(`A category named "${data.name}" already exists`);
    }
    const cat = { ...data, id: `cat-${Date.now()}`, name: data.name.trim() };
    save(LS_CATS, [...cats, cat]);
    return cat;
  },
  async update(id, data) {
    await delay();
    const cats = load(LS_CATS, SEED_CATEGORIES);
    if (cats.some(c => c.id !== id && c.name.toLowerCase() === data.name.trim().toLowerCase())) {
      throw new Error(`Another category named "${data.name}" already exists`);
    }
    const updated = cats.map(c => c.id === id ? { ...c, ...data, name: data.name.trim() } : c);
    save(LS_CATS, updated);
    return updated.find(c => c.id === id);
  },
  async delete(id) {
    await delay();
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    if (prods.some(p => p.categoryId === id)) {
      throw new Error('Cannot delete: this category still has products. Move or delete them first.');
    }
    const cats = load(LS_CATS, SEED_CATEGORIES);
    save(LS_CATS, cats.filter(c => c.id !== id));
  },
};


export const productApi = {
  async list(categoryId) {
    await delay();
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    return categoryId ? prods.filter(p => p.categoryId === categoryId) : prods;
  },
  async get(id) {
    await delay(200);
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    const p = prods.find(p => p.id === id);
    if (!p) throw new Error(`Product "${id}" not found`);
    return p;
  },
  async create(data) {
    await delay();
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    if (data.sku && prods.some(p => p.sku.toLowerCase() === data.sku.trim().toLowerCase())) {
      throw new Error(`SKU "${data.sku}" is already in use`);
    }
    const prod = {
      ...data,
      id: `p-${Date.now()}`,
      name: data.name.trim(),
      sku: data.sku?.trim() || '',
      price: parseFloat(data.price) || 0,
      stock: parseInt(data.stock) || 0,
      status: data.status || 'active',
    };
    save(LS_PRODS, [...prods, prod]);
    return prod;
  },
  async update(id, data) {
    await delay();
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    if (data.sku && prods.some(p => p.id !== id && p.sku.toLowerCase() === data.sku.trim().toLowerCase())) {
      throw new Error(`SKU "${data.sku}" is already in use by another product`);
    }
    const updated = prods.map(p => p.id === id ? {
      ...p, ...data,
      name: data.name?.trim() || p.name,
      sku:  data.sku?.trim()  || p.sku,
      price: data.price === undefined ? p.price : parseFloat(data.price) || 0,
      stock: data.stock === undefined ? p.stock : parseInt(data.stock, 10) || 0,
    } : p);
    save(LS_PRODS, updated);
    return updated.find(p => p.id === id);
  },
  async delete(id) {
    await delay();
    const prods = load(LS_PRODS, SEED_PRODUCTS);
    save(LS_PRODS, prods.filter(p => p.id !== id));
  },
  async moveCategory(id, newCategoryId) {
    await delay(300);
    const cats = load(LS_CATS, SEED_CATEGORIES);
    if (!cats.find(c => c.id === newCategoryId)) {
      throw new Error('Target category does not exist');
    }
    return productApi.update(id, { categoryId: newCategoryId });
  },
};

initStore();
