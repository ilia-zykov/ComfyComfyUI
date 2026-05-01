'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CARD_COLORS, type CardColor } from '@/lib/panel/colors';
import { cn } from '@/lib/utils';
import { useT } from '@/store/i18n';

type Props = {
  value: CardColor;
  onChange: (c: CardColor) => void;
};

export function ColorPicker({ value, onChange }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        title={t('panel.colorTitle')}
        className="size-7"
      >
        <Palette className="size-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-[208px] p-3 bg-popover border border-border rounded-md shadow-lg">
            <div className="grid grid-cols-4 gap-2">
              {CARD_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}
                  title={t(c.labelKey)}
                  className={cn(
                    'size-9 rounded-md grid place-items-center transition-transform hover:scale-110 border border-border/50 shrink-0',
                    c.swatch,
                  )}
                >
                  {value === c.id && (
                    <Check className="size-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground text-center font-mono">
              {(() => {
                const c = CARD_COLORS.find((c) => c.id === value);
                return c ? t(c.labelKey) : '';
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
