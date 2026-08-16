import { NextResponse } from "next/server";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

let passportStore = { ...INITIAL_PASSPORT };

export async function GET(request) {
  return NextResponse.json({ success: true, passport: passportStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (typeof body.isPublic === "boolean") {
      passportStore.isPublic = body.isPublic;
      passportStore.updatedAt = new Date().toISOString();
    }
    return NextResponse.json({ success: true, passport: passportStore });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update passport visibility" }, { status: 400 });
  }
}

