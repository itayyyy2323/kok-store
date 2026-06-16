/**
 * KOK – King of Kits | Product Detail Logic
 */

let currentProduct = null;
let selectedSize = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    loadProductDetails(productId);
  } else {
    window.location.href = 'products.html';
  }

  // Quantity controls
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyDisplay = document.getElementById('qtyDisplay');

  if (qtyPlus && qtyMinus && qtyDisplay) {
    qtyPlus.addEventListener('click', () => {
      if (currentQuantity < 10) {
        currentQuantity++;
        qtyDisplay.textContent = currentQuantity;
      }
    });

    qtyMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyDisplay.textContent = currentQuantity;
      }
    });
  }

  // Add to cart
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      
      const success = addToCart(currentProduct, selectedSize, currentQuantity);
      if (success) {
        // Track add to cart event
        if (window.trackEvent) {
          trackEvent('add_to_cart', { productId: currentProduct.id });
        }
      }
    });
  }
});

async function loadProductDetails(productId) {
  try {
    const data = await apiFetch(`/api/product/${productId}`);
    currentProduct = data.product;
    
    renderProductDetails(currentProduct);
    
    if (data.related && data.related.length > 0) {
      renderRelatedProducts(data.related.slice(0, 4));
    }

    // Track product view
    if (window.trackEvent) {
      trackEvent('product_view', { productId });
    }

  } catch (error) {
    document.getElementById('productContainer').innerHTML = `
      <div class="empty-state" style="padding: 100px 0;">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>המוצר לא נמצא</h3>
        <p>מצטערים, לא הצלחנו למצוא את המוצר שחיפשת.</p>
        <a href="products.html" class="btn btn-primary mt-3">חזרה לחנות</a>
      </div>
    `;
  }
}

function renderProductDetails(product) {
  document.title = `KOK | ${product.name}`;

  // Breadcrumbs
  const breadcrumbs = document.getElementById('productBreadcrumbs');
  if (breadcrumbs) {
    breadcrumbs.innerHTML = `
      <a href="index.html">ראשי</a>
      <span class="separator">/</span>
      <a href="products.html?league=${product.league}">${product.leagueName}</a>
      <span class="separator">/</span>
      <span style="color:var(--text-primary);">${product.name}</span>
    `;
  }

  // Badges
  const badgesContainer = document.getElementById('productBadges');
  if (badgesContainer) {
    let badgesHtml = '';
    if (product.tags && product.tags.length > 0) {
      product.tags.forEach(tag => {
        let badgeClass = 'badge-new';
        if (tag === 'מונדיאל') badgeClass = 'badge-worldcup';
        if (tag === 'רטרו') badgeClass = 'badge-retro';
        if (tag === 'פופולרי') badgeClass = 'badge-featured';
        badgesHtml += `<span class="badge ${badgeClass}">${tag}</span>`;
      });
    } else if (product.isWorldCupSpecial) {
      badgesHtml += `<span class="badge badge-worldcup">מונדיאל</span>`;
    }
    badgesContainer.innerHTML = badgesHtml;
  }

  // Basic info
  document.getElementById('productTeam').textContent = product.team;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productPrice').textContent = formatPrice(product.price);

  // Meta
  const metaContainer = document.getElementById('productMeta');
  if (metaContainer) {
    metaContainer.innerHTML = `
      <div class="product-info-meta-item">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        שנת ${product.year}
      </div>
      <div class="product-info-meta-item">
        <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        חולצת ${product.typeName}
      </div>
      <div class="product-info-meta-item" style="color:var(--success);">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        זמין במלאי
      </div>
    `;
  }

  // Images
  const mainImageContainer = document.getElementById('mainImageContainer');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  
  if (product.images && product.images.length > 0) {
    const mainImgUrl = `images/${product.images[0]}`;
    mainImageContainer.innerHTML = `<img src="${mainImgUrl}" alt="${product.name}" id="mainProductImage">`;
    
    // Add multiple thumbnails if they exist in a real scenario
    // Here we just duplicate the first one for demonstration of the UI
    if (product.images.length === 1) {
      // Create a few variations for visual completeness in this mockup
      const thumbHtml = `
        <div class="product-thumbnail active"><img src="${mainImgUrl}" alt="Thumb"></div>
        <div class="product-thumbnail"><div class="placeholder-img" style="background:var(--bg-secondary); width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:12px;">גב</div></div>
        <div class="product-thumbnail"><div class="placeholder-img" style="background:var(--bg-secondary); width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:12px;">תקריב</div></div>
      `;
      thumbnailsContainer.innerHTML = thumbHtml;
      
      // Add simple click handlers for thumbnails
      document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
          document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
        });
      });
    }
  } else {
    mainImageContainer.innerHTML = `<div class="placeholder-img" style="font-size:100px;">⚽</div>`;
  }

  // Sizes
  const sizeSelector = document.getElementById('sizeSelector');
  const selectedSizeText = document.getElementById('selectedSizeText');
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  if (sizeSelector && product.sizes) {
    sizeSelector.innerHTML = product.sizes.map(size => 
      `<button class="size-pill" data-size="${size}">${size}</button>`
    ).join('');

    sizeSelector.querySelectorAll('.size-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all
        sizeSelector.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        e.target.classList.add('active');
        
        // Update state
        selectedSize = e.target.dataset.size;
        selectedSizeText.textContent = selectedSize;
        
        // Enable Add to Cart button
        if (addToCartBtn) {
          addToCartBtn.removeAttribute('disabled');
        }
      });
    });
  }
}

function renderRelatedProducts(products) {
  const grid = document.getElementById('relatedProductsGrid');
  if (grid) {
    if (products.length > 0) {
      grid.innerHTML = products.map(kit => createProductCard(kit)).join('');
    } else {
      document.querySelector('.related-products').style.display = 'none';
    }
  }
}
