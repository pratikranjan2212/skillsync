import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fetchCredlyBadges } from "@/lib/integrations/credly";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const badgeUrl = searchParams.get("badgeUrl") || searchParams.get("url") || "";
    const credlyUrl = searchParams.get("credlyUrl") || user.credlyUrl || "";

    const result = await fetchCredlyBadges({
      badgeUrl,
      credlyUrl,
      userId: user.id,
    });

    if (!result.success && result.isPrivate) {
      return NextResponse.json({
        success: false,
        isPrivate: true,
        error: result.error || "Credly Profile is Private",
        message: result.message,
        badges: [],
        totalCount: 0,
      }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({
        success: false,
        isPrivate: false,
        error: result.error || "Failed to fetch badges from Credly",
        message: result.message,
        badges: [],
        totalCount: 0,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      isPrivate: false,
      credlyUrl,
      badges: result.badges || [],
      totalCount: result.totalCount || 0,
      source: result.source,
      message: result.message,
    });
  } catch (err) {
    console.error("Credly badges GET error:", err);
    return NextResponse.json({ error: "Failed to fetch Credly badges: " + err.message }, { status: 500 });
  }
}
