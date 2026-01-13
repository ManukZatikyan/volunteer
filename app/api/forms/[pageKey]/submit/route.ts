import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Form from '@/lib/models/Form';
import FormSubmission from '@/lib/models/FormSubmission';

// POST - submit form data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await connectDB();
    const { pageKey } = await params;

    // Verify form exists
    const form = await Form.findOne({ pageKey });
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { data } = body;

    // Validate submission data structure matches form
    const validationError = validateSubmission(form, data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Save submission
    const submission = new FormSubmission({
      formId: form._id,
      pageKey,
      data,
    });

    await submission.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      submissionId: submission._id 
    });
  } catch (error: any) {
    console.error('Submit form error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Validate submission data against form structure
function validateSubmission(form: any, data: any): string | null {
  if (!form.steps || form.steps.length === 0) {
    return 'Form has no steps';
  }

  if (!data || typeof data !== 'object') {
    return 'Invalid submission data';
  }

  // Check that all required fields are filled
  for (let stepIndex = 0; stepIndex < form.steps.length; stepIndex++) {
    const step = form.steps[stepIndex];
    const stepData = data[`step_${stepIndex}`] || {};

    for (let fieldIndex = 0; fieldIndex < step.fields.length; fieldIndex++) {
      const field = step.fields[fieldIndex];
      const fieldKey = `field_${fieldIndex}`;
      const fieldValue = stepData[fieldKey];

      if (field.required) {
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
          return `Field "${field.label}" in step ${stepIndex + 1} is required`;
        }
      }
    }
  }

  return null;
}

