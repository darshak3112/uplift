import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.TOKEN_SECRET;

if (!SECRET_KEY) {
  console.error('TOKEN_SECRET is not set in the environment variables');
}

export async function middleware(request) {
  const token = request.cookies.get('authorizeToken')?.value;

  console.log(`[Middleware] Checking route: ${request.nextUrl.pathname}`);
  console.log(`[Middleware] Token present: ${!!token}`);

  if (!token) {
    console.log('[Middleware] No token found, redirecting to login');
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    
    console.log('[Middleware] Token verified successfully');
    console.log(`[Middleware] User ID: ${payload}`);

    // Optional: Check for token expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('[Middleware] Token has expired');
      throw new Error('Token has expired');
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] JWT verification failed:', error.message);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};