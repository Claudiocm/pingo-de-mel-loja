const money = n =>
  Number(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

let cart = JSON.parse(localStorage.getItem("pingoCart") || "{}");
let category = "Todos";

const grid = document.querySelector("#productGrid");
const filters = document.querySelector("#filters");
const search = document.querySelector("#search");

const CATEGORY_IMAGES = {
  "Doces": "img/doces.jpg",
  "Salgados": "img/coxinha.jpg",
  "Bolos": "img/bolos.jpg",
  "Kit-festas": "img/kit-festa.jpg"
};

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function save() {
  localStorage.setItem("pingoCart", JSON.stringify(cart));
  renderCart();
}

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(product => product.cat))];
}

function getProductImage(product) {
  if (product.image) {
    return product.image;
  }

  if (product.img) {
    return product.img;
  }

  return CATEGORY_IMAGES[product.cat] || "img/doces.jpg";
}

function renderFilters() {
  filters.innerHTML = categories()
    .map(
      categoryName => `
        <button
          class="filter ${categoryName === category ? "active" : ""}"
          data-category="${escapeHTML(categoryName)}"
          type="button"
        >
          ${escapeHTML(categoryName)}
        </button>
      `
    )
    .join("");

  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.category);
    });
  });
}

function setCategory(selectedCategory) {
  category = selectedCategory;
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const query = search.value.trim().toLowerCase();

  const list = PRODUCTS.filter(product => {
    const searchableText = `
      ${product.name || ""}
      ${product.desc || ""}
      ${product.cat || ""}
    `.toLowerCase();

    const matchesCategory =
      category === "Todos" || product.cat === category;

    const matchesSearch =
      !query || searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = list.length
    ? list
        .map(product => {
          const image = getProductImage(product);

          return `
            <article class="product">
              <div class="product-media">
                <img
                  src="${escapeHTML(image)}"
                  alt="${escapeHTML(product.name)}"
                  loading="lazy"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';"
                >
                <span class="emoji" style="display:none;">
                  ${escapeHTML(product.emoji || "🍯")}
                </span>
              </div>

              <div class="product-body">
                <small>${escapeHTML(product.cat)}</small>

                <h3>${escapeHTML(product.name)}</h3>

                <p>${escapeHTML(product.desc || "")}</p>

                <div class="product-bottom">
                  <span class="price">
                    ${money(product.price)}
                  </span>

                  <button
                    class="add"
                    type="button"
                    data-product="${escapeHTML(product.id)}"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")
    : `
      <div class="empty" style="grid-column:1/-1">
        Nenhum produto encontrado.
      </div>
    `;

  grid.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => {
      add(button.dataset.product);
    });
  });
}

function add(id) {
  const product = PRODUCTS.find(item => item.id === id);

  if (!product) {
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  save();
  openCart();
}

function change(id, delta) {
  if (!PRODUCTS.some(product => product.id === id)) {
    delete cart[id];
    save();
    return;
  }

  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  save();
}

function getCartSummary() {
  let total = 0;

  const items = Object.keys(cart)
    .map(id => {
      const product = PRODUCTS.find(item => item.id === id);

      if (!product) {
        return null;
      }

      const quantity = Number(cart[id]) || 0;
      const subtotal = Number(product.price) * quantity;

      total += subtotal;

      return {
        ...product,
        quantity,
        subtotal
      };
    })
    .filter(Boolean);

  return {
    items,
    total
  };
}

function renderCart() {
  const { items, total } = getCartSummary();

  const cartCount = document.querySelector("#cartCount");
  const cartItems = document.querySelector("#cartItems");
  const cartTotal = document.querySelector("#cartTotal");

  cartCount.textContent = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cartItems.innerHTML = items.length
    ? items
        .map(
          item => `
            <div class="cart-row">
              <div>
                <h4>${escapeHTML(item.name)}</h4>

                <small>
                  ${money(item.price)} cada
                </small>

                <br>

                <strong>
                  ${money(item.subtotal)}
                </strong>
              </div>

              <div class="qty">
                <button
                  type="button"
                  data-minus="${escapeHTML(item.id)}"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>

                <b>${item.quantity}</b>

                <button
                  type="button"
                  data-plus="${escapeHTML(item.id)}"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>
          `
        )
        .join("")
    : `
      <div class="empty">
        Seu carrinho está vazio.
        <br>
        Escolha um produto para começar. 🍯
      </div>
    `;

  cartTotal.textContent = money(total);

  document.querySelectorAll("[data-minus]").forEach(button => {
    button.addEventListener("click", () => {
      change(button.dataset.minus, -1);
    });
  });

  document.querySelectorAll("[data-plus]").forEach(button => {
    button.addEventListener("click", () => {
      change(button.dataset.plus, 1);
    });
  });
}

function openCart() {
  document.querySelector("#drawer").classList.add("open");
  document.querySelector("#overlay").classList.add("show");

  document
    .querySelector("#drawer")
    .setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.querySelector("#drawer").classList.remove("open");
  document.querySelector("#overlay").classList.remove("show");

  document
    .querySelector("#drawer")
    .setAttribute("aria-hidden", "true");
}

function checkout() {
  const { items } = getCartSummary();

  if (!items.length) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  document.querySelector("#checkoutModal").classList.add("show");
  document.querySelector("#buyerName").focus();
}

function closeCheckout() {
  document.querySelector("#checkoutModal").classList.remove("show");
}

function sendOrder(event) {
  event.preventDefault();

  const { items, total } = getCartSummary();

  if (!items.length) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const name = document
    .querySelector("#buyerName")
    .value
    .trim();

  const deliveryOption = document.querySelector(
    "input[name='delivery']:checked"
  );

  const delivery = deliveryOption
    ? deliveryOption.value
    : "retirada";

  const address = document
    .querySelector("#buyerAddress")
    .value
    .trim();

  if (!name) {
    alert("Informe o nome do comprador.");
    return;
  }

  if (delivery === "entrega" && !address) {
    alert(
      "Informe o endereço para entrega ou selecione Retirar no local."
    );
    return;
  }

  const lines = [
    "Olá! Gostaria de fazer um pedido no Pingo de Mel:",
    "",
    `Nome do comprador: ${name}`,
    `Forma de recebimento: ${
      delivery === "retirada"
        ? "Retirar no local"
        : "Entrega"
    }`
  ];

  if (delivery === "entrega") {
    lines.push(`Endereço: ${address}`);
  }

  lines.push("", "Produtos:");

  items.forEach(item => {
    lines.push(
      `• ${item.quantity}x ${item.name} — ${money(item.subtotal)}`
    );
  });

  lines.push(
    "",
    `Total estimado: ${money(total)}`,
    "",
    "Gostaria de confirmar a disponibilidade dos produtos e a forma de pagamento."
  );

  const whatsappUrl =
    "https://wa.me/5513991324748?text=" +
    encodeURIComponent(lines.join("\n"));

  window.open(whatsappUrl, "_blank");

  closeCheckout();
}

document.querySelector("#cartBtn").onclick = openCart;

document.querySelector("#closeCart").onclick = closeCart;

document.querySelector("#overlay").onclick = closeCart;

document.querySelector("#checkout").onclick = checkout;

document.querySelector("#clearCart").onclick = () => {
  cart = {};
  save();
};

document.querySelector("#closeCheckout").onclick = closeCheckout;

document
  .querySelector("#checkoutForm")
  .addEventListener("submit", sendOrder);

document
  .querySelectorAll("input[name='delivery']")
  .forEach(input => {
    input.addEventListener("change", () => {
      const addressGroup = document.querySelector("#addressGroup");
      const address = document.querySelector("#buyerAddress");

      const selectedDelivery = document.querySelector(
        "input[name='delivery']:checked"
      ).value;

      const isDelivery = selectedDelivery === "entrega";

      addressGroup.hidden = !isDelivery;
      address.required = isDelivery;

      if (!isDelivery) {
        address.value = "";
      }
    });
  });

search.addEventListener("input", renderProducts);

renderFilters();
renderProducts();
renderCart();
