import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PAGES } from '@/lib/content';

export async function GET() {
  try {
    await requireAuth();
    return NextResponse.json({ pages: PAGES });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

