import { NextResponse } from "next/server";

/**
 * Next.js 16 Route Protection Proxy (proxy.js).
 * Redirects legacy /admin/* routes to unified /dashboard.
 * Protects /dashboard for authenticated sessions.
 * @param {import('next/server').NextRequest} request
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("skillsync_session")?.value;

  // Redirect any legacy /admin/* route to /dashboard
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Route protection for dashboard and profile
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*"],
};
