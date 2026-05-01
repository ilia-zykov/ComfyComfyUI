'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { shouldUseSlider, type WidgetSpec } from '@/lib/widgets/spec';

type Props = {
  id: string;
  spec: Extract<WidgetSpec, { kind: 'int' }>;
  value: number;
  onChange: (v: number) => void;
};

export function IntInput({ id, spec, value, onChange }: Props) {
  const useSlider = shouldUseSlider(spec);
  const min = spec.min ?? -Infinity;
  const max = spec.max ?? Infinity;
  const step = spec.step ?? 1;

  function clamp(n: number) {
    if (Number.isNaN(n)) return value;
    if (n < min) return min === -Infinity ? n : min;
    if (n > max) return max === Infinity ? n : max;
    return Math.round(n);
  }

  if (useSlider) {
    return (
      <div className="flex items-center gap-3">
        <Slider
          id={id}
          value={[Number.isFinite(value) ? value : (spec.default ?? 0)]}
          min={spec.min!}
          max={spec.max!}
          step={step}
          onValueChange={(v) => {
            const n = Array.isArray(v) ? v[0] : v;
            if (typeof n === 'number') onChange(clamp(n));
          }}
          className="flex-1"
        />
        <Input
          type="number"
          className="w-24 font-mono"
          value={value}
          min={spec.min}
          max={spec.max}
          step={step}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value)))}
        />
      </div>
    );
  }

  return (
    <Input
      id={id}
      type="number"
      className="font-mono"
      value={value}
      min={spec.min}
      max={spec.max}
      step={step}
      onChange={(e) => onChange(clamp(parseFloat(e.target.value)))}
    />
  );
}
