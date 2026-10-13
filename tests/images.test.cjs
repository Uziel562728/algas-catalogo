const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL, fileURLToPath } = require('node:url');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const context = { URL, moduleUrl: pathToFileURL(path.join(root, 'js/app.js')).href,
  history: {}, window: { addEventListener() {} },
  document: { addEventListener() {}, getElementById() { return { addEventListener() {} }; }, querySelector() { return null; } },
  console, localStorage: { getItem() { return null; } } };
const app = vm.runInNewContext(source.replaceAll('import.meta.url', 'moduleUrl') + ';({ PRODUCTS, IMAGE_FALLBACK, card, buildCarousel })', context);

test('Todas las fotos de catálogo y variantes son archivos locales válidos', () => {
  const photos = new Set(app.PRODUCTS.flatMap(p => [p.image, ...(p.images || []).map(i => i.src)]));
  assert.equal(photos.size, 113);
  for (const photo of photos) {
    assert.equal(new URL(photo).protocol, 'file:');
    const target = fileURLToPath(photo.replaceAll('%/', '%25/'));
    const relative = path.relative(path.join(root, 'images'), target);
    assert.equal(relative.startsWith('..') || path.isAbsolute(relative), false);
    const bytes = fs.readFileSync(target);
    assert.ok(bytes.length > 100, target);
    assert.ok(bytes.subarray(0, 2).equals(Buffer.from([0xff, 0xd8])) || bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), target);
  }
});

test('Logo y WhatsApp se cargan localmente y desaparece el fallback externo', () => {
  assert.match(html, /class="logo" src="images\/logo-algas\.jpg"/);
  assert.equal((html.match(/src="images\/whatsapp\.svg"/g) || []).length, 3);
  assert.ok(fs.statSync(path.join(root, 'images/logo-algas.jpg')).size > 100);
  assert.match(fs.readFileSync(path.join(root, 'images/whatsapp.svg'), 'utf8'), /<svg/);
  assert.doesNotMatch(source + html, /via\.placeholder\.com|https:\/\/i\.ibb\.co|cdn-icons-png\.flaticon\.com/);
});

test('El fallback local evita bucles de error en tarjetas y galerías', () => {
  assert.match(fs.readFileSync(fileURLToPath(app.IMAGE_FALLBACK), 'utf8'), /Imagen no disponible/);
  const gallery = app.buildCarousel(app.PRODUCTS.find(p => p.id === 'camisa-ysl').images);
  for (const markup of [app.card(app.PRODUCTS[0]), gallery]) {
    assert.ok(markup.includes('this.onerror=null;this.src='));
    const script = markup.match(/onerror="([^"]+)"/)[1];
    const image = { onerror() {}, src: 'missing.jpg' };
    vm.runInNewContext('(function(){' + script + '}).call(image)', { image });
    assert.equal(image.onerror, null);
    assert.equal(image.src, app.IMAGE_FALLBACK);
  }
  assert.ok(app.buildCarousel([]).includes(app.IMAGE_FALLBACK));
});
