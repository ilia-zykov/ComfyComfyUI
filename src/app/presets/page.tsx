'use client';

import { Header } from '@/components/Header';
import { PresetsList } from '@/components/PresetsList';
import { useT } from '@/store/i18n';

export default function PresetsPage() {
  const t = useT();
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">{t('presets.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('presets.subtitle')}{' '}
            <code className="font-mono">data/presets/</code>.
          </p>
        </section>
        <PresetsList />
      </main>
    </>
  );
}
