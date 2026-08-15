
import { NextResponse } from "next/server";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export async function GET(request, { params }) {
  const { shareToken } = await params;

  if (shareToken === INITIAL_PASSPORT.shareToken || shareToken.startsWith("sp-token-")) {
    if (!INITIAL_PASSPORT.isPublic && shareToken !== INITIAL_PASSPORT.shareToken) {
      return NextResponse.json({ error: "Passport is set to private by student" }, { status: 403 });
    }
    return NextResponse.json({ success: true, passport: INITIAL_PASSPORT });
  }

  return NextResponse.json({ error: "Invalid share token" }, { status: 404 });
}
