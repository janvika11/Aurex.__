import Constants from 'expo-constants';

// API base URL – app.json "extra.apiUrl" or EXPO_PUBLIC_API_URL; default = Render (works on phone)
const API_HOST =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://aurex-052u.onrender.com';

export const API_BASE = `${API_HOST.replace(/\/$/, '')}/api`;

