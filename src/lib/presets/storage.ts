import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { presetSchema, type Preset, type PresetSummary } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'presets');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function presetPath(id: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error('invalid preset id');
  }
  return path.join(DATA_DIR, `${id}.json`);
}

export async function listPresets(): Promise<PresetSummary[]> {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  const out: PresetSummary[] = [];
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, f), 'utf8');
      const data = presetSchema.parse(JSON.parse(raw));
      out.push({
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        workflowName: data.workflowName,
        exposedCount: data.exposed.length,
        nodeCount: Object.keys(data.workflow).length,
      });
    } catch {
      /* skip broken */
    }
  }
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

export async function getPreset(id: string): Promise<Preset | null> {
  await ensureDir();
  try {
    const raw = await fs.readFile(presetPath(id), 'utf8');
    return presetSchema.parse(JSON.parse(raw));
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return null;
    throw e;
  }
}

export async function createPreset(
  input: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Preset> {
  await ensureDir();
  const id = randomUUID();
  const now = Date.now();
  const preset: Preset = {
    id,
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  await fs.writeFile(presetPath(id), JSON.stringify(preset, null, 2), 'utf8');
  return preset;
}

export async function updatePreset(
  id: string,
  patch: Partial<Omit<Preset, 'id' | 'createdAt'>>,
): Promise<Preset | null> {
  const existing = await getPreset(id);
  if (!existing) return null;
  const next: Preset = {
    ...existing,
    ...patch,
    id,
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
  };
  await fs.writeFile(presetPath(id), JSON.stringify(next, null, 2), 'utf8');
  return next;
}

export async function deletePreset(id: string): Promise<boolean> {
  await ensureDir();
  try {
    await fs.unlink(presetPath(id));
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw e;
  }
}
