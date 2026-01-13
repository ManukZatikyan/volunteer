import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { migrateContentToMongoDB } from '@/lib/migrate-content';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    await migrateContentToMongoDB();

    return NextResponse.json({ 
      success: true, 
      message: 'Content migration completed successfully' 
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}

