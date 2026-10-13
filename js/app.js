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

    // ❌ Eliminamos efectivo
    liEfectivo.style.display = 'none';

    if (currentProduct && currentProduct.id === 'remera-algodon-peinado-24-1') {
      liTarjeta.innerHTML = '💳 Tarjeta: <span style="font-weight:bold; color:#2d5a42;">$ 18.000 en hasta 3 cuotas de $ 6.000 por unidad</span> <small style="color:#666;">(2 remeras por $ 36.000 en 3 cuotas de $ 12.000)</small>';
      liTrans.innerHTML = '🏦 Transferencia o depósito bancario: <span style="font-weight:bold; color:#2d5a42;">1 remera por $ 18.000 · 2 remeras por $ 30.000</span> <span style="font-weight:bold; color:#e74c3c;">(Promo Especial)</span>';
      return;
    }

    if (currentProduct && currentProduct.id === 'chomba-algodon-100') {
      liTarjeta.innerHTML = '💳 Tarjeta: <span style="font-weight:bold; color:#2d5a42;">Una chomba: $ 19.999 en 3 cuotas (dos de $ 6.666,33 y una de $ 6.666,34)</span> <small style="color:#666;">· Dos chombas: $ 39.998 en 3 cuotas</small>';
      liTrans.innerHTML = '🏦 Efectivo, transferencia bancaria o depósito: <span style="font-weight:bold; color:#2d5a42;">Una chomba: $ 19.999 · Dos chombas: $ 35.000</span> <span style="font-weight:bold; color:#e74c3c;">(Promo Especial)</span>';
      return;
    }

    const precioActual = currentProduct ? getPriceForCurrent(currentProduct) : null;

    // Tarjeta
    if(typeof precioActual === 'number'){
      const cuota = Math.round(precioActual / 3);
      const precioTrans = Math.round(precioActual * 0.9);
      liTarjeta.innerHTML = `💳 Tarjeta: <span style="font-weight:bold; color:#2d5a42;">${fmt(precioActual)} en 3 cuotas de ${fmt(cuota)}</span>`;
      liTrans.innerHTML = `🏦 Efectivo, transferencia o depósito bancario: <span style="font-weight:bold; color:#2d5a42;">${fmt(precioTrans)}</span> <span style="font-weight:bold; color:#e74c3c;">(10% OFF)</span>`;
    } else {
      liTarjeta.innerHTML = '💳 Tarjeta: (Consultar precio)';
      liTrans.innerHTML = '🏦 Efectivo, transferencia o depósito bancario <span style="font-weight:bold; color:#e74c3c;">(10% OFF)</span>';
    }

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
let cart = [];
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
const IMAGE_FALLBACK = new URL('../images/image-unavailable.svg', import.meta.url).href;
const DELETE_ICON = new URL('../images/eliminar.png', import.meta.url).href;
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
// Suéter Escote en V Yves Saint Laurent
const sueterYslAmarilloImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color amarillo.png', import.meta.url).href;
const sueterYslAzulImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color azul.png', import.meta.url).href;
const sueterYslBeigeImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color beigue.png', import.meta.url).href;
const sueterYslCremaImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color crema.png', import.meta.url).href;
const sueterYslGrisImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color gris.png', import.meta.url).href;
const sueterYslRosaSalmonImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color rosa salmon.png', import.meta.url).href;
const sueterYslVerdeClaroImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color verde claro.png', import.meta.url).href;
const sueterYslVioletaImage = new URL('../images/suéter escote en V  marca Yves Saint Laurent/color violeta.png', import.meta.url).href;
// Bermuda Rocco
const bermudaRoccoBeigeImage = new URL('../images/bermuda de la marca Rocco/color beige.png', import.meta.url).href;
const bermudaRoccoNegroImage = new URL('../images/bermuda de la marca Rocco/color negro.png', import.meta.url).href;
// Remera Algodón Peinado 24/1
const remeraAlgodonBeigeImage = new URL('../images/remera algodón peinado 24_1/color beige.png', import.meta.url).href;
const remeraAlgodonBlancoImage = new URL('../images/remera algodón peinado 24_1/color blanco.png', import.meta.url).href;
const remeraAlgodonCremaImage = new URL('../images/remera algodón peinado 24_1/color crema.png', import.meta.url).href;
const remeraAlgodonGrisImage = new URL('../images/remera algodón peinado 24_1/color gris.png', import.meta.url).href;
const remeraAlgodonMarronImage = new URL('../images/remera algodón peinado 24_1/color marron .png', import.meta.url).href;
const remeraAlgodonNegroImage = new URL('../images/remera algodón peinado 24_1/color negro.png', import.meta.url).href;
const remeraAlgodonRosaImage = new URL('../images/remera algodón peinado 24_1/color rosa.png', import.meta.url).href;
// Chomba Algodón 100%
const chombaAlgodonAmarilloImage = new URL('../images/chomba algodón 100%/amarillo.png', import.meta.url).href;
const chombaAlgodonAzulMarinoImage = new URL('../images/chomba algodón 100%/azul marino.png', import.meta.url).href;
const chombaAlgodonAzulImage = new URL('../images/chomba algodón 100%/azul.png', import.meta.url).href;
const chombaAlgodonBlancoImage = new URL('../images/chomba algodón 100%/blanco.png', import.meta.url).href;
const chombaAlgodonCelesteAquaImage = new URL('../images/chomba algodón 100%/celeste aqua.png', import.meta.url).href;
const chombaAlgodonGrisImage = new URL('../images/chomba algodón 100%/gris.png', import.meta.url).href;
const chombaAlgodonRosaSalmonViejoImage = new URL('../images/chomba algodón 100%/rosa salmon viejo.png', import.meta.url).href;
const chombaAlgodonRosaViejoImage = new URL('../images/chomba algodón 100%/rosa viejo .png', import.meta.url).href;
const chombaAlgodonVerdeSalviaImage = new URL('../images/chomba algodón 100%/verde salvia.png', import.meta.url).href;
// Chomba Devré de Algodón
const chombaDevreAzulImage = new URL('../images/Chomba marca Devré/azul.png', import.meta.url).href;
const chombaDevreBeigeImage = new URL('../images/Chomba marca Devré/beige.png', import.meta.url).href;
const chombaDevreBlancoImage = new URL('../images/Chomba marca Devré/blanco.png', import.meta.url).href;
const chombaDevreBordoImage = new URL('../images/Chomba marca Devré/bordo.png', import.meta.url).href;
const chombaDevreCelesteAquaImage = new URL('../images/Chomba marca Devré/celeste aqua.png', import.meta.url).href;
const chombaDevreGrisImage = new URL('../images/Chomba marca Devré/gris.png', import.meta.url).href;
const chombaDevreRosadoImage = new URL('../images/Chomba marca Devré/rosado .png', import.meta.url).href;
const chombaDevreVerdeMilitarImage = new URL('../images/Chomba marca Devré/verde militar.png', import.meta.url).href;
// Chomba Devré Prelavada
const chombaDevrePrelavadaAzulImage = new URL('../images/chomba marca devre prelabada/azul.png', import.meta.url).href;
const chombaDevrePrelavadaGrisImage = new URL('../images/chomba marca devre prelabada/gris.png', import.meta.url).href;
const chombaDevrePrelavadaRosaSalmonImage = new URL('../images/chomba marca devre prelabada/rosa salmon.png', import.meta.url).href;
const PRODUCTS=[
{
  id: 'sweater-punto-ingles-yves-saint-laurent',
  categoria: 'sweaters',
  name: 'Sweater Punto Inglés Yves Saint Laurent — Oferta Especial',
  price: 50000,
  isNew: true,
  image: sweaterPuntoInglesNegroImage,
  images: [
    { src: sweaterPuntoInglesNegroImage, model: 'Negro' },
    { src: sweaterPuntoInglesAzulImage, model: 'Azul' },
    { src: sweaterPuntoInglesBeigeImage, model: 'Beige' },
    { src: sweaterPuntoInglesVerdeAzuladoImage, model: 'Verde azulado' }
  ],
  description: 'Sweater marca Yves Saint Laurent confeccionado en punto inglés y tejido con spandex. Oferta especial: $50.000.',
  features: [
    'Marca Yves Saint Laurent',
    'Tejido en punto inglés',
    'Confeccionado con spandex',
    'Precio de oferta: $50.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: 'especial'
},
{
  id: 'sweater-super-abrigado',
  categoria: 'sweaters',
  name: 'Sweater Super Abrigado — Oferta Especial',
  price: 20000,
  isNew: true,
  image: sweaterSuperNegroImage,
  images: [
    { src: sweaterSuperNegroImage, model: 'Negro' },
    { src: sweaterSuperGrisImage, model: 'Gris' },
    { src: sweaterSuperAzulImage, model: 'Azul' },
    { src: sweaterSuperBordoImage, model: 'Bordo' }
  ],
  description: 'Sweater liviano importado',
  features: [
    'Diseño liviano importado',
    'Disponible en cuatro colores',
    'Precio de oferta: $20.000'
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
  isNew: true,
  image: sweaterBordoImage,
  images: [
    { src: sweaterBordoImage, model: 'Bordo' },
    { src: sweaterNegroImage, model: 'Negro' }
  ],
  description: 'Sweater importado con medio cierre. Oferta especial: $30.000.',
  features: [
    'Producto importado',
    'Diseño con medio cierre',
    'Precio de oferta: $30.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: 'especial'
},
{
  id: 'sueter-escote-en-v-yves-saint-laurent',
  categoria: 'sweaters',
  name: 'Suéter Escote en V Yves Saint Laurent',
  price: 60000,
  isNew: true,
  image: sueterYslAzulImage,
  images: [
    { src: sueterYslAzulImage, model: 'Azul' },
    { src: sueterYslBeigeImage, model: 'Beige' },
    { src: sueterYslGrisImage, model: 'Gris' },
    { src: sueterYslCremaImage, model: 'Crema' },
    { src: sueterYslRosaSalmonImage, model: 'Rosa Salmón' },
    { src: sueterYslVerdeClaroImage, model: 'Verde Claro' },
    { src: sueterYslAmarilloImage, model: 'Amarillo' },
    { src: sueterYslVioletaImage, model: 'Violeta' }
  ],
  colorMap: {
    'Azul': '#416bba',
    'Beige': '#c5a17a',
    'Beigue': '#c5a17a',
    'Gris': '#464749',
    'Crema': '#e8dfce',
    'Rosa Salmón': '#ec5a5b',
    'Rosa Salmon': '#ec5a5b',
    'Verde Claro': '#758175',
    'Verde claro': '#758175',
    'Amarillo': '#f2dc7a',
    'Violeta': '#6a4175'
  },
  description: 'Suéter escote en V Yves Saint Laurent, una prenda de estilo clásico y elegante, ideal para combinar con distintos looks. Disponible en una variedad de colores.',
  features: [
    'Marca: Yves Saint Laurent',
    'Corte: Escote en V',
    'Disponible en una variedad de colores'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  tag: null
},
{
  id: 'bermuda-rocco-gabardina-elastizada',
  categoria: 'bermudas',
  name: 'Bermuda Rocco de Gabardina Elastizada',
  price: 30000,
  isNew: true,
  image: bermudaRoccoBeigeImage,
  images: [
    { src: bermudaRoccoBeigeImage, model: 'Beige' },
    { src: bermudaRoccoNegroImage, model: 'Negro' }
  ],
  colorMap: {
    'Beige': '#d8bd9e',
    'Negro': '#333235'
  },
  description: 'Bermuda Rocco confeccionada en gabardina elastizada, ideal para quienes buscan comodidad, estilo y libertad de movimiento. Una prenda versátil para el uso diario, disponible en diferentes colores y talles.',
  features: [
    'Marca: Rocco',
    'Material: Gabardina elastizada',
    'Talles disponibles: S al XXXL',
    'Variedad de colores',
    'Precio especial de oferta: $30.000'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  tag: 'especial'
},
  { id:'campera-buckingham', categoria:'camperas', name:'Campera Doble Pechera Buckingham Polo Club', price:75000,
    image:new URL('../images/catalogo/VpBGnRRR.jpg', import.meta.url).href,
    description:'Campera doble pechera de la marca Buckingham Polo Club, pensada para brindar abrigo y estilo. Disponible en talle XL.',
    features:['Diseño de doble pechera para mayor protección térmica','Marca Buckingham Polo Club, símbolo de elegancia','Materiales resistentes y costuras reforzadas', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'campera-impermeable', categoria:'camperas', name:'Campera Impermeable con Capucha Desmontable Buckingham Polo Club', price:60000,
    image:new URL('../images/catalogo/r23hHjSP.jpg', import.meta.url).href,
    description:'Campera impermeable con capucha desmontable de Buckingham Polo Club. Ideal para lluvia y frío. Disponible en XL y color azul.',
    features:['Material impermeable de alta calidad','Capucha desmontable con cierre oculto','Confección resistente y cómoda','Marca Buckingham Polo Club', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-backing', categoria:'camperas', name:'Campera Backing Polo Club — Oferta Especial', price:35000,
    image:new URL('../images/catalogo/cXgH4Vw3.jpg', import.meta.url).href,
    description:'Campera Backing Polo Club en color único. Oferta especial desde talle S hasta doble XL.',
    features:['Diseño exclusivo de Backing Polo Club','Oferta limitada a un único color','Disponible desde talle S hasta doble XXL','Confección resistente y cómoda','Precio promocional especial', 'Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-buckingham-reversible', categoria:'camperas', name:'Campera Buckingham Polo Club — Reversible', price:65000,
    image:new URL('../images/catalogo/N6xq5CmQ.jpg', import.meta.url).href,
    description:'Campera reversible de Buckingham Polo Club, ideal para diferentes estilos y situaciones. Disponible en talles S a doble XL.',
    features:['Diseño reversible para dos estilos','Marca Buckingham Polo Club, sinónimo de calidad','Ideal para climas fríos y moderados','Disponible en talles desde S a XXL', 'Consultar por talles especiales' ],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-engomada', categoria:'camperas', name:'Campera Engomada Buckingham Polo Club', price:65000,
    image:new URL('../images/catalogo/qYvsh4fH.jpg', import.meta.url).href,
    description:'Campera engomada Buckingham Polo Club, del talle S al doble XL. Terminación engomada con excelente resistencia y estilo.',
    features:['Terminación engomada de alta resistencia','Marca Buckingham Polo Club','Disponible del S al XXL', 'Consultar por talles especiales' , 'Interior cómodo para uso diario'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-capucha-desmontable', categoria:'camperas', name:'Campera Buckingham Polo Club — Capucha Desmontable', price:40000,
    image:new URL('../images/catalogo/Xxdq6f5c.jpg', import.meta.url).href,
    description:'Campera con capucha desmontable e impermeable de Buckingham Polo Club, con precio increíble. Ideal para lluvia y uso diario.',
    features:['Capucha desmontable para mayor versatilidad','Tejido impermeable para lluvia','Marca Buckingham Polo Club','Confección cómoda para uso diario','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-uniqlo-impermeable', categoria:'camperas', name:'Campera Impermeable Símil Uniqlo Buckingham Polo Club', price:35000,
    image:new URL('../images/catalogo/rR9VsKXm.jpg', import.meta.url).href,
    description:'Campera impermeable símil Uniqlo de Buckingham Polo Club, disponible del talle S al XXL. ',
    features:['Inspirada en el estilo Uniqlo','Material impermeable de alta calidad','Disponible del talle S al XXL','Confección cómoda y resistente','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'campera-impermeable-oferta', categoria:'camperas', name:'Campera Impermeable — Oferta Limitada', price:65000,
    image:new URL('../images/catalogo/zVHHrw0V.jpg', import.meta.url).href,
    description:'Campera impermeable. Oferta limitada desde el talle S al doble XL.',
    features:['Impermeable de alta calidad','Disponible desde talle S hasta doble XXL','Consultar por talles especiales'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'campera-rompevientos', categoria:'camperas', name:'Rompevientos Buckingham Polo Club', price:50000,
    image:new URL('../images/catalogo/DPQ8mYZm.jpg', import.meta.url).href,
    description:'Varios modelos, talles y colores, del Small al XXL. ¡Increíble oferta $50.000!',
    features:['Rompevientos liviano','Varios modelos y colores','Talles S al XXL', 'Consultar por talles especiales' ,'Secado rápido','Excelente relación precio-calidad'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
  { id:'chaleco-impermeable', categoria:'chalecos', name:'Chaleco Impermeable Buckingham Polo Club', price:40000,
    image:new URL('../images/catalogo/JwPW5XPS.jpg', import.meta.url).href,
    description:'Único color. Precio $40.000.',
    features:['Tejido impermeable','Único color','Marca Buckingham Polo Club','Liviano y cómodo','Ideal para lluvia y viento'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },

  { id:'remera-mc-premium', categoria:'remeras', name:'Remera Manga Corta - Primera Marca (Algodón Peinado)', price:25000,
    image:new URL('../images/catalogo/k62gp4Zw.jpg', import.meta.url).href,
    description:'Oferta especial. Algodón peinado, calidad primera marca.',
    features:['Algodón peinado','Primera marca','Oferta especial','Corte clásico y cómodo'],
    sizes:['XS','S','M','L','XL','XXL'],
    tag: null,
    
  },
  {
    id: 'remera-algodon-peinado-24-1',
    categoria: 'remeras',
    name: 'Remera Algodón Peinado 24/1',
    price: 18000,
    isNew: true,
    image: remeraAlgodonNegroImage,
    images: [
      { src: remeraAlgodonNegroImage, model: 'Negro' },
      { src: remeraAlgodonBlancoImage, model: 'Blanco' },
      { src: remeraAlgodonGrisImage, model: 'Gris' },
      { src: remeraAlgodonBeigeImage, model: 'Beige' },
      { src: remeraAlgodonCremaImage, model: 'Crema' },
      { src: remeraAlgodonMarronImage, model: 'Marrón' },
      { src: remeraAlgodonRosaImage, model: 'Rosa' }
    ],
    colorMap: {
      'Negro': '#1a1a19',
      'Blanco': '#eae9ed',
      'Gris': '#737468',
      'Beige': '#d4c8b9',
      'Crema': '#e7ded3',
      'Marrón': '#b79470', 'Rosado': '#b9153c', 'Bordó': '#54111f',
        'Azul Marino': '#1f2841', 'Celeste Aqua': '#aee0e9', 'Verde Salvia': '#8a9684',
        'Rosa Salmón Viejo': '#dbb19c', 'Rosa Salmon Viejo': '#dbb19c', 'Rosa Viejo': '#e5ac9f',
      'Marron': '#b79470',
      'Rosa': '#eabfc2'
    },
    description: 'Remera confeccionada en algodón peinado 24/1, ideal para el uso diario. Una prenda cómoda, versátil y fácil de combinar, disponible en una amplia variedad de colores y talles.',
    features: [
      'Material: Algodón peinado 24/1',
      'Talles disponibles: S al XXL',
      'Amplia variedad de colores',
      'Precio unitario: $18.000',
      'Promoción especial: 2 por $30.000 abonando mediante transferencia o depósito bancario'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tag: 'especial'
  },
  { id:'camisa-rochas', categoria:'camisas', name:'Camisa primera marca Rochas importada', price:80000,
    image:new URL('../images/catalogo/qMzbzg3g.jpg', import.meta.url).href,
    images:[
      {src:new URL('../images/catalogo/qMzbzg3g.jpg', import.meta.url).href, model:'blanca con rayas'},
      {src:new URL('../images/catalogo/BHFDdnGT.jpg', import.meta.url).href, model:'blanca con cuadraditos azules'},
      {src:new URL('../images/catalogo/DDpnsxc3.jpg', import.meta.url).href, model:'blanca con cuadraditos celestes'},
      {src:new URL('../images/catalogo/0yzWkbfg.jpg', import.meta.url).href, model:'gris con cuadraditos'},
      {src:new URL('../images/catalogo/mVQMfzy2.jpg', import.meta.url).href, model:'celeste rayada'},
      {src:new URL('../images/catalogo/sDTfj5w.jpg', import.meta.url).href, model:'azul rayada'},
      {src:new URL('../images/catalogo/tTMVZ4y5.jpg', import.meta.url).href, model:'marron lisa'},
      {src:new URL('../images/catalogo/Mx2F0PXH.jpg', import.meta.url).href, model:'blanca lisa'}
    ],
    description:'Marca Rochas. 80% algodón. Varios tonos. Talles del S al XXL.',
    features:['Marca Rochas','80% algodón','Varios tonos disponibles','Talles del S al XXL','Consultá el precio'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'camisa-rocco', categoria:'camisas', name:'Camisa marca Rocco — Oferta especial', price:40000,
    image:new URL('../images/catalogo/gZv8X62R.jpg', import.meta.url).href,
    images:[
      {src:new URL('../images/catalogo/gZv8X62R.jpg', import.meta.url).href, model:'blanca con rayas'},
      {src:new URL('../images/catalogo/mrM7mpgh.jpg', import.meta.url).href, model:'negra con cuadraditos'},
      {src:new URL('../images/catalogo/xq52DPBJ.jpg', import.meta.url).href, model:'celeste lisa'},
      {src:new URL('../images/catalogo/tTmYf0T4.jpg', import.meta.url).href, model:'blanca lisa'},
      {src:new URL('../images/catalogo/23M4Gwv0.jpg', import.meta.url).href, model:'negra con rayas'}
    ],
    description:'Camisas marca Rocco. Oferta especial $40.000. Talles del S al XXL.',
    features:['Marca Rocco','Varios tonos y diseños','Talles del S al XXL'],
    sizes:['S','M','L','XL','XXL'],
    tag: null,
    
  },
  { id:'camisa-ysl', categoria:'camisas', name:'Camisa Yves Saint Laurent — 100% Algodón', price:50000,
    image:new URL('../images/catalogo/tM3rFddt.jpg', import.meta.url).href,
    images:[
      {src:new URL('../images/catalogo/tM3rFddt.jpg', import.meta.url).href, model:'modelo 01'},
      {src:new URL('../images/catalogo/LzyYt9L1.jpg', import.meta.url).href, model:'modelo 02'},
      {src:new URL('../images/catalogo/xqGrQLNV.jpg', import.meta.url).href, model:'modelo 03'},
      {src:new URL('../images/catalogo/YBzK92Bw.jpg', import.meta.url).href, model:'modelo 04'},
      {src:new URL('../images/catalogo/mV3NyWv7.jpg', import.meta.url).href, model:'modelo 05'},
      {src:new URL('../images/catalogo/27LnnSdj.jpg', import.meta.url).href, model:'modelo 06'},
      {src:new URL('../images/catalogo/pvhHXhpx.jpg', import.meta.url).href, model:'modelo 07'},
      {src:new URL('../images/catalogo/xcFR2w4.jpg', import.meta.url).href, model:'modelo 08'},
      {src:new URL('../images/catalogo/3ydTxVQ1.jpg', import.meta.url).href, model:'modelo 09'},
      {src:new URL('../images/catalogo/TxWMdDVR.jpg', import.meta.url).href, model:'modelo 10'},
      {src:new URL('../images/catalogo/BVxSvKFC.jpg', import.meta.url).href, model:'modelo 11'},
      {src:new URL('../images/catalogo/8LTFT59N.jpg', import.meta.url).href, model:'modelo 12'},
      {src:new URL('../images/catalogo/qqfVWnC.jpg', import.meta.url).href, model:'modelo 13'},
      {src:new URL('../images/catalogo/TMNmnWkD.jpg', import.meta.url).href, model:'modelo 14'},
      {src:new URL('../images/catalogo/ZDnW7rj.jpg', import.meta.url).href, model:'modelo 15'},
      {src:new URL('../images/catalogo/mLchkJf.jpg', import.meta.url).href, model:'modelo 16'},
      {src:new URL('../images/catalogo/hxLX8fDt.jpg', import.meta.url).href, model:'modelo 17'}
    ],
    description:'Sastrería de lujo en algodón 100% de fibra larga. Terminación impecable en cuello y puños; corte moderno con estructura clásica.',
    features:['100% algodón premium','Costuras reforzadas','Conserva forma y color','Corte moderno'],
    sizes:['S','M','L','XL','XXL'],
   tag: null,
    
  },
    {
    id: 'chomba-algodon-100',
    categoria: 'chombas',
    name: 'Chomba Algodón 100%',
    price: 19999,
    isNew: true,
    image: chombaAlgodonAzulMarinoImage,
    images: [
      { src: chombaAlgodonAzulMarinoImage, model: 'Azul Marino' },
      { src: chombaAlgodonAzulImage, model: 'Azul' },
      { src: chombaAlgodonBlancoImage, model: 'Blanco' },
      { src: chombaAlgodonGrisImage, model: 'Gris' },
      { src: chombaAlgodonAmarilloImage, model: 'Amarillo' },
      { src: chombaAlgodonCelesteAquaImage, model: 'Celeste Aqua' },
      { src: chombaAlgodonVerdeSalviaImage, model: 'Verde Salvia' },
      { src: chombaAlgodonRosaSalmonViejoImage, model: 'Rosa Salmón Viejo' },
      { src: chombaAlgodonRosaViejoImage, model: 'Rosa Viejo' }
    ],
    colorMap: {
      'Azul Marino': '#1f2841',
      'Azul marino': '#1f2841',
      'Azul': '#577ab0',
      'Blanco': '#e8e6ec',
      'Gris': '#c0bebf',
      'Amarillo': '#eddaa4',
      'Celeste Aqua': '#aee0e9',
      'Celeste aqua': '#aee0e9',
      'Verde Salvia': '#8a9684',
      'Verde salvia': '#8a9684',
      'Rosa Salmón Viejo': '#dbb19c',
      'Rosa Salmón viejo': '#dbb19c',
      'Rosa Salmon Viejo': '#dbb19c',
      'Rosa salmon viejo': '#dbb19c',
      'Rosa Viejo': '#e5ac9f',
      'Rosa viejo': '#e5ac9f'
    },
    description: 'Chomba confeccionada en 100% algodón, ideal para quienes buscan comodidad y estilo en una misma prenda. Su diseño clásico y versátil permite combinarla fácilmente para diferentes ocasiones. Disponible en una amplia variedad de colores y talles.',
    features: [
      'Material: 100% algodón',
      'Talles disponibles: S al 5XL',
      'Amplia variedad de colores',
      'Oferta especial: una por $19.999 o dos por $35.000 abonando en efectivo, transferencia bancaria o depósito'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL'],
    tag: 'especial'
  },
  {
    id: 'chomba-devre-algodon',
    categoria: 'chombas',
    name: 'Chomba Devré de Algodón',
    price: 35000,
    isNew: true,
    image: chombaDevreAzulImage,
    images: [
      { src: chombaDevreAzulImage, model: 'Azul' },
      { src: chombaDevreBeigeImage, model: 'Beige' },
      { src: chombaDevreBlancoImage, model: 'Blanco' },
      { src: chombaDevreBordoImage, model: 'Bordó' },
      { src: chombaDevreCelesteAquaImage, model: 'Celeste Aqua' },
      { src: chombaDevreGrisImage, model: 'Gris' },
      { src: chombaDevreRosadoImage, model: 'Rosado' },
      { src: chombaDevreVerdeMilitarImage, model: 'Verde Militar' }
    ],
    colorMap: {
      'Azul': '#1f2130',
      'Beige': '#c3ab95',
      'Blanco': '#f2f1f6',
      'Bordó': '#54111f',
      'Bordo': '#54111f',
      'Celeste Aqua': '#8cdeee',
      'Celeste aqua': '#8cdeee',
      'Gris': '#99989a',
      'Rosado': '#b9153c',
      'Verde Militar': '#4a4b3b',
      'Verde militar': '#4a4b3b'
    },
    description: 'Chomba Devré confeccionada en algodón, una prenda clásica y versátil, ideal para combinar comodidad y estilo. Perfecta para diferentes ocasiones, disponible en una variedad de colores y talles.',
    features: [
      'Marca: Devré',
      'Material: Algodón',
      'Talles disponibles: S al XXL',
      'Variedad de colores',
      'Precio especial: $35.000',
      '10% OFF abonando en efectivo o transferencia bancaria'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tag: 'especial'
  },
  {
        id: 'chomba-devre-prelavada',
    categoria: 'chombas',
    name: 'Chomba Devré Prelavada',
    price: 35000,
    isNew: true,
    image: chombaDevrePrelavadaAzulImage,
    images: [
      { src: chombaDevrePrelavadaAzulImage, model: 'Azul' },
      { src: chombaDevrePrelavadaGrisImage, model: 'Gris' },
      { src: chombaDevrePrelavadaRosaSalmonImage, model: 'Rosa Salmón' }
    ],
    colorMap: {
      'Azul': '#566b92',
      'Gris': '#a8a099',
      'Rosa Salmón': '#cb8177',
      'Rosa Salmon': '#cb8177'
    },
    description: 'Chomba Devré prelavada, una prenda de estilo clásico y versátil, ideal para combinar con diferentes looks. Su acabado prelavado le aporta una terminación distintiva. Disponible en una variedad de colores y talles.',
    features: [
      'Marca: Devré',
      'Terminación: Prelavada',
      'Talles disponibles: S al XXL',
      'Diferentes colores disponibles',
      'Precio de oferta: $35.000',
      '10% OFF en efectivo o transferencia'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tag: 'especial'
  },
  {
        id: 'chomba-algodon-premium-colores',
    categoria: 'chombas',
    name: 'Chomba 100% Algodón (Varios Colores)',
    price: 29999,
    image: new URL('../images/catalogo/nGq637f.jpg', import.meta.url).href,
    images:[
      {src: new URL('../images/catalogo/nGq637f.jpg', import.meta.url).href, model: 'Gris'},
      {src: new URL('../images/catalogo/xKdJ0pHj.jpg', import.meta.url).href, model: 'Rosa'},
      {src: new URL('../images/catalogo/DPX5DP9h.jpg', import.meta.url).href, model: 'Negro'},
      {src: new URL('../images/catalogo/Dg6Bfycy.jpg', import.meta.url).href, model: 'Blanco'},
      {src: new URL('../images/catalogo/8n6Ftqvz.jpg', import.meta.url).href, model: 'Naranja'},
      {src: new URL('../images/catalogo/mV7RgNV4.jpg', import.meta.url).href, model: 'Bordo'},
      {src: new URL('../images/catalogo/TqPrQPZ1.jpg', import.meta.url).href, model: 'Celeste'},
      {src: new URL('../images/catalogo/707vBmd.jpg', import.meta.url).href, model: 'Mostaza'}
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
    price: 350000, // Precio de lista (tarjeta)

    // --- IMÁGENES ---
    // Imagen principal para la grilla (Verde)
    image: new URL('../images/catalogo/3yV4d7px.jpg', import.meta.url).href,

    // Imágenes para el carrusel (como las camisas)
    images: [
      {src: new URL('../images/catalogo/3yV4d7px.jpg', import.meta.url).href, model: 'Verde'},
      {src: new URL('../images/catalogo/GfCt2RCv.jpg', import.meta.url).href, model: 'Bordo'},
      {src: new URL('../images/catalogo/Fbkq9XG6.jpg', import.meta.url).href, model: 'Gris'},
      {src: new URL('../images/catalogo/hFLjb4sD.jpg', import.meta.url).href, model: 'Celeste'},
      {src: new URL('../images/catalogo/7tRngXB2.jpg', import.meta.url).href, model: 'Marron'}
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
    price: 60000, // Precio base
    
    // Precios según talle
    sizePrices: {
      'M': 60000, 'L': 60000, 'XL': 60000, 'XXL': 60000, 'XXXL': 60000
    },
    
    image: new URL('../images/catalogo/Y40RWhpM.jpg', import.meta.url).href,
    
    images:[
      {src: new URL('../images/catalogo/Y40RWhpM.jpg', import.meta.url).href, model: 'Rosa Pálido'},
      {src: new URL('../images/catalogo/xtKFszk3.jpg', import.meta.url).href, model: 'Beige / Arena'},
      {src: new URL('../images/catalogo/hFG1GDgr.jpg', import.meta.url).href, model: 'celeste Claro'},
      {src: new URL('../images/catalogo/20nybJWM.jpg', import.meta.url).href, model: 'Blanco'},
      {src: new URL('../images/catalogo/ZpsBqG60.jpg', import.meta.url).href, model: 'Gris '},
      {src: new URL('../images/catalogo/MxmRwfpG.jpg', import.meta.url).href, model: 'Verde Militar'},
      {src: new URL('../images/catalogo/TDVsBLfW.jpg', import.meta.url).href, model: 'Azul Marino '},
      {src: new URL('../images/catalogo/sv7njSDn.jpg', import.meta.url).href, model: 'Azul claro'},
      {src: new URL('../images/catalogo/67pH4rYm.jpg', import.meta.url).href, model: ' Negro'}
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
  price: 50000, // Precio Tarjeta
  
  // Imagen principal (usamos la primera para la grilla)
  image: new URL('../images/catalogo/MkWF08Lm.jpg', import.meta.url).href,
  
  // Imágenes y Modelos/Colores para el carrusel
  images: [
    {src: new URL('../images/catalogo/MkWF08Lm.jpg', import.meta.url).href, model: 'Mostaza y Blanco'},
    {src: new URL('../images/catalogo/hnBsNS8.jpg', import.meta.url).href, model: 'Rojo y Azul'},
    {src: new URL('../images/catalogo/0j6ZFGc9.jpg', import.meta.url).href, model: 'Gris y Blanco'}
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
const lineTotal = (item) => Number.isFinite(item.price) && Number.isSafeInteger(item.qty) && item.qty > 0
  ? item.price * item.qty
  : 0;
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
                onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'"
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
        if (p.id === 'remera-algodon-peinado-24-1') {
        priceHTML = `<div class="product-price"><span class="price-current">${priceLabel(p)}</span><div style="color:#25d366;font-size:0.85rem;font-weight:bold;margin-top:2px;">✨ Promo: 2 POR $30.000</div></div>`;
    } else if (p.id === 'chomba-algodon-100') {
        priceHTML = `<div class="product-price"><span class="price-current">${priceLabel(p)}</span><div style="color:#25d366;font-size:0.85rem;font-weight:bold;margin-top:2px;">✨ Promo: 2 POR $35.000</div></div>`;
    } else {
        priceHTML = `<div class="product-price"><span class="price-current">${priceLabel(p)}</span></div>`;
    }
    }

    const imageHTML = `
        <div style="position:relative;">
            <img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">

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
const ORDER = ['camperas','sweaters','camisas','remeras','chombas','trajes','chalecos','pantalones','bermudas']; 
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
  if(!imgs.length) return `<img src="${IMAGE_FALLBACK}" alt="Imagen no disponible">`;
  // CORREGIDO: Usar backticks y cerrar etiquetas correctamente
  const slides = imgs.map(obj => `<div class="carousel-slide"><img referrerpolicy="no-referrer" src="${(obj.src||obj)}" alt="${obj.alt || obj.model || 'Imagen del producto'}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'"></div>`).join('');
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
    'modelo 01': 50000, 'modelo 02': 50000, 'modelo 03': 50000, 'modelo 04': 50000, 'modelo 05': 50000,
    'modelo 06': 50000, 'modelo 07': 50000, 'modelo 08': 50000, 'modelo 09': 50000, 'modelo 10': 50000,
    'modelo 11': 50000, 'modelo 12': 50000, 'modelo 13': 50000, 'modelo 14': 50000, 'modelo 15': 50000,
    'modelo 16': 50000, 'modelo 17': 50000
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
  
  // Aquí está el truco: usa el mismo precio vigente que el carrito
  const priceNum = getPriceForCurrent(currentProduct);
  
  if(typeof priceNum==='number'){
    if (currentProduct.oldPrice) {
      el.innerHTML = `
        <span class="detail-price-old">${fmt(currentProduct.oldPrice)}</span>
        <span>${fmt(priceNum)}</span>
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
        if (currentProduct.categoria === 'chombas' || currentProduct.categoria === 'trajes' || currentProduct.categoria === 'camperas' || currentProduct.categoria === 'sweaters' || currentProduct.categoria === 'bermudas' || currentProduct.categoria === 'remeras') {
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

  if (p.categoria === 'chombas' || p.categoria === 'trajes' || p.categoria === 'camperas' || p.categoria === 'sweaters' || p.categoria === 'bermudas' || p.categoria === 'remeras') {
      document.getElementById('detailImage').innerHTML = '';
      if (p.images && p.images.length > 1) {
          document.getElementById('detailImage').innerHTML = buildCarousel(p.images);
          buildColorSelector(p);
          // CAMBIO: Pasamos el índice inicial
          setTimeout(() => attachCarouselHandlers(initialCarouselIndex), 0);
      } else {
          document.getElementById('detailImage').innerHTML = `<img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">`;
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
      document.getElementById('detailImage').innerHTML = `<img referrerpolicy="no-referrer" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">`;
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
    const subtotal = lineTotal(item);
    total += subtotal;

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
      <img src="${itemImageSrc}" class="cart-img" alt="${item.name}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">

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
         ${(item.price==null || isNaN(item.price)) ? 'Consultar' : fmt(subtotal)}
      </div>



<button type="button" class="btn-basura-cuadrado" 
    onclick="event.stopPropagation(); removeItem('${item.key}')">
    <img src="${DELETE_ICON}" alt="Eliminar">
</button>
    `;
    items.appendChild(div);
  });

  if (cart.length > 0) {
    const remerasCount = cart.filter(it => it.id === 'remera-algodon-peinado-24-1').reduce((s, it) => s + it.qty, 0);
    const remerasPairs = Math.floor(remerasCount / 2);
    const remerasSingles = remerasCount % 2;
    const remerasTransferTotal = (remerasPairs * 30000) + (remerasSingles * 18000);

    const chombasCount = cart.filter(it => it.id === 'chomba-algodon-100').reduce((s, it) => s + it.qty, 0);
    const chombasPairs = Math.floor(chombasCount / 2);
    const chombasSingles = chombasCount % 2;
    const chombasTransferTotal = (chombasPairs * 35000) + (chombasSingles * 19999);

    let otherTransferTotal = 0;
    cart.forEach(it => {
      if (it.id !== 'remera-algodon-peinado-24-1' && it.id !== 'chomba-algodon-100') {
        otherTransferTotal += Math.round(lineTotal(it) * 0.9);
      }
    });
    const totalTransfer = remerasTransferTotal + chombasTransferTotal + otherTransferTotal;
    const footerDiv = document.createElement('div');
    footerDiv.className = 'cart-footer-clean';
    footerDiv.innerHTML = `
      <div class="total-row">
          <span>Total:</span>
          <span>${fmt(total)}</span>
      </div>
      <div class="total-row" style="color:#2d5a42;font-weight:bold;margin-top:4px;">
          <span>Transferencia / Depósito:</span>
          <span>${fmt(totalTransfer)}</span>
      </div>
      ${remerasPairs > 0 ? '<div style="font-size:0.85rem;color:#2d5a42;margin-top:4px;text-align:right;">🎉 ¡Promo 2 por $30.000 aplicada en Remeras por transferencia!</div>' : ''}
      ${chombasPairs > 0 ? '<div style="font-size:0.85rem;color:#2d5a42;margin-top:4px;text-align:right;">🎉 ¡Promo 2 por $35.000 aplicada en Chombas 100% Algodón!</div>' : ''}
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
      lines.push(`  Subtotal: ${fmt(lineTotal(it))}`);

    } else {
      lines.push(`  Precio: A consultar`);
    }
    lines.push('');
  });

 const total = cart.reduce((s, it) => s + lineTotal(it), 0);
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 TOTAL: ${fmt(total)}`);

  const remerasCount = cart.filter(it => it.id === 'remera-algodon-peinado-24-1').reduce((s, it) => s + it.qty, 0);
  const remerasPairs = Math.floor(remerasCount / 2);
  const remerasSingles = remerasCount % 2;
  const remerasTransferTotal = (remerasPairs * 30000) + (remerasSingles * 18000);

  const chombasCount = cart.filter(it => it.id === 'chomba-algodon-100').reduce((s, it) => s + it.qty, 0);
  const chombasPairs = Math.floor(chombasCount / 2);
  const chombasSingles = chombasCount % 2;
  const chombasTransferTotal = (chombasPairs * 35000) + (chombasSingles * 19999);

  let otherTransferTotal = 0;
  cart.forEach(it => {
    if (it.id !== 'remera-algodon-peinado-24-1' && it.id !== 'chomba-algodon-100') {
      otherTransferTotal += Math.round(lineTotal(it) * 0.9);
    }
  });
  const totalTransfer = remerasTransferTotal + chombasTransferTotal + otherTransferTotal;

  if (totalTransfer !== total) {
    lines.push(`🏦 TOTAL (Efectivo / Transferencia / Depósito): ${fmt(totalTransfer)}`);
  }
  if (remerasPairs > 0) {
    lines.push(`🎉 Incluye Promo Remeras: 2 por $30.000`);
  }
  if (chombasPairs > 0) {
    lines.push(`🎉 Incluye Promo Chombas: 2 por $35.000`);
  }
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
  cart = restoreCart();
  saveCart();
  // window.scrollTo(0,0); setTimeout(()=>window.scrollTo(0,0),0); // Puede ser problemático, mejor quitar
  buildIndex();
  renderProductsGrid(PRODUCTS);
  showCamisasPromoInGrid('all');
  updateCartDisplay(); // Mostrar el carrito reconciliado con el catálogo vigente

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

// Resolución compartida por detalle, carrito y restauración del almacenamiento.
function resolveProductPrice(product, size = null, model = null) {
  if (!product) return null;
  let price = product.price;
  if (product.sizePrices && size && Object.hasOwn(product.sizePrices, size)) {
    price = product.sizePrices[size];
  } else if (product.id === 'camisa-ysl' && model && Object.hasOwn(MODEL_PRICES['camisa-ysl'], model)) {
    price = MODEL_PRICES['camisa-ysl'][model];
  }
  return typeof price === 'number' && Number.isFinite(price) && price > 0 ? price : null;
}

function getPriceForCurrent(p) {
  return resolveProductPrice(p, selectedSize, getCurrentModelLabel(p));
}

function reconcileCart(savedCart) {
  if (!Array.isArray(savedCart)) return [];
  const reconciled = [];
  for (const saved of savedCart) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) continue;
    const product = PRODUCTS.find(p => p.id === saved.id);
    if (!product || product.soldOut) continue;
    const qty = typeof saved.qty === 'number' || typeof saved.qty === 'string' ? Number(saved.qty) : NaN;
    if (!Number.isSafeInteger(qty) || qty <= 0) continue;
    const size = typeof saved.size === 'string' || typeof saved.size === 'number' ? String(saved.size) : null;
    if (!size || !product.sizes?.includes(size)) continue;
    const models = (product.images || []).map(image => image.model || image.alt).filter(Boolean);
    let model = saved.modelo ?? null;
    if (models.length) {
      if (model === null || model === '') model = models[0];
      if (!models.includes(model)) continue;
    } else if (model !== null && model !== '') {
      continue;
    } else {
      model = null;
    }
    const price = resolveProductPrice(product, size, model);
    if (price === null) continue;
    const key = product.id + '::' + (model || 'default') + '::' + size;
    const existing = reconciled.find(item => item.key === key);
    if (existing) {
      if (Number.isSafeInteger(existing.qty + qty)) existing.qty += qty;
      continue;
    }
    // Solo el catálogo vigente aporta datos comerciales; el almacenamiento aporta selección y cantidad.
    const item = { ...product, key, size, modelo: model, qty, price };
    delete item.images;
    reconciled.push(item);
  }
  return reconciled;
}

function restoreCart() {
  try {
    return reconcileCart(JSON.parse(localStorage.getItem('algasCart')));
  } catch (error) {
    console.warn('No se pudo restaurar el carrito guardado:', error);
    return [];
  }
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
        'Amarillo': '#f2dc7a', 'Crema': '#e8dfce', 'Rosa Salmón': '#ec5a5b', 'Rosa Salmon': '#ec5a5b',
        'Verde Claro': '#758175', 'Verde claro': '#758175', 'Violeta': '#6a4175', 'Beigue': '#c5a17a',
        'Marrón': '#b79470',
      
      'Mostaza y Blanco': '#FFDB58,#FFFFFF', 
        'Rojo y Azul': '#E74C3C,#2980B9',      
        'Gris y Blanco': '#A9A9A9,#FFFFFF'
    };
    
if (product.categoria !== 'chombas' && product.categoria !== 'trajes' && product.categoria !== 'camperas' && product.categoria !== 'sweaters' && product.categoria !== 'bermudas' && product.categoria !== 'remeras') {
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
        let colorCode = (product.colorMap && product.colorMap[colorName]) || hexMap[colorName] || '#555'; 

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
             detailImageContainer.innerHTML = `<img referrerpolicy="no-referrer" src="${product.images[0].src}" alt="${product.name} - ${firstColorName}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK}'">`;
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
    b.innerHTML = '<img src="images/whatsapp.svg" alt="WhatsApp" style="height:20px;width:20px;vertical-align:middle;margin-right:8px">Consultar por WhatsApp';
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
