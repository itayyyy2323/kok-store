/**
 * KOK – King of Kits | Utility Functions
 */
const API_BASE_URL = '';
/**
 * Pricing Rules
 * - kit.isWorldCupSpecial === true → 79.99 ILS
 * - kit.year >= 2022 → 69.99 ILS
 * - kit.year < 2022 → 79.99 ILS
 */
function getPrice(kit) {
  if (!kit) return 0;
  let basePrice = 79.99;
  
  if (kit.isWorldCupSpecial) {
    basePrice = 79.99;
  } else if (kit.year >= 2022) {
    basePrice = 69.99;
  }
  
  if (kit.customName || kit.customNumber) {
    basePrice += 10;
  }
  
  return basePrice;
}

/**
 * Format price in ILS
 */
function formatPrice(price) {
  return `₪${Number(price).toFixed(2)}`;
}

/**
 * Format date in Hebrew locale
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate product card HTML
 */
function createProductCard(kit) {
  const price = getPrice(kit);
  const imageUrl = kit.images && kit.images[0] ? `images/${kit.images[0]}` : null;
  
  // Create badges HTML
  let badgesHtml = '';
  if (kit.tags && kit.tags.length > 0) {
    kit.tags.forEach(tag => {
      let badgeClass = 'badge-new';
      if (tag === 'מונדיאל') badgeClass = 'badge-worldcup';
      if (tag === 'רטרו') badgeClass = 'badge-retro';
      if (tag === 'פופולרי') badgeClass = 'badge-featured';
      
      badgesHtml += `<span class="badge ${badgeClass}">${tag}</span>`;
    });
  } else if (kit.isWorldCupSpecial) {
    badgesHtml += `<span class="badge badge-worldcup">מונדיאל</span>`;
  }

  const imageHtml = imageUrl 
    ? `<img src="${imageUrl}" alt="${kit.name}" loading="lazy" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
       <div class="placeholder-fallback" style="display:none; background:var(--bg-secondary); width:100%; height:100%; align-items:center; justify-content:center; flex-direction:column;">
         <span style="font-size:3rem;">⚽</span>
         <span style="margin-top:10px; font-weight:bold; color:var(--text-muted);">${kit.team}</span>
       </div>`
    : `<div style="background:var(--bg-secondary); width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column;">
         <span style="font-size:3rem;">⚽</span>
         <span style="margin-top:10px; font-weight:bold; color:var(--text-muted);">${kit.team}</span>
       </div>`;

  return `
    <a href="product.html?id=${kit.id}" class="product-card" data-id="${kit.id}">
      <div class="product-card-image">
        ${imageHtml}
        <div class="product-card-badges">
          ${badgesHtml}
        </div>
        <div class="product-card-overlay hide-mobile">
          <button class="btn btn-add-cart" onclick="event.preventDefault(); window.location.href='product.html?id=${kit.id}'">
            בחר מידה
          </button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-card-team">${kit.team}</div>
        <h3 class="product-card-name">${kit.name}</h3>
        <div class="product-card-meta">
          <span class="product-card-type">${kit.typeName}</span>
          <span class="product-card-price">${formatPrice(price)}</span>
        </div>
      </div>
    </a>
  `;
}

/**
 * API Fetch Wrapper
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if checking admin endpoints
    if (endpoint.includes('/admin/')) {
      const token = localStorage.getItem('kok_admin_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'שגיאת רשת');
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Show Toast Notification
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '';
  switch (type) {
    case 'success':
      iconHtml = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      break;
    case 'error':
      iconHtml = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      break;
    case 'info':
      iconHtml = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      break;
    case 'warning':
      iconHtml = '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      break;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconHtml}</div>
    <div class="toast-content">
      <div class="toast-title">${type === 'success' ? 'הצלחה' : type === 'error' ? 'שגיאה' : 'הודעה'}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.4s reverse forwards';
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 400);
  }, 4000);
}

/**
 * Validation Helpers
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^05\d{8}$/;
  return re.test(phone.replace(/\D/g, ''));
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
