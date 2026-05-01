import { NextRequest, NextResponse } from 'next/server';
import {
  getPreset,
  updatePreset,
  deletePreset,
} from '@/lib/presets/storage';
import { updatePresetInputSchema } from '@/lib/presets/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const preset = await getPreset(id);
  if (!preset) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ preset });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = updatePresetInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid input', details: parsed.error.issues },
      { status: 400 },
    );
  }
  const preset = await updatePreset(id, parsed.data);
  if (!preset) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ preset });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const ok = await deletePreset(id);
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
