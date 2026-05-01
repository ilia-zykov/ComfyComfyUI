import type { NodeInputSpec, InputConfig } from '@/lib/comfy/types';

export type WidgetSpec =
  | {
      kind: 'int';
      default?: number;
      min?: number;
      max?: number;
      step?: number;
      controlAfterGenerate?: boolean;
      tooltip?: string;
    }
  | {
      kind: 'float';
      default?: number;
      min?: number;
      max?: number;
      step?: number;
      round?: number | false;
      tooltip?: string;
    }
  | {
      kind: 'string';
      default?: string;
      multiline?: boolean;
      placeholder?: string;
      tooltip?: string;
    }
  | { kind: 'boolean'; default?: boolean; tooltip?: string }
  | {
      kind: 'combo';
      options: string[];
      default?: string;
      imageUpload?: boolean;
      tooltip?: string;
    }
  | { kind: 'link'; linkType: string }
  | { kind: 'unknown'; raw: string };

type ExtendedInputConfig = InputConfig & {
  control_after_generate?: boolean;
};

const PRIMITIVE_TYPES = new Set([
  'INT',
  'FLOAT',
  'STRING',
  'BOOLEAN',
]);

export function normalizeSpec(spec: NodeInputSpec | undefined): WidgetSpec {
  if (!spec || !Array.isArray(spec)) return { kind: 'unknown', raw: 'missing' };
  const [t, cfg] = spec;
  const c = (cfg ?? {}) as ExtendedInputConfig;

  if (Array.isArray(t)) {
    const options = t
      .filter((x) => typeof x === 'string' || typeof x === 'number')
      .map((x) => String(x));
    return {
      kind: 'combo',
      options,
      default:
        typeof c.default === 'string' || typeof c.default === 'number'
          ? String(c.default)
          : options[0],
      imageUpload: c.image_upload,
      tooltip: c.tooltip,
    };
  }

  if (typeof t !== 'string') return { kind: 'unknown', raw: String(t) };

  if (!PRIMITIVE_TYPES.has(t)) return { kind: 'link', linkType: t };

  switch (t) {
    case 'INT':
      return {
        kind: 'int',
        default: typeof c.default === 'number' ? c.default : undefined,
        min: typeof c.min === 'number' ? c.min : undefined,
        max: typeof c.max === 'number' ? c.max : undefined,
        step: typeof c.step === 'number' ? c.step : 1,
        controlAfterGenerate: c.control_after_generate,
        tooltip: c.tooltip,
      };
    case 'FLOAT':
      return {
        kind: 'float',
        default: typeof c.default === 'number' ? c.default : undefined,
        min: typeof c.min === 'number' ? c.min : undefined,
        max: typeof c.max === 'number' ? c.max : undefined,
        step: typeof c.step === 'number' ? c.step : 0.1,
        round: c.round,
        tooltip: c.tooltip,
      };
    case 'STRING':
      return {
        kind: 'string',
        default: typeof c.default === 'string' ? c.default : undefined,
        multiline: !!c.multiline,
        placeholder: c.placeholder,
        tooltip: c.tooltip,
      };
    case 'BOOLEAN':
      return {
        kind: 'boolean',
        default: typeof c.default === 'boolean' ? c.default : undefined,
        tooltip: c.tooltip,
      };
  }
  return { kind: 'unknown', raw: t };
}

export function isSeedInput(inputName: string, spec: WidgetSpec): boolean {
  if (spec.kind !== 'int') return false;
  return (
    spec.controlAfterGenerate === true ||
    inputName === 'seed' ||
    inputName === 'noise_seed'
  );
}

export function shouldUseSlider(spec: WidgetSpec): boolean {
  if (spec.kind !== 'int' && spec.kind !== 'float') return false;
  if (spec.min == null || spec.max == null) return false;
  const range = spec.max - spec.min;
  // INT64 max и подобные — не слайдером
  if (range > 1_000_000) return false;
  if (range <= 0) return false;
  return true;
}
