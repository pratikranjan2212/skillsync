import { NextResponse } from "next/server";
import { INITIAL_OPPORTUNITIES } from "@/app/data/mockData";

export async function GET(request, { params }) {
  const { id } = await params;
  const item = INITIAL_OPPORTUNITIES.find((op) => op.id === id) || INITIAL_OPPORTUNITIES[0];

  if (!item) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    opportunity: item,
    explanation: item.explanation,
  });
}