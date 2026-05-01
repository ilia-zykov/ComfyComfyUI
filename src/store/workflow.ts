'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiWorkflow, ExposedKey } from '@/lib/workflow/types';

type WorkflowState = {
  workflow: ApiWorkflow | null;
  workflowName: string;
  exposed: ExposedKey[];
  setWorkflow: (wf: ApiWorkflow, name?: string) => void;
  clearWorkflow: () => void;
  toggleExposed: (key: ExposedKey) => void;
  setExposedBulk: (keys: ExposedKey[]) => void;
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflow: null,
      workflowName: '',
      exposed: [],
      setWorkflow: (wf, name) =>
        set({
          workflow: wf,
          workflowName: name ?? get().workflowName ?? '',
          exposed: [],
        }),
      clearWorkflow: () => set({ workflow: null, workflowName: '', exposed: [] }),
      toggleExposed: (key) =>
        set((s) => ({
          exposed: s.exposed.includes(key)
            ? s.exposed.filter((k) => k !== key)
            : [...s.exposed, key],
        })),
      setExposedBulk: (keys) => set({ exposed: keys }),
    }),
    { name: 'comfy-panel-workflow' },
  ),
);

export const isExposed = (exposed: ExposedKey[], key: ExposedKey) =>
  exposed.includes(key);
