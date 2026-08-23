// Roof Burger — interactive layer (cart, customization, delivery/retiro, sucursales, login teaser)
// This site has no real backend: the local cart, order-mode and login modal are all
// client-side UX. Real checkout/auth happens on the official ordering platform.
(function () {
  "use strict";

  const ORDER_URL = "https://roofburger.cl/pedir";

  const PROTEINS = [
    { name: "Hamburguesa Carne 225gr", price: 0 },
    { name: "Hamburguesa de Lentejas", price: 0 },
    { name: "Hamburguesa de Garbanzos", price: 0 },
    { name: "Carne Mechada", price: 1000 },
  ];

  const SIZES = [
    { name: "Simple", price: 0 },
    { name: "Doble", price: 3000 },
    { name: "Triple", price: 6000 },
    { name: "Cuadruple", price: 9000 },
  ];

  const PAPAS = [
    { name: "Papas tamaño normal", price: 0 },
    { name: "Papas agrandadas", price: 1000 },
  ];

  const EXTRAS = [
    { name: "Alioli", price: 500 },
    { name: "Aros de Cebolla Fritos", price: 900 },
    { name: "BBQ", price: 500 },
    { name: "Camarones Ecuatorianos", price: 1500 },
    { name: "Cebolla Blanca", price: 500 },
    { name: "Cebolla Caramelizada", price: 900 },
    { name: "Cebolla Morada", price: 500 },
    { name: "Champiñones", price: 900 },
    { name: "Espárragos", price: 500 },
    { name: "Huevo Frito", price: 900 },
    { name: "Lechuga Hidropónica", price: 500 },
    { name: "Mayonesa", price: 500 },
    { name: "Palta Hass", price: 2000 },
    { name: "Pan Extra", price: 500 },
    { name: "Pepinillos", price: 900 },
    { name: "Pimientos", price: 900 },
    { name: "Pollo", price: 1200 },
    { name: "Queso Azul", price: 900 },
    { name: "Queso Cheddar", price: 900 },
    { name: "Queso Mantecoso", price: 900 },
    { name: "Salsa Cheddar", price: 500 },
    { name: "Tocino", price: 1500 },
    { name: "Tomate", price: 500 },
    { name: "Tomate Cherry", price: 900 },
  ];

  const DRINK_ADDON_PRICE = 2200;
  const DRINK_ADDONS = [
    "Agua Mineral C/G", "Agua Mineral S/G", "Coca-Cola Normal", "Coca-Cola Light", "Coca-Cola Zero",
    "Fanta Normal", "Fanta Zero", "Sprite Normal", "Sprite Zero",
    "Schweppes Ginger Ale", "Schweppes Zero Ginger Ale", "Schweppes Tónica", "Quatro Zero",
  ];

  const BRANCHES = [
    { name: "Roof Burger: Los Angeles", address: "Av. Gabriela Mistral 1268, Los Ángeles", retiro: true },
    { name: "Roof: La Florida", address: "Las Lluvias 1643, La Florida, Santiago", retiro: false },
    { name: "Roof: Villa Alemana", address: "Av. Valparaíso 1015, Villa Alemana", retiro: true },
    { name: "Roof Burger: Reñaca", address: "Avenida Borgoño 14575, Concón", retiro: true },
    { name: "Roof Burger: Quilpué", address: "Camilo Henríquez 476, Quilpué", retiro: true },
    { name: "Roof Burger: Curauma", address: "Avenida Cardenal Samoré 2290, Valparaíso", retiro: true },
    { name: "Roof Burger: Vitacura", address: "Av Vitacura 7125, Vitacura, Santiago", retiro: true },
    { name: "Roof Burger: Peñalolén", address: "Avenida Las Perdices 2990, Peñalolén, Santiago", retiro: true },
    { name: "Roof Burger: Chicureo", address: "Avenida del Valle 2700, Chicureo, Colina", retiro: true },
    { name: "Roof Burger: Puerto Montt", address: "Monseñor Ramón Munita 1600, Puerto Montt", retiro: true },
    { name: "Roof Burger: Concón", address: "Avenida Concón Reñaca 122, Concón", retiro: true },
    { name: "Roof Burger: Viña del Mar (4 Poniente)", address: "4 Poniente 506, Viña del Mar", retiro: true },
    { name: "Roof Burger: Av. Valparaíso", address: "Avenida Valparaíso 355, Viña del Mar", retiro: true },
    { name: "Roof Burger: 6 Pte (sector casino)", address: "6 Poniente 203, Viña del Mar", retiro: true },
    { name: "Roof Burger: Valdivia Sur", address: "Ángel Muñoz 1123, Valdivia", retiro: true },
    { name: "Roof Burger: Los Andes", address: "Santa Rosa 617, Los Andes", retiro: true },
    { name: "Roof Burger: La Calera", address: "Carrera 1977, La Calera", retiro: true },
    { name: "Roof Burger: Copiapó", address: "Bernardo O'Higgins 1147, Copiapó", retiro: false },
    { name: "Roof Burger: Quillota", address: "Maipú 140, Quillota", retiro: false },
  ];

  const STORAGE_CART = "rb_cart_v1";
  const STORAGE_ORDER_MODE = "rb_order_mode_v1";

  let cart = safeParse(localStorage.getItem(STORAGE_CART), []);
  const DEFAULT_BRANCH = "Roof Burger: Viña del Mar (4 Poniente)";
  let orderMode = safeParse(localStorage.getItem(STORAGE_ORDER_MODE), {
    mode: "delivery",
    address: "",
    branch: DEFAULT_BRANCH,
  });

  let modalCtx = null; // {catIdx, prodIdx, product, isCustomizable, protein, size, papas, extras:Set, drink, qty, notes}

  function safeParse(raw, fallback) {
    try {
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function clp(n) {
    return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function esc(s) {
    return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function saveCart() {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    renderCartBadge();
  }

  function saveOrderMode() {
    localStorage.setItem(STORAGE_ORDER_MODE, JSON.stringify(orderMode));
  }

  // ---------- Header: cart badge ----------
  function renderCartBadge() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle("hidden", count === 0);
    });
  }

  // ---------- Header: delivery / retiro ----------
  function renderOrderModeWidget() {
    document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
      const active = btn.getAttribute("data-mode-btn") === orderMode.mode;
      btn.classList.toggle("bg-primary", active);
      btn.classList.toggle("text-on-primary", active);
      btn.classList.toggle("text-on-surface-variant", !active);
    });
    document.querySelectorAll("[data-address-input]").forEach((el) => {
      el.classList.toggle("hidden", orderMode.mode !== "delivery");
      if (el.tagName === "INPUT") el.value = orderMode.address;
    });
    document.querySelectorAll("[data-branch-select]").forEach((el) => {
      el.classList.toggle("hidden", orderMode.mode !== "retiro");
    });
  }

  function setOrderMode(mode) {
    orderMode.mode = mode;
    saveOrderMode();
    renderOrderModeWidget();
  }

  function populateBranchSelects() {
    const retiroBranches = BRANCHES.filter((b) => b.retiro);
    document.querySelectorAll("[data-branch-select]").forEach((sel) => {
      sel.innerHTML = retiroBranches
        .map((b) => `<option value="${esc(b.name)}">${esc(b.name)}</option>`)
        .join("");
      sel.value = orderMode.branch;
    });
  }

  // ---------- Product customization modal ----------
  function findProduct(catIdx, prodIdx) {
    const cat = window.MENU_DATA[catIdx];
    const product = cat.productos[prodIdx];
    return { cat, product };
  }

  window.openProductModal = function (catIdx, prodIdx) {
    const { cat, product } = findProduct(catIdx, prodIdx);
    if (!product.Disponible) return;
    const isCustomizable = window.CUSTOMIZABLE_CATEGORIES.includes(cat.Nombre.trim());
    modalCtx = {
      catIdx,
      prodIdx,
      product,
      isCustomizable,
      protein: 0,
      size: 0,
      papas: 0,
      extras: new Set(),
      drink: null,
      qty: 1,
      notes: "",
    };
    renderProductModal();
    document.getElementById("product-modal").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  window.closeProductModal = function () {
    document.getElementById("product-modal").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    modalCtx = null;
  };

  function unitPrice() {
    if (!modalCtx) return 0;
    let total = modalCtx.product.PrecioFinal;
    if (modalCtx.isCustomizable) {
      total += PROTEINS[modalCtx.protein].price;
      total += SIZES[modalCtx.size].price;
      total += PAPAS[modalCtx.papas].price;
      modalCtx.extras.forEach((i) => (total += EXTRAS[i].price));
      if (modalCtx.drink !== null) total += DRINK_ADDON_PRICE;
    }
    return total;
  }

  function pillGroup(id, title, subtitle, items, selectedIdx, onclickName) {
    return `
      <div>
        <h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">${esc(title)}</h4>
        <p class="text-xs text-on-surface-variant mb-2">${esc(subtitle)}</p>
        <div class="flex flex-wrap gap-2">
          ${items
            .map(
              (it, i) => `
            <button type="button" onclick="${onclickName}(${i})"
              class="px-3.5 py-2 rounded-full text-sm border transition-colors ${
                i === selectedIdx
                  ? "bg-primary text-on-primary border-primary font-bold"
                  : "bg-surface-container-high text-on-surface-variant border-surface-variant hover:border-primary/60"
              }">
              ${esc(it.name)}${it.price ? ` <span class="opacity-80">+${clp(it.price)}</span>` : ""}
            </button>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderProductModal() {
    const { product } = modalCtx;
    document.getElementById("product-modal-image").style.backgroundImage = `url('${product.Imagen}')`;

    let body = `
      <div>
        <h3 class="font-headline-md text-2xl text-on-background uppercase leading-tight">${esc(product.Nombre.trim())}</h3>
        <p class="text-sm text-on-surface-variant mt-2 leading-relaxed">${esc(product.Descripcion)}</p>
      </div>`;

    if (modalCtx.isCustomizable) {
      body += pillGroup("protein", "Elige tu proteína", "Selecciona tu proteína de preferencia · Requerido", PROTEINS, modalCtx.protein, "setProtein");
      body += `<div><h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">Pan</h4><p class="text-xs text-on-surface-variant">Pan brioche artesanal, horneado en casa</p></div>`;
      body += pillGroup("size", "Tamaño de tu hamburguesa", "Selecciona tu preferencia · Requerido", SIZES, modalCtx.size, "setSize");
      body += pillGroup("papas", "Agranda tus papas", "Doble porción de papas rústicas", PAPAS, modalCtx.papas, "setPapas");

      body += `
        <div>
          <h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">Ingredientes extra</h4>
          <p class="text-xs text-on-surface-variant mb-2">Opcional · agrega lo que más te guste</p>
          <div class="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            ${EXTRAS.map(
              (ex, i) => `
              <button type="button" onclick="toggleExtra(${i})"
                class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs border transition-colors text-left ${
                  modalCtx.extras.has(i)
                    ? "bg-primary/15 border-primary text-on-surface"
                    : "bg-surface-container-high border-surface-variant text-on-surface-variant hover:border-primary/60"
                }">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base">${modalCtx.extras.has(i) ? "check_box" : "check_box_outline_blank"}</span>
                  ${esc(ex.name)}
                </span>
                <span class="shrink-0 font-bold">+${clp(ex.price)}</span>
              </button>`
            ).join("")}
          </div>
        </div>`;

      body += `
        <div>
          <h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">Bebida adicional</h4>
          <p class="text-xs text-on-surface-variant mb-2">Opcional · ${clp(DRINK_ADDON_PRICE)} c/u</p>
          <select onchange="setDrink(this.value)" class="w-full bg-surface-container-high border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-on-surface">
            <option value="">Sin bebida adicional</option>
            ${DRINK_ADDONS.map((d) => `<option value="${esc(d)}" ${modalCtx.drink === d ? "selected" : ""}>${esc(d)}</option>`).join("")}
          </select>
        </div>`;
    }

    body += `
      <div>
        <h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">Preferencias</h4>
        <p class="text-xs text-on-surface-variant mb-2">Cuéntanos algún requisito especial (opcional)</p>
        <textarea onchange="setNotes(this.value)" rows="2" placeholder="Ej: sin cebolla, salsa aparte..." class="w-full bg-surface-container-high border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60"></textarea>
      </div>`;

    document.getElementById("product-modal-body").innerHTML = body;
    document.getElementById("qty-value").textContent = modalCtx.qty;
    updateModalTotal();
  }

  function updateModalTotal() {
    document.getElementById("product-modal-total").textContent = clp(unitPrice() * modalCtx.qty);
  }

  window.setProtein = function (i) { modalCtx.protein = i; renderProductModal(); };
  window.setSize = function (i) { modalCtx.size = i; renderProductModal(); };
  window.setPapas = function (i) { modalCtx.papas = i; renderProductModal(); };
  window.setDrink = function (v) { modalCtx.drink = v || null; updateModalTotal(); };
  window.setNotes = function (v) { modalCtx.notes = v; };
  window.toggleExtra = function (i) {
    if (modalCtx.extras.has(i)) modalCtx.extras.delete(i);
    else modalCtx.extras.add(i);
    renderProductModal();
  };
  window.changeQty = function (delta) {
    modalCtx.qty = Math.max(1, modalCtx.qty + delta);
    document.getElementById("qty-value").textContent = modalCtx.qty;
    updateModalTotal();
  };

  window.confirmAddToCart = function () {
    if (!modalCtx) return;
    const { product, isCustomizable } = modalCtx;
    const summary = [];
    if (isCustomizable) {
      summary.push(PROTEINS[modalCtx.protein].name);
      if (modalCtx.size) summary.push(SIZES[modalCtx.size].name);
      if (modalCtx.papas) summary.push(PAPAS[modalCtx.papas].name);
      modalCtx.extras.forEach((i) => summary.push("+ " + EXTRAS[i].name));
      if (modalCtx.drink) summary.push(modalCtx.drink);
    }
    if (modalCtx.notes) summary.push('"' + modalCtx.notes + '"');

    cart.push({
      lineId: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: product.Nombre.trim(),
      image: product.Imagen,
      unitPrice: unitPrice(),
      qty: modalCtx.qty,
      summary: summary.join(" · "),
    });
    saveCart();
    closeProductModal();
    openCartDrawer();
  };

  // ---------- Cart drawer ----------
  window.openCartDrawer = function () {
    renderCartDrawer();
    document.getElementById("cart-drawer").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  window.closeCartDrawer = function () {
    document.getElementById("cart-drawer").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  window.removeCartLine = function (lineId) {
    cart = cart.filter((i) => i.lineId !== lineId);
    saveCart();
    renderCartDrawer();
  };

  window.changeCartQty = function (lineId, delta) {
    const item = cart.find((i) => i.lineId === lineId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    renderCartDrawer();
  };

  function renderCartDrawer() {
    const list = document.getElementById("cart-drawer-items");
    const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    document.getElementById("cart-drawer-subtotal").textContent = clp(subtotal);

    if (cart.length === 0) {
      list.innerHTML = `<div class="flex flex-col items-center justify-center gap-3 py-16 text-center text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl opacity-40">shopping_bag</span>
        <p>Tu carrito está vacío.<br>Agrega algo rico del menú.</p>
      </div>`;
      return;
    }

    list.innerHTML = cart
      .map(
        (item) => `
      <div class="flex gap-3 border-b border-surface-variant pb-4">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-surface-container-high">
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <p class="font-bold text-sm text-on-surface leading-snug">${esc(item.name)}</p>
            <button onclick="removeCartLine('${item.lineId}')" class="text-on-surface-variant hover:text-primary shrink-0">
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
          ${item.summary ? `<p class="text-xs text-on-surface-variant mt-0.5 line-clamp-2">${esc(item.summary)}</p>` : ""}
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2 bg-surface-container-highest rounded-full border border-surface-variant px-1">
              <button onclick="changeCartQty('${item.lineId}', -1)" class="h-7 w-7 rounded-full flex items-center justify-center text-on-surface hover:text-primary">−</button>
              <span class="w-5 text-center text-sm font-bold">${item.qty}</span>
              <button onclick="changeCartQty('${item.lineId}', 1)" class="h-7 w-7 rounded-full flex items-center justify-center text-on-surface hover:text-primary">+</button>
            </div>
            <p class="font-price-tag text-price-tag text-primary text-lg">${clp(item.unitPrice * item.qty)}</p>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  // ---------- Login / puntos teaser modal ----------
  window.openLoginModal = function () {
    document.getElementById("login-modal").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  window.closeLoginModal = function () {
    document.getElementById("login-modal").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  // ---------- Sucursales modal ----------
  window.openBranchesModal = function () {
    const list = document.getElementById("branches-modal-list");
    list.innerHTML = BRANCHES.map(
      (b) => `
      <div class="flex items-start justify-between gap-3 py-3 border-b border-surface-variant last:border-0">
        <div class="min-w-0">
          <p class="font-bold text-sm text-on-surface">${esc(b.name)}</p>
          <p class="text-xs text-on-surface-variant mt-0.5">${esc(b.address)}</p>
          <p class="text-xs text-secondary mt-0.5">${b.retiro ? "Delivery y Retiro" : "Solo Delivery"}</p>
        </div>
        <a href="${ORDER_URL}" target="_blank" rel="noopener" class="shrink-0 text-xs font-label-bold bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface px-3 py-2 rounded-full transition-colors whitespace-nowrap">Pedir aquí</a>
      </div>`
    ).join("");
    document.getElementById("branches-modal").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  window.closeBranchesModal = function () {
    document.getElementById("branches-modal").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function () {
    renderCartBadge();
    populateBranchSelects();
    renderOrderModeWidget();

    document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
      btn.addEventListener("click", () => setOrderMode(btn.getAttribute("data-mode-btn")));
    });
    document.querySelectorAll("[data-address-input]").forEach((el) => {
      el.addEventListener("change", () => {
        orderMode.address = el.value;
        saveOrderMode();
      });
    });
    document.querySelectorAll("[data-branch-select]").forEach((el) => {
      el.addEventListener("change", () => {
        orderMode.branch = el.value;
        saveOrderMode();
      });
    });

    document.getElementById("qty-minus").addEventListener("click", () => window.changeQty(-1));
    document.getElementById("qty-plus").addEventListener("click", () => window.changeQty(1));
    document.getElementById("product-modal-add").addEventListener("click", window.confirmAddToCart);
    document.getElementById("product-modal-close").addEventListener("click", window.closeProductModal);
    document.getElementById("product-modal-backdrop").addEventListener("click", window.closeProductModal);

    document.querySelectorAll("[data-open-cart]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); window.openCartDrawer(); }));
    document.getElementById("cart-drawer-close").addEventListener("click", window.closeCartDrawer);
    document.getElementById("cart-drawer-backdrop").addEventListener("click", window.closeCartDrawer);

    document.querySelectorAll("[data-open-login]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); window.openLoginModal(); }));
    document.getElementById("login-modal-close").addEventListener("click", window.closeLoginModal);
    document.getElementById("login-modal-backdrop").addEventListener("click", window.closeLoginModal);

    document.querySelectorAll("[data-open-branches]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); window.openBranchesModal(); }));
    document.getElementById("branches-modal-close").addEventListener("click", window.closeBranchesModal);
    document.getElementById("branches-modal-backdrop").addEventListener("click", window.closeBranchesModal);

    document.querySelectorAll("[data-scroll-burgers]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("burgers").scrollIntoView({ behavior: "smooth" });
      })
    );
  });
})();
