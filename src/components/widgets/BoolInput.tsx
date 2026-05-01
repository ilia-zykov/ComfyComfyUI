'use client';

import { Switch } from '@/components/ui/switch';

type Props = {
  id: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

export function BoolInput({ id, value, onChange }: Props) {
  return (
    <div className="flex items-center">
      <Switch id={id} checked={value} onCheckedChange={onChange} />
    </div>
  );
}
