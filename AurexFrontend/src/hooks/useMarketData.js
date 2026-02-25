import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMarketStore } from '../store/marketStore';
import { sendAlert } from '../utils/notifications';
import { API_BASE } from '../config';

async function fetchMarketData() {
  const [f, g] = await Promise.all([
    axios.get(`${API_BASE}/forex`),
    axios.get(`${API_BASE}/gold`),
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
          const body  = `Rate is ₹${forex.toFixed(4)} — target ₹${forexAlert.target} hit`;
          await sendAlert(title, body);
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
          const body  = `Gold is ₹${Math.round(gold).toLocaleString('en-IN')}/g — target hit`;
          await sendAlert(title, body);
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
    retry: 2,
  });
}