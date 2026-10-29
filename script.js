
const products = [
  {id:'smartwatches',name:'Smartwatches',group:'Wearables',caption:'Time, with a twist.',description:'Explore smartwatches that bring your daily essentials to your wrist.',emoji:'⌚',bg:'#dce6ce',art:'watch'},
  {id:'earbuds',name:'Earbuds',group:'Audio',caption:'Tune into your day.',description:'Discover earbuds for music, calls and everything in between.',emoji:'♫',bg:'#e2e8e1',art:'earbuds'},
  {id:'powerbanks',name:'Power Banks',group:'Power',caption:'Power on the move.',description:'Explore portable power banks for busy days and long journeys.',emoji:'ϟ',bg:'#d9e5e5',art:'power'},
  {id:'wirelesschargers',name:'Wireless Chargers',group:'Power',caption:'Drop it. Charge it.',description:'Explore wireless charging pads and stands for effortless power-ups.',emoji:'◎',bg:'#dfe3df',art:'wireless'},
  {id:'cableschargers',name:'Cables & Chargers',group:'Everyday',caption:'Stay powered up.',description:'Browse charging cables and wall chargers for your everyday connections.',emoji:'↝',bg:'#e8e3d7',art:'cable'},
  {id:'adapters',name:'Adapters',group:'Everyday',caption:'Connect with ease.',description:'Explore handy adapters for everyday tech setups.',emoji:'▣',bg:'#e6e5df',art:'adapter'},
  {id:'speakers',name:'Speakers',group:'Audio',caption:'Turn the volume up.',description:'Discover speakers to take your sound wherever you go.',emoji:'◉',bg:'#d7dfd3',art:'speaker'},
  {id:'ringlight',name:'LED Ring Light',group:'Style',caption:'Light up your shot.',description:'Explore LED ring lights with stands for perfect content and calls.',emoji:'◯',bg:'#e9ece2',art:'ringlight'},
  {id:'deskholder',name:'Desk Mobile Holders',group:'Holders',caption:'Hands-free, always.',description:'Explore desk stand holders to keep your phone upright for calls and videos.',emoji:'⊥',bg:'#e3e6dc',art:'deskholder'},
  {id:'carholder',name:'Car Mobile Holders',group:'Holders',caption:'Drive. Don’t fumble.',description:'Explore car mount holders that keep your phone secure on every drive.',emoji:'⌾',bg:'#dde3da',art:'carholder'},
  {id:'bikeholder',name:'Bike Mobile Holders',group:'Holders',caption:'Ride with your phone in view.',description:'Explore bike mount holders built for a secure grip on every ride.',emoji:'⊙',bg:'#e1e4db',art:'bikeholder'},
  {id:'covers',name:'Mobile Covers',group:'Style',caption:'Make it your own.',description:'Explore mobile covers that add personality and everyday protection.',emoji:'▯',bg:'#d6e1da',art:'cover'}
];

const art = {
  watch:`<div class="art-object watch-object"><div class="watch-strap"></div><div class="watch-face"><div class="watch-time">09<span>41</span></div><div class="watch-dot"></div></div></div>`,
  earbuds:`<div class="art-object buds-object"><div class="earbud one"></div><div class="earbud two"></div><div class="buds-case"></div></div>`,
  power:`<div class="art-object power-object"><div class="power-body"></div><span class="power-logo">x.</span></div>`,
  cable:`<div class="art-object cable-object"><div class="cable-loop"></div><div class="cable-tail"></div><div class="cable-plug"></div></div>`,
  charger:`<div class="art-object charger-object"><div class="charger-pin left"></div><div class="charger-pin right"></div><div class="charger-body"></div></div>`,
  wireless:`<div class="art-object wireless-object"><div class="wireless-phone"><div class="wireless-phone-notch"></div></div><div class="wireless-pad"><div class="wireless-pad-ring"></div></div></div>`,
  adapter:`<div class="art-object adapter-object"><div class="adapter-body"></div><div class="adapter-socket"></div></div>`,
  speaker:`<div class="art-object speaker-object"><div class="speaker-body"></div><div class="speaker-grill"></div><div class="speaker-mark">x.</div><div class="speaker-top"></div></div>`,
  ringlight:`<div class="art-object ringlight-object"><div class="ringlight-stand"></div><div class="ringlight-ring"><div class="ringlight-phone"></div></div></div>`,
  deskholder:`<div class="art-object deskholder-object"><div class="deskholder-base"></div><div class="deskholder-arm"></div><div class="deskholder-clip"><div class="deskholder-phone"></div></div></div>`,
  carholder:`<div class="art-object carholder-object"><div class="carholder-vent"></div><div class="carholder-arm"></div><div class="carholder-clip"><div class="carholder-phone"></div></div></div>`,
  bikeholder:`<div class="art-object bikeholder-object"><div class="bikeholder-bar"></div><div class="bikeholder-mount"></div><div class="bikeholder-clip"><div class="bikeholder-phone"></div></div></div>`,
  cover:`<div class="art-object cover-object"><div class="cover-shell"></div><div class="cover-camera"><i></i><i></i></div></div>`
};

const artwork = key => `<div class="art-root" aria-hidden="true">${art[key]}</div>`;

const heartIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 8.5c0 4.3-8.7 10.4-8.7 10.4S3.3 12.8 3.3 8.5A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.7 2.3Z"/></svg>`;

const productGrid=document.querySelector('#productGrid');
const categoryStrip=document.querySelector('#categoryStrip');
const filters=document.querySelector('#filters');
const searchInput=document.querySelector('#searchInput');
const emptyState=document.querySelector('#emptyState');
const favoritesCount=document.querySelector('#favoritesCount');
const productDialog=document.querySelector('#productDialog');
const bagDialog=document.querySelector('#bagDialog');

let activeGroup='All';
let favoritesOnly=false;
let saved=new Set();
let cartItems=new Set();
let qtyMap={};

try { saved=new Set(JSON.parse(localStorage.getItem('xcess-favorites')||'[]')); } catch {}
try { cartItems=new Set(JSON.parse(localStorage.getItem('xcess-cart')||'[]')); } catch {}
try { qtyMap=JSON.parse(localStorage.getItem('xcess-qty')||'{}'); } catch {}

function getQty(id){ return qtyMap[id]||1; }
function setQty(id,v){ qtyMap[id]=Math.max(1,v); try{localStorage.setItem('xcess-qty',JSON.stringify(qtyMap));}catch{} }

document.querySelector('#heroWatch').innerHTML=artwork('watch');
document.querySelector('#heroEarbuds').innerHTML=artwork('earbuds');
document.querySelector('#year').textContent=new Date().getFullYear();

function updateFavoritesCount(){
  favoritesCount.textContent=saved.size;
  favoritesCount.hidden=saved.size===0;

  const button=document.querySelector('#favoritesToggle');
  button.setAttribute('aria-pressed',String(favoritesOnly));
  button.title=favoritesOnly?'Show all categories':'Show saved favorites';
}

function renderFilters(){
  const groups=['All','Audio','Power','Wearables','Everyday','Holders','Style'];

  filters.innerHTML=groups.map(group=>`
    <button
      class="filter-button ${activeGroup===group?'is-active':''}"
      data-filter="${group}"
      aria-pressed="${activeGroup===group}">
      ${group}
    </button>
  `).join('');
}

function renderProducts(){
  const term=searchInput.value.trim().toLowerCase();

  const visible=products.filter(p=>
    (activeGroup==='All'||p.group===activeGroup)
    &&(!favoritesOnly||saved.has(p.id))
    &&(`${p.name} ${p.group} ${p.caption}`.toLowerCase().includes(term))
  );

  productGrid.innerHTML=visible.map((p,index)=>{
    const qty=getQty(p.id);
    return `
    <article class="product-card" data-id="${p.id}" style="--card-bg:${p.bg}">

      <div class="product-media">
        <span class="product-topline">
          ${String(index+1).padStart(2,'0')} / ${p.group.toUpperCase()}
        </span>
        <button
          class="heart-button ${saved.has(p.id)?'is-saved':''}"
          data-save="${p.id}"
          aria-label="${saved.has(p.id)?'Remove':'Save'} ${p.name}"
          aria-pressed="${saved.has(p.id)}">
          ${heartIcon}
        </button>
        ${artwork(p.art)}
      </div>

      <div class="product-info-block">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-caption">${p.caption}</p>

        <div class="product-stars" aria-label="4.5 out of 5 stars">
          <span class="stars-filled">★★★★★</span>
          <span class="stars-count">(${Math.floor(Math.random()*120+30)})</span>
        </div>

        <div class="product-qty-row">
          <button class="qty-btn" data-qty-dec="${p.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value" id="qty-${p.id}">${qty}</span>
          <button class="qty-btn" data-qty-inc="${p.id}" aria-label="Increase quantity">+</button>
        </div>

        <div class="product-actions">
          <button class="btn-buy-now" data-buy="${p.id}">
            Buy Now
          </button>
          <button class="btn-add-cart ${cartItems.has(p.id)?'in-cart':''}" data-cart="${p.id}">
            ${cartItems.has(p.id)?'✓ Added':'Add to Cart'}
          </button>
        </div>
      </div>

    </article>`;
  }).join('');

  emptyState.hidden=visible.length>0;

  setupTilt();
  updateFavoritesCount();
  revealNewCards();
}

function revealNewCards(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  productGrid.querySelectorAll('.product-card').forEach((card,i)=>{
    card.classList.add('reveal');
    requestAnimationFrame(()=>{
      setTimeout(()=>card.classList.add('in-view'), i*35);
    });
  });
}

categoryStrip.innerHTML=products.map(p=>`
  <button class="category-tile" data-category="${p.id}">
    <span class="category-icon" aria-hidden="true">${p.emoji}</span>

    <span>
      <strong>${p.name}</strong>
      <small>${p.group}</small>
    </span>

    <span class="arrow" aria-hidden="true">↗</span>
  </button>
`).join('');

filters.addEventListener('click',e=>{
  const button=e.target.closest('[data-filter]');
  if(!button)return;

  activeGroup=button.dataset.filter;
  favoritesOnly=false;

  renderFilters();
  renderProducts();
});

searchInput.addEventListener('input',renderProducts);

categoryStrip.addEventListener('click',e=>{
  const button=e.target.closest('[data-category]');
  if(!button)return;

  const item=products.find(p=>p.id===button.dataset.category);

  activeGroup='All';
  favoritesOnly=false;
  searchInput.value=item.name;

  renderFilters();
  renderProducts();

  document.querySelector('#collection').scrollIntoView({behavior:'smooth'});
});

productGrid.addEventListener('click',e=>{

  /* SAVE / HEART */
  const save=e.target.closest('[data-save]');
  if(save){
    const id=save.dataset.save;
    const item=products.find(p=>p.id===id);
    const wasSaved=saved.has(id);
    wasSaved?saved.delete(id):saved.add(id);
    try{ localStorage.setItem('xcess-favorites',JSON.stringify([...saved])); }catch{}
    renderProducts();
    showToast(wasSaved?`Removed ${item.name} from favorites`:`Saved ${item.name} to favorites ✓`);
    return;
  }

  /* QTY DEC */
  const dec=e.target.closest('[data-qty-dec]');
  if(dec){
    const id=dec.dataset.qtyDec;
    const newVal=Math.max(1,getQty(id)-1);
    setQty(id,newVal);
    const el=document.getElementById('qty-'+id);
    if(el)el.textContent=newVal;
    return;
  }

  /* QTY INC */
  const inc=e.target.closest('[data-qty-inc]');
  if(inc){
    const id=inc.dataset.qtyInc;
    const newVal=getQty(id)+1;
    setQty(id,newVal);
    const el=document.getElementById('qty-'+id);
    if(el)el.textContent=newVal;
    return;
  }

  /* ADD TO CART */
  const cart=e.target.closest('[data-cart]');
  if(cart){
    const id=cart.dataset.cart;
    const item=products.find(p=>p.id===id);
    const wasIn=cartItems.has(id);
    if(!wasIn){
      cartItems.add(id);
      bagCount+=getQty(id);
      bagCountEl.textContent=bagCount;
      try{
        localStorage.setItem('xcess-cart',JSON.stringify([...cartItems]));
        localStorage.setItem('xcess-bag-count',String(bagCount));
      }catch{}
      cart.textContent='✓ Added';
      cart.classList.add('in-cart');
      showToast(`${item.name} added to cart ✓`);
    } else {
      showToast(`${item.name} already in cart`);
    }
    return;
  }

  /* BUY NOW */
  const buy=e.target.closest('[data-buy]');
  if(buy){
    openOrderDialog(buy.dataset.buy);
    return;
  }

  /* QUICK VIEW (explore button) */
  const open=e.target.closest('[data-open]');
  if(open)openProduct(open.dataset.open);
});

/* ORDER DIALOG */
const orderDialog=document.querySelector('#orderDialog');
const orderForm=document.querySelector('#orderForm');
const orderSuccess=document.querySelector('#orderSuccess');

function openOrderDialog(id){
  const p=products.find(item=>item.id===id);
  if(!p||!orderDialog)return;
  document.querySelector('#orderProductName').textContent=p.name;
  document.querySelector('#orderProductQty').textContent=`Quantity: ${getQty(p.id)}`;
  document.querySelector('#orderArt').innerHTML=artwork(p.art);
  document.querySelector('#orderArt').style.background=p.bg;
  orderForm.dataset.productId=p.id;
  orderForm.dataset.productName=p.name;
  orderForm.hidden=false;
  orderSuccess.hidden=true;
  orderDialog.showModal();
}

if(orderForm){
  orderForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.querySelector('#orderName').value.trim();
    const phone=document.querySelector('#orderPhone').value.trim();
    const address=document.querySelector('#orderAddress').value.trim();
    const payment=document.querySelector('input[name="payment"]:checked')?.value||'Cash on Delivery';
    const product=orderForm.dataset.productName;
    const qty=getQty(orderForm.dataset.productId);
    if(!name||!phone||!address){ showToast('Please fill all required fields'); return; }
    /* WhatsApp message */
    const msg=encodeURIComponent(
      `*New Order — XCESS*\n\nProduct: ${product}\nQty: ${qty}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}`
    );
    window.open(`https://wa.me/923144494605?text=${msg}`,'_blank');
    orderForm.hidden=true;
    orderSuccess.hidden=false;
    orderForm.reset();
  });
}

document.querySelectorAll('[data-close-order]').forEach(btn=>
  btn.addEventListener('click',()=>orderDialog?.close())
);
orderDialog?.addEventListener('click',e=>{ if(e.target===orderDialog)orderDialog.close(); });

function openProduct(id){
  const p=products.find(item=>item.id===id);
  if(!p)return;

  document.querySelector('#dialogTitle').textContent=p.name;
  document.querySelector('#dialogDescription').textContent=p.description;
  document.querySelector('#dialogVisual').style.background=p.bg;
  document.querySelector('#dialogVisual').innerHTML=artwork(p.art);
  document.querySelector('#dialogDone').dataset.notify=p.name;

  productDialog.showModal();
}

function showToast(message){
  let toast=document.querySelector('#toast');

  if(!toast){
    toast=document.createElement('div');
    toast.id='toast';
    toast.className='toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    document.body.appendChild(toast);
  }

  toast.textContent=message;
  toast.classList.remove('toast-show');
  void toast.offsetWidth;
  toast.classList.add('toast-show');

  clearTimeout(showToast._timer);
  showToast._timer=setTimeout(()=>toast.classList.remove('toast-show'),2600);
}

document.querySelector('#favoritesToggle').addEventListener('click',()=>{
  favoritesOnly=!favoritesOnly;
  activeGroup='All';
  searchInput.value='';

  renderFilters();
  renderProducts();

  document.querySelector('#collection').scrollIntoView({behavior:'smooth'});
});

const bagButton=document.querySelector('#bagToggle');
const bagCountEl=bagButton.querySelector('.bag-count');
let bagCount=0;

try {
  bagCount=parseInt(localStorage.getItem('xcess-bag-count')||'0',10)||0;
  bagCountEl.textContent=bagCount;
} catch {}

bagButton.addEventListener('click',()=>{
  bagDialog.showModal();
});

document.querySelector('#searchToggle').addEventListener('click',()=>{
  document.querySelector('#collection').scrollIntoView({behavior:'smooth'});
  searchInput.focus({preventScroll:true});
});

document.querySelectorAll('[data-close]').forEach(button=>
  button.addEventListener('click',()=>
    button.closest('dialog').close()
  )
);

document.querySelectorAll('dialog').forEach(dialog=>
  dialog.addEventListener('click',e=>{
    if(e.target===dialog)dialog.close();
  })
);

const menuToggle=document.querySelector('#menuToggle');
const mobileNav=document.querySelector('#mobileNav');

menuToggle.addEventListener('click',()=>{
  mobileNav.hidden=!mobileNav.hidden;
  menuToggle.setAttribute('aria-expanded',String(!mobileNav.hidden));
});

mobileNav.querySelectorAll('a').forEach(a=>
  a.addEventListener('click',()=>{
    mobileNav.hidden=true;
    menuToggle.setAttribute('aria-expanded','false');
  })
);

document.addEventListener('keydown',e=>{
  if(
    e.key==='/' &&
    document.activeElement!==searchInput &&
    !e.ctrlKey &&
    !e.metaKey
  ){
    e.preventDefault();
    document.querySelector('#searchToggle').click();
  }
});

function setupTilt(){
  if(window.matchMedia('(hover:none), (prefers-reduced-motion:reduce)').matches)return;

  productGrid.querySelectorAll('.product-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;

      card.style.transform=`
        perspective(900px)
        rotateX(${-y*7}deg)
        rotateY(${x*7}deg)
        translateY(-5px)
      `;
    });

    card.addEventListener('pointerleave',()=>{
      card.style.transform='';
    });
  });
}

document.querySelector('#dialogDone')?.addEventListener('click',e=>{
  const name=e.currentTarget.dataset.notify;
  if(name)showToast(`We'll let you know when ${name} is ready ✓`);
});

/* SCROLL REVEAL */
const revealTargets=document.querySelectorAll(
  '.category-tile, .editorial-grid, .closing-section'
);

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});

  revealTargets.forEach(el=>{
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
} else {
  revealTargets.forEach(el=>el.classList.add('in-view'));
}

/* ACTIVE NAV LINK ON SCROLL */
const navLinks=document.querySelectorAll('.desktop-nav a, .mobile-nav a');
const sections=['collection','categories','about']
  .map(id=>document.getElementById(id))
  .filter(Boolean);

if('IntersectionObserver' in window && sections.length){
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(link=>{
          link.classList.toggle(
            'is-current',
            link.getAttribute('href')===`#${entry.target.id}`
          );
        });
      }
    });
  },{rootMargin:'-45% 0px -50% 0px'});

  sections.forEach(section=>navObserver.observe(section));
}

renderFilters();
renderProducts();

/* BRAND GRID */
const brands = [
  { name:'iPhone',  symbol:'',  svg:true  },
  { name:'Samsung', symbol:'S', svg:false },
  { name:'OnePlus', symbol:'1+',svg:false },
  { name:'Xiaomi',  symbol:'Mi',svg:false },
  { name:'Oppo',    symbol:'O', svg:false },
  { name:'Vivo',    symbol:'V', svg:false },
  { name:'Honor',   symbol:'H', svg:false },
  { name:'Huawei',  symbol:'HW',svg:false },
  { name:'Realme',  symbol:'R', svg:false },
  { name:'Tecno',   symbol:'T', svg:false },
  { name:'Infinix', symbol:'∞', svg:false },
  { name:'Pixel',   symbol:'G', svg:false },
  { name:'Motorola',symbol:'M', svg:false },
  { name:'Nothing', symbol:'N', svg:false },
  { name:'iQOO',    symbol:'iQ',svg:false },
  { name:'Itel',    symbol:'it',svg:false }
];

const appleSvg=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3.5c-1.6 1.7-4.2 2.1-5.9.4C8.8 2.2 9.1-.4 10.8-1.6" stroke-linecap="round"/><path d="M17.2 8.8C15.2 10 14 12.2 14 14.5c0 2.7 1.8 5 4.4 5.8" stroke-linecap="round"/><path d="M6 21.5c1.4 0 2.8-.5 3.8-1.5C11 18.8 12 17 12 15s-1-3.8-2.2-5C8.6 8.8 7 8 5.4 8c-1 0-2 .3-2.9.8C1.6 9.5 1 10.7 1 12c0 3 1.7 5.9 3.5 7.8.8.9 1.6 1.7 2.5 1.7Z" stroke-linecap="round"/></svg>`;

const brandGrid=document.querySelector('#brandGrid');
if(brandGrid){
  brandGrid.innerHTML=brands.map(b=>`
    <div class="brand-card" role="button" tabindex="0" aria-label="${b.name} covers">
      <div class="brand-logo">
        ${b.svg ? appleSvg : `<span class="brand-logo-text">${b.symbol}</span>`}
      </div>
      <span class="brand-name">${b.name}</span>
    </div>
  `).join('');

  brandGrid.addEventListener('click',e=>{
    const card=e.target.closest('.brand-card');
    if(!card)return;
    const name=card.querySelector('.brand-name').textContent;
    showToast(`${name} covers — coming soon! ✓`);
  });
  brandGrid.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      const card=e.target.closest('.brand-card');
      if(card)card.click();
    }
  });
}
