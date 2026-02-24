# Aurex – Gold & Forex Alerts

A React Native (Expo) app that displays live USD/INR forex and gold rates, and sends push notifications when your target prices are hit.

---

## How to Run

### 1. Backend (required for prices to load)

```bash
cd AurexBackend
npm install
```

Create `.env` in `AurexBackend` with:
```
FOREX_KEY=your_exchangerate-api_key
GOLD_KEY=your_goldapi_key
PORT=5000
```

Get keys from:
- Forex: https://www.exchangerate-api.com/
- Gold: https://www.goldapi.io/

Then start the server:
```bash
npm start
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd AurexFrontend
npm install
npm start
```

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Or scan the QR code with **Expo Go** on your phone

### 3. Connect phone to backend

The app fetches prices from your computer. Your phone and computer must be on the **same Wi‑Fi network**.

1. Find your computer's local IP (e.g. `192.168.1.110`):
   - Windows: `ipconfig` → look for IPv4
   - Mac: System Preferences → Network

2. Edit `AurexFrontend/src/config.js` and set the API host:
   ```js
   // Change 192.168.1.110 to YOUR computer's IP
   export const API_BASE = 'http://192.168.1.110:5000/api';
   ```

3. Or set `EXPO_PUBLIC_API_URL` when starting:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.110:5000 npm start
   ```

4. Restart the app after changing the URL.

---

## Notifications

- **When working:** App open or in background. Alerts fire when forex/gold hits your target.
- **When app is fully closed:** Alerts do not run; the app must be open or backgrounded to check prices every 60 seconds.

To receive alerts reliably, keep the app in the background. Full "push when app is killed" would require a hosted backend with Expo Push.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| "Fetching..." never updates | Backend not running, or wrong API URL. Check `src/config.js` and ensure backend is on same network. |
| Bottom content cut off on phone | Fixed in latest version with extra bottom padding for small screens. |
| No notification when target hit | Enable notifications when the app asks. On Android, ensure app has notification permission. |
