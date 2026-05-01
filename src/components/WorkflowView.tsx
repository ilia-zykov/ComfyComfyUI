'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useWorkflowStore } from '@/store/workflow';
import { useT } from '@/store/i18n';
import { exposedKey, isLink } from '@/lib/workflow/types';
import { getEditableInputs, nodeTitle } from '@/lib/workflow/parse';
import type { ObjectInfo } from '@/lib/comfy/types';
import { PresetMenu } from './PresetMenu';

async function fetchObjectInfo(): Promise<ObjectInfo> {
  const r = await fetch('/api/comfy/object_info');
  if (!r.ok) throw new Error(`object_info → ${r.status}`);
  return r.json();
}

function valuePreview(v: unknown): string {
  if (v === null) return 'null';
  if (typeof v === 'string') {
    const s = v.length > 60 ? v.slice(0, 57) + '…' : v;
    return JSON.stringify(s);
  }
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.length}]`;
  return typeof v;
}

function inputTypeBadge(spec: unknown): string {
  if (!Array.isArray(spec) || spec.length === 0) return '?';
  const t = spec[0];
  if (Array.isArray(t)) return `COMBO(${t.length})`;
  if (typeof t === 'string') return t;
  return '?';
}

export function WorkflowView() {
  const t = useT();
  const workflow = useWorkflowStore((s) => s.workflow);
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const exposed = useWorkflowStore((s) => s.exposed);
  const toggleExposed = useWorkflowStore((s) => s.toggleExposed);
  const setExposedBulk = useWorkflowStore((s) => s.setExposedBulk);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);

  const [filter, setFilter] = useState('');
  const [onlyEditable, setOnlyEditable] = useState(true);
  const [onlyExposed, setOnlyExposed] = useState(false);

  const { data: objectInfo } = useQuery({
    queryKey: ['object_info'],
    queryFn: fetchObjectInfo,
    staleTime: 60_000,
  });

  const editable = useMemo(
    () => (workflow ? getEditableInputs(workflow) : []),
    [workflow],
  );

  const exposedSet = useMemo(() => new Set(exposed), [exposed]);

  const sortedNodes = useMemo(() => {
    if (!workflow) return [];
    const entries = Object.entries(workflow);
    return entries.sort((a, b) => {
      const an = parseInt(a[0], 10);
      const bn = parseInt(b[0], 10);
      if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
      return a[0].localeCompare(b[0]);
    });
  }, [workflow]);

  const filteredNodes = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return sortedNodes.filter(([nodeId, node]) => {
      if (q) {
        const hay = `${nodeId} ${node.class_type} ${nodeTitle(nodeId, node)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (onlyEditable) {
        const hasEditable = Object.values(node.inputs).some((v) => !isLink(v));
        if (!hasEditable) return false;
      }
      if (onlyExposed) {
        const anyExposed = Object.keys(node.inputs).some((name) =>
          exposedSet.has(exposedKey(nodeId, name)),
        );
        if (!anyExposed) return false;
      }
      return true;
    });
  }, [sortedNodes, filter, onlyEditable, onlyExposed, exposedSet]);

  if (!workflow) return null;

  const totalNodes = Object.keys(workflow).length;

  function exposeAll() {
    setExposedBulk(
      editable.map(({ nodeId, inputName }) => exposedKey(nodeId, inputName)),
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
        <CardTitle className="flex-1 min-w-0">
          {workflowName || t('wfv.unnamedWorkflow')}{' '}
          <span className="text-muted-foreground font-normal text-sm">
            · {totalNodes} {t('wfv.totalNodes')} · {editable.length} {t('wfv.editable')} · {exposed.length} {t('wfv.exposed')}
          </span>
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <PresetMenu />
          <Button size="sm" variant="outline" onClick={exposeAll}>
            {t('wfv.exposeAll')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExposedBulk([])}
            disabled={exposed.length === 0}
          >
            {t('wfv.unexposeAll')}
          </Button>
          <Button size="sm" variant="ghost" onClick={clearWorkflow}>
            {t('wfv.removeWorkflow')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder={t('wfv.filterPlaceholder')}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-md"
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={onlyEditable}
              onCheckedChange={(v) => setOnlyEditable(v === true)}
            />
            {t('wfv.onlyEditable')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={onlyExposed}
              onCheckedChange={(v) => setOnlyExposed(v === true)}
            />
            {t('wfv.onlyExposed')}
          </label>
        </div>

        <div className="space-y-3">
          {filteredNodes.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('wfv.empty')}</p>
          )}
          {filteredNodes.map(([nodeId, node]) => {
            const schema = objectInfo?.[node.class_type];
            const required = schema?.input.required ?? {};
            const optional = schema?.input.optional ?? {};
            const allSpecs = { ...required, ...optional };

            return (
              <div
                key={nodeId}
                className="rounded-lg border border-border/60 bg-card/40"
              >
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60">
                  <Badge variant="outline" className="font-mono text-xs">
                    #{nodeId}
                  </Badge>
                  <div className="font-medium">{nodeTitle(nodeId, node)}</div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {node.class_type}
                  </Badge>
                  {schema?.category && (
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {schema.category}
                    </Badge>
                  )}
                </div>
                <div className="divide-y divide-border/40">
                  {Object.entries(node.inputs).map(([inputName, value]) => {
                    const linked = isLink(value);
                    const key = exposedKey(nodeId, inputName);
                    const isExp = exposedSet.has(key);
                    const spec = allSpecs[inputName];
                    return (
                      <div
                        key={inputName}
                        className={`grid grid-cols-[1.5rem_minmax(120px,160px)_1fr_auto] gap-3 items-center px-4 py-2 text-sm ${
                          linked ? 'opacity-60' : ''
                        }`}
                      >
                        <Checkbox
                          checked={isExp}
                          disabled={linked}
                          onCheckedChange={() => !linked && toggleExposed(key)}
                          aria-label="expose input"
                        />
                        <div className="font-mono text-xs">{inputName}</div>
                        <div className="font-mono text-xs text-muted-foreground truncate">
                          {linked
                            ? `→ #${(value as [unknown, number])[0]}[${(value as [unknown, number])[1]}]`
                            : valuePreview(value)}
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {spec ? inputTypeBadge(spec) : linked ? 'link' : '—'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
