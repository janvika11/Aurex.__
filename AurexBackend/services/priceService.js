const axios = require('axios');
require('dotenv').config();

let latestForex = null;
let latestGold  = null;

async function fetchPrices() {
  try {
    // FOREX
    const forexRes = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.FOREX_KEY}/latest/USD`
    );
    latestForex = forexRes.data.conversion_rates.INR;

    // GOLD
    const goldRes = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': process.env.GOLD_KEY }
    });

    const goldUSD_perGram = goldRes.data.price_gram_24k;
    latestGold = goldUSD_perGram * latestForex;

    console.log(`✅ USD/INR: ₹${latestForex}`);
    console.log(`✅ Gold INR/gram (24k spot): ₹${Math.round(latestGold)}`);

  } catch(err) {
    console.error('Fetch error:', err.message);
  }
}

function getLatestForex() { return latestForex; }
function getLatestGold()  { return latestGold;  }

module.exports = { fetchPrices, getLatestForex, getLatestGold };