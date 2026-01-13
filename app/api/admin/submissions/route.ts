import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import FormSubmission from '@/lib/models/FormSubmission';
import Form from '@/lib/models/Form';

// GET all form submissions
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');

    // Build query
    const query: any = {};
    if (pageKey) {
      query.pageKey = pageKey;
    }

    // Fetch submissions with form details
    const submissions = await FormSubmission.find(query)
      .populate('formId', 'pageKey steps')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ submissions });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

