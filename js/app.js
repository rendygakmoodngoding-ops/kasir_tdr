/* =====================================================
   WEB KASIR - TDR STORE
   ===================================================== */

const WA_NUMBER = "6285933800533";
const STORAGE_PRODUCTS = "tdr_kasir_products";
const STORAGE_CART = "tdr_kasir_cart";
const STORAGE_TX = "tdr_kasir_transactions";

// ========== DEFAULT PRODUCTS ==========
const DEFAULT_PRODUCTS = [
  { id: "p1", name: "Joki Rank Glory", category: "Joki", price: 12000, stock: 999, image: "assets/JOKI.jpeg", desc: "Rp12.000 per bintang" },
  { id: "p2", name: "Joki Rank Immortal", category: "Joki", price: 15000, stock: 999, image: "assets/JOKI.jpeg", desc: "Rp15.000 per bintang" },
  { id: "p3", name: "Paket 10 Bintang Glory", category: "Joki", price: 120000, stock: 999, image: "assets/JOKI.jpeg", desc: "Bonus +2 bintang" },
  { id: "p4", name: "Paket 10 Bintang Immortal", category: "Joki", price: 150000, stock: 999, image: "assets/JOKI.jpeg", desc: "Bonus +2 bintang" },
  { id: "p5", name: "Akun MLBB Paket 100K", category: "Akun", price: 100000, stock: 10, image: "assets/JB.jpeg", desc: "Akun MLBB siap pakai" },
  { id: "p6", name: "Akun MLBB Paket 500K", category: "Akun", price: 500000, stock: 5, image: "assets/JB.jpeg", desc: "Akun MLBB premium" },
  { id: "p7", name: "Akun Free Fire 100K", category: "Akun", price: 100000, stock: 10, image: "assets/JB.jpeg", desc: "Akun Free Fire" },
  { id: "p8", name: "Akun Free Fire 300K", category: "Akun", price: 300000, stock: 5, image: "assets/JB.jpeg", desc: "Akun Free Fire premium" },
  { id: "p9", name: "Pulsa Rp15.000", category: "Pulsa", price: 15000, stock: 999, image: "assets/PAKET.JPEG", desc: "Semua operator" },
  { id: "p10", name: "Pulsa Rp20.000", category: "Pulsa", price: 20000, stock: 999, image: "assets/PAKET.JPEG", desc: "Semua operator" },
  { id: "p11", name: "Pulsa Rp25.000", category: "Pulsa", price: 25000, stock: 999, image: "assets/PAKET.JPEG", desc: "Semua operator" },
  { id: "p12", name: "Pulsa Rp50.000", category: "Pulsa", price: 50000, stock: 999, image: "assets/PAKET.JPEG", desc: "Semua operator" },
  { id: "p13", name: "Pulsa Rp100.000", category: "Pulsa", price: 100000, stock: 999, image: "assets/PAKET.JPEG", desc: "Semua operator" },
  { id: "p14", name: "Desain Basic", category: "Desain", price: 15000, stock: 999, image: "assets/DESAIN.jpeg", desc: "Desain sederhana" },
  { id: "p15", name: "Desain Standard", category: "Desain", price: 25000, stock: 999, image: "assets/DESAIN.jpeg", desc: "Desain standar" },
  { id: "p16", name: "Desain Premium", category: "Desain", price: 35000, stock: 999, image: "assets/DESAIN.jpeg", desc: "Desain premium" },
  { id: "p17", name: "Desain Pro", category: "Desain", price: 50000, stock: 999, image: "assets/DESAIN.jpeg", desc: "Desain profesional" },
  { id: "p18", name: "Desain Custom", category: "Desain", price: 75000, stock: 999, image: "assets/DESAIN.jpeg", desc: "Desain custom request" }
];

// ========== HELPERS ==========
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

function uid() {
  return "id_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show " + type;
  setTimeout(() => el.classList.remove("show"), 2500);
}

// ========== DATA LAYER ==========
function getProducts() {
  const raw = localStorage.getItem(STORAGE_PRODUCTS);
  if (!raw) {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return [...DEFAULT_PRODUCTS];
  }
  return JSON.parse(raw);
}

function saveProducts(list) {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(list));
}

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function getTransactions() {
  return JSON.parse(localStorage.getItem(STORAGE_TX) || "[]");
}

function saveTransactions(list) {
  localStorage.setItem(STORAGE_TX, JSON.stringify(list));
}

// ========== CLOCK ==========
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const mobileClock = document.getElementById("mobileClock");
  if (clockEl) clockEl.textContent = timeStr;
  if (dateEl) dateEl.textContent = dateStr;
  if (mobileClock) mobileClock.textContent = timeStr.slice(0, 5);
}

// ========== NAVIGATION ==========
function switchPage(page) {
  document.querySelectorAll(".nav-btn, .bottom-nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.page === page);
  });
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const pageEl = document.getElementById("page-" + page);
  if (pageEl) pageEl.classList.add("active");

  if (page === "produk") renderProductTable();
  if (page === "riwayat") renderHistory();
  if (page === "laporan") renderLaporan();
  if (page === "kasir") {
    renderProductGrid();
    renderCart();
  }

  // close mobile sidebar after navigate
  closeSidebar();
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.add("open");
  if (overlay) overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function initNav() {
  document.querySelectorAll(".nav-btn, .bottom-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (page) switchPage(page);
    });
  });

  const menuToggle = document.getElementById("menuToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const overlay = document.getElementById("sidebarOverlay");

  if (menuToggle) menuToggle.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);
}

// ========== KASIR: PRODUCT GRID ==========
function renderProductGrid() {
  const products = getProducts();
  const search = (document.getElementById("searchProduct").value || "").toLowerCase();
  const cat = document.getElementById("filterCategory").value;

  // populate category filter once
  const cats = [...new Set(products.map((p) => p.category))];
  const sel = document.getElementById("filterCategory");
  if (sel.options.length <= 1) {
    cats.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search) || (p.desc || "").toLowerCase().includes(search);
    const matchCat = !cat || p.category === cat;
    return matchSearch && matchCat;
  });

  const grid = document.getElementById("productGrid");
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">Tidak ada produk</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
    <div class="product-card ${p.stock <= 0 ? "out-of-stock" : ""}" data-id="${p.id}">
      <img src="${p.image || "assets/logo.jpeg"}" alt="${p.name}" onerror="this.src='assets/logo.jpeg'">
      <div class="info">
        <h3>${p.name}</h3>
        <div class="cat">${p.category}</div>
        <div class="price">${rupiah(p.price)}</div>
        <div class="stock">Stok: ${p.stock}</div>
      </div>
    </div>`
    )
    .join("");

  grid.querySelectorAll(".product-card:not(.out-of-stock)").forEach((card) => {
    card.onclick = () => addToCart(card.dataset.id);
  });
}

function addToCart(productId) {
  const products = getProducts();
  const p = products.find((x) => x.id === productId);
  if (!p || p.stock <= 0) {
    toast("Stok habis!", "error");
    return;
  }

  let cart = getCart();
  const existing = cart.find((x) => x.id === productId);
  if (existing) {
    if (existing.qty >= p.stock) {
      toast("Stok tidak cukup!", "error");
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category || "",
      qty: 1
    });
  }
  saveCart(cart);
  renderCart();
  toast(p.name + " ditambahkan");
}

// ========== KASIR: CART ==========
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  const payBtn = document.getElementById("payBtn");

  if (!cart.length) {
    container.innerHTML = `<div class="empty-cart">Keranjang masih kosong</div>`;
    document.getElementById("subtotal").textContent = rupiah(0);
    document.getElementById("adminFee").textContent = rupiah(0);
    document.getElementById("adminFeeRow").style.display = "none";
    document.getElementById("grandTotal").textContent = rupiah(0);
    payBtn.disabled = true;
    return;
  }

  container.innerHTML = cart
    .map(
      (item, i) => `
    <div class="cart-item">
      <img src="${item.image || "assets/logo.jpeg"}" alt="" onerror="this.src='assets/logo.jpeg'">
      <div class="detail">
        <h4>${item.name}</h4>
        <div class="meta">${rupiah(item.price)} × ${item.qty}</div>
      </div>
      <div class="qty-ctrl">
        <button data-action="minus" data-i="${i}">−</button>
        <span>${item.qty}</span>
        <button data-action="plus" data-i="${i}">+</button>
      </div>
      <button class="remove" data-i="${i}">✕</button>
    </div>`
    )
    .join("");

  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.i);
      const cart = getCart();
      if (btn.dataset.action === "plus") {
        const products = getProducts();
        const prod = products.find((p) => p.id === cart[i].id);
        if (prod && cart[i].qty >= prod.stock) {
          toast("Stok tidak cukup!", "error");
          return;
        }
        cart[i].qty += 1;
      } else {
        cart[i].qty -= 1;
        if (cart[i].qty <= 0) cart.splice(i, 1);
      }
      saveCart(cart);
      renderCart();
    };
  });

  container.querySelectorAll(".remove").forEach((btn) => {
    btn.onclick = () => {
      const cart = getCart();
      cart.splice(Number(btn.dataset.i), 1);
      saveCart(cart);
      renderCart();
    };
  });

  updateTotals();
  payBtn.disabled = false;
}

function updateTotals() {
  const cart = getCart();
  const products = getProducts();
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);

  // Biaya admin Rp2.000 jika ada produk kategori Pulsa di keranjang
  const hasPulsa = cart.some((item) => {
    if (item.category === "Pulsa") return true;
    const p = products.find((x) => x.id === item.id);
    return p && p.category === "Pulsa";
  });
  const adminFee = hasPulsa ? 2000 : 0;

  const discount = Math.max(0, Number(document.getElementById("discountInput").value) || 0);
  const total = Math.max(0, subtotal + adminFee - discount);

  document.getElementById("subtotal").textContent = rupiah(subtotal);
  document.getElementById("adminFee").textContent = rupiah(adminFee);
  document.getElementById("adminFeeRow").style.display = adminFee > 0 ? "flex" : "none";
  document.getElementById("grandTotal").textContent = rupiah(total);
  return { subtotal, adminFee, discount, total };
}

// ========== PEMBAYARAN ==========
function openPayModal() {
  const { total } = updateTotals();
  if (total <= 0 && getCart().length === 0) return;

  document.getElementById("payTotalDisplay").textContent = rupiah(total);
  document.getElementById("cashReceived").value = "";
  document.getElementById("changeAmount").textContent = rupiah(0);
  document.getElementById("payNote").value = "";
  document.querySelector('input[name="payMethod"][value="cash"]').checked = true;
  document.getElementById("cashPanel").classList.remove("hidden");
  document.getElementById("qrisPanel").classList.add("hidden");
  document.getElementById("payModal").classList.remove("hidden");
}

function confirmPayment() {
  const cart = getCart();
  if (!cart.length) return;

  const { subtotal, adminFee, discount, total } = updateTotals();
  const method = document.querySelector('input[name="payMethod"]:checked').value;
  const note = document.getElementById("payNote").value.trim();
  const cashReceived = Number(document.getElementById("cashReceived").value) || 0;

  if (method === "cash" && cashReceived < total) {
    toast("Uang diterima kurang!", "error");
    return;
  }

  // kurangi stok
  const products = getProducts();
  cart.forEach((item) => {
    const p = products.find((x) => x.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  });
  saveProducts(products);

  // simpan transaksi
  const tx = {
    id: "TRX-" + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    items: cart.map((x) => ({ ...x })),
    subtotal,
    adminFee: adminFee || 0,
    discount,
    total,
    method,
    cashReceived: method === "cash" ? cashReceived : 0,
    change: method === "cash" ? cashReceived - total : 0,
    note
  };

  const txs = getTransactions();
  txs.unshift(tx);
  saveTransactions(txs);

  // clear cart
  saveCart([]);
  renderCart();
  renderProductGrid();

  document.getElementById("payModal").classList.add("hidden");
  toast("Transaksi berhasil!");

  // tampilkan struk
  showReceipt(tx);
}

function showReceipt(tx) {
  const content = document.getElementById("receiptContent");
  const dateStr = new Date(tx.date).toLocaleString("id-ID");

  let itemsHtml = tx.items
    .map(
      (x) => `
    <div class="item-line">
      <span>${x.name} ×${x.qty}</span>
      <span>${rupiah(x.price * x.qty)}</span>
    </div>`
    )
    .join("");

  content.innerHTML = `
    <div class="receipt" id="printArea">
      <div class="center bold">TDR STORE</div>
      <div class="center">Jasa & Produk Digital</div>
      <div class="center" style="font-size:11px;margin-top:4px">WA: 0859-3380-0533</div>
      <hr>
      <div class="row"><span>No.</span><span>${tx.id}</span></div>
      <div class="row"><span>Tanggal</span><span>${dateStr}</span></div>
      <div class="row"><span>Metode</span><span>${tx.method === "qris" ? "QRIS" : "Cash"}</span></div>
      <hr>
      ${itemsHtml}
      <hr>
      <div class="row"><span>Subtotal</span><span>${rupiah(tx.subtotal)}</span></div>
      ${tx.adminFee > 0 ? `<div class="row"><span>Biaya Admin (Pulsa)</span><span>${rupiah(tx.adminFee)}</span></div>` : ""}
      ${tx.discount > 0 ? `<div class="row"><span>Diskon</span><span>-${rupiah(tx.discount)}</span></div>` : ""}
      <div class="row bold"><span>TOTAL</span><span>${rupiah(tx.total)}</span></div>
      ${
        tx.method === "cash"
          ? `<div class="row"><span>Bayar</span><span>${rupiah(tx.cashReceived)}</span></div>
             <div class="row"><span>Kembali</span><span>${rupiah(tx.change)}</span></div>`
          : ""
      }
      ${tx.note ? `<hr><div>Catatan: ${tx.note}</div>` : ""}
      <hr>
      <div class="center" style="margin-top:8px">Terima kasih!</div>
    </div>`;

  document.getElementById("receiptModal").classList.remove("hidden");
  document.getElementById("receiptModal").dataset.txId = tx.id;
}

// ========== MANAJEMEN PRODUK ==========
function renderProductTable() {
  const products = getProducts();
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = products
    .map(
      (p) => `
    <tr>
      <td><img class="thumb" src="${p.image || "assets/logo.jpeg"}" onerror="this.src='assets/logo.jpeg'"></td>
      <td><strong>${p.name}</strong><br><small style="color:var(--text-muted)">${p.desc || ""}</small></td>
      <td>${p.category}</td>
      <td>${rupiah(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn secondary btn-sm" data-edit="${p.id}">Edit</button>
        <button class="btn danger btn-sm" data-del="${p.id}">Hapus</button>
      </td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.onclick = () => openProductModal(btn.dataset.edit);
  });
  tbody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("Hapus produk ini?")) return;
      const list = getProducts().filter((p) => p.id !== btn.dataset.del);
      saveProducts(list);
      renderProductTable();
      toast("Produk dihapus");
    };
  });
}

function openProductModal(editId = null) {
  document.getElementById("productModalTitle").textContent = editId ? "Edit Produk" : "Tambah Produk";
  document.getElementById("editProductId").value = editId || "";

  if (editId) {
    const p = getProducts().find((x) => x.id === editId);
    if (!p) return;
    document.getElementById("prodName").value = p.name;
    document.getElementById("prodCategory").value = p.category;
    document.getElementById("prodPrice").value = p.price;
    document.getElementById("prodStock").value = p.stock;
    document.getElementById("prodImage").value = p.image || "";
    document.getElementById("prodDesc").value = p.desc || "";
  } else {
    document.getElementById("prodName").value = "";
    document.getElementById("prodCategory").value = "Joki";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodStock").value = "999";
    document.getElementById("prodImage").value = "";
    document.getElementById("prodDesc").value = "";
  }

  document.getElementById("productModal").classList.remove("hidden");
}

function saveProduct() {
  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("prodName").value.trim();
  const category = document.getElementById("prodCategory").value;
  const price = Number(document.getElementById("prodPrice").value) || 0;
  const stock = Number(document.getElementById("prodStock").value) || 0;
  const image = document.getElementById("prodImage").value.trim() || "assets/logo.jpeg";
  const desc = document.getElementById("prodDesc").value.trim();

  if (!name || price < 0) {
    toast("Nama dan harga wajib diisi!", "error");
    return;
  }

  let list = getProducts();
  if (id) {
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], name, category, price, stock, image, desc };
    }
  } else {
    list.push({ id: uid(), name, category, price, stock, image, desc });
  }
  saveProducts(list);
  document.getElementById("productModal").classList.add("hidden");
  renderProductTable();
  toast(id ? "Produk diperbarui" : "Produk ditambahkan");
}

// ========== RIWAYAT ==========
function renderHistory() {
  let txs = getTransactions();
  const filterDate = document.getElementById("filterDate").value;

  if (filterDate) {
    txs = txs.filter((t) => t.date.startsWith(filterDate));
  }

  const tbody = document.getElementById("historyTableBody");
  if (!txs.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">Belum ada transaksi</td></tr>`;
    return;
  }

  tbody.innerHTML = txs
    .map((t) => {
      const d = new Date(t.date).toLocaleString("id-ID");
      const itemCount = t.items.reduce((s, x) => s + x.qty, 0);
      return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${d}</td>
        <td>${itemCount} item</td>
        <td>${rupiah(t.total)}</td>
        <td><span class="badge ${t.method}">${t.method === "qris" ? "QRIS" : "Cash"}</span></td>
        <td><button class="btn secondary btn-sm" data-view="${t.id}">Lihat</button></td>
      </tr>`;
    })
    .join("");

  tbody.querySelectorAll("[data-view]").forEach((btn) => {
    btn.onclick = () => {
      const tx = getTransactions().find((t) => t.id === btn.dataset.view);
      if (tx) showReceipt(tx);
    };
  });
}

// ========== LAPORAN ==========
function renderLaporan() {
  const txs = getTransactions();
  const today = new Date().toISOString().slice(0, 10);

  const todayTxs = txs.filter((t) => t.date.startsWith(today));
  const todayTotal = todayTxs.reduce((s, t) => s + t.total, 0);
  const allTotal = txs.reduce((s, t) => s + t.total, 0);

  document.getElementById("statToday").textContent = rupiah(todayTotal);
  document.getElementById("statTodayCount").textContent = todayTxs.length;
  document.getElementById("statAll").textContent = rupiah(allTotal);
  document.getElementById("statAllCount").textContent = txs.length;

  // top products
  const map = {};
  txs.forEach((t) => {
    t.items.forEach((item) => {
      if (!map[item.name]) map[item.name] = { qty: 0, revenue: 0 };
      map[item.name].qty += item.qty;
      map[item.name].revenue += item.price * item.qty;
    });
  });

  const sorted = Object.entries(map)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 10);

  const tbody = document.getElementById("topProductsBody");
  if (!sorted.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:24px">Belum ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = sorted
    .map(
      ([name, data]) => `
    <tr>
      <td>${name}</td>
      <td>${data.qty}</td>
      <td>${rupiah(data.revenue)}</td>
    </tr>`
    )
    .join("");
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);

  initNav();
  renderProductGrid();
  renderCart();

  // search & filter
  document.getElementById("searchProduct").addEventListener("input", renderProductGrid);
  document.getElementById("filterCategory").addEventListener("change", renderProductGrid);

  // discount
  document.getElementById("discountInput").addEventListener("input", updateTotals);

  // clear cart
  document.getElementById("clearCartBtn").onclick = () => {
    if (!getCart().length) return;
    if (confirm("Kosongkan keranjang?")) {
      saveCart([]);
      renderCart();
    }
  };

  // pay
  document.getElementById("payBtn").onclick = openPayModal;

  // pay method toggle
  document.querySelectorAll('input[name="payMethod"]').forEach((r) => {
    r.onchange = () => {
      const isCash = r.value === "cash" && r.checked;
      document.getElementById("cashPanel").classList.toggle("hidden", !isCash);
      document.getElementById("qrisPanel").classList.toggle("hidden", isCash);
    };
  });

  // cash change calculator
  document.getElementById("cashReceived").addEventListener("input", () => {
    const { total } = updateTotals();
    const received = Number(document.getElementById("cashReceived").value) || 0;
    document.getElementById("changeAmount").textContent = rupiah(Math.max(0, received - total));
  });

  document.getElementById("confirmPayBtn").onclick = confirmPayment;

  // product modal
  document.getElementById("addProductBtn").onclick = () => openProductModal();
  document.getElementById("saveProductBtn").onclick = saveProduct;

  // close modals
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.onclick = () => document.getElementById(btn.dataset.close).classList.add("hidden");
  });

  // click outside modal
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  // print receipt
  document.getElementById("printReceiptBtn").onclick = () => window.print();

  // WA receipt
  document.getElementById("waReceiptBtn").onclick = () => {
    const txId = document.getElementById("receiptModal").dataset.txId;
    const tx = getTransactions().find((t) => t.id === txId);
    if (!tx) return;

    let msg = `*STRUK TDR STORE*%0A`;
    msg += `No: ${tx.id}%0A`;
    msg += `Tanggal: ${new Date(tx.date).toLocaleString("id-ID")}%0A%0A`;
    tx.items.forEach((x, i) => {
      msg += `${i + 1}. ${x.name} x${x.qty} = ${rupiah(x.price * x.qty)}%0A`;
    });
    msg += `%0ASubtotal: ${rupiah(tx.subtotal)}%0A`;
    if (tx.adminFee) msg += `Biaya Admin (Pulsa): ${rupiah(tx.adminFee)}%0A`;
    if (tx.discount) msg += `Diskon: -${rupiah(tx.discount)}%0A`;
    msg += `*TOTAL: ${rupiah(tx.total)}*%0A`;
    msg += `Metode: ${tx.method === "qris" ? "QRIS" : "Cash"}%0A`;
    if (tx.note) msg += `Catatan: ${tx.note}%0A`;
    msg += `%0ATerima kasih!`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  // history filter
  document.getElementById("filterDate").addEventListener("change", renderHistory);
  document.getElementById("clearFilterDate").onclick = () => {
    document.getElementById("filterDate").value = "";
    renderHistory();
  };

  // chatbot
  initChatbot();
});

/* ========== CHATBOT (AI-like) ========== */
function formatProductList(products, limit) {
  const list = (products || []).slice(0, limit || 20);
  if (!list.length) return "Belum ada produk.";
  return list.map(p => `• <b>${p.name}</b> — ${rupiah(p.price)} <small>(${p.category}, stok ${p.stock})</small>`).join("<br>");
}

function searchProducts(query) {
  const q = (query || "").toLowerCase();
  return getProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category || "").toLowerCase().includes(q) ||
    (p.desc || "").toLowerCase().includes(q)
  );
}

function productsByCategory(cat) {
  const c = (cat || "").toLowerCase();
  return getProducts().filter(p => (p.category || "").toLowerCase() === c);
}

function buildHargaReply() {
  const products = getProducts();
  const cats = {};
  products.forEach(p => {
    const c = p.category || "Lainnya";
    if (!cats[c]) cats[c] = [];
    cats[c].push(p);
  });
  let html = `📋 <b>Daftar harga terkini TDR Store</b><br><br>`;
  Object.keys(cats).forEach(cat => {
    html += `<b>${cat}</b><br>`;
    cats[cat].forEach(p => {
      html += `• ${p.name} — <b>${rupiah(p.price)}</b>${p.stock <= 0 ? " <small>(habis)</small>" : ""}<br>`;
    });
    html += `<br>`;
  });
  html += `<i>Order Pulsa dikenakan biaya admin Rp2.000.</i>`;
  return html;
}

function buildProdukReply() {
  const products = getProducts();
  const cats = [...new Set(products.map(p => p.category))];
  return `📦 <b>Produk & layanan yang tersedia</b><br><br>` +
    cats.map(c => {
      const items = products.filter(p => p.category === c);
      return `<b>${c}</b> (${items.length} item)<br>` + items.slice(0, 6).map(p => `• ${p.name} — ${rupiah(p.price)}`).join("<br>");
    }).join("<br><br>") +
    `<br><br>Ketik nama produk untuk cek detail/harga, atau pilih di halaman <b>Kasir</b>.`;
}

function getBotReply(text) {
  const raw = (text || "").trim();
  const lower = raw.toLowerCase();

  // Greeting
  if (/^(halo|hai|hi|hello|selamat\s*(pagi|siang|sore|malam)?|assalamualaikum|permisi)\b/.test(lower)) {
    return `Halo! 👋 Saya asisten <b>TDR Store</b>.<br><br>Bisa tanya apa saja soal produk, harga, cara order, pembayaran, joki, pulsa, akun, desain, stok, dll.<br>Contoh: <i>"harga joki glory berapa?"</i> atau <i>"cara bayar qris"</i>.`;
  }

  // Thanks
  if (/terima\s*kasih|makasih|thanks|thank you|thx/.test(lower)) {
    return `Sama-sama! 😊 Kalau masih ada pertanyaan, silakan ketik saja.`;
  }

  // WhatsApp / admin contact
  if (/\b(wa|whatsapp|admin|cs|customer\s*service|hubungi|kontak|chat\s*admin)\b/.test(lower)) {
    return `Admin siap bantu via WhatsApp: <b>0859-3380-0533</b>.<br>Klik tombol <b>Chat Admin</b> di bawah untuk langsung terhubung, atau ketik pertanyaan di sini dulu.`;
  }

  // How to order
  if (/(cara\s*(order|pesan|beli)|bagaimana\s*(order|pesan|beli)|gimana\s*(order|pesan|beli)|proses\s*order|langkah)/.test(lower)) {
    return `📋 <b>Cara order di Web Kasir</b><br><br>
1. Buka halaman <b>Kasir</b><br>
2. Klik produk yang diinginkan (bisa cari di kolom pencarian)<br>
3. Atur jumlah di keranjang<br>
4. (Opsional) isi diskon<br>
5. Klik <b>Bayar</b> → pilih <b>Cash</b> atau <b>QRIS</b><br>
6. Konfirmasi → struk muncul (bisa cetak / kirim WA)<br><br>
Kalau mau dibantu admin langsung, klik <b>Chat Admin</b>.`;
  }

  // Payment
  if (/(bayar|pembayaran|payment|qris|cash|tunai|transfer|metode\s*bayar)/.test(lower)) {
    return `💳 <b>Metode pembayaran</b><br><br>
• <b>Cash</b> — bayar tunai, kembalian dihitung otomatis<br>
• <b>QRIS</b> — scan QR yang muncul di layar kasir<br><br>
Setelah bayar, struk otomatis muncul dan bisa dikirim ke WhatsApp.<br>
Catatan: order <b>Pulsa</b> kena <b>biaya admin Rp2.000</b>.`;
  }

  // Admin fee specifically
  if (/(biaya\s*admin|admin\s*fee|kena\s*admin|tambahan\s*admin)/.test(lower)) {
    return `Biaya admin <b>Rp2.000</b> hanya dikenakan jika di keranjang ada produk kategori <b>Pulsa</b>.<br>Produk lain (joki, akun, desain) <b>tidak</b> kena biaya admin.`;
  }

  // Stock
  if (/(stok|stock|tersedia|ada\s*barang|masih\s*ada)/.test(lower)) {
    const found = searchProducts(lower.replace(/stok|stock|tersedia|ada|masih|berapa|gak|tidak|ga/g, " ").trim());
    if (found.length) {
      return `📦 <b>Info stok</b><br><br>` + found.slice(0, 10).map(p =>
        `• <b>${p.name}</b> — stok <b>${p.stock}</b> · ${rupiah(p.price)}`
      ).join("<br>");
    }
    return `Stok bisa dicek di setiap kartu produk di halaman <b>Kasir</b>, atau di menu <b>Produk</b>. Stok otomatis berkurang setelah transaksi berhasil.<br><br>Ketik nama produk untuk cek stok spesifik, contoh: <i>"stok pulsa 50"</i>.`;
  }

  // Hours / open
  if (/(jam\s*(buka|operasional)|kapan\s*buka|buka\s*jam|hari\s*apa)/.test(lower)) {
    return `TDR Store melayani <b>setiap hari</b>. Order lewat Web Kasir bisa kapan saja. Untuk chat admin WhatsApp: <b>0859-3380-0533</b> (biasanya respon cepat).`;
  }

  // Discount / promo
  if (/(diskon|promo|potongan|voucher|kupon)/.test(lower)) {
    return `Di keranjang ada kolom <b>Diskon</b> yang bisa diisi manual (dalam Rupiah) sebelum bayar.<br>Untuk promo spesial / kode voucher, tanyakan langsung ke admin via WhatsApp ya.`;
  }

  // Receipt
  if (/(struk|nota|receipt|invoice)/.test(lower)) {
    return `Setelah transaksi sukses, struk otomatis muncul. Dari situ kamu bisa:<br>• <b>Cetak</b> struk<br>• <b>Kirim WA</b> ke admin/pembeli<br><br>Semua transaksi juga tersimpan di menu <b>Riwayat</b>.`;
  }

  // Joki specific
  if (/(joki|rank|bintang|glory|immortal|push\s*rank)/.test(lower)) {
    const joki = productsByCategory("Joki");
    if (joki.length) {
      return `🎮 <b>Jasa Joki Mobile Legends</b><br><br>` +
        joki.map(p => `• <b>${p.name}</b> — ${rupiah(p.price)}${p.desc ? ` <small>(${p.desc})</small>` : ""}`).join("<br>") +
        `<br><br>Order 10 bintang biasanya dapat bonus. Mau order? Pilih di Kasir atau chat admin.`;
    }
    return `Kami menyediakan jasa joki ML (Glory & Immortal). Cek harga di halaman Kasir atau ketik <i>"harga joki"</i>.`;
  }

  // Pulsa specific
  if (/(pulsa|kuota|isi\s*pulsa)/.test(lower)) {
    const pulsa = productsByCategory("Pulsa");
    return `📱 <b>Jasa Pulsa</b> (semua operator)<br><br>` +
      (pulsa.length ? pulsa.map(p => `• ${p.name} — <b>${rupiah(p.price)}</b>`).join("<br>") : "Cek di Kasir untuk nominal tersedia.") +
      `<br><br>⚠️ Setiap order pulsa dikenakan <b>biaya admin Rp2.000</b>.<br>Contoh: Pulsa 50rb → total <b>Rp52.000</b>.`;
  }

  // Akun specific
  if (/(akun|mlbb|mobile\s*legends|free\s*fire|\bff\b)/.test(lower) && !/joki|rank|bintang/.test(lower)) {
    const akun = productsByCategory("Akun");
    return `👤 <b>Jual Akun Game</b><br><br>` +
      (akun.length ? akun.map(p => `• <b>${p.name}</b> — ${rupiah(p.price)} · stok ${p.stock}`).join("<br>") : "Cek di halaman Kasir.") +
      `<br><br>Akun siap pakai. Stok terbatas.`;
  }

  // Desain specific
  if (/(desain|design|logo|banner|thumbnail)/.test(lower)) {
    const desain = productsByCategory("Desain");
    return `🎨 <b>Jasa Desain</b><br><br>` +
      (desain.length ? desain.map(p => `• <b>${p.name}</b> — ${rupiah(p.price)}`).join("<br>") : "Cek di halaman Kasir.") +
      `<br><br>Cocok untuk logo, banner, komunitas, brand. Detail request bisa dibahas dengan admin.`;
  }

  // Price / list all prices
  if (/(harga|price|berapa|list\s*harga|daftar\s*harga|pricelist|price\s*list)/.test(lower)) {
    // try find specific product
    const cleaned = lower
      .replace(/harga|price|berapa|ya|sih|dong|kak|min|gan|bang|tolong|cek|untuk|yang|ini|itu/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned.length >= 2) {
      const found = searchProducts(cleaned);
      if (found.length === 1) {
        const p = found[0];
        return `💰 <b>${p.name}</b><br>Harga: <b>${rupiah(p.price)}</b><br>Kategori: ${p.category}<br>Stok: ${p.stock}${p.desc ? `<br>${p.desc}` : ""}${p.category === "Pulsa" ? `<br><br><i>+ biaya admin Rp2.000</i>` : ""}`;
      }
      if (found.length > 1 && found.length <= 12) {
        return `Hasil pencarian harga:<br><br>` + found.map(p =>
          `• <b>${p.name}</b> — ${rupiah(p.price)} <small>(${p.category})</small>`
        ).join("<br>");
      }
    }
    return buildHargaReply();
  }

  // Product list
  if (/(produk|layanan|jual\s*apa|ada\s*apa|menu|katalog|catalog)/.test(lower)) {
    return buildProdukReply();
  }

  // Generic product search: if message looks like a product name
  const found = searchProducts(lower);
  if (found.length === 1) {
    const p = found[0];
    return `📦 <b>${p.name}</b><br>Harga: <b>${rupiah(p.price)}</b><br>Kategori: ${p.category}<br>Stok: ${p.stock}${p.desc ? `<br>Ket: ${p.desc}` : ""}${p.category === "Pulsa" ? `<br><br>Order pulsa + admin Rp2.000` : ""}<br><br>Mau order? Pilih di halaman Kasir.`;
  }
  if (found.length > 1 && found.length <= 10) {
    return `Saya menemukan beberapa produk terkait:<br><br>` + found.map(p =>
      `• <b>${p.name}</b> — ${rupiah(p.price)} <small>(${p.category}, stok ${p.stock})</small>`
    ).join("<br>") + `<br><br>Ketik nama lebih spesifik, atau order langsung di Kasir.`;
  }

  // Fallback — still helpful, AI-like
  return `Saya belum yakin maksud pertanyaanmu 🙏<br><br>
Coba tanya seperti ini:<br>
• <i>"harga joki glory"</i><br>
• <i>"pulsa 50rb berapa totalnya?"</i><br>
• <i>"cara order"</i> / <i>"bisa bayar qris?"</i><br>
• <i>"stok akun mlbb"</i><br>
• <i>"daftar produk"</i><br><br>
Atau klik tombol cepat di bawah. Untuk bantuan langsung, ketik <b>admin</b> atau klik <b>Chat Admin</b>.`;
}

const QUICK_LABELS = {
  harga: "Cek Harga",
  produk: "Daftar Produk",
  cara: "Cara Order",
  bayar: "Pembayaran",
  joki: "Joki ML",
  pulsa: "Pulsa",
  wa: "Chat Admin"
};

function addBotMsg(html) {
  const box = document.getElementById("chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "bot-msg";
  div.innerHTML = html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function addUserMsg(text) {
  const box = document.getElementById("chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "user-msg";
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function handleBotQuery(key, customText) {
  if (key === "wa") {
    addUserMsg("Chat Admin");
    addBotMsg("Menghubungkan ke WhatsApp admin... 🚀");
    setTimeout(() => {
      window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo TDR Store, saya ingin bertanya.")}`,
        "_blank"
      );
    }, 500);
    return;
  }

  if (customText) {
    addUserMsg(customText);
    const reply = getBotReply(customText);
    setTimeout(() => addBotMsg(reply), 280);
    return;
  }

  // quick buttons mapped to natural queries
  const quickMap = {
    harga: "daftar harga",
    produk: "daftar produk",
    cara: "cara order",
    bayar: "cara pembayaran",
    joki: "info joki ml",
    pulsa: "info pulsa"
  };
  const text = quickMap[key] || key;
  addUserMsg(QUICK_LABELS[key] || key);
  setTimeout(() => addBotMsg(getBotReply(text)), 280);
}

function initChatbot() {
  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");

  if (!toggle || !box) return;

  toggle.onclick = () => box.classList.toggle("hidden");
  closeBtn.onclick = () => box.classList.add("hidden");

  document.querySelectorAll(".chatbot-quick button").forEach((btn) => {
    btn.onclick = () => handleBotQuery(btn.dataset.q);
  });

  function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleBotQuery(null, text);
  }

  sendBtn.onclick = send;
  input.onkeydown = (e) => {
    if (e.key === "Enter") send();
  };
}
