const { v4: uuidv4 } = require('uuid');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// In-memory token store (in production, use a database or Redis)
global.adminTokens = global.adminTokens || new Set();

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'kok_admin_2024';

    if (password === adminPassword) {
      const token = uuidv4();
      global.adminTokens.add(token);
      
      // Simple cleanup of old tokens (for demo purposes)
      if (global.adminTokens.size > 100) {
        const first = global.adminTokens.values().next().value;
        global.adminTokens.delete(first);
      }

      return res.status(200).json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: 'סיסמה שגויה' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
};
