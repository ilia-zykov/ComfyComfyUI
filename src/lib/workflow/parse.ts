import { apiWorkflowSchema, isLink, type ApiWorkflow, type EditableInput } from './types';

export type ParseResult =
  | { ok: true; workflow: ApiWorkflow }
  | { ok: false; error: string };

export function parseWorkflow(raw: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
  }

  // ComfyUI UI export has "nodes" and "links" keys — not what we need.
  if (
    json &&
    typeof json === 'object' &&
    !Array.isArray(json) &&
    'nodes' in json &&
    'links' in json
  ) {
    return {
      ok: false,
      error:
        'This is the UI workflow format. Need API format: in ComfyUI choose Save (API Format).',
    };
  }

  const parsed = apiWorkflowSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: `Does not look like an API workflow: ${parsed.error.issues[0]?.message ?? 'unknown'}`,
    };
  }
  return { ok: true, workflow: parsed.data };
}

export function getEditableInputs(workflow: ApiWorkflow): EditableInput[] {
  const out: EditableInput[] = [];
  for (const [nodeId, node] of Object.entries(workflow)) {
    for (const [inputName, value] of Object.entries(node.inputs)) {
      if (!isLink(value)) {
        out.push({ nodeId, inputName, value });
      }
    }
  }
  return out;
}

export function nodeTitle(nodeId: string, node: { class_type: string; _meta?: { title?: string } }): string {
  return node._meta?.title?.trim() || node.class_type || nodeId;
}
