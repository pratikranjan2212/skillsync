import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fetchLinkedInCertifications } from "@/lib/integrations/linkedin";

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
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const queryUrl = searchParams.get("linkedinUrl") || searchParams.get("url") || user.linkedinUrl || "";
    const title = searchParams.get("title") || "";
    const issuer = searchParams.get("issuer") || "";
    const credentialId = searchParams.get("credentialId") || "";
    const verificationUrl = searchParams.get("verificationUrl") || "";

    const linkedInAccount = user.accounts?.find((a) => a.provider === "linkedin");

    const result = await fetchLinkedInCertifications({
      linkedinUrl: queryUrl,
      title,
      issuer,
      credentialId,
      verificationUrl,
      accessToken: linkedInAccount?.access_token || null,
      userId: user.id,
      name: user.name || "",
    });

    return NextResponse.json({
      success: true,
      linkedinUrl: queryUrl,
      certifications: result.certifications || [],
      totalCount: result.totalCount || 0,
      source: result.source,
      message: result.message,
    });
  } catch (err) {
    console.error("LinkedIn certifications GET error:", err);
    return NextResponse.json({ error: "Failed to fetch LinkedIn certifications: " + err.message }, { status: 500 });
  }
}
