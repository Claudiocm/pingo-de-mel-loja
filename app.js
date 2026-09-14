const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let cart = JSON.parse(localStorage.getItem("pingoCart") || "{}");
let category = "Todos";
const grid = document.querySelector("#productGrid");
const filters = document.querySelector("#filters");
const search = document.querySelector("#search");

function save(){localStorage.setItem("pingoCart",JSON.stringify(cart)); renderCart();}
function categories(){return ["Todos",...new Set(PRODUCTS.map(p=>p.cat))];}
function renderFilters(){
  filters.innerHTML = categories().map(c=>`<button class="filter ${c===category?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");
}
function setCategory(c){category=c;renderFilters();renderProducts();}
function renderProducts(){
  const q=search.value.trim().toLowerCase();
  const list=PRODUCTS.filter(p=>(category==="Todos"||p.cat===category)&&(!q||(`${p.name} ${p.desc} ${p.cat}`).toLowerCase().includes(q)));
  grid.innerHTML=list.length?list.map(p=>{
    const media=p.id==="pao-mel"||p.id==="brownie"||p.id==="bolo-pote"||p.id==="caseirinho"?<img src="img/doces.jpg" alt="${p.name}">`:`<span class="emoji">${p.emoji}</span>`;
    return `<article class="product"><div class="product-media">${media}</div><div class="product-body"><small>${p.cat}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="add('${p.id}')">+ Adicionar</button></div></div></article>`;
  }).join(""):`<div class="empty" style="grid-column:1/-1">Nenhum produto encontrado.</div>`;
}
function add(id){cart[id]=(cart[id]||0)+1;save();openCart();}
function change(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];save();}
function renderCart(){
  const ids=Object.keys(cart);
  document.querySelector("#cartCount").textContent=ids.reduce((s,id)=>s+cart[id],0);
  if(!ids.length){document.querySelector("#cartItems").innerHTML='<div class="empty">Seu carrinho está vazio.<br>Escolha um produto para começar. 🍯</div>';document.querySelector("#cartTotal").textContent=money(0);return;}
  let total=0;
  document.querySelector("#cartItems").innerHTML=ids.map(id=>{
    const p=PRODUCTS.find(x=>x.id===id), q=cart[id]; total+=p.price*q;
    return `<div class="cart-row"><div><h4>${p.name}</h4><small>${money(p.price)} cada</small></div><div class="qty"><button onclick="change('${id}',-1)">−</button><b>${q}</b><button onclick="change('${id}',1)">+</button></div></div>`;
  }).join("");
  document.querySelector("#cartTotal").textContent=money(total);
}
function openCart(){document.querySelector("#drawer").classList.add("open");document.querySelector("#overlay").classList.add("show");document.querySelector("#drawer").setAttribute("aria-hidden","false");}
function closeCart(){document.querySelector("#drawer").classList.remove("open");document.querySelector("#overlay").classList.remove("show");document.querySelector("#drawer").setAttribute("aria-hidden","true");}
function checkout(){
  const ids=Object.keys(cart);
  if(!ids.length){alert("Adicione pelo menos um produto ao carrinho.");return;}
  let total=0, lines=["Olá! Gostaria de fazer um pedido no Pingo de Mel:",""];
  ids.forEach(id=>{const p=PRODUCTS.find(x=>x.id===id),q=cart[id];total+=p.price*q;lines.push(`• ${q}x ${p.name} — ${money(p.price*q)}`);});
  lines.push("",`Total estimado: ${money(total)}`,"","Gostaria de confirmar disponibilidade e forma de pagamento/retirada.");
  window.open("https://wa.me/5513991324748?text="+encodeURIComponent(lines.join("\n")),"_blank");
}
document.querySelector("#cartBtn").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=closeCart;
document.querySelector("#checkout").onclick=checkout;
document.querySelector("#clearCart").onclick=()=>{cart={};save();};
search.addEventListener("input",renderProducts);
renderFilters();renderProducts();renderCart();
