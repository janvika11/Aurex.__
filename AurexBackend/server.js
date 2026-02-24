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

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Fetch immediately on start
priceService.fetchPrices();

// Then every 15 minutes on weekdays
cron.schedule('*/15 * * * 1-5', priceService.fetchPrices);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));