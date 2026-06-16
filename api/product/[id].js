const fs = require('fs');
const path = require('path');

function getPrice(kit) {
  if (kit.isWorldCupSpecial) return 79.99;
  if (kit.year >= 2022) return 69.99;
  return 79.99;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const productId = req.query.id;
    if (!productId) {
      return res.status(400).json({ error: 'מזהה מוצר חסר' });
    }

    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(rawData);

    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'מוצר לא נמצא' });
    }

    // Calculate price
    const productWithPrice = { ...product, price: getPrice(product) };

    // Find related products (same league or same team, exclude current)
    let related = products
      .filter(p => p.id !== productId && (p.league === product.league || p.team === product.team))
      .slice(0, 8)
      .map(p => ({ ...p, price: getPrice(p) }));

    // If not enough related, fill with random products
    if (related.length < 4) {
      const additional = products
        .filter(p => p.id !== productId && !related.find(r => r.id === p.id))
        .slice(0, 8 - related.length)
        .map(p => ({ ...p, price: getPrice(p) }));
      related = [...related, ...additional];
    }

    res.status(200).json({
      product: productWithPrice,
      related
    });
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ error: 'שגיאה בטעינת המוצר' });
  }
};
