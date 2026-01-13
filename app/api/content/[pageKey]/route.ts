import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, type PageKey } from '@/lib/content';

// Public API endpoint for fetching content (used by frontend)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const content = await getPageContent(pageKey as PageKey, locale);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

