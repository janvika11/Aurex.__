/**
 * Run this from AurexBackend to verify your server is reachable.
 * Usage: node test-local.js
 */
const http = require('http');

function get(hostname, path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname, port: 5000, path: path || '/api/health' },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.setTimeout(3000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  console.log('Make sure the server is running in another terminal: node server.js\n');
  try {
    const r = await get('127.0.0.1', '/api/health');
    const ok = r.status === 200 && (r.data || '').includes('ok');
    console.log(ok ? 'OK' : 'FAIL', 'localhost:5000/api/health', r.status, (r.data || '').trim().slice(0, 60));
  } catch (e) {
    console.log('FAIL', 'localhost:5000', e.message || e);
  }
  console.log('\nIf OK, backend is bound to 0.0.0.0 and listening. From phone use: http://YOUR_WIFI_IP:5000');
  console.log('Check Wi-Fi IP: ipconfig (look for IPv4 under Wi-Fi)');
}

main();
