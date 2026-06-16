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
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'לא מורשה' });
  }

  try {
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    const subscribers = readJSON(subscribersPath);
    
    // Sort by newest first
    subscribers.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    return res.status(200).json({ subscribers });
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
};
