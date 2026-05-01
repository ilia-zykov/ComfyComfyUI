'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { WidgetSpec } from '@/lib/widgets/spec';

type Props = {
  id: string;
  spec: Extract<WidgetSpec, { kind: 'combo' }>;
  value: string;
  onChange: (v: string) => void;
};

export function ComboInput({ id, spec, value, onChange }: Props) {
  const [filter, setFilter] = useState('');
  const showFilter = spec.options.length > 12;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return spec.options;
    return spec.options.filter((o) => o.toLowerCase().includes(q));
  }, [filter, spec.options]);

  return (
    <Select
      value={value || ''}
      onValueChange={(v) => onChange(v ?? '')}
    >
      <SelectTrigger id={id} className="w-full font-mono text-xs">
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {showFilter && (
          <div className="p-1.5 sticky top-0 bg-popover z-10">
            <Input
              placeholder="фильтр…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="h-8 text-xs"
            />
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            ничего не найдено
          </div>
        )}
        {filtered.slice(0, 200).map((opt) => (
          <SelectItem key={opt} value={opt} className="font-mono text-xs">
            {opt}
          </SelectItem>
        ))}
        {filtered.length > 200 && (
          <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
            и ещё {filtered.length - 200}…
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
