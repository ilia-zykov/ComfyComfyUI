'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardColor } from '@/lib/panel/colors';

export type SeedControl = 'fixed' | 'randomize' | 'increment' | 'decrement';

export type ColumnCount = 1 | 2 | 3;

type PanelState = {
  values: Record<string, unknown>;
  seedControls: Record<string, SeedControl>;
  nodeOrder: string[];
  nodeColors: Record<string, CardColor>;
  columns: ColumnCount;
  setValue: (key: string, v: unknown) => void;
  setSeedControl: (key: string, c: SeedControl) => void;
  setNodeOrder: (order: string[]) => void;
  setNodeColor: (nodeId: string, color: CardColor) => void;
  setColumns: (n: ColumnCount) => void;
  resetValues: () => void;
  resetLayout: () => void;
};

export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      values: {},
      seedControls: {},
      nodeOrder: [],
      nodeColors: {},
      columns: 2,
      setValue: (key, v) =>
        set((s) => ({ values: { ...s.values, [key]: v } })),
      setSeedControl: (key, c) =>
        set((s) => ({ seedControls: { ...s.seedControls, [key]: c } })),
      setNodeOrder: (order) => set({ nodeOrder: order }),
      setNodeColor: (nodeId, color) =>
        set((s) => ({
          nodeColors: { ...s.nodeColors, [nodeId]: color },
        })),
      setColumns: (n) => set({ columns: n }),
      resetValues: () => set({ values: {}, seedControls: {} }),
      resetLayout: () => set({ nodeOrder: [], nodeColors: {} }),
    }),
    { name: 'comfy-panel-values' },
  ),
);
