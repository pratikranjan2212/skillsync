import { NextResponse } from "next/server";
import { INITIAL_EVIDENCE } from "@/app/data/mockData";

export async function GET(req) {
  // Return current mock session
  const role = req.cookies.get("skillsync_role")?.value || "student";
  const user =
    role === "admin"
      ? { id: "adm-001", name: "Admin Lead", email: "admin@skillsync.edu", role: "admin" }
      : { id: "std-101", name: "Alex Chen", email: "alex.chen@skillsync.edu", role: "student" };

  return NextResponse.json({ user, expires: new Date(Date.now() + 86400000).toISOString() });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, role } = body;

    const assignedRole = role || (email?.includes("admin") ? "admin" : "student");
    const user = {
      id: assignedRole === "admin" ? "adm-001" : "std-101",
      name: assignedRole === "admin" ? "Admin Lead" : "Alex Chen",
      email: email || (assignedRole === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu"),
      role: assignedRole,
    };

    const response = NextResponse.json({ ok: true, user });

    // Set cookies for Next.js 16 proxy.js route validation
    response.cookies.set("skillsync_session", "session-active-token", { path: "/", httpOnly: false });
    response.cookies.set("next-auth.session-token", "session-active-token", { path: "/", httpOnly: false });
    response.cookies.set("skillsync_role", assignedRole, { path: "/", httpOnly: false });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 400 });
  }
}
