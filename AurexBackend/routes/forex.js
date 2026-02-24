const express = require('express');
const router  = express.Router();
const { getLatestForex } = require('../services/priceService');

router.get('/', (req, res) => {
  const rate = getLatestForex();
  if (!rate) return res.status(503).json({ error: 'Price not available yet' });
  res.json({ rate, timestamp: new Date().toISOString() });
});

module.exports = router;