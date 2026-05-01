'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useT } from '@/store/i18n';
import type { SystemStats, QueueState } from '@/lib/comfy/types';
import { LangSwitcher } from './LangSwitcher';

async function fetchJson<T>(path: string): Promise<T> {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json() as Promise<T>;
}

const NAV_ITEMS = [
  { href: '/', key: 'nav.dashboard' },
  { href: '/workflow', key: 'nav.workflow' },
  { href: '/panel', key: 'nav.panel' },
  { href: '/gallery', key: 'nav.gallery' },
  { href: '/presets', key: 'nav.presets' },
];

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const stats = useQuery({
    queryKey: ['system_stats'],
    queryFn: () => fetchJson<SystemStats>('/api/comfy/system_stats'),
    refetchInterval: 5000,
  });
  const queue = useQuery({
    queryKey: ['queue'],
    queryFn: () => fetchJson<QueueState>('/api/comfy/queue'),
    refetchInterval: 2000,
  });

  const online = stats.isSuccess;
  const device = stats.data?.devices?.[0];
  const vramFree = device?.vram_free;
  const vramTotal = device?.vram_total;
  const running = queue.data?.queue_running.length ?? 0;
  const pending = queue.data?.queue_pending.length ?? 0;

  return (
    <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="size-8 rounded-md bg-foreground text-background grid place-items-center font-bold">
            C
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Comfy Panel</div>
            <div className="text-xs text-muted-foreground font-mono">
              127.0.0.1:8188
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((n) => {
            const active =
              n.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {t(n.key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LangSwitcher />
          <Badge variant={online ? 'default' : 'destructive'}>
            <span
              className={`size-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-red-400'}`}
            />
            {online ? t('header.online') : stats.isLoading ? '…' : t('header.offline')}
          </Badge>

          {device && (
            <Badge variant="secondary" className="font-mono text-xs">
              {device.name.slice(0, 18)}
              {vramFree != null && vramTotal != null && (
                <span className="opacity-70">
                  · {(vramFree / 1024 ** 3).toFixed(1)}/{(vramTotal / 1024 ** 3).toFixed(1)}G
                </span>
              )}
            </Badge>
          )}

          <Badge variant="outline" className="font-mono text-xs">
            {t('header.queue')} {running}/{pending}
          </Badge>
        </div>
      </div>
    </header>
  );
}
