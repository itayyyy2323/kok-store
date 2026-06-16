/**
 * KOK – King of Kits | Cart Logic
 */

let cart = JSON.parse(localStorage.getItem('kok_cart')) || [];
let discountCode = localStorage.getItem('kok_applied_discount') || null;
const SHIPPING_COST = 15;
const FREE_SHIPPING_THRESHOLD = 199;

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initCartDrawer();
  
  // Expose global functions for inline handlers
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
});

function saveCart() {
  localStorage.setItem('kok_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawerItems();
  
  // If on cart or checkout page, re-render
  if (typeof renderCartPage === 'function') renderCartPage();
  if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('pulse');
      setTimeout(() => badge.classList.remove('pulse'), 300);
    }
  }
}

function addToCart(product, size, quantity = 1) {
  if (!size) {
    showToast('נא לבחור מידה', 'error');
    return false;
  }

  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === size);
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      team: product.team,
      league: product.league,
      year: product.year,
      type: product.type,
      isWorldCupSpecial: product.isWorldCupSpecial,
      size: size,
      quantity: quantity,
      image: product.images && product.images[0] ? product.images[0] : null
    });
  }

  saveCart();
  showToast('המוצר נוסף לעגלה בהצלחה!');
  openCartDrawer();
  return true;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQuantity(index, delta) {
  const newQty = cart[index].quantity + delta;
  if (newQty > 0 && newQty <= 10) {
    cart[index].quantity = newQty;
    saveCart();
  } else if (newQty === 0) {
    removeFromCart(index);
  }
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    return total + (getPrice(item) * item.quantity);
  }, 0);
}

function getShippingCost(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

function getDiscountAmount(subtotal) {
  if (discountCode === 'KOK10') {
    return subtotal * 0.10;
  }
  return 0;
}

function getCartTotal() {
  const subtotal = getCartSubtotal();
  const shipping = getShippingCost(subtotal);
  const discount = getDiscountAmount(subtotal);
  return Math.max(0, subtotal + shipping - discount);
}

function clearCart() {
  cart = [];
  localStorage.removeItem('kok_applied_discount');
  discountCode = null;
  saveCart();
}

function applyDiscount(code) {
  if (code === 'KOK10') {
    discountCode = code;
    localStorage.setItem('kok_applied_discount', code);
    saveCart();
    return true;
  }
  return false;
}

function removeDiscount() {
  discountCode = null;
  localStorage.removeItem('kok_applied_discount');
  saveCart();
}

/* Cart Drawer Logic */
function initCartDrawer() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('closeCartBtn');

  if (!cartBtn || !cartDrawer || !cartOverlay) return;

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });

  closeBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);
}

function openCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  
  if (cartDrawer && cartOverlay) {
    renderCartDrawerItems();
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCartDrawerItems() {
  const container = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>העגלה שלך ריקה</p>
        <button class="btn btn-primary mt-3" onclick="closeCartDrawer(); window.location.href='products.html'">המשך לקנות</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₪0.00';
    return;
  }

  container.innerHTML = cart.map((item, index) => {
    const price = getPrice(item);
    const imageUrl = item.image ? `images/${item.image}` : null;
    const imgHtml = imageUrl 
      ? `<img src="${imageUrl}" alt="${item.name}" loading="lazy">`
      : `<div class="placeholder-img" style="background:var(--bg-secondary); width:100%; height:100%; display:flex; align-items:center; justify-content:center;">⚽</div>`;

    return `
      <div class="cart-drawer-item">
        <div class="cart-drawer-item-img">
          ${imgHtml}
        </div>
        <div class="cart-drawer-item-info">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <h4 class="cart-drawer-item-name">${item.name}</h4>
            <button class="cart-drawer-item-remove" onclick="removeFromCart(${index})" aria-label="Remove">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="cart-drawer-item-meta">מידה: ${item.size}</div>
          <div class="cart-drawer-item-bottom">
            <div class="qty-control" style="transform: scale(0.85); transform-origin: right center;">
              <button onclick="updateQuantity(${index}, 1)">+</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${index}, -1)">-</button>
            </div>
            <div class="cart-drawer-item-price">${formatPrice(price)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(getCartSubtotal());
  }
}
