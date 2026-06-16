const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Simple middleware to map /api/* routes to the files in api/ directory
app.use('/api', (req, res, next) => {
  let endpoint = req.path;
  
  // Clean up trailing slash
  if (endpoint.endsWith('/')) {
    endpoint = endpoint.slice(0, -1);
  }

  // Support for /product/:id mapping to /product/[id].js
  if (endpoint.startsWith('/product/')) {
    const id = endpoint.split('/')[2];
    req.query.id = id;
    endpoint = '/product/[id]';
  }

  const filePath = path.join(__dirname, 'api', `${endpoint}.js`);
  
  if (fs.existsSync(filePath)) {
    try {
      // Clear cache for development
      delete require.cache[require.resolve(filePath)];
      const handler = require(filePath);
      return handler(req, res);
    } catch (err) {
      console.error(`Error executing ${endpoint}:`, err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  next();
});

// Fallback for SPA routing if needed (though we're using separate HTML files here)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  
  // Try to find the HTML file matching the route, otherwise default to index.html
  const publicPath = path.join(__dirname, 'public');
  let filePath = path.join(publicPath, req.path);
  
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else {
      filePath = path.join(publicPath, 'index.html');
    }
  }
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('To test the API endpoints:');
  console.log(`- http://localhost:${PORT}/api/products`);
});
