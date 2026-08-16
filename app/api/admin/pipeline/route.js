import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const evidenceList = await prisma.evidence.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, pipeline: evidenceList || [] });
  } catch (err) {
    console.warn("DB Admin Pipeline GET fallback:", err.message);
    return NextResponse.json({ success: true, pipeline: [] });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, newTier } = body;

    if (!id || !newTier) {
      return NextResponse.json({ error: "Evidence ID and new tier are required" }, { status: 400 });
    }

    let updatedItem = null;

    try {
      updatedItem = await prisma.evidence.update({
        where: { id },
        data: {
          verificationTier: newTier,
          adminOverride: true,
          verificationReason: `Admin manual override set tier to ${newTier}`,
        },
      });
    } catch (dbErr) {
      console.warn("DB Admin Pipeline PATCH fallback:", dbErr.message);
    }

    const item = pipelineStore.find((ev) => ev.id === id);
    if (item) {
      item.verificationTier = newTier;
      item.adminOverride = true;
      item.verificationReason = `Admin manual override set tier to ${newTier}`;
      if (!updatedItem) updatedItem = item;
    }

    return NextResponse.json({ success: true, item: updatedItem || item });
  } catch (err) {
    return NextResponse.json({ error: "Failed to apply manual override" }, { status: 400 });
  }
}
