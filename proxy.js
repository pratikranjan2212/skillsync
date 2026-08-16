import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("skillsync_session")?.value;

  const userRole = request.cookies.get("skillsync_role")?.value;

  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/signin?role=admin", request.url));
    }
    if (userRole && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

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

