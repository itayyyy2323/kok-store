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

function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `KOK-${timestamp}-${random}`;
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

  if (req.method === 'POST') {
    try {
      const { customer, items, subtotal, shipping, discount, total, paypalTransactionId, discountCode } = req.body;

      // Validate required fields
      if (!customer || !items || !total) {
        return res.status(400).json({ error: 'נתוני הזמנה חסרים' });
      }

      if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city) {
        return res.status(400).json({ error: 'פרטי לקוח חסרים' });
      }

      if (!items.length) {
        return res.status(400).json({ error: 'סל הקניות ריק' });
      }

      const orderId = generateOrderId();
      const order = {
        orderId,
        customer,
        items,
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        discount: discount || 0,
        discountCode: discountCode || null,
        total,
        paypalTransactionId: paypalTransactionId || null,
        status: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // NOTE: On Vercel serverless, file writes to data/ won't persist between function calls.
      // For production, use Vercel KV, MongoDB Atlas, or another database.
      const orders = readJSON(ordersPath);
      orders.push(order);
      writeJSON(ordersPath, orders);

      return res.status(201).json({
        success: true,
        orderId,
        message: 'ההזמנה נשמרה בהצלחה'
      });
    } catch (error) {
      console.error('Error saving order:', error);
      return res.status(500).json({ error: 'שגיאה בשמירת ההזמנה' });
    }
  }

  if (req.method === 'GET') {
    // Admin-only: read all orders
    try {
      const orders = readJSON(ordersPath);
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      return res.status(200).json({
        orders,
        stats: {
          totalOrders: orders.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error reading orders:', error);
      return res.status(500).json({ error: 'שגיאה בטעינת ההזמנות' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
