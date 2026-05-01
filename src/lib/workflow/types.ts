import { z } from 'zod';

export const apiNodeSchema = z.object({
  inputs: z.record(z.string(), z.unknown()),
  class_type: z.string(),
  _meta: z
    .object({ title: z.string().optional() })
    .loose()
    .optional(),
});

export const apiWorkflowSchema = z.record(z.string(), apiNodeSchema);

export type ApiNode = z.infer<typeof apiNodeSchema>;
export type ApiWorkflow = z.infer<typeof apiWorkflowSchema>;

export type Link = [string | number, number];

export function isLink(v: unknown): v is Link {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    (typeof v[0] === 'string' || typeof v[0] === 'number') &&
    typeof v[1] === 'number'
  );
}

export type EditableInput = {
  nodeId: string;
  inputName: string;
  value: unknown;
};

export type ExposedKey = string;
export const exposedKey = (nodeId: string, input: string): ExposedKey =>
  `${nodeId}::${input}`;
