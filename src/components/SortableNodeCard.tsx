'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ColorPicker } from './ColorPicker';
import { CARD_STYLES, type CardColor } from '@/lib/panel/colors';
import { cn } from '@/lib/utils';
import { useT } from '@/store/i18n';

type Props = {
  id: string;
  title: string;
  classType: string;
  category?: string;
  color: CardColor;
  onColorChange: (c: CardColor) => void;
  children: React.ReactNode;
};

export function SortableNodeCard({
  id,
  title,
  classType,
  category,
  color,
  onColorChange,
  children,
}: Props) {
  const t = useT();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const palette = CARD_STYLES[color];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-0 gap-0 transition-shadow',
        palette.card,
        isDragging && 'opacity-70 shadow-2xl ring-2 z-50 ' + palette.ring,
      )}
    >
      <CardHeader
        className={cn(
          'py-3 px-4 rounded-t-xl border-b border-border/40',
          palette.header,
        )}
      >
        <CardTitle className="flex items-center gap-2 flex-wrap text-base">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none -ml-1.5 p-1 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
            title={t('panel.dragHandle')}
            aria-label="Drag handle"
          >
            <GripVertical className="size-4" />
          </button>
          <Badge variant="outline" className="font-mono text-[10px]">
            #{id}
          </Badge>
          <span className="flex-1 min-w-0 truncate">{title}</span>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {classType}
          </Badge>
          {category && (
            <Badge variant="outline" className="font-mono text-[10px]">
              {category}
            </Badge>
          )}
          <ColorPicker value={color} onChange={onColorChange} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-4">{children}</CardContent>
    </Card>
  );
}
