import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const isMobileOrTablet = device.type === 'mobile' || device.type === 'tablet';

  if (isMobileOrTablet) {
    return NextResponse.rewrite(new URL('/desktop-locked', request.url));
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - desktop-locked (the locked page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|desktop-locked).*)',
  ],
};
