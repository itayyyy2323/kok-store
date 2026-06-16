const fs = require('fs');
const path = require('path');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function checkAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return global.adminTokens && global.adminTokens.has(token);
}

function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  return [];
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'לא מורשה' });
  }

  try {
    const analyticsPath = path.join(process.cwd(), 'data', 'analytics.json');
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    
    const events = readJSON(analyticsPath);
    const orders = readJSON(ordersPath);

    // Basic stats
    const totalVisitors = new Set(events.map(e => e.sessionId)).size;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEvents = events.filter(e => new Date(e.timestamp) > sevenDaysAgo);
    const recentOrders = orders.filter(o => new Date(o.createdAt) > sevenDaysAgo);
    
    const recentVisitors = new Set(recentEvents.map(e => e.sessionId)).size;
    const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Chart data: revenue by day (last 7 days)
    const revenueByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      revenueByDay[d.toISOString().split('T')[0]] = 0;
    }
    
    recentOrders.forEach(order => {
      const day = order.createdAt.split('T')[0];
      if (revenueByDay[day] !== undefined) {
        revenueByDay[day] += (order.total || 0);
      }
    });

    return res.status(200).json({
      totalVisitors,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentVisitors,
      recentOrders: recentOrders.length,
      recentRevenue: Math.round(recentRevenue * 100) / 100,
      charts: {
        revenueByDay: Object.entries(revenueByDay).map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
      }
    });

  } catch (error) {
    console.error('Error generating admin analytics:', error);
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
};
