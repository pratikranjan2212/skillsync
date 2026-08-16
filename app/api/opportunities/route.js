import { NextResponse } from "next/server";
import { INITIAL_OPPORTUNITIES } from "@/app/data/mockData";

export async function GET(request) {
  return NextResponse.json({ success: true, opportunities: INITIAL_OPPORTUNITIES });
}

