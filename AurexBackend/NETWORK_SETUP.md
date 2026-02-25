# Fix "Network Error" – phone can't reach backend

## Option A: Use Render (recommended – no local network needed)

Your app is already set to use **https://aurex-052u.onrender.com**. The phone works on any network (Wi‑Fi or mobile data).

1. In **AurexFrontend/app.json** keep:
   ```json
   "apiUrl": "https://aurex-052u.onrender.com"
   ```
2. Restart the app: `npx expo start --clear`, then reload on the phone (pull to refresh).
3. If the first load is slow, that’s Render’s free tier waking up; wait or pull again.

---

## Option B: Run backend on your PC (same Wi‑Fi only)

### 1. Backend is bound to `0.0.0.0`

Already done in `server.js`:
```js
app.listen(PORT, '0.0.0.0', () => ...)
```

### 2. Start the backend

```bash
cd AurexBackend
node server.js
```

You should see: `Server running on http://0.0.0.0:5000`

### 3. Test from your PC

In **PowerShell** (backend must be running):

```powershell
curl http://localhost:5000/api/health
```

You should see: `{"status":"ok"}`

Optional: run `node test-local.js` in AurexBackend to double-check.

### 4. Same Wi‑Fi

Phone and PC must be on the **same Wi‑Fi**. Turn off mobile data on the phone.

### 5. Correct IP in the app

Check your PC’s Wi‑Fi IP:

```powershell
ipconfig
```

Under **Wireless LAN adapter Wi‑Fi** use the **IPv4 Address** (e.g. `192.168.1.118`).

In **AurexFrontend/app.json** set:

```json
"apiUrl": "http://192.168.1.118:5000"
```

(Use your actual IP if different.)

### 6. Allow port 5000 in Windows Firewall

In **PowerShell as Administrator**:

```powershell
New-NetFirewallRule -DisplayName "Aurex Backend 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### 7. Test from phone

- On the phone’s **browser** open: `http://192.168.1.118:5000/api/health`  
  You should see `{"status":"ok"}`.
- In the **app**, pull down to refresh.

If the browser works but the app doesn’t, fully close the app and reopen it (or run `npx expo start --clear` and reload).
