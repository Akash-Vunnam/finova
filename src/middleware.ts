import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/desktop-locked'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = !publicRoutes.includes(pathname);

  if (isProtectedRoute) {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobileOrTablet) {
      // Rewrite the URL so it keeps the same path but renders the desktop-locked page
      return NextResponse.rewrite(new URL('/desktop-locked', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
