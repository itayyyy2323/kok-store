/**
 * KOK – King of Kits | Discount Popup Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('discountPopup');
  const closeBtn = document.getElementById('closeDiscountBtn');
  const skipBtn = document.getElementById('skipDiscountBtn');
  const form = document.getElementById('discountForm');
  const emailInput = document.getElementById('discountEmail');
  
  const formContainer = document.getElementById('discountFormContainer');
  const successContainer = document.getElementById('discountSuccessContainer');
  const applyBtn = document.getElementById('applyDiscountBtn');

  if (!popup) return;

  // Check if we should show the popup
  const hasShown = localStorage.getItem('kok_popup_shown');
  const hasDiscount = localStorage.getItem('kok_applied_discount');

  if (!hasShown && !hasDiscount) {
    // Show after 5 seconds
    setTimeout(() => {
      popup.classList.add('active');
    }, 5000);
  }

  function closePopup() {
    popup.classList.remove('active');
    localStorage.setItem('kok_popup_shown', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (skipBtn) skipBtn.addEventListener('click', closePopup);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      
      if (!validateEmail(email)) {
        showToast('נא להזין כתובת אימייל תקינה', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'שולח...';
      submitBtn.disabled = true;

      try {
        // We call the discount API to validate and save email
        const res = await apiFetch('/api/discount', {
          method: 'POST',
          body: JSON.stringify({ code: 'KOK10', email })
        });

        // Show success state
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
        
      } catch (error) {
        showToast('אירעה שגיאה, אנא נסה שוב', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Set the discount globally via cart.js function
      if (typeof applyDiscount === 'function') {
        applyDiscount('KOK10');
        showToast('הקוד הוחל בהצלחה! תוכל לראות אותו בסל הקניות.', 'success');
      }
      closePopup();
    });
  }
});
