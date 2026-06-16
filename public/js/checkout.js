/**
 * KOK – King of Kits | Checkout Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutSummary();
  initFormValidation();
});

function renderCheckoutSummary() {
  const list = document.getElementById('checkoutItemsList');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const discountContainer = document.getElementById('checkoutDiscountContainer');
  const totalEl = document.getElementById('checkoutTotal');

  if (!list) return;

  list.innerHTML = cart.map(item => {
    const imageUrl = item.image ? `images/${item.image}` : null;
    const imgHtml = imageUrl 
      ? `<img src="${imageUrl}" alt="${item.name}">`
      : `<div class="placeholder-img" style="background:var(--bg-secondary); width:100%; height:100%; display:flex; align-items:center; justify-content:center;">⚽</div>`;

    const customizationText = (item.customName || item.customNumber) 
      ? `<div style="color:var(--accent); font-size: 0.85rem; margin-top: 2px;">הדפסה: ${item.customName || ''} ${item.customNumber || ''}</div>` 
      : '';

    return `
      <div style="display: flex; gap: 15px; margin-bottom: 15px;">
        <div style="width: 60px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background: var(--bg-secondary);">
          ${imgHtml}
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 0.95rem; margin-bottom: 5px;">${item.name}</h4>
          <div style="color: var(--text-secondary); font-size: 0.85rem;">מידה: ${item.size} | כמות: ${item.quantity}</div>
          ${customizationText}
        </div>
        <div style="font-weight: 600;">${formatPrice(getPrice(item) * item.quantity)}</div>
      </div>
    `;
  }).join('');

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost(subtotal);
  const discount = getDiscountAmount(subtotal);
  const total = getCartTotal();

  subtotalEl.textContent = formatPrice(subtotal);
  
  if (shipping === 0) {
    shippingEl.innerHTML = '<span style="color:var(--success);">חינם</span>';
  } else {
    shippingEl.textContent = formatPrice(shipping);
  }

  if (discount > 0) {
    discountContainer.innerHTML = `
      <div class="order-summary-row discount">
        <span class="label">הנחה (${discountCode})</span>
        <span class="value">-${formatPrice(discount)}</span>
      </div>
    `;
  } else {
    discountContainer.innerHTML = '';
  }

  totalEl.textContent = formatPrice(total);
}

function initFormValidation() {
  const validateBtn = document.getElementById('validateFormBtn');
  const paymentSection = document.getElementById('paymentSection');
  const form = document.getElementById('checkoutForm');

  if (!validateBtn || !form) return;

  validateBtn.addEventListener('click', () => {
    // Basic HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const phone = document.getElementById('phone').value;
    if (!validatePhone(phone)) {
      showToast('מספר טלפון לא תקין', 'error');
      document.getElementById('phone').focus();
      return;
    }

    // Validation passed, show payment section
    document.getElementById('validationBtnContainer').style.display = 'none';
    paymentSection.style.opacity = '1';
    paymentSection.style.pointerEvents = 'auto';
    
    // Init PayPal
    initPayPal();
    
    // Scroll to payment
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initPayPal() {
  const container = document.getElementById('paypal-button-container');
  if (!container || container.innerHTML.trim() !== '') return; // Already initialized

  const total = getCartTotal().toFixed(2);

  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: 'ILS',
            value: total
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        handlePaymentSuccess(details);
      });
    },
    onCancel: function(data) {
      showToast('התשלום בוטל', 'info');
    },
    onError: function(err) {
      console.error('PayPal Error:', err);
      showToast('שגיאה בתהליך התשלום. אנא נסה שוב.', 'error');
    }
  }).render('#paypal-button-container');
}

async function handlePaymentSuccess(paypalDetails) {
  showToast('התשלום בוצע בהצלחה! מעבד הזמנה...', 'success');
  
  const customer = {
    name: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    zip: document.getElementById('zip').value,
    notes: document.getElementById('notes').value
  };

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost(subtotal);
  const discount = getDiscountAmount(subtotal);
  const total = getCartTotal();

  const items = cart.map(item => ({
    id: item.id,
    name: item.name,
    size: item.size,
    quantity: item.quantity,
    price: getPrice(item)
  }));

  const orderData = {
    customer,
    items,
    subtotal,
    shipping,
    discount,
    discountCode: discountCode || null,
    total,
    paypalTransactionId: paypalDetails.id
  };

  try {
    const res = await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    if (res.success) {
      // Track purchase
      if (window.trackEvent) {
        trackEvent('purchase', { orderId: res.orderId, value: total });
      }
      
      // Store current order for the thank you page
      localStorage.setItem('kok_last_order', JSON.stringify({
        orderId: res.orderId,
        date: new Date().toISOString(),
        ...orderData
      }));

      // Clear cart
      clearCart();

      // Redirect to thank you
      window.location.href = `thank-you.html?orderId=${res.orderId}`;
    } else {
      throw new Error(res.error || 'שגיאה בשמירת הזמנה');
    }
  } catch (error) {
    showToast('שגיאה בשמירת ההזמנה במערכת. אנא צור קשר עם שירות הלקוחות.', 'error');
    console.error(error);
  }
}
