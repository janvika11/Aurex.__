import Constants from 'expo-constants';

// API base URL – change in app.json "extra.apiUrl" or set EXPO_PUBLIC_API_URL when building
const API_HOST =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://192.168.1.120:5000'; // ipaddress

export const API_BASE = `${API_HOST.replace(/\/$/, '')}/api`;
