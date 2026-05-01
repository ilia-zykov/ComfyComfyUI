'use client';

import { Loader2, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRunStore, comfyImageUrl, type Run } from '@/store/run';
import { useWorkflowStore } from '@/store/workflow';
import { nodeTitle } from '@/lib/workflow/parse';
import type { ObjectInfo } from '@/lib/comfy/types';
import { useT } from '@/store/i18n';

type Props = {
  objectInfo: ObjectInfo | undefined;
  onClose?: () => void;
  closeLabel?: string;
};

export function LivePreview({ objectInfo, onClose, closeLabel }: Props) {
  const t = useT();
  const workflow = useWorkflowStore((s) => s.workflow);
  const runs = useRunStore((s) => s.runs);
  const currentPromptId = useRunStore((s) => s.currentPromptId);
  const interrupt = useRunStore((s) => s.interrupt);

  const run: Run | undefined =
    runs.find((r) => r.promptId === currentPromptId) ?? runs[0];

  const status = run?.status ?? 'idle';
  const isRunning = status === 'queued' || status === 'running';

  const pct = run?.progress
    ? Math.round((run.progress.value / Math.max(1, run.progress.max)) * 100)
    : null;

  const nodeId =
    run?.executingNode ?? run?.progress?.nodeId ?? run?.error?.nodeId ?? null;
  const nodeLabel =
    nodeId && workflow?.[nodeId]
      ? `#${nodeId} · ${nodeTitle(nodeId, workflow[nodeId])}` +
        (objectInfo?.[workflow[nodeId].class_type]?.category
          ? ` · ${objectInfo[workflow[nodeId].class_type].category}`
          : '')
      : nodeId
      ? `#${nodeId}`
      : null;

  const lastOutput =
    run && run.outputs.length ? run.outputs[run.outputs.length - 1] : null;
  const previewSrc =
    isRunning && run?.preview
      ? run.preview
      : lastOutput
      ? comfyImageUrl(lastOutput.filename, lastOutput.subfolder, lastOutput.type)
      : null;

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
        {status === 'running' || status === 'queued' ? (
          <Badge>
            <Loader2 className="size-3 animate-spin" />
            {status === 'queued' ? t('run.queued') : t('run.running')}
          </Badge>
        ) : status === 'success' ? (
          <Badge className="bg-emerald-600 hover:bg-emerald-600">{t('run.success')}</Badge>
        ) : status === 'error' ? (
          <Badge variant="destructive">{t('run.error')}</Badge>
        ) : (
          <Badge variant="secondary">{t('run.idle')}</Badge>
        )}
        {pct !== null && (
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            {run!.progress!.value}/{run!.progress!.max} · {pct}%
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => interrupt()}
            disabled={!isRunning}
          >
            <Square className="size-3" />
            {t('panel.interrupt')}
          </Button>
          {onClose && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              title={closeLabel ?? t('common.close')}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {pct !== null && (
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 grid place-items-center bg-muted/30 overflow-hidden">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="preview"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-sm text-muted-foreground p-6">
            {t('run.previewWaiting')}
          </div>
        )}
      </div>

      {nodeLabel && (
        <div className="px-3 py-1.5 border-t border-border/60 text-[11px] font-mono text-muted-foreground truncate">
          {nodeLabel}
        </div>
      )}
      {run?.error && (
        <div className="px-3 py-2 border-t border-destructive/40 bg-destructive/5 text-xs text-destructive font-mono">
          {run.error.type}: {run.error.message}
        </div>
      )}
    </div>
  );
}
