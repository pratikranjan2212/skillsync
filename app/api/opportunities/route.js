import { NextResponse } from "next/server";
import { INITIAL_OPPORTUNITIES } from "@/app/data/mockData";

export async function GET(request) {
  // TODO: replace mock once /api/opportunities backend service is live
  return NextResponse.json({ success: true, opportunities: INITIAL_OPPORTUNITIES });
}
