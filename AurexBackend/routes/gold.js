const express = require('express');
const router  = express.Router();
const { getLatestGold } = require('../services/priceService');

router.get('/', (req, res) => {
  const inrPerGram = getLatestGold();
  if (!inrPerGram) return res.status(503).json({ error: 'Price not available yet' });
  res.json({ inrPerGram, timestamp: new Date().toISOString() });
});

module.exports = router;