const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'לא מורשה' });
  }

  const dataPath = path.join(process.cwd(), 'data', 'products.json');

  if (req.method === 'GET') {
    const products = readJSON(dataPath);
    return res.status(200).json({ products });
  }

  if (req.method === 'POST') {
    try {
      const product = req.body;
      if (!product.id) product.id = uuidv4();
      
      const products = readJSON(dataPath);
      products.push(product);
      writeJSON(dataPath, products);
      
      return res.status(201).json({ success: true, product });
    } catch (e) {
      return res.status(500).json({ error: 'שגיאה בהוספת מוצר' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      if (!updates.id) return res.status(400).json({ error: 'מזהה מוצר חסר' });

      const products = readJSON(dataPath);
      const index = products.findIndex(p => p.id === updates.id);
      
      if (index === -1) return res.status(404).json({ error: 'מוצר לא נמצא' });
      
      products[index] = { ...products[index], ...updates };
      writeJSON(dataPath, products);
      
      return res.status(200).json({ success: true, product: products[index] });
    } catch (e) {
      return res.status(500).json({ error: 'שגיאה בעדכון מוצר' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'מזהה מוצר חסר' });

      const products = readJSON(dataPath);
      const newProducts = products.filter(p => p.id !== id);
      
      if (newProducts.length === products.length) {
        return res.status(404).json({ error: 'מוצר לא נמצא' });
      }
      
      writeJSON(dataPath, newProducts);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'שגיאה במחיקת מוצר' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
