'use client';

import { useI18n } from '@/store/i18n';
import { LANGS, type Lang } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';

export function LangSwitcher() {
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs font-mono">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id as Lang)}
          className={cn(
            'px-2 py-0.5 rounded transition-colors',
            lang === l.id
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground',
          )}
          title={l.label}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
