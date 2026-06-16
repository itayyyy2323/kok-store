/**
 * KOK – King of Kits | Admin Panel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('kok_admin_token');
  
  if (token) {
    showDashboard();
    loadDashboardData();
  } else {
    showLogin();
  }

  // Login Form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('adminPassword').value;
      
      const btn = loginForm.querySelector('button');
      btn.textContent = 'מתחבר...';
      btn.disabled = true;

      try {
        const res = await apiFetch('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify({ password })
        });

        if (res.success) {
          localStorage.setItem('kok_admin_token', res.token);
          showDashboard();
          loadDashboardData();
        } else {
          showToast(res.message || 'שגיאה בהתחברות', 'error');
        }
      } catch (error) {
        showToast('סיסמה שגויה או שגיאת שרת', 'error');
      } finally {
        btn.textContent = 'התחבר';
        btn.disabled = false;
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('kok_admin_token');
      showLogin();
    });
  }

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.target).classList.add('active');
    });
  });
});

function showLogin() {
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('dashboardView').classList.remove('active');
  document.getElementById('logoutBtn').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('dashboardView').classList.add('active');
  document.getElementById('logoutBtn').style.display = 'block';
}

async function loadDashboardData() {
  try {
    // Load Analytics Overview
    const analyticsData = await apiFetch('/api/admin/analytics');
    
    document.getElementById('statRevenue').textContent = formatPrice(analyticsData.totalRevenue || 0);
    document.getElementById('statOrders').textContent = analyticsData.totalOrders || 0;
    document.getElementById('statVisitors').textContent = analyticsData.totalVisitors || 0;
    
    const avgOrder = analyticsData.totalOrders ? (analyticsData.totalRevenue / analyticsData.totalOrders) : 0;
    document.getElementById('statAvgOrder').textContent = formatPrice(avgOrder);

    drawSimpleChart(analyticsData.charts?.revenueByDay || []);

    // Load Orders
    const ordersData = await apiFetch('/api/admin/orders');
    renderOrdersTable(ordersData.orders || []);

    // Load Products
    const productsData = await apiFetch('/api/admin/products');
    renderProductsTable(productsData.products || []);

  } catch (error) {
    console.error('Admin data load error:', error);
    if (error.message.includes('401') || error.message.includes('מורשה')) {
      localStorage.removeItem('kok_admin_token');
      showLogin();
      showToast('פג תוקף ההתחברות, אנא התחבר מחדש', 'warning');
    }
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">אין הזמנות עדיין</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => `
    <tr>
      <td style="white-space: nowrap;">${formatDate(order.createdAt)}</td>
      <td><strong>${order.orderId}</strong></td>
      <td>${order.customer.name}</td>
      <td>${order.customer.phone}</td>
      <td style="font-weight:bold;">${formatPrice(order.total)}</td>
      <td><span class="badge badge-featured" style="background:var(--success-bg); color:var(--success); border:none;">שולם</span></td>
    </tr>
  `).join('');
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">אין מוצרים</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => {
    const price = getPrice(product);
    const imageUrl = product.images && product.images[0] ? `images/${product.images[0]}` : null;
    const imgHtml = imageUrl 
      ? `<img src="${imageUrl}" alt="${product.name}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;">`
      : `<div style="width:40px; height:50px; background:#333; border-radius:4px;"></div>`;

    return `
      <tr>
        <td style="font-size:12px; color:var(--text-muted);">${product.id}</td>
        <td>${imgHtml}</td>
        <td><strong>${product.name}</strong></td>
        <td>${product.team}</td>
        <td>${formatPrice(price)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="alert('פונקציונליות עריכה (הדגמה)')">ערוך</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Simple custom CSS bar chart to avoid external dependencies
function drawSimpleChart(dataArr) {
  const container = document.getElementById('revenueChartContainer');
  if (!container || !dataArr || dataArr.length === 0) return;

  // dataArr format: [{date: '2024-05-01', amount: 1500}, ...]
  const maxAmount = Math.max(...dataArr.map(d => d.amount), 100); // Ensure at least 100 max
  
  let html = `<div style="display:flex; height:100%; width:100%; align-items:flex-end; gap:10px; padding-bottom:30px; border-bottom:1px solid var(--border);">`;
  
  dataArr.forEach(item => {
    const heightPct = (item.amount / maxAmount) * 100;
    const dateStr = item.date.split('-').slice(1).join('/'); // MM/DD
    
    html += `
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; group;">
        <div style="font-size:10px; color:var(--text-muted); margin-bottom:5px; opacity:0; transition:opacity 0.2s;" class="chart-tooltip">${formatPrice(item.amount)}</div>
        <div style="width:100%; background:var(--accent); border-radius:4px 4px 0 0; height:${heightPct}%; min-height:2px; transition:height 0.5s ease; cursor:pointer;" 
             onmouseover="this.previousElementSibling.style.opacity='1'" 
             onmouseout="this.previousElementSibling.style.opacity='0'"></div>
        <div style="font-size:10px; color:var(--text-muted); margin-top:10px; position:absolute; bottom:0;">${dateStr}</div>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
}
