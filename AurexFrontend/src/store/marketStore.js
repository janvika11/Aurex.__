import { create } from 'zustand';

export const useMarketStore = create((set) => ({
  forex: null,
  gold: null,
  setForex: (v) => set({ forex: v }),
  setGold: (v) => set({ gold: v }),

  forexAlert: { active: false, target: null, direction: 'above' },
  setForexAlert: (a) => set({ forexAlert: a }),
  clearForexAlert: () => set({
    forexAlert: { active: false, target: null, direction: 'above' }
  }),

  goldAlert: { active: false, target: null, direction: 'above' },
  setGoldAlert: (a) => set({ goldAlert: a }),
  clearGoldAlert: () => set({
    goldAlert: { active: false, target: null, direction: 'above' }
  }),

  alertHistory: [],
  addToHistory: (a) => set((s) => ({
    alertHistory: [a, ...s.alertHistory]
  })),
}));