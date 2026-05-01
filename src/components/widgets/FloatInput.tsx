'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { shouldUseSlider, type WidgetSpec } from '@/lib/widgets/spec';

type Props = {
  id: string;
  spec: Extract<WidgetSpec, { kind: 'float' }>;
  value: number;
  onChange: (v: number) => void;
};

export function FloatInput({ id, spec, value, onChange }: Props) {
  const useSlider = shouldUseSlider(spec);
  const step = spec.step ?? 0.1;
  const round =
    typeof spec.round === 'number' && spec.round > 0 ? spec.round : null;

  function applyRound(n: number) {
    if (round) return Math.round(n / round) * round;
    return n;
  }

  function clamp(n: number) {
    if (Number.isNaN(n)) return value;
    let v = applyRound(n);
    if (spec.min != null && v < spec.min) v = spec.min;
    if (spec.max != null && v > spec.max) v = spec.max;
    return v;
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
          className="w-28 font-mono"
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
