import { NextResponse } from "next/server";

export async function GET(req) {
  const { pathname } = new URL(req.url);

  if (pathname.endsWith("/csrf")) {
    return NextResponse.json({ csrfToken: "skillsync-csrf-token" });
  }

  if (pathname.endsWith("/providers")) {
    return NextResponse.json({
      credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        signinUrl: "/api/auth/signin/credentials",
        callbackUrl: "/api/auth/callback/credentials",
      },
    });
  }

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("skillsync_session")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.json(null);
  }

  const role = req.cookies.get("skillsync_role")?.value || "student";
  const user =
    role === "admin"
      ? { id: "adm-001", name: "Admin Lead", email: "admin@skillsync.edu", role: "admin" }
      : { id: "std-101", name: "Alex Chen", email: "alex.chen@skillsync.edu", role: "student" };

  return NextResponse.json({ user, expires: new Date(Date.now() + 86400000).toISOString() });
}

export async function POST(req) {
  const { pathname } = new URL(req.url);

  if (pathname.includes("signout")) {
    const response = NextResponse.json({ url: "/" });
    response.cookies.set("skillsync_session", "", { path: "/", maxAge: 0, expires: new Date(0) });
    response.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0, expires: new Date(0) });
    response.cookies.set("skillsync_role", "", { path: "/", maxAge: 0, expires: new Date(0) });
    response.cookies.set("__Secure-next-auth.session-token", "", { path: "/", maxAge: 0, expires: new Date(0) });
    return response;
  }

  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
    }

    const { email, role } = body;

    const assignedRole = role || (email?.includes("admin") ? "admin" : "student");
    const user = {
      id: assignedRole === "admin" ? "adm-001" : "std-101",
      name: assignedRole === "admin" ? "Admin Lead" : "Alex Chen",
      email: email || (assignedRole === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu"),
      role: assignedRole,
    };

    const response = NextResponse.json({ ok: true, user, url: "/dashboard" });

    response.cookies.set("skillsync_session", "session-active-token", { path: "/", httpOnly: false });
    response.cookies.set("next-auth.session-token", "session-active-token", { path: "/", httpOnly: false });
    response.cookies.set("skillsync_role", assignedRole, { path: "/", httpOnly: false });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 400 });
  }
}

