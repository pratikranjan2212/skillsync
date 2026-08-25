import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractCertificatesFromFiles } from "@/lib/integrations/geminiMultimodalExtractor";

export const dynamic = "force-dynamic";

export async function POST(request) {
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

    const body = await request.json().catch(() => ({}));
    const { files = [] } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No certificate files provided." }, { status: 400 });
    }

    // Limit maximum batch size for memory and rate limit safety
    const filesToProcess = files.slice(0, 15);
    const extractedCertificates = await extractCertificatesFromFiles(filesToProcess);

    return NextResponse.json({
      success: true,
      count: extractedCertificates.length,
      certificates: extractedCertificates,
    });
  } catch (err) {
    console.error("Bulk certificate extraction error:", err);
    return NextResponse.json(
      { error: "Failed to extract certificates with Gemini AI: " + (err.message || String(err)) },
      { status: 500 }
    );
  }
}
