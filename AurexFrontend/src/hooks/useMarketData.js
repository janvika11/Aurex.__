import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMarketStore } from '../store/marketStore';
import { triggerAlarm } from '../utils/notifications';
import { API_BASE } from '../config';

// Render free tier can take 30–60s to wake up; use long timeout so phone doesn't get "Network Error"
const API_TIMEOUT_MS = 60000;

async function fetchMarketData() {
  const opts = { timeout: API_TIMEOUT_MS };
  const [f, g] = await Promise.all([
    axios.get(`${API_BASE}/forex`, opts),
    axios.get(`${API_BASE}/gold`, opts),
  ]);
  return {
    forex: f.data.rate,
    gold:  g.data.inrPerGram,
  };
}

export function useMarketData() {
  const {
    setForex, setGold,
    forexAlert, clearForexAlert,
    goldAlert,  clearGoldAlert,
    addToHistory,
  } = useMarketStore();

  return useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const data = await fetchMarketData();
      const { forex, gold } = data;

      if (forexAlert.active && forexAlert.target) {
        const hit =
          (forexAlert.direction === 'above' && forex >= forexAlert.target) ||
          (forexAlert.direction === 'below' && forex <= forexAlert.target);
        if (hit) {
          const title = '📈 Aurex — USD/INR Alert!';
          const body  = `Rate is ₹${forex.toFixed(4)} — target ₹${Number(forexAlert.target) === forexAlert.target && forexAlert.target % 1 !== 0 ? forexAlert.target.toFixed(4) : forexAlert.target} hit`;
          triggerAlarm(title, body);
          addToHistory({ type: 'forex', title, body, time: new Date().toISOString() });
          clearForexAlert();
        }
      }

      if (goldAlert.active && goldAlert.target) {
        const hit =
          (goldAlert.direction === 'above' && gold >= goldAlert.target) ||
          (goldAlert.direction === 'below' && gold <= goldAlert.target);
        if (hit) {
          const title = '🥇 Aurex — Gold Alert!';
          const goldTargetFormatted = Number(goldAlert.target) === goldAlert.target && goldAlert.target % 1 !== 0
            ? goldAlert.target.toFixed(2)
            : Math.round(goldAlert.target).toLocaleString('en-IN');
          const body  = `Gold is ₹${gold.toFixed(2)}/g — target ₹${goldTargetFormatted}/g hit`;
          triggerAlarm(title, body);
          addToHistory({ type: 'gold', title, body, time: new Date().toISOString() });
          clearGoldAlert();
        }
      }

      setForex(forex);
      setGold(gold);
      return data;
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 10000),
  });
}