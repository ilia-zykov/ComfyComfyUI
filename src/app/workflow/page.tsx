'use client';

import { Header } from '@/components/Header';
import { WorkflowImport } from '@/components/WorkflowImport';
import { WorkflowView } from '@/components/WorkflowView';
import { useWorkflowStore } from '@/store/workflow';
import { useT } from '@/store/i18n';

export default function WorkflowPage() {
  const t = useT();
  const workflow = useWorkflowStore((s) => s.workflow);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">{t('workflow.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('workflow.subtitle')}</p>
        </section>

        {!workflow && <WorkflowImport />}
        {workflow && <WorkflowView />}
        {workflow && (
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              {t('workflow.loadAnother')}
            </summary>
            <div className="mt-3">
              <WorkflowImport />
            </div>
          </details>
        )}
      </main>
    </>
  );
}
