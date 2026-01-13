import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Form from '@/lib/models/Form';

// GET form by pageKey (public route for users)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await connectDB();
    const { pageKey } = await params;

    const form = await Form.findOne({ pageKey });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ form });
  } catch (error: any) {
    console.error('Get form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

