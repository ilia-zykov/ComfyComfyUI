'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { WidgetSpec } from '@/lib/widgets/spec';

type Props = {
  id: string;
  spec: Extract<WidgetSpec, { kind: 'string' }>;
  value: string;
  onChange: (v: string) => void;
};

export function StringInput({ id, spec, value, onChange }: Props) {
  if (spec.multiline) {
    return (
      <Textarea
        id={id}
        value={value}
        placeholder={spec.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] font-mono text-sm"
      />
    );
  }
  return (
    <Input
      id={id}
      value={value}
      placeholder={spec.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
