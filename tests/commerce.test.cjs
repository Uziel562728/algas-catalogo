const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

function fixture(stored = null, inaccessible = false, hash = '') {
  const nodes = new Map();
  const events = new Map();
  const opened = [];
  const writes = [];
  const historyWrites = [];
  function element() {
    return { dataset: {}, style: {}, children: [], textContent: '', innerHTML: '', disabled: false,
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
      setAttribute() {}, removeAttribute() {}, addEventListener() {},
      appendChild(child) { this.children.push(child); }, querySelectorAll() { return []; },
      getBoundingClientRect() { return { top: 0 }; } };
  }
  const document = {
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
    createElement: element, querySelector() { return null; },
    addEventListener(name, fn) { if (!events.has(name)) events.set(name, []); events.get(name).push(fn); },
    body: element(), documentElement: element(), title: 'Algas - Catalogo'
  };
  const context = vm.createContext({ document, URL, moduleUrl: pathToFileURL(path.join(__dirname, '../js/app.js')).href,
    console: { warn() {}, error() {} }, alert() {}, setTimeout() {}, requestAnimationFrame(fn) { fn(); },
    location: { hash }, history: { replaceState(...args) { historyWrites.push(args); }, pushState() {} },
    window: { addEventListener() {}, location: { pathname: '/', search: '' }, scrollY: 0,
      scrollTo() {}, open(url) { opened.push(url); } },
    localStorage: { getItem() { if (inaccessible) throw new Error('Storage blocked'); return stored; },
      setItem(key, value) { if (inaccessible) throw new Error('Storage blocked'); writes.push({ key, value }); } }
  });
  vm.runInContext(source.replaceAll('import.meta.url', 'moduleUrl'), context);
  const api = vm.runInContext('({ PRODUCTS, MODEL_PRICES, resolveProductPrice, reconcileCart, restoreCart, lineTotal, fmt, card, updateDetailPriceUI, updateCartDisplay, checkout, consultarWhatsApp, addToCart, updateQuantity, removeItem, clearCart, saveCart, setCart(value) { cart = value; }, getCart() { return cart; }, select(product, size, model) { currentProduct = product; selectedSize = size; selectedModel = model; carouselIndex = 0; } })', context);
  return { ...api, nodes, opened, writes, historyWrites, init() { for (const fn of events.get('DOMContentLoaded') || []) fn(); } };
}
const expectedPrices = {
  'sweater-punto-ingles-yves-saint-laurent': 50000, 'sweater-super-abrigado': 20000,
  'sweater-medio-cierre-importado': 30000, 'campera-buckingham': 75000,
  'campera-impermeable': 60000, 'campera-impermeable-oferta': 65000, 'campera-buckingham-reversible': 65000,
  'campera-engomada': 65000, 'campera-uniqlo-impermeable': 35000,
  'camisa-rocco': 40000, 'campera-rompevientos': 50000,
  'campera-rompevientos-buckingham-nueva': 50000, 'chaleco-impermeable': 40000,
  'remera-mc-premium': 25000, 'camisa-rochas': 80000, 'camisa-ysl': 50000,
  'traje-thomson-williams-soft': 350000, 'chomba-hilo-pima': 60000,
  'sueter-escote-en-v-yves-saint-laurent': 60000,
  'bermuda-rocco-gabardina-elastizada': 30000,
  'remera-algodon-peinado-24-1': 18000,
  'chomba-algodon-100': 19999,
  'chomba-devre-algodon': 35000,
  'chomba-devre-prelavada': 35000
};

test('Precios confirmados, catálogo sin duplicados ni Camisaco', () => {
  const app = fixture();
  assert.equal(app.PRODUCTS.length, 27);
  assert.equal(new Set(app.PRODUCTS.map(p => p.id)).size, 27);
  assert.equal(app.PRODUCTS.some(p => p.id === 'camisaco-corderito'), false);
  for (const [id, price] of Object.entries(expectedPrices)) assert.equal(app.PRODUCTS.find(p => p.id === id)?.price, price, id);
  assert.equal(app.PRODUCTS.find(p => p.id === 'campera-backing').price, 35000);
  assert.equal(app.PRODUCTS.find(p => p.id === 'campera-capucha-desmontable').price, 40000);
  assert.equal(app.PRODUCTS.find(p => p.id === 'chomba-algodon-premium-colores').price, 29999);
});

test('Los 17 modelos YSL y sus talles mantienen $50.000', () => {
  const app = fixture(); const product = app.PRODUCTS.find(p => p.id === 'camisa-ysl');
  assert.equal(product.images.length, 17); assert.equal(product.priceRange, undefined);
  assert.equal(Object.keys(app.MODEL_PRICES['camisa-ysl']).length, 17);
  for (const image of product.images) for (const size of product.sizes) {
    assert.equal(app.MODEL_PRICES['camisa-ysl'][image.model], 50000);
    assert.equal(app.resolveProductPrice(product, size, image.model), 50000);
    app.select(product, size, image.model); app.updateDetailPriceUI();
    assert.equal(app.nodes.get('detailPrice').textContent, app.fmt(50000));
    app.consultarWhatsApp(); assert.match(decodeURIComponent(app.opened.at(-1)), /50\.000/);
  }
});

test('Todos los talles y colores Pima mantienen $60.000', () => {
  const app = fixture(); const product = app.PRODUCTS.find(p => p.id === 'chomba-hilo-pima');
  assert.equal(product.images.length, 9);
  assert.equal(app.card(product).includes(app.fmt(60000)), true);
  for (const size of ['M', 'L', 'XL', 'XXL', 'XXXL']) for (const image of product.images) {
    assert.equal(product.sizePrices[size], 60000);
    assert.equal(app.resolveProductPrice(product, size, image.model), 60000);
    app.select(product, size, image.model); app.updateDetailPriceUI();
    assert.equal(app.nodes.get('detailPrice').textContent, app.fmt(60000));
  }
});

test('Sin promociones por cantidad, incluso ante campos antiguos', () => {
  const app = fixture();
  assert.doesNotMatch(source, /bundlePrice|bundleQuantity|bundleLineTotal/);
  for (const product of app.PRODUCTS) {
    assert.equal(product.bundlePrice, undefined); assert.equal(product.bundleQuantity, undefined);
    if (product.id === 'remera-algodon-peinado-24-1') {
      assert.match(app.card(product), /2 POR \$30\.000/);
    } else if (product.id === 'chomba-algodon-100') {
      assert.match(app.card(product), /2 POR \$35\.000/);
    } else {
      assert.doesNotMatch(app.card(product), /\d+ POR/);
    }
  }
  for (const [id, unit] of [['sweater-punto-ingles-yves-saint-laurent', 50000], ['sweater-super-abrigado', 20000], ['sweater-medio-cierre-importado', 30000]]) {
    for (const qty of [1, 2, 3, 4, 5]) assert.equal(app.lineTotal({ id, price: unit, qty, bundleQuantity: 2, bundlePrice: 1 }), unit * qty);
  }
  assert.equal(app.PRODUCTS.find(p => p.id === 'sweater-super-abrigado').description, 'Sweater liviano importado');
  assert.equal(app.PRODUCTS.find(p => p.id === 'sweater-medio-cierre-importado').oldPrice, 40000);
  assert.match(source, /10% OFF/);
});

test('Restauración actualiza precios y descarta productos y selecciones inválidas', () => {
  const app = fixture();
  const legacy = [
    { id: 'sweater-punto-ingles-yves-saint-laurent', qty: 3, size: 'M', modelo: 'Azul', price: 40000, bundleQuantity: 2, bundlePrice: 75000, name: 'Obsoleto', key: 'old' },
    { id: 'camisa-ysl', qty: 2, size: 'XL', modelo: 'modelo 16', price: 70000 },
    { id: 'chomba-hilo-pima', qty: 1, size: 'XXXL', modelo: ' Negro', price: 70000 },
    { id: 'campera-impermeable', qty: 2, size: 'XL', modelo: null, price: 65000 },
    { id: 'campera-impermeable-oferta', qty: 2, size: 'L', modelo: null, price: 40000 },
    { id: 'camisaco-corderito', qty: 1, size: 'M', price: 49999 },
    { id: 'missing', qty: 1, size: 'M' }, null, [],
    { id: 'camisa-rocco', qty: 1, size: 'M', modelo: 'inexistente' },
    { id: 'camisa-rocco', qty: 1, size: 'INVALID' },
    { id: 'camisa-rocco', qty: -1, size: 'M' },
    { id: 'camisa-rocco', qty: 1.5, size: 'M' },
    { id: 'camisa-rocco', qty: true, size: 'M' }
  ];
  const cart = app.reconcileCart(legacy);
  assert.equal(cart.length, 5);
  assert.deepEqual(Array.from(cart, i => i.price), [50000, 50000, 60000, 60000, 65000]);
  assert.deepEqual(Array.from(cart, i => i.qty), [3, 2, 1, 2, 2]);
  assert.equal(cart[0].modelo, 'Azul'); assert.equal(cart[0].size, 'M');
  assert.equal(cart[0].bundlePrice, undefined); assert.equal(cart[0].bundleQuantity, undefined);
  assert.equal(cart[0].name, app.PRODUCTS[0].name);
  assert.equal(cart[0].key, 'sweater-punto-ingles-yves-saint-laurent::Azul::M');
  assert.equal(app.reconcileCart({}).length, 0);
});

test('JSON corrupto o almacenamiento bloqueado no impiden iniciar', () => {
  for (const raw of ['{broken', '{}', 'null', '42', '"text"', '[null]']) {
    const app = fixture(raw); app.init(); assert.equal(app.getCart().length, 0);
    assert.equal(app.writes.at(-1).value, '[]');
  }
  const app = fixture(null, true); assert.doesNotThrow(() => app.init());
  assert.equal(app.getCart().length, 0);
});

test('Inicio persiste reconciliación, agrupa líneas repetidas y respeta modelos exactos', () => {
  const app = fixture(JSON.stringify([
    { id: 'chomba-hilo-pima', qty: '2', size: 'XXXL', modelo: ' Negro', price: 70000 },
    { id: 'chomba-hilo-pima', qty: 1, size: 'XXXL', modelo: ' Negro', price: 1 },
    { id: 'traje-thomson-williams-soft', qty: 1, size: 46, price: 199999 }
  ]));
  app.init(); const saved = JSON.parse(app.writes.at(-1).value);
  assert.equal(saved.length, 2); assert.equal(saved[0].qty, 3); assert.equal(saved[0].price, 60000);
  assert.equal(saved[0].modelo, ' Negro'); assert.equal(saved[1].size, '46');
  assert.equal(saved[1].price, 350000); assert.equal(saved[1].modelo, 'Verde');
});

test('Combinaciones sin precio válido y productos agotados se descartan', () => {
  const app = fixture(); const product = app.PRODUCTS.find(p => p.id === 'camisa-rocco');
  product.price = null;
  assert.equal(app.reconcileCart([{ id: product.id, qty: 1, size: 'M' }]).length, 0);
  product.price = 40000; product.soldOut = true;
  assert.equal(app.reconcileCart([{ id: product.id, qty: 1, size: 'M' }]).length, 0);
  app.select(product, 'M', null); app.addToCart(product); assert.equal(app.getCart().length, 0);
});

test('Carrito, cantidades y mensaje de WhatsApp coinciden en subtotales y total', () => {
  const app = fixture(); const product = app.PRODUCTS[0];
  app.select(product, null, 'Negro'); app.addToCart(product); assert.equal(app.getCart().length, 0);
  app.select(product, 'M', 'Negro'); app.addToCart(product); app.addToCart(product);
  app.updateQuantity(0, 1); assert.equal(app.getCart()[0].qty, 3);
  const second = app.PRODUCTS.find(p => p.id === 'sweater-medio-cierre-importado');
  app.select(second, 'L', 'Bordo'); app.addToCart(second); app.addToCart(second);
  const expected = 210000;
  const rendered = app.nodes.get('cartItems').children.at(-1).innerHTML;
  assert.equal(rendered.includes(app.fmt(expected)), true);
  app.checkout(); const message = new URL(app.opened.at(-1)).searchParams.get('text');
  assert.equal(message.includes('TOTAL: ' + app.fmt(expected)), true);
  assert.equal(message.includes('Subtotal: ' + app.fmt(150000)), true);
  assert.equal(message.includes('Subtotal: ' + app.fmt(60000)), true);
  assert.doesNotMatch(message, /Promo aplicada|2 por/);
  app.updateQuantity(0, -1); assert.equal(app.getCart()[0].qty, 2);
  app.removeItem(app.getCart()[1].key); assert.equal(app.getCart().length, 1);
  app.clearCart(); assert.equal(app.getCart().length, 0);
});

test('Enlace directo al Camisaco retirado vuelve a la grilla', () => {
  const app = fixture(null, false, '#detalle-camisaco-corderito');
  app.init(); assert.equal(app.historyWrites.at(-1)[2], '/');
  assert.equal(app.nodes.get('productsGrid').children.length, 27);
});


test('Precios vigentes coinciden en tarjeta, detalle, carrito y WhatsApp para todas las selecciones confirmadas', () => {
  const app = fixture();
  for (const [id, price] of Object.entries(expectedPrices)) {
    const product = app.PRODUCTS.find(p => p.id === id);
    assert.equal(app.card(product).includes(app.fmt(price)), true, id);
    for (const size of product.sizes) for (const model of (product.images || []).map(i => i.model || i.alt).filter(Boolean).concat(product.images ? [] : [null])) {
      app.select(product, size, model); app.updateDetailPriceUI();
      const shown = app.nodes.get('detailPrice');
      assert.equal((product.oldPrice ? shown.innerHTML : shown.textContent).includes(app.fmt(price)), true, id);
      const cart = app.reconcileCart([{ id, size, modelo: model, qty: 3, price: 1, bundlePrice: 1, bundleQuantity: 2 }]);
      assert.equal(cart.length, 1, id); assert.equal(cart[0].price, price, id);
      app.setCart(cart); app.updateCartDisplay(); app.checkout();
      const message = new URL(app.opened.at(-1)).searchParams.get('text');
      assert.equal(message.includes('Precio unitario: ' + app.fmt(price)), true, id);
      assert.equal(message.includes('TOTAL: ' + app.fmt(price * 3)), true, id);
      app.consultarWhatsApp(); assert.equal(new URL(app.opened.at(-1)).searchParams.get('text').includes(app.fmt(price)), true, id);
    }
  }
});
