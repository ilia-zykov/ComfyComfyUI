'use client';

import { Dices } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SeedControl } from '@/store/panel';
import { useT } from '@/store/i18n';

type Props = {
  id: string;
  value: number;
  onChange: (v: number) => void;
  control: SeedControl;
  onControlChange: (c: SeedControl) => void;
};

const MAX_SEED = 0xffffffff;

function randomSeed() {
  return Math.floor(Math.random() * MAX_SEED);
}

export function SeedInput({
  id,
  value,
  onChange,
  control,
  onControlChange,
}: Props) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        id={id}
        type="number"
        className="font-mono w-44"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(randomSeed())}
        title={t('seed.random')}
      >
        <Dices className="size-4" />
      </Button>
      <Select value={control} onValueChange={(v) => onControlChange(v as SeedControl)}>
        <SelectTrigger className="w-[170px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fixed">{t('seed.fixed')}</SelectItem>
          <SelectItem value="randomize">{t('seed.randomize')}</SelectItem>
          <SelectItem value="increment">{t('seed.increment')}</SelectItem>
          <SelectItem value="decrement">{t('seed.decrement')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
