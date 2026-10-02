'use client';

import { create } from 'zustand';

interface SizeChartState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSizeChartStore = create<SizeChartState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
