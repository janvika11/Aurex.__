require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const cron           = require('node-cron');
const priceService   = require('./services/priceService');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/forex', require('./routes/forex'));
app.use('/api/gold',  require('./routes/gold'));

app.get('/', (req, res) => {
  res.type('html').send(`
    <!DOCTYPE html>
    <html><body style="font-family:sans-serif;padding:2rem;background:#0a0a0f;color:#e8e8f0;">
      <h1 style="color:#d4a017;">Aurex API</h1>
      <p>Gold &amp; Forex price backend. Endpoints:</p>
      <ul>
        <li><a href="/api/health" style="color:#4fc3f7;">/api/health</a> – status</li>
        <li><a href="/api/forex" style="color:#4fc3f7;">/api/forex</a> – USD/INR rate</li>
        <li><a href="/api/gold" style="color:#d4a017;">/api/gold</a> – Gold ₹/gram</li>
      </ul>
    </body></html>
  `);
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Fetch prices on start (so first client request usually succeeds)
priceService.fetchPrices().catch((err) => console.warn('Initial price fetch failed:', err.message));

// Refresh from external APIs every 30 min (every day) – keeps free-tier usage low
// App still refreshes from *our* backend every 1 min; we just update our cache every 30 min
cron.schedule('*/30 * * * *', priceService.fetchPrices);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // so phone/other devices on network can reach it (not just localhost)
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));