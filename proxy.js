import { NextResponse } from "next/server";
import { logRouteSecurity, SecurityEvent, LogLevel } from "@/lib/security/logger";
import { isMaliciousUserAgent, isProbingRestrictedPaths } from "@/lib/security/botProtection";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Defend against automated scanners and malicious path probing
  if (isProbingRestrictedPaths(pathname)) {
    logRouteSecurity(request, SecurityEvent.SUSPICIOUS_TRAFFIC_DETECTED, LogLevel.ALERT, {
      details: { reason: "Probing restricted/vulnerable path", path: pathname, userAgent },
    });
    return new NextResponse("Access Denied", { status: 403 });
  }

  const botCheck = isMaliciousUserAgent(userAgent);
  if (botCheck.isBot) {
    logRouteSecurity(request, SecurityEvent.SUSPICIOUS_TRAFFIC_DETECTED, LogLevel.ALERT, {
      details: { reason: botCheck.reason, userAgent },
    });
    return new NextResponse("Access Denied: Automated scraping or vulnerability scanning detected.", { status: 403 });
  }

  // 2. Enforce HTTPS redirection in production environments
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  if (process.env.NODE_ENV === "production" && proto === "http" && host) {
    return NextResponse.redirect(`https://${host}${pathname}${request.nextUrl.search}`, 301);
  }

  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // 3. Redirect admin routes to dashboard since admin portal is removed
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Protect student dashboard and profile routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!sessionToken) {
      logRouteSecurity(request, SecurityEvent.ACCESS_DENIED_UNAUTHORIZED, LogLevel.WARN, {
        details: { targetPath: pathname, reason: "Missing session token" },
      });

      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
