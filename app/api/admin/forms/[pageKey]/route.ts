import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Form from '@/lib/models/Form';
import { FORM_ALLOWED_PAGES } from '@/lib/pages';

// GET form by pageKey
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await requireAuth();
    await connectDB();
    const { pageKey } = await params;

    // Check if page is allowed to have forms
    if (!FORM_ALLOWED_PAGES.includes(pageKey as any)) {
      return NextResponse.json(
        { error: 'Forms are not allowed for this page' },
        { status: 403 }
      );
    }

    const form = await Form.findOne({ pageKey });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ form });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - update form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await requireAuth();
    await connectDB();
    const { pageKey } = await params;

    // Check if page is allowed to have forms
    if (!FORM_ALLOWED_PAGES.includes(pageKey as any)) {
      return NextResponse.json(
        { error: 'Forms are not allowed for this page' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { steps } = body;

    const form = await Form.findOneAndUpdate(
      { pageKey },
      { steps: steps || [] },
      { new: true, upsert: true }
    );

    return NextResponse.json({ form, success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Update form error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - delete form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await requireAuth();
    await connectDB();
    const { pageKey } = await params;

    // Check if page is allowed to have forms
    if (!FORM_ALLOWED_PAGES.includes(pageKey as any)) {
      return NextResponse.json(
        { error: 'Forms are not allowed for this page' },
        { status: 403 }
      );
    }

    await Form.findOneAndDelete({ pageKey });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Delete form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

