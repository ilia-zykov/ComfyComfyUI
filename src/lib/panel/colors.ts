export type CardColor =
  | 'default'
  | 'slate'
  | 'red'
  | 'orange'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'pink';

export const CARD_COLORS: { id: CardColor; labelKey: string; swatch: string }[] = [
  { id: 'default', labelKey: 'color.default', swatch: 'bg-muted' },
  { id: 'slate', labelKey: 'color.slate', swatch: 'bg-slate-500' },
  { id: 'red', labelKey: 'color.red', swatch: 'bg-red-500' },
  { id: 'orange', labelKey: 'color.orange', swatch: 'bg-orange-500' },
  { id: 'amber', labelKey: 'color.amber', swatch: 'bg-amber-500' },
  { id: 'lime', labelKey: 'color.lime', swatch: 'bg-lime-500' },
  { id: 'emerald', labelKey: 'color.emerald', swatch: 'bg-emerald-500' },
  { id: 'cyan', labelKey: 'color.cyan', swatch: 'bg-cyan-500' },
  { id: 'blue', labelKey: 'color.blue', swatch: 'bg-blue-500' },
  { id: 'violet', labelKey: 'color.violet', swatch: 'bg-violet-500' },
  { id: 'pink', labelKey: 'color.pink', swatch: 'bg-pink-500' },
];

export const CARD_STYLES: Record<
  CardColor,
  { card: string; header: string; ring: string }
> = {
  default: { card: '', header: '', ring: 'ring-foreground/40' },
  slate: {
    card: 'border-slate-400/50 dark:border-slate-500/40',
    header: 'bg-slate-500/15',
    ring: 'ring-slate-400',
  },
  red: {
    card: 'border-red-400/50 dark:border-red-500/40',
    header: 'bg-red-500/15',
    ring: 'ring-red-400',
  },
  orange: {
    card: 'border-orange-400/50 dark:border-orange-500/40',
    header: 'bg-orange-500/15',
    ring: 'ring-orange-400',
  },
  amber: {
    card: 'border-amber-400/50 dark:border-amber-500/40',
    header: 'bg-amber-500/15',
    ring: 'ring-amber-400',
  },
  lime: {
    card: 'border-lime-400/50 dark:border-lime-500/40',
    header: 'bg-lime-500/15',
    ring: 'ring-lime-400',
  },
  emerald: {
    card: 'border-emerald-400/50 dark:border-emerald-500/40',
    header: 'bg-emerald-500/15',
    ring: 'ring-emerald-400',
  },
  cyan: {
    card: 'border-cyan-400/50 dark:border-cyan-500/40',
    header: 'bg-cyan-500/15',
    ring: 'ring-cyan-400',
  },
  blue: {
    card: 'border-blue-400/50 dark:border-blue-500/40',
    header: 'bg-blue-500/15',
    ring: 'ring-blue-400',
  },
  violet: {
    card: 'border-violet-400/50 dark:border-violet-500/40',
    header: 'bg-violet-500/15',
    ring: 'ring-violet-400',
  },
  pink: {
    card: 'border-pink-400/50 dark:border-pink-500/40',
    header: 'bg-pink-500/15',
    ring: 'ring-pink-400',
  },
};
