const products = [
  {
    id: 1,
    name: "Kemeja Linen Oversize — Warm Sand",
    category: "kemeja",
    categoryLabel: "Kemeja & Blouse",
    price: 89000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Kemeja potongan longgar bahan linen rayon yang adem, cocok untuk kerja atau kuliah."
  },
  {
    id: 2,
    name: "Blouse Puff Sleeve — Rosewood",
    category: "kemeja",
    categoryLabel: "Kemeja & Blouse",
    price: 79000,
    image: "https://images.unsplash.com/photo-1564257631407-4deb25f9c8e7?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Blouse lengan puff manis dengan bahan jatuh yang rapi dan tidak mudah kusut."
  },
  {
    id: 3,
    name: "Midi Dress Polos — Sage",
    category: "dress",
    categoryLabel: "Dress & Tunik",
    price: 115000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Dress panjang dengan potongan nyaman untuk acara santai maupun semi-formal."
  },
  {
    id: 4,
    name: "Tunik Kancing Depan — Ivory",
    category: "dress",
    categoryLabel: "Dress & Tunik",
    price: 95000,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Tunik simpel dengan bukaan kancing depan yang praktis dan mudah dipadukan dengan celana."
  },
  {
    id: 5,
    name: "Knit Cardigan Crop — Midnight Navy",
    category: "outer",
    categoryLabel: "Outer & Cardigan",
    price: 85000,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Cardigan rajut halus yang ringan sebagai luaran kaus, tank top, atau dress."
  },
  {
    id: 6,
    name: "Outer Vest Rajut — Mocca",
    category: "outer",
    categoryLabel: "Outer & Cardigan",
    price: 75000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    marketplaceUrl: "https://shopee.co.id",
    desc: "Vest tanpa lengan untuk memberi sentuhan layering yang modis pada outfit harian."
  }
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80";
const MARKETPLACE_STORE_URL = "https://shopee.co.id";

let activeCategory = "all";
let searchQuery = "";
let cart = [];

const productGrid = document.getElementById("productGrid");
const filterBar = document.getElementById("filterBar");
const searchInput = document.getElementById("searchInput");
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutMarketplaceBtn = document.getElementById("checkoutMarketplaceBtn");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const toastEl = document.getElementById("toast");

document.getElementById("year").textContent = new Date().getFullYear();

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function renderProducts() {
  const filtered = products.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1 / -1; color: var(--muted);">Produk baju tidak ditemukan.</p>`;
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (item) => `
      <article class="product-card">
        <div class="product-thumb">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          />
          <span>Silver P Mareta</span>
        </div>
        <div class="product-body">
          <span class="product-cat">${item.categoryLabel}</span>
          <h3 class="product-title">${item.name}</h3>
          <p class="product-desc">${item.desc}</p>
          <div class="product-footer">
            <span class="product-price">${formatRupiah(item.price)}</span>
            <button class="btn btn-primary add-btn" onclick="addToCart(${item.id})">+ Keranjang</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`"${product.name}" ditambahkan ke keranjang`);
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = formatRupiah(totalPrice);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Keranjang masih kosong.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-sub">${formatRupiah(item.price)} x ${item.qty}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderProducts();
});

openCartBtn.addEventListener("click", () => cartModal.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartModal.classList.remove("open"));
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.classList.remove("open");
});

checkoutMarketplaceBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Pilih baju terlebih dahulu sebelum checkout ke marketplace");
    return;
  }

  const targetUrl = cart[0].marketplaceUrl || MARKETPLACE_STORE_URL;
  showToast("Mengarahkan ke halaman marketplace...");
  window.open(targetUrl, "_blank", "noopener,noreferrer");
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

renderProducts();
updateCartUI();