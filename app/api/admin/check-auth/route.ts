import { NextResponse } from 'next/server';
import { checkSession } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthenticated = await checkSession();
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

