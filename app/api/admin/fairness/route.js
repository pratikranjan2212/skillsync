import { NextResponse } from "next/server";
import { INITIAL_FAIRNESS_AUDIT_LOGS } from "@/app/data/mockData";

export async function GET(request) {
  // TODO: replace mock once /api/admin/fairness backend service is live
  return NextResponse.json({
    success: true,
    audits: INITIAL_FAIRNESS_AUDIT_LOGS,
    excludedParameters: ["gender", "college tier", "name", "photo"],
  });
}
