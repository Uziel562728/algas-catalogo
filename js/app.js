  // NUEVA FUNCIÓN PARA GUARDAR EL CARRITO EN LOCAL STORAGE
function saveCart() {
    try {
        localStorage.setItem('algasCart', JSON.stringify(cart));
    } catch (e) {
        console.error("Error al guardar el carrito en Local Storage:", e);
    }
}
// === Modelo + Precio dinámico ===
function updateModelInfo(modelo, precio){
  try{
    const info=document.getElementById('detailModelInfo');
    if(info){
      if(modelo){
        // Corregido: Usar backticks para template literal (si aplica, aunque aquí no era necesario)
        info.textContent='Modelo seleccionado: '+modelo+' — $'+precio;
      }else{
        info.textContent='';
      }
    }
    const promo=document.getElementById('paymentPriceNote');
    if(promo && currentProduct && currentProduct.categoria==='camisas'){
      if(modelo){
        promo.innerHTML=`El <strong>PRECIO mostrado en Camisas</strong> (Modelo ${modelo}) corresponde a abonar en <strong>3 cuotas</strong> o con <strong>Transferencia 10% de descuento</strong>.`; // Usar backticks si hay ${}
      }else{
        promo.innerHTML='El <strong>PRECIO mostrado en Camisas</strong> corresponde a abonar en <strong>3 cuotas</strong> o con <strong>Transferencia 10% de descuento</strong>.';
      }
    }
  }catch(e){ console.error("Error en updateModelInfo:", e); }
}


function updateMediosPago(categoria){
  try{
    const liEfectivo = document.getElementById('pagoEfectivo');
    const liTarjeta = document.getElementById('pagoTarjeta');
    const liTrans = document.getElementById('pagoTransferencia');

    if(!liTarjeta || !liTrans || !liEfectivo) return;

    const precioActual = currentProduct ? getPriceForCurrent(currentProduct) : null;

    // ❌ Eliminamos efectivo
    liEfectivo.style.display = 'none';

    // Tarjeta
    if(typeof precioActual === 'number'){
      liTarjeta.innerHTML = `Tarjeta 💳 <span style="font-weight:bold; color:#2d5a42;">(${fmt(precioActual)} en 3 cuotas)</span>`;
    } else {
      liTarjeta.innerHTML = 'Tarjeta 💳 (Consultar precio)';
    }

    // Transferencia + Retiro
    liTrans.innerHTML = 'Transferencia o Retiro en el local <span style="font-weight:bold; color:#e74c3c;">(10% OFF)</span>';

  }catch(e){
    console.error("Error en updateMediosPago:", e);
  }
}


// === Helpers PROMO CAMISAS (restaurado) ===
function showCamisasPromoInGrid(cat){
  try{
    const el = document.getElementById('promoCamisas');
    if(!el) return;
    el.style.display = (cat==='camisas' || cat==='all') ? 'block' : 'none';
  }catch(e){ console.error("Error en showCamisasPromoInGrid:", e); }
}
function showCamisasPromoInDetail(isCamisa){
  try{
    const el = document.getElementById('paymentPriceNote');
    if(!el) return;
    el.style.display = isCamisa ? 'block' : 'none';
  }catch(e){ console.error("Error en showCamisasPromoInDetail:", e); }
}

history.scrollRestoration='manual';
const WA_NUMBER='5491161521424';
const CURRENCY={style:'currency',currency:'ARS',maximumFractionDigits:0,minimumFractionDigits:0};
const fmt=(n)=> n.toLocaleString('es-AR',CURRENCY);
// State
// Cargar el carrito desde localStorage al inicio
let cart = (JSON.parse(localStorage.getItem('algasCart')) || []); 
let currentProduct = null; 
let prevScrollY = 0; 
let selectedSize = null; 
let selectedModel = null;
let __cartLockScrollY=0;
function lockBodyScroll(){
  __cartLockScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('modal-open');
  // CORREGIDO: Usar backticks
  document.body.style.top = `-${__cartLockScrollY}px`;
}
function unlockBodyScroll(){
  document.body.classList.remove('modal-open');
  const y = __cartLockScrollY || 0;
  document.body.style.top='';
  window.scrollTo(0, y);
}
// ===== CATÁLOGO =====
const sweaterBordoImage = new URL('../images/sweater medio cierre/sweater medio cierre color bordo claro .png', import.meta.url).href;
const sweaterNegroImage = new URL('../images/sweater medio cierre/sweater medio cierre color negro .png', import.meta.url).href;
const sweaterSuperAzulImage = new URL('../images/sweater super abrigado/azul.png', import.meta.url).href;
const sweaterSuperBordoImage = new URL('../images/sweater super abrigado/bordo.png', import.meta.url).href;
const sweaterSuperGrisImage = new URL('../images/sweater super abrigado/gris.png', import.meta.url).href;
const sweaterSuperNegroImage = new URL('../images/sweater super abrigado/negro.png', import.meta.url).href;
const sweaterPuntoInglesAzulImage = new URL('../images/sweater punto ingles/azul.png', import.meta.url).href;
const sweaterPuntoInglesBeigeImage = new URL('../images/sweater punto ingles/beige.png', import.meta.url).href;
const sweaterPuntoInglesNegroImage = new URL('../images/sweater punto ingles/negro.png', import.meta.url).href;
const sweaterPuntoInglesVerdeAzuladoImage = new URL('../images/sweater punto ingles/verde azulado.png', import.meta.url).href;
const PRODUCTS=[
{
  id: 'sweater-punto-ingles-yves-saint-laurent',
  categoria: 'sweaters',
  name: 'Sweater Punto Inglés Yves Saint Laurent — Oferta Especial',
  price: 40000,
  oldPrice: 50000,
  bundleQuantity: 2,
  bundlePrice: 75000,
  isNew: true,
  image: sweaterPuntoInglesNegroImage,
  images: [
    { src: sweaterPuntoInglesNegroImage, model: 'Negro' },
    { src: sweaterPuntoInglesAzulImage, model: 'Azul' },
    { src: sweaterPuntoInglesBeigeImage, model: 'Beige' },
    { src: sweaterPuntoInglesVerdeAzuladoImage, model: 'Verde azulado' }
  ],
  description: 'Sweater marca Yves Saint Laurent confeccionado en punto inglés y tejido con spandex. Oferta especial: $40.000 o 2 por $75.000.',
  features: [
    'Marca Yves Saint Laurent',
    'Tejido en punto inglés',
    'Confeccionado con spandex',
    'Precio de oferta: $40.000',
    'Promoción especial: 2 por $75.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: 'especial'
},
{
  id: 'sweater-super-abrigado',
  categoria: 'sweaters',
  name: 'Sweater Super Abrigado — Oferta Especial',
  price: 20000,
  bundleQuantity: 2,
  bundlePrice: 30000,
  isNew: true,
  image: sweaterSuperNegroImage,
  images: [
    { src: sweaterSuperNegroImage, model: 'Negro' },
    { src: sweaterSuperGrisImage, model: 'Gris' },
    { src: sweaterSuperAzulImage, model: 'Azul' },
    { src: sweaterSuperBordoImage, model: 'Bordo' }
  ],
  description: 'Sweater súper abrigado disponible en negro, gris, azul y bordo. Precio especial: $20.000 o 2 por $30.000.',
  features: [
    'Diseño súper abrigado',
    'Disponible en cuatro colores',
    'Precio de oferta: $20.000',
    'Promoción especial: 2 por $30.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: 'especial'
},
{
  id: 'sweater-medio-cierre-importado',
  categoria: 'sweaters',
  name: 'Sweater Medio Cierre Importado — Oferta Especial',
  price: 30000,
  oldPrice: 40000,
  bundleQuantity: 2,
  bundlePrice: 55000,
  isNew: true,
  image: sweaterBordoImage,
  images: [
    { src: sweaterBordoImage, model: 'Bordo' },
    { src: sweaterNegroImage, model: 'Negro' }
  ],
  description: 'Sweater importado con medio cierre. Oferta especial: $30.000 o 2 por $55.000.',
  features: [
    'Producto importado',
    'Diseño con medio cierre',
    'Precio de oferta: $30.000',
    'Promoción especial: 2 por $55.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: 'especial'
},
  { id:'campera-buckingham', categoria:'camperas', name:'Campera Doble Pechera Buckingham Polo Club', price:40000,
    image:'https://i.ibb.co/VpBGnRRR/Whats-App-Image-2026-04-12-at-1-37-32-PM.jpg',
    description:'Campera doble pechera de la marca Buckingham Polo Club, pensada para brindar abrigo y estilo. Disponible en talle XL.',
    features:['Diseño de doble pechera para mayor protección térmica','Marca Buckingham Polo Club, símbolo de elegancia','Materiales resistentes y costuras reforzadas', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'campera-impermeable', categoria:'camperas', name:'Campera Impermeable con Capucha Desmontable Buckingham Polo Club', price:40000,
    image:'https://i.ibb.co/r23hHjSP/Whats-App-Image-2026-04-12-at-1-37-32-PM-1.jpg',
    description:'Campera impermeable con capucha desmontable de Buckingham Polo Club. Ideal para lluvia y frío. Disponible en XL y color azul.',
    features:['Material impermeable de alta calidad','Capucha desmontable con cierre oculto','Confección resistente y cómoda','Marca Buckingham Polo Club', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-backing', categoria:'camperas', name:'Campera Backing Polo Club — Oferta Especial', price:35000,
    image:'https://i.ibb.co/cXgH4Vw3/Whats-App-Image-2026-04-12-at-1-37-33-PM.jpg',
    description:'Campera Backing Polo Club en color único. Oferta especial desde talle S hasta doble XL.',
    features:['Diseño exclusivo de Backing Polo Club','Oferta limitada a un único color','Disponible desde talle S hasta doble XXL','Confección resistente y cómoda','Precio promocional especial', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-buckingham-reversible', categoria:'camperas', name:'Campera Buckingham Polo Club — Reversible', price:40000,
    image:'https://i.ibb.co/N6xq5CmQ/Whats-App-Image-2026-04-12-at-1-37-33-PM-1.jpg',
    description:'Campera reversible de Buckingham Polo Club, ideal para diferentes estilos y situaciones. Disponible en talles S a doble XL.',
    features:['Diseño reversible para dos estilos','Marca Buckingham Polo Club, sinónimo de calidad','Ideal para climas fríos y moderados','Disponible en talles desde S a XXL', 'Consultar por talles especiales' ],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-engomada', categoria:'camperas', name:'Campera Engomada Buckingham Polo Club', price:40000,
    image:'https://i.ibb.co/qYvsh4fH/Whats-App-Image-2026-04-12-at-1-37-33-PM-4.jpg',
    description:'Campera engomada Buckingham Polo Club, del talle S al doble XL. Terminación engomada con excelente resistencia y estilo.',
    features:['Terminación engomada de alta resistencia','Marca Buckingham Polo Club','Disponible del S al XXL', 'Consultar por talles especiales' , 'Interior cómodo para uso diario'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-capucha-desmontable', categoria:'camperas', name:'Campera Buckingham Polo Club — Capucha Desmontable', price:40000,
    image:'https://i.ibb.co/Xxdq6f5c/Whats-App-Image-2026-04-12-at-1-37-33-PM-6.jpg',
    description:'Campera con capucha desmontable e impermeable de Buckingham Polo Club, con precio increíble. Ideal para lluvia y uso diario.',
    features:['Capucha desmontable para mayor versatilidad','Tejido impermeable para lluvia','Marca Buckingham Polo Club','Confección cómoda para uso diario','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-uniqlo-impermeable', categoria:'camperas', name:'Campera Impermeable Símil Uniqlo Buckingham Polo Club', price:25000,
    image:'https://i.ibb.co/rR9VsKXm/Whats-App-Image-2026-04-12-at-1-37-34-PM.jpg',
    description:'Campera impermeable símil Uniqlo de Buckingham Polo Club, disponible del talle S al XXL. ',
    features:['Inspirada en el estilo Uniqlo','Material impermeable de alta calidad','Disponible del talle S al XXL','Confección cómoda y resistente','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'campera-impermeable-oferta', categoria:'camperas', name:'Campera Impermeable — Oferta Limitada', price:40000,
    image:'https://i.ibb.co/zVHHrw0V/Imagen-de-Whats-App-2025-09-04-a-las-11-06-23-83ac75f2.jpg',
    description:'Campera impermeable. Oferta limitada desde el talle S al doble XL. Precio promocional $35.000 (transferencia o efectivo).',
    features:['Impermeable de alta calidad','Disponible desde talle S hasta doble XXL','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-rompevientos', categoria:'camperas', name:'Rompevientos Buckingham Polo Club', price:25000,
    image:'https://i.ibb.co/DPQ8mYZm/Imagen-de-Whats-App-2025-09-04-a-las-10-33-16-0ff45917.jpg',
    description:'Varios modelos, talles y colores, del Small al XXL. ¡Increíble oferta $40.000!',
    features:['Rompevientos liviano','Varios modelos y colores','Talles S al XXL', 'Consultar por talles especiales' ,'Secado rápido','Excelente relación precio-calidad'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'chaleco-impermeable', categoria:'chalecos', name:'Chaleco Impermeable Buckingham Polo Club', price:29999,
    image:'https://i.ibb.co/JwPW5XPS/Imagen-de-Whats-App-2025-09-04-a-las-10-33-17-ba7943c4.jpg',
    description:'Único color. Precio $35.000.',
    features:['Tejido impermeable','Único color','Marca Buckingham Polo Club','Liviano y cómodo','Ideal para lluvia y viento'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
{
  id: 'camisaco-corderito',
  categoria: 'camperas',
  name: 'Camisaco forrado en Corderito marca Devrè',
  price: 49999,
  soldOut: true,

  image: 'https://i.ibb.co/jqdFsKW/Imagen-de-Whats-App-2025-09-04-a-las-10-33-17-1b371c5b.jpg',
  description: 'Producto agotado.',
  features: [
    'Forrado en corderito',
    'Producto agotado',
    'Del S al XL',
    'Abrigo suave y cómodo'
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  tag: null
},
  { id:'remera-mc-premium', categoria:'remeras', name:'Remera Manga Corta - Primera Marca (Algodón Peinado)', price:15000,
    image:'https://i.ibb.co/k62gp4Zw/Imagen-de-Whats-App-2025-09-04-a-las-22-34-46-2e91c20e.jpg',
    description:'Oferta especial. Algodón peinado, calidad primera marca.',
    features:['Algodón peinado','Primera marca','Oferta especial','Corte clásico y cómodo'],
    sizes:['XS','S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'camisa-rochas', categoria:'camisas', name:'Camisa primera marca Rochas importada', price:65000,
    image:'https://i.ibb.co/qMzbzg3g/Imagen-de-Whats-App-2025-09-09-a-las-23-41-40-dc17556f.jpg',
    images:[
      {src:'https://i.ibb.co/qMzbzg3g/Imagen-de-Whats-App-2025-09-09-a-las-23-41-40-dc17556f.jpg', model:'blanca con rayas'},
      {src:'https://i.ibb.co/BHFDdnGT/Imagen-de-Whats-App-2025-09-09-a-las-23-41-40-cdb0bb08.jpg', model:'blanca con cuadraditos azules'},
      {src:'https://i.ibb.co/DDpnsxc3/Imagen-de-Whats-App-2025-09-09-a-las-23-41-40-a689e4c3.jpg', model:'blanca con cuadraditos celestes'},
      {src:'https://i.ibb.co/0yzWkbfg/Imagen-de-Whats-App-2025-09-09-a-las-23-41-40-9e7fafbe.jpg', model:'gris con cuadraditos'},
      {src:'https://i.ibb.co/mVQMfzy2/Imagen-de-Whats-App-2025-09-09-a-las-23-41-41-e4f63b4d.jpg', model:'celeste rayada'},
      {src:'https://i.ibb.co/sDTfj5w/Imagen-de-Whats-App-2025-09-11-a-las-17-19-20-3f1a47d0.jpg', model:'azul rayada'},
      {src:'https://i.ibb.co/tTMVZ4y5/Imagen-de-Whats-App-2025-09-11-a-las-17-19-21-22aaa98f.jpg', model:'marron lisa'},
      {src:'https://i.ibb.co/Mx2F0PXH/Imagen-de-Whats-App-2025-09-11-a-las-17-19-21-9ea15da8.jpg', model:'blanca lisa'}
    ],
    description:'Marca Rochas. 80% algodón. Varios tonos. Talles del S al XXL.',
    features:['Marca Rochas','80% algodón','Varios tonos disponibles','Talles del S al XXL','Consultá el precio'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'camisa-rocco', categoria:'camisas', name:'Camisa marca Rocco — Oferta especial', price:35000,
    image:'https://i.ibb.co/gZv8X62R/Imagen-de-Whats-App-2025-09-10-a-las-16-31-37-d034c8e0.jpg',
    images:[
      {src:'https://i.ibb.co/gZv8X62R/Imagen-de-Whats-App-2025-09-10-a-las-16-31-37-d034c8e0.jpg', model:'blanca con rayas'},
      {src:'https://i.ibb.co/mrM7mpgh/Imagen-de-Whats-App-2025-09-10-a-las-16-31-38-4ab03b07.jpg', model:'negra con cuadraditos'},
      {src:'https://i.ibb.co/xq52DPBJ/Imagen-de-Whats-App-2025-09-10-a-las-16-31-38-99aed11c.jpg', model:'celeste lisa'},
      {src:'https://i.ibb.co/tTmYf0T4/Imagen-de-Whats-App-2025-09-10-a-las-16-31-38-dd398098.jpg', model:'blanca lisa'},
      {src:'https://i.ibb.co/23M4Gwv0/Imagen-de-Whats-App-2025-09-10-a-las-16-31-39-0476913f.jpg', model:'negra con rayas'}
    ],
    description:'Camisas marca Rocco. Oferta especial $39.999. Talles del S al XXL.',
    features:['Marca Rocco','Varios tonos y diseños','Talles del S al XXL'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'camisa-ysl', categoria:'camisas', name:'Camisa Yves Saint Laurent — 100% Algodón', priceRange:[50000,70000],
    image:'https://i.ibb.co/tM3rFddt/Imagen-de-Whats-App-2025-09-15-a-las-16-22-09-bd64a629.jpg',
    images:[
      {src:'https://i.ibb.co/tM3rFddt/Imagen-de-Whats-App-2025-09-15-a-las-16-22-09-bd64a629.jpg', model:'modelo 01'},
      {src:'https://i.ibb.co/LzyYt9L1/Imagen-de-Whats-App-2025-09-15-a-las-16-22-10-14e1a743.jpg', model:'modelo 02'},
      {src:'https://i.ibb.co/xqGrQLNV/Imagen-de-Whats-App-2025-09-15-a-las-16-22-10-d9c3ca50.jpg', model:'modelo 03'},
      {src:'https://i.ibb.co/YBzK92Bw/Imagen-de-Whats-App-2025-09-15-a-las-16-22-10-478a6c88.jpg', model:'modelo 04'},
      {src:'https://i.ibb.co/mV3NyWv7/Imagen-de-Whats-App-2025-09-15-a-las-16-22-10-62b4189e.jpg', model:'modelo 05'},
      {src:'https://i.ibb.co/27LnnSdj/Imagen-de-Whats-App-2025-09-15-a-las-16-22-11-3591d70d.jpg', model:'modelo 06'},
      {src:'https://i.ibb.co/pvhHXhpx/Imagen-de-Whats-App-2025-09-15-a-las-16-22-11-c53aee86.jpg', model:'modelo 07'},
      {src:'https://i.ibb.co/xcFR2w4/Imagen-de-Whats-App-2025-09-15-a-las-16-22-11-3050943c.jpg', model:'modelo 08'},
      {src:'https://i.ibb.co/3ydTxVQ1/Imagen-de-Whats-App-2025-09-15-a-las-16-22-12-feb4e7e4.jpg', model:'modelo 09'},
      {src:'https://i.ibb.co/TxWMdDVR/Imagen-de-Whats-App-2025-09-15-a-las-16-22-12-d79c3e84.jpg', model:'modelo 10'},
      {src:'https://i.ibb.co/BVxSvKFC/Imagen-de-Whats-App-2025-09-15-a-las-16-22-12-abdb9f42.jpg', model:'modelo 11'},
      {src:'https://i.ibb.co/8LTFT59N/Imagen-de-Whats-App-2025-09-15-a-las-16-22-13-744a2e8e.jpg', model:'modelo 12'},
      {src:'https://i.ibb.co/qqfVWnC/Imagen-de-Whats-App-2025-09-15-a-las-16-22-13-35fe9016.jpg', model:'modelo 13'},
      {src:'https://i.ibb.co/TMNmnWkD/Imagen-de-Whats-App-2025-09-15-a-las-16-22-13-47d26d6f.jpg', model:'modelo 14'},
      {src:'https://i.ibb.co/ZDnW7rj/Imagen-de-Whats-App-2025-09-15-a-las-16-22-13-395d716f.jpg', model:'modelo 15'},
      {src:'https://i.ibb.co/mLchkJf/Imagen-de-Whats-App-2025-09-15-a-las-16-22-14-e09a9aaf.jpg', model:'modelo 16'},
      {src:'https://i.ibb.co/hxLX8fDt/Imagen-de-Whats-App-2025-09-15-a-las-16-22-14-3f416705.jpg', model:'modelo 17'}
    ],
    description:'Sastrería de lujo en algodón 100% de fibra larga. Terminación impecable en cuello y puños; corte moderno con estructura clásica.',
    features:['100% algodón premium','Costuras reforzadas','Conserva forma y color','Corte moderno'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  {
    id: 'chomba-algodon-premium-colores',
    categoria: 'chombas',
    name: 'Chomba 100% Algodón (Varios Colores)',
    price: 29999,
    image: 'https://i.ibb.co/nGq637f/Imagen-de-Whats-App-2025-10-26-a-las-15-09-30-ca057623.jpg',
    images:[
      {src: 'https://i.ibb.co/nGq637f/Imagen-de-Whats-App-2025-10-26-a-las-15-09-30-ca057623.jpg', model: 'Gris'},
      {src: 'https://i.ibb.co/xKdJ0pHj/Imagen-de-Whats-App-2025-10-26-a-las-16-28-04-0908ebeb.jpg', model: 'Rosa'},
      {src: 'https://i.ibb.co/DPX5DP9h/Imagen-de-Whats-App-2025-10-26-a-las-16-39-34-6555552d.jpg', model: 'Negro'},
      {src: 'https://i.ibb.co/Dg6Bfycy/Imagen-de-Whats-App-2025-10-26-a-las-16-43-49-eeb476ee.jpg', model: 'Blanco'},
      {src: 'https://i.ibb.co/8n6Ftqvz/Imagen-de-Whats-App-2025-10-26-a-las-18-10-17-385cf442.jpg', model: 'Naranja'},
      {src: 'https://i.ibb.co/mV7RgNV4/Imagen-de-Whats-App-2025-10-26-a-las-18-10-17-5dbb78fe.jpg', model: 'Bordo'},
      {src: 'https://i.ibb.co/TqPrQPZ1/Imagen-de-Whats-App-2025-10-26-a-las-18-10-17-73d49d04.jpg', model: 'Celeste'},
      {src: 'https://i.ibb.co/707vBmd/Imagen-de-Whats-App-2025-10-26-a-las-18-10-17-9c9a251f.jpg', model: 'Mostaza'}
    ],
    description: 'Una chomba premium confeccionada en 100% algodón puro, ofreciendo una suavidad y durabilidad excepcionales. Calidad superior con increíbles resultados en confort y calce.',
    features: [
      'Confección 100% algodón premium',
      'Calidad superior: increíbles resultados y confort',
      'Amplia variedad de colores disponibles',
      'Talles disponibles del S al XXXL'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL','XXXL'],
    tag: null,
    
  }
  ,
  {
    id: 'traje-thomson-williams-soft', // ID único
    categoria: 'trajes', // Nueva categoría
    name: 'Traje Soft Thomson & Williams', // Nombre del producto
    price: 199999, // Precio de lista (tarjeta)

    // --- IMÁGENES ---
    // Imagen principal para la grilla (Verde)
    image: 'https://i.ibb.co/3yV4d7px/Imagen-de-Whats-App-2025-10-27-a-las-16-46-31-86af5f26.jpg',

    // Imágenes para el carrusel (como las camisas)
    images: [
      {src: 'https://i.ibb.co/3yV4d7px/Imagen-de-Whats-App-2025-10-27-a-las-16-46-31-86af5f26.jpg', model: 'Verde'},
      {src: 'https://i.ibb.co/GfCt2RCv/Imagen-de-Whats-App-2025-10-27-a-las-16-46-31-f1ff27e2.jpg', model: 'Bordo'},
      {src: 'https://i.ibb.co/Fbkq9XG6/Imagen-de-Whats-App-2025-10-27-a-las-16-46-32-f15817f9.jpg', model: 'Gris'},
      {src: 'https://i.ibb.co/hFLjb4sD/Imagen-de-Whats-App-2025-10-27-a-las-16-46-32-1bce43b6.jpg', model: 'Celeste'},
      {src: 'https://i.ibb.co/7tRngXB2/Imagen-de-Whats-App-2025-10-27-a-las-18-21-49-ba86bce2.jpg', model: 'Marron'}
    ],
    // --- FIN IMÁGENES ---

    description: 'Traje soft de calidad insuperable de la marca Thomson & Williams. Un corte moderno y cómodo, perfecto para cualquier ocasión formal. Disponible en una amplia gama de talles.',
    features: [
      'Marca: Thomson & Williams',
      'Calidad insuperable',
      'Corte soft moderno y confortable',
      'Talles disponibles: 46 al 66'
    ],
    // Generamos los talles del 46 al 66
    sizes: ['46', '48', '50', '52', '54', '56', '58', '60', '62', '64', '66'],
   tag: null,
    
  }
  , // <--- Coma separadora del producto anterior
  {
    id: 'chomba-hilo-pima',
    categoria: 'chombas',
    name: 'Chomba Hilo Pima Peruano Original Thomson & Williams',
    price: 35000, // Precio base
    
    // Precios según talle
    sizePrices: {
      'M': 60000, 'L': 60000, 'XL': 60000, 'XXL': 60000, 'XXXL': 70000 
    },
    
    image: 'https://i.ibb.co/Y40RWhpM/Imagen-de-Whats-App-2025-11-24-a-las-16-16-56-ca4ca3ea.jpg',
    
    images:[
      {src: 'https://i.ibb.co/Y40RWhpM/Imagen-de-Whats-App-2025-11-24-a-las-16-16-56-ca4ca3ea.jpg', model: 'Rosa Pálido'},
      {src: 'https://i.ibb.co/xtKFszk3/Imagen-de-Whats-App-2025-11-24-a-las-16-16-56-f7cc5cd9.jpg', model: 'Beige / Arena'},
      {src: 'https://i.ibb.co/hFG1GDgr/Imagen-de-Whats-App-2025-11-24-a-las-16-16-57-5870fac9.jpg', model: 'celeste Claro'},
      {src: 'https://i.ibb.co/20nybJWM/Imagen-de-Whats-App-2025-11-24-a-las-16-16-57-214d8f5c.jpg', model: 'Blanco'},
      {src: 'https://i.ibb.co/ZpsBqG60/Imagen-de-Whats-App-2025-11-24-a-las-16-16-57-1b59fcb3.jpg', model: 'Gris '},
      {src: 'https://i.ibb.co/MxmRwfpG/Imagen-de-Whats-App-2025-11-24-a-las-16-16-57-e3d43251.jpg', model: 'Verde Militar'},
      {src: 'https://i.ibb.co/TDVsBLfW/Imagen-de-Whats-App-2025-11-24-a-las-16-16-58-7c50772d.jpg', model: 'Azul Marino '},
      {src: 'https://i.ibb.co/sv7njSDn/Imagen-de-Whats-App-2025-11-24-a-las-16-16-58-f09e8f53.jpg', model: 'Azul claro'},
      {src: 'https://i.ibb.co/67pH4rYm/Imagen-de-Whats-App-2025-11-24-a-las-16-32-08-b3b88eb8.jpg', model: ' Negro'}
    ],
    description: 'Chomba confeccionada con Hilo Pima Peruano legítimo, un producto excepcional, ofreciendo un tacto suave y una durabilidad superior.',
    features: [
      'Material: Hilo Pima Peruano legítimo (producto excepcional)',
      'Máxima suavidad y transpirabilidad',
      'Talles disponibles: M al XXXL'
    ],
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
   tag: null,
    
  },
{
  id: 'campera-rompevientos-buckingham-nueva', 
  categoria: 'camperas', 
  name: 'Campera Rompevientos Buckingham Polo Club - Impermeable', 
  price: 25000, // Precio Tarjeta
  
  // Imagen principal (usamos la primera para la grilla)
  image: 'https://i.ibb.co/MkWF08Lm/Imagen-de-Whats-App-2025-12-14-a-las-14-31-59-f5d77cab.jpg',
  
  // Imágenes y Modelos/Colores para el carrusel
  images: [
    {src: 'https://i.ibb.co/MkWF08Lm/Imagen-de-Whats-App-2025-12-14-a-las-14-31-59-f5d77cab.jpg', model: 'Mostaza y Blanco'},
    {src: 'https://i.ibb.co/hnBsNS8/Imagen-de-Whats-App-2025-12-14-a-las-14-31-59-5ea91511.jpg', model: 'Rojo y Azul'},
    {src: 'https://i.ibb.co/0j6ZFGc9/Imagen-de-Whats-App-2025-12-14-a-las-14-32-00-1bc18621.jpg', model: 'Gris y Blanco'}
  ],
  
  description: 'Campera rompevientos de la primera marca Buckingham Polo Club. Diseño impermeable, con capucha desmontable y de calidad insuperable.',
  features: [
    'Marca: Buckingham Polo Club (Primera Marca)',
    'Material impermeable de alta calidad',
    'Capucha desmontable para mayor versatilidad',
 
    'Talles disponibles: S al XXL'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
 tag: null,
    
}
];
// Helpers
const priceLabel = (p)=>{ if(typeof p.price==='number') return fmt(p.price); if(Array.isArray(p.priceRange)&&p.priceRange.length===2) return fmt(p.priceRange[0])+'–'+fmt(p.priceRange[1]); return 'Consultar precio'; };
const isOfferProduct = (p) => Boolean(
  p.bundlePrice ||
  p.oldPrice ||
  p.fakeDiscount ||
  p.tag === 'especial' ||
  /oferta|promo/i.test(p.name || '')
);
const catalogPriority = (p) => (isOfferProduct(p) ? 2 : 0) + (p.isNew ? 1 : 0);
const sortCatalogProducts = (products) => products
  .map((product, index) => ({ product, index }))
  .sort((a, b) => catalogPriority(b.product) - catalogPriority(a.product) || a.index - b.index)
  .map(({ product }) => product);
const bundleLineTotal = (item) => {
  if (item.price == null || isNaN(item.price)) return 0;
  if (item.bundleQuantity > 1 && typeof item.bundlePrice === 'number') {
    const bundles = Math.floor(item.qty / item.bundleQuantity);
    const remainder = item.qty % item.bundleQuantity;
    return bundles * item.bundlePrice + remainder * item.price;
  }
  return item.price * item.qty;
};
const makeBadge = (tag)=> tag===''?"<span class='badge '></span>":(tag==='especial'?"<span class='badge especial'>ESPECIAL</span>":"");
const card = (p) => {
    if (p.soldOut) {
    return `
        <div style="position:relative;">
            <img
                referrerpolicy="no-referrer"
                src="${p.image}"
                alt="${p.name}"
                style="filter:grayscale(40%);opacity:.75;"
                onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'"
            >

            <span style="
                position:absolute;
                top:10px;
                left:10px;
                background:#e74c3c;
                color:#fff;
                padding:6px 10px;
                border-radius:5px;
                font-size:.8rem;
                font-weight:bold;
            ">
                AGOTADO
            </span>
        </div>

        <div class="product-name">${p.name}</div>

        <div class="product-price">
            <span class="price-current" style="color:#e74c3c;">
                Agotado
            </span>
        </div>
    `;
}
    let priceHTML = '';

    // Lógica de Fake Discount: Si existe fakeDiscount, calculamos el precio tachado
    if (typeof p.oldPrice === 'number' && typeof p.price === 'number') {
        priceHTML = `
            <div class="product-price">
                <span class="price-old">${fmt(p.oldPrice)}</span>
                <span class="price-current">${fmt(p.price)}</span>
            </div>
        `;
    } else if (p.fakeDiscount && typeof p.price === 'number') {
        const finalPrice = p.price;
        const originalPrice = Math.round(finalPrice / (1 - p.fakeDiscount / 100));

        priceHTML = `
            <div class="product-price">
                <span class="price-old">${fmt(originalPrice)}</span>
                <span class="price-current">${fmt(finalPrice)}</span>
                <span class="price-discount">-${p.fakeDiscount}%</span>
            </div>
        `;
    } else {
        // Precio normal si no tiene descuento
        priceHTML = `<div class="product-price"><span class="price-current">${priceLabel(p)}</span></div>`;
    }

    const imageHTML = `
        <div style="position:relative;">
            <img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
            ${p.bundlePrice ? `
                <span style="
                    position:absolute;
                    top:10px;
                    left:10px;
                    background:#d97706;
                    color:#fff;
                    padding:6px 10px;
                    border-radius:5px;
                    font-size:.8rem;
                    font-weight:bold;
                    box-shadow:0 2px 6px rgba(0,0,0,.2);
                ">
                    ${p.bundleQuantity} POR ${fmt(p.bundlePrice)}
                </span>
            ` : ''}
        </div>
    `;

    // Retornamos solo Imagen, Nombre y Precio (SIN BOTÓN)
    return `
        ${imageHTML}
        <div class="product-name">${p.name}</div>
        ${priceHTML}
    `;
};
// Render grid
function renderProductsGrid(list){
  const grid=document.getElementById('productsGrid');
  grid.innerHTML='';
  const productos = sortCatalogProducts(list && Array.isArray(list) ? list : PRODUCTS);
  if(productos.length===0){
    const ph=document.createElement('div'); ph.className='card'; ph.innerHTML='<strong>Sin productos</strong>';
    grid.appendChild(ph); return;
  }
  productos.forEach(p=>{
    const el=document.createElement('div');
    el.className='card product-card';
    el.dataset.id=p.id;
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.setAttribute('aria-label','Ver detalles de ' + p.name);
    el.innerHTML=card(p);
    const open=()=>showProductDetail(p.id);
    el.addEventListener('click', open);
    el.addEventListener('keydown', ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); open(); } });
    grid.appendChild(el);
  });
}
// Build index
function buildIndex(){
  const cont = document.getElementById('catalogoIndice');
  const cats = Array.from(new Set(PRODUCTS.map(p=>p.categoria)));
  // CORREGIDO: Agregar 'chombas' al orden deseado
const ORDER = ['camperas','sweaters','camisas','remeras','chombas','trajes','chalecos','pantalones']; 
  const ordered = ORDER.filter(c=>cats.includes(c)).concat(cats.filter(c=>!ORDER.includes(c)));
  cont.innerHTML = '';
  const btnAll = document.createElement('button');
  btnAll.className='btn btn-primary active';
  btnAll.dataset.cat='all';
  btnAll.textContent='Todos';
  cont.appendChild(btnAll);
  ordered.forEach(c=>{
    const b=document.createElement('button');
    b.className='btn'; b.dataset.cat=c; b.textContent = c.charAt(0).toUpperCase()+c.slice(1);
    cont.appendChild(b);
  });
  cont.addEventListener('click', e=>{
    const btn=e.target.closest('button[data-cat]'); if(!btn) return;
    cont.querySelectorAll('button').forEach(b=>b.classList.remove('active','btn-primary'));
    btn.classList.add('active','btn-primary');
    const cat=btn.dataset.cat;
    renderProductsGrid(cat==='all'?PRODUCTS:PRODUCTS.filter(p=>p.categoria===cat));
    showCamisasPromoInGrid(cat);const header=document.querySelector('header'); const offset=(header?header.offsetHeight:70)+10;
    const y=document.getElementById('productos').getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({behavior:'smooth', top:y});
  });
}
// Carousel builders
function buildCarousel(images){
  const imgs = images && images.length ? images : [];
  if(!imgs.length) return '<img referrerpolicy="no-referrer" src="https://via.placeholder.com/500x400?text=Sin+Imagen" alt="Imagen">';
  // CORREGIDO: Usar backticks y cerrar etiquetas correctamente
  const slides = imgs.map(obj => `<div class="carousel-slide"><img referrerpolicy="no-referrer" src="${(obj.src||obj)}" onerror="this.src='https://via.placeholder.com/500x400?text=Sin+Imagen'"></div>`).join('');
  const dots = imgs.map((_,i)=> `<span class="carousel-dot${i===0?' active':''}" data-i="${i}"></span>`).join('');
  return `
    <div class="carousel" id="carousel">
      <button class="carousel-btn prev" aria-label="Anterior" data-dir="-1">‹</button>
      <div class="carousel-track" id="carouselTrack">${slides}</div>
      <button class="carousel-btn next" aria-label="Siguiente" data-dir="1">›</button>
      <div class="carousel-dots" id="carouselDots">${dots}</div>
      <div id="carouselCaption" style="text-align:center;margin-top:6px;font-weight:bold;color:#2d5a42"></div>
    </div>`;
}
// === Precios por modelo (YSL) ===
const MODEL_PRICES = {
  'camisa-ysl': {
    'modelo 01': 50000, 'modelo 02': 60000, 'modelo 03': 50000, 'modelo 04': 50000, 'modelo 05': 60000,
    'modelo 06': 50000, 'modelo 07': 60000, 'modelo 08': 60000, 'modelo 09': 50000, 'modelo 10': 50000,
    'modelo 11': 50000, 'modelo 12': 50000, 'modelo 13': 60000, 'modelo 14': 70000, 'modelo 15': 60000,
    'modelo 16': 70000, 'modelo 17': 60000
  }
};
// Helpers de precio en detalle (sin tocar tu lógica de render)

function updateDetailPriceUI(){
  const el = document.getElementById('detailPrice');
  const addBtn = document.getElementById('addBtn');
  if(!el) return;
    if (currentProduct && currentProduct.soldOut) {
    el.textContent = 'AGOTADO';
    el.style.color = '#e74c3c';

    if (addBtn) {
        addBtn.disabled = true;
        addBtn.setAttribute('disabled', 'disabled');
        addBtn.textContent = 'AGOTADO';
        addBtn.style.background = '#999';
    }

    return;
}

el.style.color = '';
  
  // Aquí está el truco: ahora siempre usa getPriceForCurrent que ya sabe lo del talle XXXL
  const priceNum = getPriceForCurrent(currentProduct);
  
  if(typeof priceNum==='number'){
    if (currentProduct.oldPrice) {
      el.innerHTML = `
        <span class="detail-price-old">${fmt(currentProduct.oldPrice)}</span>
        <span>${fmt(priceNum)}</span>
        ${currentProduct.bundlePrice ? `<span class="detail-bundle-offer">o ${currentProduct.bundleQuantity} por ${fmt(currentProduct.bundlePrice)}</span>` : ''}
      `;
    } else {
      el.textContent = fmt(priceNum);
    }
    if(addBtn){ addBtn.removeAttribute('disabled'); addBtn.disabled=false; addBtn.textContent='🛒 Agregar al Carrito'; }
  }else{
    el.textContent = 'Consultar precio';
    if(addBtn){ addBtn.setAttribute('disabled','disabled'); addBtn.disabled=true; addBtn.textContent='🛒 No disponible'; }
  }
}
let carouselIndex = 0;
// CAMBIO: Ahora acepta un índice inicial
function attachCarouselHandlers(initialIndex = 0){
  const track = document.getElementById('carouselTrack');
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const caption = document.getElementById('carouselCaption');
  const colorNameSpan = document.getElementById('selectedColorName');

  // Seteamos el índice global con el valor inicial recibido
  carouselIndex = initialIndex;

  const update = ()=>{
    track.style.transform = `translateX(${-carouselIndex*100}%)`;
    dots.forEach((d,i)=>{
        d.classList.toggle('active', i===carouselIndex);
        if (currentProduct.categoria === 'chombas' || currentProduct.categoria === 'trajes' || currentProduct.categoria === 'camperas') {
                const chips = document.querySelectorAll('#colorChipsContainer span');
                chips.forEach(c => c.style.border = '2px solid #ccc');

                if (chips[carouselIndex]) {
                    chips[carouselIndex].style.border = '3px solid #1e3a2e';
                    selectedModel = chips[carouselIndex].dataset.colorName || null;
                }
            }
    });

    updateModelAndPrice();
    if(typeof updateDetailPriceUI==='function') updateDetailPriceUI();

    if(currentProduct && Array.isArray(currentProduct.images) && currentProduct.images[carouselIndex]){
      const obj = currentProduct.images[carouselIndex];
      const label = (obj && (obj.model||obj.alt)) ? (obj.model||obj.alt) : '';
      if(caption) caption.textContent = label ? `Modelo: ${label}` : '';
      if (colorNameSpan) colorNameSpan.textContent = label ? label.toUpperCase() : '';
    } else if (caption) {
      caption.textContent = '';
      if (colorNameSpan) colorNameSpan.textContent = '';
    }
  };

  if(prev) prev.onclick = ()=>{
    carouselIndex = (carouselIndex > 0) ? carouselIndex - 1 : dots.length - 1;
    update();
  };
  if(next) next.onclick = ()=>{
    carouselIndex = (carouselIndex < dots.length - 1) ? carouselIndex + 1 : 0;
    update();
  };

  dots.forEach((d,i)=> d.onclick = ()=>{ carouselIndex = i; update(); });

  let startX=0, dx=0;
  const el = document.getElementById('carousel');
  if(el){
    el.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; }, {passive:true});
    el.addEventListener('touchmove', e=>{ dx = e.touches[0].clientX - startX; }, {passive:true});
    el.addEventListener('touchend', ()=>{
      const total = dots.length;
      if(dx < -40) {
          carouselIndex = (carouselIndex < total - 1) ? carouselIndex + 1 : 0;
      }
      if(dx > 40) {
          carouselIndex = (carouselIndex > 0) ? carouselIndex - 1 : total - 1;
      }
      dx = 0; update();
    });
  }
  // CAMBIO: Llamamos a update() para aplicar el estado inicial
  update();
}

function showProductDetail(id, silent=false, preSelectedModel=null){
  prevScrollY = window.scrollY || window.pageYOffset || 0;
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  currentProduct=p;
  selectedSize=null;
  // CAMBIO: Si viene un modelo pre-seleccionado, lo usamos. Si no, se resetea.
  selectedModel = preSelectedModel || null;
  carouselIndex = 0;

  try{window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}catch(e){}

  const productos=document.getElementById('productos');
  const detail=document.getElementById('productDetail');
  const hero=document.getElementById('inicio');
  if(productos) productos.style.display='none';
  if(hero) hero.style.display='none';
  if(detail) detail.style.display='block';

  const selector = document.getElementById('colorSelector');
  if (selector) selector.style.display = 'none';

  // LÓGICA PARA ENCONTRAR EL ÍNDICE DEL MODELO PRE-SELECCIONADO
  let initialCarouselIndex = 0;
  if (preSelectedModel && p.images && p.images.length > 1) {
      const foundIndex = p.images.findIndex(img => (img.model === preSelectedModel || img.alt === preSelectedModel));
      if (foundIndex !== -1) {
          initialCarouselIndex = foundIndex;
          carouselIndex = foundIndex; // Seteamos el índice global
      }
  }

  if (p.categoria === 'chombas' || p.categoria === 'trajes' || p.categoria === 'camperas' || p.categoria === 'sweaters') {
      document.getElementById('detailImage').innerHTML = '';
      if (p.images && p.images.length > 1) {
          document.getElementById('detailImage').innerHTML = buildCarousel(p.images);
          buildColorSelector(p);
          // CAMBIO: Pasamos el índice inicial
          setTimeout(() => attachCarouselHandlers(initialCarouselIndex), 0);
      } else {
          document.getElementById('detailImage').innerHTML = `<img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500x400?text=Sin+Imagen'">`;
          selectedModel = null;
          if (selector) selector.style.display = 'none';
      }
  } else if (p.images && p.images.length > 1) {
      document.getElementById('detailImage').innerHTML = buildCarousel(p.images);
      // Si no había modelo pre-seleccionado, usamos el primero por defecto
      if (!selectedModel && p.images && p.images[0] && (p.images[0].model || p.images[0].alt)) {
          selectedModel = p.images[0].model || p.images[0].alt;
      }
      // CAMBIO: Pasamos el índice inicial
      setTimeout(() => attachCarouselHandlers(initialCarouselIndex), 0);
  } else {
      document.getElementById('detailImage').innerHTML = `<img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/500x400?text=Sin+Imagen'">`;
      selectedModel = null;
  }

  document.getElementById('detailName').textContent=p.name;
  updateDetailPriceUI();
  document.getElementById('detailDesc').textContent=p.description;
  const ul=document.getElementById('detailFeatures'); ul.innerHTML='';
  (p.features||[]).forEach(f=>{ const li=document.createElement('li'); li.textContent=f; ul.appendChild(li); });

  const szCont=document.getElementById('detailSizes'); szCont.innerHTML='';
  (p.sizes||[]).forEach(s=>{
    const chip=document.createElement('span');
    chip.className='size-chip'; chip.textContent=s;
    chip.setAttribute('role','button'); chip.setAttribute('tabindex','0');
    chip.setAttribute('aria-label','Seleccionar talle '+s);

    const select=()=>{
        selectedSize=s;
        szCont.querySelectorAll('.size-chip').forEach(c=>c.classList.remove('selected'));
        chip.classList.add('selected');
        const warn=document.getElementById('sizeWarning'); if(warn) warn.style.display='none';

        updateMediosPago(p.categoria);

        const priceEl = document.getElementById('detailPrice');
        const newPrice = getPriceForCurrent(p);
        if(priceEl && newPrice !== null) {
            updateDetailPriceUI();
        }
    };

    chip.addEventListener('click', select);
    chip.addEventListener('keydown', ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); select(); } });
    szCont.appendChild(chip);
  });

  const sizeWarn = document.getElementById('sizeWarning'); if(sizeWarn) sizeWarn.style.display='none';
 const addBtn = document.getElementById('addBtn');

if (addBtn) {
    if (p.soldOut) {
        addBtn.setAttribute('disabled', 'disabled');
        addBtn.disabled = true;
        addBtn.textContent = 'AGOTADO';
        addBtn.style.background = '#999';
    } else if (p.price == null && !p.priceRange && !p.sizePrices) {
        addBtn.setAttribute('disabled', 'disabled');
        addBtn.disabled = true;
        addBtn.textContent = '🛒 No disponible';
        addBtn.style.background = '';
    } else {
        addBtn.removeAttribute('disabled');
        addBtn.disabled = false;
        addBtn.textContent = '🛒 Agregar al Carrito';
        addBtn.style.background = '';
        updateDetailPriceUI();
    }
}
  showCamisasPromoInDetail(p.categoria==='camisas');
  updateMediosPago(p.categoria);
  requestAnimationFrame(()=>{
    const header = document.querySelector('header');
    const offset = (header ? header.offsetHeight : 70) + 10;
    const y = detail.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({top:y, behavior:'smooth'});
  });
  if(!silent){ history.pushState({view:'detail', productId:id}, '', `#detalle-${id}`); }
}

function goHome(){
  selectedModel = null; // Resetear modelo al volver
  currentProduct = null; // Limpiar producto actual

const m = document.getElementById('cartModal');
  if(m && m.classList.contains('visible')) {
      m.classList.remove('visible');
      unlockBodyScroll();
  }
  const detail=document.getElementById('productDetail');
  const productos=document.getElementById('productos');
  const hero=document.getElementById('inicio');
  if(detail) detail.style.display='none';
  if(hero) hero.style.display='block';
  if(productos) productos.style.display='block';
  requestAnimationFrame(()=>{ window.scrollTo({ top: prevScrollY, behavior:'smooth' }); });
  history.replaceState({view:'grid'}, document.title, window.location.pathname + window.location.search);
}
function goToProducts(){
  selectedModel = null; // Resetear modelo
  currentProduct = null; // Limpiar producto actual
  const hero=document.getElementById('inicio');
  const productos=document.getElementById('productos');
  const detail=document.getElementById('productDetail');
  if(detail) detail.style.display='none';
  if(hero) hero.style.display='block';
  if(productos) productos.style.display='block';
  const header=document.querySelector('header');
  const offset=(header?header.offsetHeight:70)+10;
  const y=productos.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({top:y, behavior:'smooth'});
  history.replaceState({view:'grid'}, document.title, window.location.pathname + window.location.search);
}

function addToCart(p) {
    if (!p) return;

    if (p.soldOut) {
        alert('Este producto se encuentra agotado.');
        return;
    }

    // Continúa el código actual...

  // Usar getCurrentModelLabel para asegurar que tomamos el modelo/color correcto
  let modeloActual = getCurrentModelLabel(p);
  let precioActual = getPriceForCurrent(p); // Usa la función helper para el precio

  // Validar precio y talle
  if (precioActual === null) {
    alert('Error: No se pudo determinar el precio. Por favor, selecciona un modelo/color si es necesario.');
    return;
  }
  if (!selectedSize) {
    const warn = document.getElementById('sizeWarning');
    if (warn) warn.style.display = 'block';
    return;
  }

  const key = p.id + '::' + (modeloActual || 'default') + '::' + selectedSize; // Añadir default si no hay modelo
  const found = cart.find(i => i.key === key);

  if (found) {
    found.qty++;
  } else {
    const itemParaCarrito = {
      ...p,
      qty: 1,
      key: key,
      size: selectedSize,
      modelo: modeloActual,
      price: precioActual // Asegura usar el precio correcto
    };
    // Limpiar 'images' si existe para no guardar data innecesaria en el carrito
    delete itemParaCarrito.images;
    cart.push(itemParaCarrito);
  }

  updateCartDisplay();
  const fab = document.getElementById('cartFab');
  if (fab) {
    fab.classList.add('bounce');
    setTimeout(() => fab.classList.remove('bounce'), 600);
  }
  saveCart();
}

// Función para abrir el producto desde el carrito, ahora recibe el modelo
function openProductFromCart(id, model) {
    toggleCart(); // Cierra el carrito
    setTimeout(() => {
        // Llamamos a showProductDetail pasando el modelo (si existe)
        showProductDetail(id, false, model);
    }, 100);
}
  
function updateCartDisplay(){
  const count = document.getElementById('cartCount');
  if(count) count.textContent = cart.reduce((a,b)=>a+b.qty,0);

  const items = document.getElementById('cartItems');
  if(!items) return;
  items.innerHTML='';

  let total = 0;

  cart.forEach((item,i)=>{
    const lineTotal = bundleLineTotal(item);
    total += lineTotal;

    let itemImageSrc = item.image;
    const originalProduct = PRODUCTS.find(p => p.id === item.id);
    if (originalProduct && originalProduct.images && item.modelo) {
        const modelImage = originalProduct.images.find(img => img.model === item.modelo || img.alt === item.modelo);
        if (modelImage) itemImageSrc = modelImage.src;
    }

    let specsHTML = '';
    if(item.size){
        specsHTML += `
            <div class="spec-box">
                <span class="spec-title">Talle</span>
                <span class="spec-value">${item.size}</span>
            </div>
        `;
    }
    if(item.modelo){
        specsHTML += `
            <div class="spec-box" style="margin-left: 10px;">
                <span class="spec-title">Modelo</span>
                <span class="spec-value">${item.modelo}</span>
            </div>
        `;
    }

    const div = document.createElement('div');
    div.className = 'cart-card';

    // CAMBIO IMPORTANTE: Al hacer click, pasamos el ID y el MODELO
    div.onclick = () => openProductFromCart(item.id, item.modelo);

    div.innerHTML = `
      <img src="${itemImageSrc}" class="cart-img" alt="${item.name}">

      <div class="cart-info">
          <div class="cart-title">${item.name}</div>

          <div class="cart-details-row">
              <div class="qty-selector" onclick="event.stopPropagation()">
                  <button class="qty-btn" onclick="updateQuantity(${i}, -1, event)">‹</button>
                  <span class="qty-val">${item.qty}</span>
                  <button class="qty-btn" onclick="updateQuantity(${i}, 1, event)">›</button>
              </div>
              ${specsHTML}
          </div>
      </div>

      <div class="cart-price-absolute">
         ${(item.price==null || isNaN(item.price)) ? 'Consultar' : fmt(lineTotal)}
      </div>



<button type="button" class="btn-basura-cuadrado" 
    onclick="event.stopPropagation(); removeItem('${item.key}')">
    <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="Eliminar">
</button>
    `;
    items.appendChild(div);
  });

  if (cart.length > 0) {
    const footerDiv = document.createElement('div');
    footerDiv.className = 'cart-footer-clean';
    footerDiv.innerHTML = `
      <div class="total-row">
          <span>Total:</span>
          <span>${fmt(total)}</span>
      </div>
    `;
    items.appendChild(footerDiv);
  } else {
    items.innerHTML = '<div style="text-align: center; padding: 40px; color: #777;">Tu carrito está vacío 🛒</div>';
  }

  const totalEl = document.getElementById('cartTotal');
  if(totalEl) totalEl.innerHTML = '';
}
  
function updateQuantity(i, change, event){
    // Asegura que el evento no se propague al fondo (soluciona el cierre del carrito)
    if (event) event.stopPropagation();

    if (!cart[i]) return; // Evitar error si el item ya no existe
    cart[i].qty+=change;
    if(cart[i].qty<=0){cart.splice(i,1);}
    updateCartDisplay();
  saveCart();
}
function clearCart(){ cart = []; updateCartDisplay(); saveCart();}
function removeItem(itemKey, event) {
    // 1. Intentamos encontrar la tarjeta visualmente usando el evento
    let card = null;
    if (event && event.target) {
        card = event.target.closest('.cart-card');
    }

    // Esta es la lógica de borrado real (lo que ya tenías)
    const ejecutarBorrado = () => {
        const index = cart.findIndex(item => item.key === itemKey);
        if (index > -1) {
            cart.splice(index, 1);
            updateCartDisplay();
            saveCart();
            // Si no quedan items, cierra el panel
            if (cart.length === 0) {
                toggleCart();
            }
        }
    };

    // 2. Si encontramos la tarjeta visual, la animamos primero
    if (card) {
        card.classList.add('slide-out-left'); // Activamos la animación CSS
        
        // Esperamos 400ms (lo mismo que dura la transición CSS) antes de borrar
        setTimeout(() => {
            ejecutarBorrado();
        }, 400); 
    } else {
        // Si por alguna razón no hay tarjeta visual, borramos directo
        ejecutarBorrado();
    }
}
function toggleCart(){
  const m=document.getElementById('cartModal'); if(!m) return;
  
  // INICIO DEL NUEVO CÓDIGO (Lógica del Panel Lateral):
  const opening = !m.classList.contains('visible'); 

  if(opening){ 
    m.classList.add('visible');
    lockBodyScroll(); 
history.pushState({view: 'cart'}, '', '#carrito');
  } else { 
    m.classList.remove('visible');
    setTimeout(unlockBodyScroll, 300);
  }
  // FIN DEL NUEVO CÓDIGO
}

function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  let lines = ['¡Hola buenas! Quiero hacer un pedido de las siguientes prendas:', '', '📋 RESUMEN DEL PEDIDO:', '━━━━━━━━━━━━━━━━━━━━'];

  cart.forEach(it => {
    // CORREGIDO: Usar backticks para template literal
    lines.push(`• ${it.name}`);
    if (it.modelo) {
      lines.push(`  Modelo: ${it.modelo}`);
    }
    lines.push(`  Talle ${it.size || '-'}: ${it.qty} unidades`);
    if (typeof it.price === 'number' && !isNaN(it.price)) {
      lines.push(`  Precio unitario: ${fmt(it.price)}`);
      lines.push(`  Subtotal: ${fmt(bundleLineTotal(it))}`);
      if (it.bundlePrice && it.qty >= it.bundleQuantity) {
        lines.push(`  Promo aplicada: ${it.bundleQuantity} por ${fmt(it.bundlePrice)}`);
      }
    } else {
      lines.push(`  Precio: A consultar`);
    }
    lines.push('');
  });

 const total = cart.reduce((s, it) => s + bundleLineTotal(it), 0);
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  // CORREGIDO: Usar backticks para template literal
  lines.push(`💰 TOTAL: ${fmt(total)}`);
  lines.push('');
  lines.push('¡Espero su confirmación! 😊');

  const msg = encodeURIComponent(lines.join('\n'));
  // CORREGIDO: Usar backticks para template literal
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// WhatsApp FAB & botón detalle
document.getElementById('whatsappFab').addEventListener('click',()=>{
  const msg=encodeURIComponent('¡Hola! Me interesa conocer más sobre los productos de Algas.');
  // CORREGIDO: Usar backticks para template literal
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
});

function consultarWhatsApp() {
  if (!currentProduct) return;

  let modeloActual = getCurrentModelLabel(currentProduct); // Usar helper
  let precioActual = getPriceForCurrent(currentProduct);   // Usar helper

  // CORREGIDO: Usar backticks para template literal
  let mensaje = `Hola, quiero consultar por el producto:\n\n📌 ${currentProduct.name}`;

  if (modeloActual) {
    // CORREGIDO: Usar backticks para template literal
    mensaje += `\n🧵 Modelo: ${modeloActual}`;
  }

  if (typeof precioActual === 'number') {
    // CORREGIDO: Usar backticks para template literal
    mensaje += `\n💲 Precio: ${fmt(precioActual)}`;
  }

  if (selectedSize) {
    // CORREGIDO: Usar backticks para template literal
    mensaje += `\n📏 Talle: ${selectedSize}`;
  }

  // CORREGIDO: Usar backticks para template literal
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Navegación
document.addEventListener('click', (e)=>{
  const btn=e.target.closest('#backHome'); if(btn){ e.preventDefault(); goHome(); }
});
document.getElementById('btnVerProductos').addEventListener('click', (e)=>{ e.preventDefault(); goToProducts(); });
// FAB de WhatsApp sube al detectar footer
(function(){
  const fab=document.getElementById('whatsappFab');
  const footer=document.querySelector('footer');
  if(fab&&footer&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(es=>{es.forEach(e=>{
      fab.classList.toggle('lifted', e.isIntersecting); // Simplificado
    })}, {root:null,threshold:0});
    io.observe(footer);
  }
})();
// History/back - CORREGIDO para usar goHome()
window.addEventListener('popstate', (event)=>{
  // Verifica si el estado al que volvemos es la vista de detalle
  // (esto maneja el caso de usar el botón "Adelante" del navegador)
  if(event.state && event.state.view==='detail'){
    const pid = event.state.productId;
    // Si vamos HACIA un detalle, lo mostramos (sin scroll suave)
    showProductDetail(pid, true); // true evita añadir más historial
  } else {
    // SI NO es un estado 'detail', significa que estamos volviendo DESDE un detalle HACIA la grilla.
    // Llamamos a goHome() que ya contiene la lógica de ocultar/mostrar y el scroll suave.
    goHome();
  }
});
// Init
document.addEventListener('DOMContentLoaded', ()=>{
  // window.scrollTo(0,0); setTimeout(()=>window.scrollTo(0,0),0); // Puede ser problemático, mejor quitar
  buildIndex();
  renderProductsGrid(PRODUCTS);
  showCamisasPromoInGrid('all');
  updateCartDisplay(); // Actualizar carrito por si había algo guardado (no implementado aquí)

  const hash = location.hash || '';
  if(hash.startsWith('#detalle-')){
    const pid = hash.replace('#detalle-','');
    const p = PRODUCTS.find(x=>x.id===pid);
    if(p){
      showProductDetail(pid, true); // Mostrar detalle directamente
      // No reemplazar estado aquí, dejar que showProductDetail lo maneje si no es silent
    } else {
      // Si el ID no es válido, limpiar hash y mostrar grilla
      history.replaceState({view:'grid'}, document.title, window.location.pathname + window.location.search);
    }
  }else{
    history.replaceState({view:'grid'}, document.title, window.location.pathname + window.location.search); // Estado inicial
  }
});

// === Helpers robustos YSL ===
function getCurrentModelLabel(p){
  try{
    // Priorizar selectedModel si existe (seteado por carrusel o selector de color)
    if (selectedModel) return selectedModel;
    if (!p || !p.images || p.images.length === 0) return null;
    // Si no hay selectedModel, intentar obtener del índice actual (carouselIndex)
    if (typeof carouselIndex==='number' && p.images[carouselIndex]){
      return p.images[carouselIndex].model || p.images[carouselIndex].alt || null;
    }
    // Fallback al primer modelo/alt si existe
    return p.images[0].model || p.images[0].alt || null;
  }catch(e){ console.error("Error en getCurrentModelLabel:", e); }
  return null;
}

function getPriceForCurrent(p){
  try{
    if(!p) return null;

    // 1. PRIORIDAD MÁXIMA: Si el talle tiene un precio especial (como el XXXL de 70k), devolvemos ese y listo.
    if (p.sizePrices && selectedSize && typeof p.sizePrices[selectedSize] === 'number') {
        return p.sizePrices[selectedSize];
    }

    // 2. SEGUNDA PRIORIDAD: Si es Camisa YSL y tiene precio por modelo.
    const currentModel = getCurrentModelLabel(p);
    if (p.id==='camisa-ysl' && currentModel && MODEL_PRICES['camisa-ysl'] && typeof MODEL_PRICES['camisa-ysl'][currentModel]==='number'){
      return MODEL_PRICES['camisa-ysl'][currentModel];
    }

    // 3. TERCERA PRIORIDAD: Precio base del producto.
    if (typeof p.price==='number') return p.price;

    return null;
  }catch(e){ console.error("Error en getPriceForCurrent:", e); }
  return null;
}

function updateModelAndPrice() {
  try {
    if (!currentProduct || !currentProduct.images) return;

    if (currentProduct.images.length > 0 && typeof carouselIndex === 'number' && currentProduct.images[carouselIndex]) {
      const currentImageObj = currentProduct.images[carouselIndex];
      selectedModel = currentImageObj.model || currentImageObj.alt || null;
    }

    // Al cambiar de color, volvemos a preguntar el precio correcto
    const precioFinal = getPriceForCurrent(currentProduct); 
    const priceEl = document.getElementById('detailPrice');
    
    if (priceEl && typeof precioFinal === 'number') {
      priceEl.textContent = fmt(precioFinal);
    }

    updateDetailPriceUI();
    updateMediosPago(currentProduct.categoria); // Esto actualiza los textos de abajo también
  } catch (e) { 
    console.error("Error en updateModelAndPrice:", e); 
  }
}


function buildColorSelector(product) {
    const selector = document.getElementById('colorSelector');
    const container = document.getElementById('colorChipsContainer');
    const nameDisplay = document.getElementById('selectedColorName');
    const detailImageContainer = document.getElementById('detailImage');

    // MAPA UNIFICADO DE COLORES
    const hexMap = {
        'Gris': '#808080', 'Rosa': '#FFC0CB', 'Negro': '#000000', 'Blanco': '#FFFFFF',
        'Naranja': '#e67315', 'Bordo': '#800000', 'Celeste': '#87CEEB', 'Mostaza': '#FFDB58',
        'Verde': '#00A36C', 'Verde azulado': '#205F5F', 'Marron': '#8B4513', 'Azul': '#1b475c', 'Beige': '#d1b27a',
        
        // Pima Nombres Exactos
        'Rosa Pálido': '#D4A9A6', 'Beige / Arena': '#d1b27a', 'celeste Claro': '#A9D7EC',   
        'Gris ': '#A8A8A8', 'Verde Militar': '#4C6556', 'Azul Marino ': '#1A233A',
        'Azul claro': '#26364D', ' Negro': '#171F27',
      
      'Mostaza y Blanco': '#FFDB58,#FFFFFF', 
        'Rojo y Azul': '#E74C3C,#2980B9',      
        'Gris y Blanco': '#A9A9A9,#FFFFFF'
    };
    
if (product.categoria !== 'chombas' && product.categoria !== 'trajes' && product.categoria !== 'camperas' && product.categoria !== 'sweaters') {
        if (selector) selector.style.display = 'none';
        return;
    }
    if (!product.images || product.images.length < 2) {
        if (selector) selector.style.display = 'none';
        return;
    }

    selector.style.display = 'block';
    container.innerHTML = '';

    product.images.forEach((img, index) => {
        const colorName = img.model || 'Color ' + (index + 1);
        let colorCode = hexMap[colorName] || '#555'; 

        const chip = document.createElement('span');
        chip.style.width = '30px'; 
      chip.style.height = '30px';
      chip.style.flex = '0 0 30px';
        chip.style.borderRadius = '50%';
        chip.style.border = index === 0 ? '3px solid #1e3a2e' : '2px solid #ccc';
        if (colorCode.includes(',')) {
            const [color1, color2] = colorCode.split(',');
            // Crea el efecto diagonal de dos colores
            chip.style.background = `linear-gradient(135deg, ${color1} 0%, ${color1} 49%, #FFFFFF 49%, #FFFFFF 51%, ${color2} 51%, ${color2} 100%)`;
        } else {
            // Mantiene el color sólido para los chips normales
            chip.style.backgroundColor = colorCode;
        }
        chip.style.cursor = 'pointer';
        chip.dataset.index = index;
        chip.dataset.colorName = colorName; 
        chip.dataset.imageSrc = img.src;
        chip.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';

        chip.onclick = function() {
            container.querySelectorAll('span').forEach(c => c.style.border = '2px solid #ccc');
            this.style.border = '3px solid #1e3a2e';
            
            const dot = document.querySelector(`.carousel-dot[data-i="${this.dataset.index}"]`);
            if (dot) dot.click();

            selectedModel = this.dataset.colorName; 
            carouselIndex = parseInt(this.dataset.index);
            nameDisplay.textContent = this.dataset.colorName.toUpperCase();
            updateDetailPriceUI();
        };
        container.appendChild(chip);
    });

    if (product.images.length > 0) {
        const firstColorName = product.images[0].model || 'Color 1';
        selectedModel = firstColorName; 
        carouselIndex = 0;
        nameDisplay.textContent = firstColorName.toUpperCase();
        if(!document.getElementById('carousel')) {
             detailImageContainer.innerHTML = `<img referrerpolicy="no-referrer" src="${product.images[0].src}" alt="${product.name} - ${firstColorName}">`;
        }
    }
}
// === FIN NUEVA FUNCIÓN ===

// Garantizar botón #btnAsk en el detalle (no necesario, ya está en HTML)
/*(function(){
  const container = document.querySelector('#productDetail .detail-info'); // Ajustado selector
  if(container && !document.getElementById('btnAsk')){
    const b = document.createElement('button');
    b.id='btnAsk'; b.className='btn'; b.style.background='#25d366'; b.style.color='#fff';
    b.onclick = consultarWhatsApp; // Asignar función existente
    b.innerHTML = '<img src="https://i.ibb.co/BV91S86b/image.png" alt="WhatsApp" style="height:20px;width:20px;vertical-align:middle;margin-right:8px">Consultar por WhatsApp';
    container.querySelector('.detail-buttons').appendChild(b); // Añadir a los botones existentes
  }
})();*/
  
  // CÓDIGO PARA CERRAR EL CARRITO AL CLIC FUERA (DEBE ESTAR AL FINAL DEL <SCRIPT>)
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    // Si el carrito está visible
    if (modal.classList.contains('visible')) {
        const modalContent = modal.querySelector('.modal-content');
        
        // Verifica si el clic ocurrió fuera del contenido del modal
        if (!modalContent.contains(e.target)) {
            // Verifica que el clic NO haya sido en el botón de abrir (para evitar doble acción)
            if (e.target.closest('#cartFab') === null) {
                toggleCart();
            }
        }
    }
});

// === CÓDIGO PARA QUE EL BOTÓN ATRÁS DEL CELULAR CIERRE EL CARRITO ===
window.addEventListener('popstate', (event) => {
  const modal = document.getElementById('cartModal');

  // 1. Si el carrito está abierto, lo cerramos y volvemos al inicio
  if (modal && modal.classList.contains('visible')) {
    goHome();
    return;
  }

  // 2. Si estaba viendo un producto, vuelve a la lista
  if (event.state && event.state.view === 'detail') {
    const pid = event.state.productId;
    showProductDetail(pid, true);
  } else {
    // 3. En cualquier otro caso, vuelve al inicio
    goHome();
  }
});

function addCurrentProductToCart() {
  addToCart(currentProduct);
}

// Funciones utilizadas por los controles inline del HTML y del carrito.
Object.assign(window, {
  addCurrentProductToCart,
  checkout,
  clearCart,
  consultarWhatsApp,
  removeItem,
  toggleCart,
  updateQuantity
});
