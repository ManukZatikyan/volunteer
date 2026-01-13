import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getPageContent, updatePageContent, type PageKey } from '@/lib/content';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await requireAuth();
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
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    await requireAuth();
    const { pageKey } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Validate pageKey
    const validPageKeys: PageKey[] = ['home', 'membership', 'camps', 'centerUpJunior', 'futureUp', 'internationalUniversities', 'cursesAndActivities', 'conferences', 'eventOrganization', 'upcomingEvents', 'marketing', 'ourTeam', 'contactUs'];
    if (!validPageKeys.includes(pageKey as PageKey)) {
      return NextResponse.json(
        { error: `Invalid page key: ${pageKey}` },
        { status: 400 }
      );
    }
    
    let content;
    try {
      content = await request.json();
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    await updatePageContent(pageKey as PageKey, locale, content);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Update content error:', error);
    const errorMessage = error.message || 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

