/**
 * KOK – King of Kits | Products Listing Logic
 */

let currentFilters = {
  league: '',
  type: '',
  worldcup: '',
  retro: '',
  sort: 'featured',
  page: 1,
  limit: 24
};

let totalPages = 1;
let allProductsLoaded = [];

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initFilterUI();
  loadProducts(true);

  // Mobile filters toggle
  const openBtn = document.getElementById('openFiltersBtn');
  const closeBtn = document.getElementById('closeFiltersBtn');
  const sidebar = document.getElementById('filterSidebar');

  if (openBtn && closeBtn && sidebar) {
    openBtn.addEventListener('click', () => sidebar.classList.add('active'));
    closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  // Load More btn
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentFilters.page++;
      loadProducts(false);
    });
  }
});

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('league')) currentFilters.league = params.get('league');
  if (params.has('type')) currentFilters.type = params.get('type');
  if (params.has('worldcup')) currentFilters.worldcup = params.get('worldcup');
  if (params.has('retro')) currentFilters.retro = params.get('retro');
  
  updatePageTitle();
}

function updatePageTitle() {
  let title = 'כל החולצות';
  
  if (currentFilters.retro === 'true') {
    title = 'קולקציית רטרו';
  } else if (currentFilters.worldcup === 'true') {
    title = 'מונדיאל';
  } else if (currentFilters.league) {
    const leagueNames = {
      'premier-league': 'פרמייר ליג',
      'la-liga': 'לה ליגה',
      'serie-a': 'סריה A',
      'bundesliga': 'בונדסליגה',
      'ligue-1': 'ליג 1'
    };
    title = leagueNames[currentFilters.league] || title;
  }

  const breadcrumb = document.getElementById('breadcrumbCurrent');
  if (breadcrumb) breadcrumb.textContent = title;
  document.title = `KOK – King of Kits | ${title}`;
}

function initFilterUI() {
  // Set initial input states based on URL params
  document.querySelectorAll('input[name="league"]').forEach(radio => {
    radio.checked = radio.value === currentFilters.league;
    radio.addEventListener('change', (e) => {
      // Clear worldcup/retro if league selected
      if (e.target.value) {
        document.querySelector('input[name="worldcup"]').checked = false;
        document.querySelector('input[name="retro"]').checked = false;
        currentFilters.worldcup = '';
        currentFilters.retro = '';
      }
      currentFilters.league = e.target.value;
      resetAndLoad();
    });
  });

  document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.checked = radio.value === currentFilters.type;
    radio.addEventListener('change', (e) => {
      currentFilters.type = e.target.value;
      resetAndLoad();
    });
  });

  const wcCheckbox = document.querySelector('input[name="worldcup"]');
  if (wcCheckbox) {
    wcCheckbox.checked = currentFilters.worldcup === 'true';
    wcCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Clear league if worldcup selected
        document.querySelector('input[name="league"][value=""]').checked = true;
        currentFilters.league = '';
      }
      currentFilters.worldcup = e.target.checked ? 'true' : '';
      resetAndLoad();
    });
  }

  const retroCheckbox = document.querySelector('input[name="retro"]');
  if (retroCheckbox) {
    retroCheckbox.checked = currentFilters.retro === 'true';
    retroCheckbox.addEventListener('change', (e) => {
      currentFilters.retro = e.target.checked ? 'true' : '';
      resetAndLoad();
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = currentFilters.sort;
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      resetAndLoad();
    });
  }

  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelector('input[name="league"][value=""]').checked = true;
      document.querySelector('input[name="type"][value=""]').checked = true;
      if (wcCheckbox) wcCheckbox.checked = false;
      if (retroCheckbox) retroCheckbox.checked = false;
      
      currentFilters = {
        league: '', type: '', worldcup: '', retro: '',
        sort: currentFilters.sort, page: 1, limit: 24
      };
      
      resetAndLoad();
    });
  }
}

function updateUrlParams() {
  const url = new URL(window.location);
  url.search = ''; // clear
  
  if (currentFilters.league) url.searchParams.set('league', currentFilters.league);
  if (currentFilters.type) url.searchParams.set('type', currentFilters.type);
  if (currentFilters.worldcup) url.searchParams.set('worldcup', currentFilters.worldcup);
  if (currentFilters.retro) url.searchParams.set('retro', currentFilters.retro);
  
  window.history.replaceState({}, '', url);
  updatePageTitle();
}

function resetAndLoad() {
  currentFilters.page = 1;
  updateUrlParams();
  loadProducts(true);
  
  // Close mobile sidebar if open
  const sidebar = document.getElementById('filterSidebar');
  if (sidebar) sidebar.classList.remove('active');
}

async function loadProducts(resetGrid = true) {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('productsCount');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  
  if (!grid) return;

  if (resetGrid) {
    grid.innerHTML = Array(8).fill('<div class="skeleton skeleton-card" style="height: 350px;"></div>').join('');
    loadMoreContainer.style.display = 'none';
    allProductsLoaded = [];
  }

  try {
    // Build query string
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const data = await apiFetch(`/api/products?${params.toString()}`);
    
    totalPages = data.pages;
    
    if (resetGrid) {
      grid.innerHTML = '';
    }

    if (data.products.length === 0 && resetGrid) {
      grid.innerHTML = `
        <div class="products-no-results">
          <h3>לא נמצאו מוצרים תואמים לסינון</h3>
          <p>נסה לשנות את אפשרויות הסינון ולחפש שוב.</p>
          <button class="btn btn-secondary mt-3" onclick="document.getElementById('clearFiltersBtn').click()">נקה סינונים</button>
        </div>
      `;
    } else {
      const html = data.products.map(kit => createProductCard(kit)).join('');
      grid.insertAdjacentHTML('beforeend', html);
      allProductsLoaded = [...allProductsLoaded, ...data.products];
    }

    if (countEl) {
      countEl.innerHTML = `מציג <strong>${data.total}</strong> מוצרים`;
    }

    if (loadMoreContainer) {
      if (currentFilters.page < totalPages) {
        loadMoreContainer.style.display = 'block';
      } else {
        loadMoreContainer.style.display = 'none';
      }
    }

  } catch (error) {
    if (resetGrid) {
      grid.innerHTML = '<div class="products-no-results" style="color:var(--error);">שגיאה בטעינת המוצרים. אנא נסה שוב מאוחר יותר.</div>';
    }
  }
}
