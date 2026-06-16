const fs = require('fs');
const path = require('path');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  return [];
}

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const analyticsPath = path.join(process.cwd(), 'data', 'analytics.json');
  const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

  if (req.method === 'POST') {
    try {
      const { event, page, productId, sessionId } = req.body;
      
      if (!event || !sessionId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const events = readJSON(analyticsPath);
      events.push({
        event,
        page: page || null,
        productId: productId || null,
        sessionId,
        timestamp: new Date().toISOString()
      });
      writeJSON(analyticsPath, events);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving analytics:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const events = readJSON(analyticsPath);
      const orders = readJSON(ordersPath);

      const totalPageViews = events.filter(e => e.event === 'pageview').length;
      const uniqueVisitors = new Set(events.map(e => e.sessionId)).size;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Top products viewed
      const productViews = {};
      events.filter(e => e.event === 'product_view' && e.productId).forEach(e => {
        productViews[e.productId] = (productViews[e.productId] || 0) + 1;
      });
      
      const topProducts = Object.entries(productViews)
        .map(([id, views]) => ({ id, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      return res.status(200).json({
        totalPageViews,
        uniqueVisitors,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        topProducts
      });
    } catch (error) {
      console.error('Error reading analytics:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
