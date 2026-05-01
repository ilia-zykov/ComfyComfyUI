import { NextRequest, NextResponse } from 'next/server';
import { listPresets, createPreset } from '@/lib/presets/storage';
import { newPresetInputSchema } from '@/lib/presets/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await listPresets();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = newPresetInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid input', details: parsed.error.issues },
      { status: 400 },
    );
  }
  const preset = await createPreset({
    ...parsed.data,
    description: parsed.data.description ?? '',
  });
  return NextResponse.json({ preset }, { status: 201 });
}
