/**
 * KOK – King of Kits | Homepage Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('featuredCarousel')) {
    loadFeaturedProducts();
    initCarousel('featuredCarousel', 'featuredPrev', 'featuredNext');
  }
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featuredCarousel');
  
  try {
    const data = await apiFetch('/api/products?featured=true&limit=8');
    
    if (data.products && data.products.length > 0) {
      container.innerHTML = data.products.map(kit => createProductCard(kit)).join('');
    } else {
      container.innerHTML = '<p class="text-center" style="width:100%;">אין מוצרים להצגה כרגע.</p>';
    }
  } catch (error) {
    container.innerHTML = '<p class="text-center" style="width:100%; color:var(--error);">שגיאה בטעינת מוצרים.</p>';
  }
}

function initCarousel(containerId, prevBtnId, nextBtnId) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  
  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 300; // Adjust based on card width + gap

  nextBtn.addEventListener('click', () => {
    // In RTL, "next" means scrolling left (negative)
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    // In RTL, "prev" means scrolling right (positive)
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Optional: Auto-hide buttons if not scrollable
  container.addEventListener('scroll', debounce(() => {
    // Note: scrollLeft is negative in RTL in some browsers, 0 in others, positive in others.
    // Modern browsers usually use negative values for RTL.
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const currentScroll = Math.abs(container.scrollLeft);
    
    prevBtn.style.opacity = currentScroll <= 5 ? '0.5' : '1';
    nextBtn.style.opacity = currentScroll >= maxScrollLeft - 5 ? '0.5' : '1';
  }, 100));
}
