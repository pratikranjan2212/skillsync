import { NextResponse } from "next/server";
import { INITIAL_EVIDENCE } from "@/app/data/mockData";

let pipelineStore = [...INITIAL_EVIDENCE];

export async function GET(request) {
  return NextResponse.json({ success: true, pipeline: pipelineStore });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, newTier } = body;

    const item = pipelineStore.find((ev) => ev.id === id);
    if (item) {
      item.verificationTier = newTier;
      item.adminOverride = true;
      item.verificationReason = `Admin manual override set tier to ${newTier}`;
    }

    return NextResponse.json({ success: true, item });
  } catch (err) {
    return NextResponse.json({ error: "Failed to apply manual override" }, { status: 400 });
  }
}

