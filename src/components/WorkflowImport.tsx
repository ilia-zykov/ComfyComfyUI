'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseWorkflow } from '@/lib/workflow/parse';
import { apiWorkflowSchema } from '@/lib/workflow/types';
import { useWorkflowStore } from '@/store/workflow';
import { useT } from '@/store/i18n';

export function WorkflowImport() {
  const t = useT();
  const setWorkflow = useWorkflowStore((s) => s.setWorkflow);
  const [raw, setRaw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState<null | 'history' | 'queue'>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function importFromComfy(source: 'history' | 'queue') {
    setBusy(source);
    setError(null);
    try {
      if (source === 'history') {
        const r = await fetch('/api/comfy/history?max_items=64');
        if (!r.ok) throw new Error(`history → ${r.status}`);
        const data = (await r.json()) as Record<
          string,
          { prompt: [number, string, unknown, unknown, unknown] }
        >;
        const ids = Object.keys(data);
        if (ids.length === 0) throw new Error(t('import.errorHistoryEmpty'));
        const last = data[ids[ids.length - 1]];
        const wf = apiWorkflowSchema.parse(last.prompt[2]);
        setWorkflow(wf, name.trim() || t('import.fromHistoryDefault'));
        setName('');
      } else {
        const r = await fetch('/api/comfy/queue');
        if (!r.ok) throw new Error(`queue → ${r.status}`);
        const data = (await r.json()) as {
          queue_running: Array<[number, string, unknown, unknown, unknown]>;
          queue_pending: Array<[number, string, unknown, unknown, unknown]>;
        };
        const item = data.queue_running[0] ?? data.queue_pending[0] ?? null;
        if (!item) throw new Error(t('import.errorQueueEmpty'));
        const wf = apiWorkflowSchema.parse(item[2]);
        setWorkflow(wf, name.trim() || t('import.fromQueueDefault'));
        setName('');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function commit(text: string, derivedName: string) {
    const result = parseWorkflow(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setWorkflow(result.workflow, name.trim() || derivedName || 'workflow');
    setRaw('');
    setName('');
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    file.text().then((t) => commit(t, file.name.replace(/\.json$/i, '')));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('import.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="wf-name">{t('import.name')}</Label>
            <Input
              id="wf-name"
              placeholder={t('import.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            {t('import.pickFile')}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              f.text().then((t) => commit(t, f.name.replace(/\.json$/i, '')));
              e.target.value = '';
            }}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-md border-2 border-dashed transition-colors ${
            dragOver ? 'border-foreground bg-muted/40' : 'border-border/60'
          }`}
        >
          <Textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={t('import.dropzone')}
            className="min-h-[180px] font-mono text-xs border-0 focus-visible:ring-0 bg-transparent resize-y"
          />
        </div>

        {error && (
          <div className="text-sm text-destructive font-mono whitespace-pre-wrap">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => commit(raw, '')} disabled={!raw.trim()}>
            {t('import.load')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => importFromComfy('history')}
            disabled={busy !== null}
          >
            {busy === 'history' ? '…' : t('import.fromHistory')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => importFromComfy('queue')}
            disabled={busy !== null}
          >
            {busy === 'queue' ? '…' : t('import.fromQueue')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRaw('');
              setError(null);
            }}
          >
            {t('import.clear')}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{t('import.tip')}</p>
      </CardContent>
    </Card>
  );
}
