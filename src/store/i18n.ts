'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { messages, format, type Lang } from '@/lib/i18n/messages';

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const useI18n = create<State>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (l) => set({ lang: l }),
    }),
    {
      name: 'comfy-panel-lang',
      partialize: (s) => ({ lang: s.lang }),
      skipHydration: true,
    },
  ),
);

export function useT() {
  const lang = useI18n((s) => s.lang);
  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = messages[lang] ?? messages.en;
      const tmpl = dict[key] ?? messages.en[key] ?? key;
      return format(tmpl, vars);
    },
    [lang],
  );
}
