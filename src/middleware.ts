import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const isMobileOrTablet = device.type === 'mobile' || device.type === 'tablet';

  if (isMobileOrTablet) {
    return NextResponse.redirect(new URL('/desktop-locked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all protected app routes:
     * - dashboard
     * - portfolio
     * - discover
     * - ai-chat
     * - profile
     * - settings
     * - stock
     */
    '/dashboard/:path*',
    '/portfolio/:path*',
    '/discover/:path*',
    '/ai-chat/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/stock/:path*'
  ],
};
