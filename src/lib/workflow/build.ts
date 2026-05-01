import { exposedKey, type ApiWorkflow } from './types';

export function buildWorkflow(
  workflow: ApiWorkflow,
  overrides: Record<string, unknown>,
): ApiWorkflow {
  const out: ApiWorkflow = {};
  for (const [nodeId, node] of Object.entries(workflow)) {
    const newInputs: Record<string, unknown> = { ...node.inputs };
    for (const inputName of Object.keys(node.inputs)) {
      const k = exposedKey(nodeId, inputName);
      if (k in overrides) newInputs[inputName] = overrides[k];
    }
    out[nodeId] = { ...node, inputs: newInputs };
  }
  return out;
}

export function getCurrentValue(
  workflow: ApiWorkflow,
  overrides: Record<string, unknown>,
  nodeId: string,
  inputName: string,
): unknown {
  const k = exposedKey(nodeId, inputName);
  if (k in overrides) return overrides[k];
  return workflow[nodeId]?.inputs[inputName];
}
