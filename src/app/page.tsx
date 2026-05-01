'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { useT } from '@/store/i18n';
import type { ObjectInfo, ObjectInfoEntry } from '@/lib/comfy/types';

async function fetchObjectInfo(): Promise<ObjectInfo> {
  const r = await fetch('/api/comfy/object_info');
  if (!r.ok) throw new Error(`object_info → ${r.status}`);
  return r.json();
}

export default function Home() {
  const t = useT();
  const { data, isLoading, error } = useQuery({
    queryKey: ['object_info'],
    queryFn: fetchObjectInfo,
    staleTime: 60_000,
  });

  const [filter, setFilter] = useState('');

  const grouped = useMemo(() => {
    if (!data) return null;
    const map = new Map<string, [string, ObjectInfoEntry][]>();
    for (const [name, entry] of Object.entries(data)) {
      const cat = entry.category || 'uncategorized';
      const top = cat.split('/')[0] || 'uncategorized';
      if (!map.has(top)) map.set(top, []);
      map.get(top)!.push([name, entry]);
    }
    return map;
  }, [data]);

  const total = data ? Object.keys(data).length : 0;

  const visibleNodes = useMemo(() => {
    if (!data) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return [];
    return Object.entries(data)
      .filter(
        ([name, e]) =>
          name.toLowerCase().includes(q) ||
          e.display_name?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q),
      )
      .slice(0, 60);
  }, [data, filter]);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </section>

        {error && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">{t('dashboard.errorTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-mono">
              {(error as Error).message}
              <p className="mt-2 text-muted-foreground font-sans">
                {t('dashboard.errorHint')}{' '}
                <code className="font-mono">127.0.0.1:8188</code>.
              </p>
            </CardContent>
          </Card>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                {t('dashboard.nodesDetected')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tabular-nums">
                {isLoading ? '…' : total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                {t('dashboard.topCategories')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold tabular-nums">
                {grouped?.size ?? (isLoading ? '…' : 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                {t('dashboard.statusLabel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base">
                {isLoading
                  ? t('dashboard.connecting')
                  : error
                  ? t('dashboard.noConnection')
                  : t('dashboard.ready')}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.searchTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder={t('dashboard.searchPlaceholder')}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {filter && visibleNodes.length === 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('dashboard.notFound')}
                </p>
              )}
              {visibleNodes.length > 0 && (
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {visibleNodes.map(([name, e]) => (
                    <li
                      key={name}
                      className="rounded-md border border-border/60 px-3 py-2 text-sm"
                    >
                      <div className="font-mono text-xs text-muted-foreground">
                        {e.category}
                      </div>
                      <div className="font-medium">{e.display_name || name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground/70 mt-0.5">
                        {name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        {grouped && (
          <section>
            <h2 className="text-lg font-semibold mb-3">{t('dashboard.categories')}</h2>
            <div className="flex flex-wrap gap-2">
              {[...grouped.entries()]
                .sort((a, b) => b[1].length - a[1].length)
                .map(([cat, items]) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    {cat}
                    <span className="opacity-60">· {items.length}</span>
                  </Badge>
                ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
