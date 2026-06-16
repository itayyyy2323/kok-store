const fs = require('fs');
const path = require('path');

function getPrice(kit) {
  if (kit.isWorldCupSpecial) return 79.99;
  if (kit.year >= 2022) return 69.99;
  return 79.99;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    let products = JSON.parse(rawData);

    const { league, team, year, type, worldcup, retro, search, featured, sort, page = '1', limit = '24' } = req.query;

    // Apply filters
    if (league) {
      products = products.filter(p => p.league === league);
    }

    if (team) {
      const teamLower = team.toLowerCase();
      products = products.filter(p =>
        p.team.toLowerCase().includes(teamLower) ||
        p.teamEn.toLowerCase().includes(teamLower)
      );
    }

    if (year) {
      products = products.filter(p => p.year === parseInt(year));
    }

    if (type) {
      products = products.filter(p => p.type === type);
    }

    if (worldcup === 'true') {
      products = products.filter(p => p.isWorldCupSpecial === true);
    }

    if (retro === 'true') {
      products = products.filter(p => p.year < 2022 && !p.isWorldCupSpecial);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.team.toLowerCase().includes(searchLower) ||
        p.teamEn.toLowerCase().includes(searchLower) ||
        p.leagueName.toLowerCase().includes(searchLower)
      );
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    // Calculate price for each product
    products = products.map(p => ({ ...p, price: getPrice(p) }));

    // Sort
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'year-desc':
          products.sort((a, b) => b.year - a.year);
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name, 'he'));
          break;
        default:
          break;
      }
    }

    // Pagination
    const total = products.length;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const pages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      products: paginatedProducts,
      total,
      page: pageNum,
      pages,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'שגיאה בטעינת המוצרים' });
  }
};
