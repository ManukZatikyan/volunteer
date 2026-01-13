import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Form from '@/lib/models/Form';
import { FORM_ALLOWED_PAGES } from '@/lib/pages';

// GET all forms
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const forms = await Form.find({}).sort({ pageKey: 1 });
    return NextResponse.json({ forms });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get forms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - create new form
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const body = await request.json();
    const { pageKey, steps } = body;

    if (!pageKey) {
      return NextResponse.json(
        { error: 'pageKey is required' },
        { status: 400 }
      );
    }

    // Check if page is allowed to have forms
    if (!FORM_ALLOWED_PAGES.includes(pageKey as any)) {
      return NextResponse.json(
        { error: 'Forms are not allowed for this page' },
        { status: 403 }
      );
    }

    // Check if form already exists
    const existing = await Form.findOne({ pageKey });
    if (existing) {
      return NextResponse.json(
        { error: 'Form for this page already exists' },
        { status: 400 }
      );
    }

    const form = new Form({
      pageKey,
      steps: steps || [],
    });

    await form.save();

    return NextResponse.json({ form, success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Create form error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

