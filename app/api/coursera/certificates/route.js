import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fetchCourseraCertificates } from "@/lib/integrations/coursera";
import { env } from "@/lib/config/env";

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
    const queryUrl = searchParams.get("courseraUrl") || searchParams.get("url") || user.courseraUrl || "";

    const result = await fetchCourseraCertificates({
      apiKey: env.courseraApiKey,
      courseraUrl: queryUrl,
      userId: user.id,
      email: user.email,
      name: user.name || "",
    });

    return NextResponse.json({
      success: true,
      apiKeyConfigured: Boolean(env.courseraApiKey),
      courseraUrl: queryUrl,
      certificates: result.certificates || [],
      totalCount: result.totalCount || 0,
      source: result.source,
    });
  } catch (err) {
    console.error("Coursera certificates GET error:", err);
    return NextResponse.json({ error: "Failed to fetch Coursera certificates: " + err.message }, { status: 500 });
  }
}
