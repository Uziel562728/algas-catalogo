const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

test('El HTML solicita una versión de JavaScript correspondiente al catálogo vigente', () => {
  const root = path.join(__dirname, '..');
  const source = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8').replaceAll('\r\n', '\n');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const version = createHash('sha256').update(source).digest('hex').slice(0, 12);
  const script = html.match(/<script type="module" src="([^"]+)"/);
  assert.ok(script, 'Debe existir el módulo principal');
  assert.equal(script[1], 'js/app.js?v=' + version,
    'Si cambia app.js, actualizar su versión en index.html para invalidar la caché anterior.');
});
