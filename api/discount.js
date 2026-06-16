const fs = require('fs');
const path = require('path');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code, email } = req.body;

    if (!code || code !== 'KOK10') {
      return res.status(400).json({ valid: false, message: 'קוד הנחה לא תקין' });
    }

    if (email) {
      const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
      const subscribers = readJSON(subscribersPath);
      
      if (!subscribers.find(s => s.email === email)) {
        subscribers.push({
          email,
          dateAdded: new Date().toISOString()
        });
        writeJSON(subscribersPath, subscribers);
      }
    }

    return res.status(200).json({
      valid: true,
      discount: 0.10,
      message: 'קוד הנחה הוחל בהצלחה! 10% הנחה'
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    return res.status(500).json({ error: 'שגיאה בהפעלת קוד ההנחה' });
  }
};
