import { NextResponse } from "next/server";
import { INITIAL_OPPORTUNITIES } from "@/app/data/mockData";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword")?.toLowerCase() || "";
    const source = searchParams.get("source")?.toLowerCase() || "all";
    const minScore = parseInt(searchParams.get("minScore") || "0", 10);

    let list = [...INITIAL_OPPORTUNITIES];

    if (keyword) {
      list = list.filter(
        (op) =>
          op.title.toLowerCase().includes(keyword) ||
          op.company.toLowerCase().includes(keyword) ||
          op.skillsRequired.some((s) => s.toLowerCase().includes(keyword))
      );
    }

    if (source !== "all") {
      list = list.filter((op) => op.source.toLowerCase() === source);
    }

    if (minScore > 0) {
      list = list.filter((op) => op.matchScore >= minScore);
    }

    list.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      total: list.length,
      opportunities: list,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch opportunities" }, { status: 500 });
  }
}