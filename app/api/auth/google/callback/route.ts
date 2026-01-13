import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // Can be used to pass locale/pageKey

  // Extract locale from state or referer, default to 'en'
  let locale = 'en';
  if (state) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      locale = stateData.locale || 'en';
    } catch (e) {
      // If state is not JSON, try to extract from referer
      const referer = request.headers.get('referer') || '';
      const localeMatch = referer.match(/\/(en|hy)\//);
      locale = localeMatch ? localeMatch[1] : 'en';
    }
  } else {
    const referer = request.headers.get('referer') || '';
    const localeMatch = referer.match(/\/(en|hy)\//);
    locale = localeMatch ? localeMatch[1] : 'en';
  }

  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/registration?error=auth_failed`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/registration?error=no_code`, request.url));
  }

  // Exchange code for tokens
  try {
    // Use the actual request URL to construct redirect_uri - this ensures it matches exactly
    const requestUrl = new URL(request.url);
    const redirectUri = `${requestUrl.origin}${requestUrl.pathname}`;
    
    // Try NEXT_PUBLIC_GOOGLE_CLIENT_ID first (for client-side), fallback to GOOGLE_CLIENT_ID
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId) {
      console.error('Missing Google OAuth Client ID. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID in your .env.local file');
      return NextResponse.redirect(new URL(`/${locale}/registration?error=config_error&details=missing_client_id`, request.url));
    }

    if (!clientSecret) {
      console.error('Missing Google OAuth Client Secret. Set GOOGLE_CLIENT_SECRET in your .env.local file');
      return NextResponse.redirect(new URL(`/${locale}/registration?error=config_error&details=missing_client_secret`, request.url));
    }

    console.log('Exchanging code for tokens:', {
      redirectUri,
      hasCode: !!code,
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      let errorMessage = 'Unknown error';
      try {
        const errorJson = JSON.parse(errorData);
        errorMessage = errorJson.error_description || errorJson.error || errorData;
      } catch {
        errorMessage = errorData;
      }
      
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorMessage,
        redirectUri,
        expectedRedirectUri: redirectUri,
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      });
      
      return NextResponse.redirect(new URL(`/${locale}/registration?error=token_exchange_failed&details=${encodeURIComponent(errorMessage)}`, request.url));
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userResponse.json();

    // Create a session or token (simplified - you may want to use proper session management)
    // For now, we'll redirect with a success parameter
    const redirectUrl = new URL(`/${locale}/registration`, request.url);
    redirectUrl.searchParams.set('auth', 'success');
    redirectUrl.searchParams.set('email', userInfo.email);
    redirectUrl.searchParams.set('name', userInfo.name);
    
    // Preserve pageKey from state if it exists
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        if (stateData.pageKey) {
          redirectUrl.searchParams.set('pageKey', stateData.pageKey);
        }
      } catch (e) {
        // Fallback to extracting from referer
        const originalUrl = request.headers.get('referer') || '';
        const pageKeyMatch = originalUrl.match(/[?&]pageKey=([^&]+)/);
        if (pageKeyMatch) {
          redirectUrl.searchParams.set('pageKey', pageKeyMatch[1]);
        }
      }
    } else {
      // Fallback to extracting from referer
      const originalUrl = request.headers.get('referer') || '';
      const pageKeyMatch = originalUrl.match(/[?&]pageKey=([^&]+)/);
      if (pageKeyMatch) {
        redirectUrl.searchParams.set('pageKey', pageKeyMatch[1]);
      }
    }
    
    // Set a cookie with user info (in production, use httpOnly, secure cookies)
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('google_user', JSON.stringify({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    }), {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    const referer = request.headers.get('referer') || '';
    const localeMatch = referer.match(/\/(en|hy)\//);
    const locale = localeMatch ? localeMatch[1] : 'en';
    return NextResponse.redirect(new URL(`/${locale}/registration?error=auth_failed`, request.url));
  }
}

