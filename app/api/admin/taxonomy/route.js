import { NextResponse } from "next/server";
import { INITIAL_SKILL_TAXONOMY } from "@/app/data/mockData";

let taxonomyStore = [...INITIAL_SKILL_TAXONOMY];

export async function GET(request) {
  // TODO: replace mock once /api/admin/taxonomy backend service is live
  return NextResponse.json({ success: true, taxonomy: taxonomyStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, description } = body;

    const newSkill = {
      id: `sk-${Date.now()}`,
      name: name || "New Skill",
      category: category || "General",
      description: description || "",
    };

    taxonomyStore.push(newSkill);
    return NextResponse.json({ success: true, skill: newSkill }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create skill record" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    taxonomyStore = taxonomyStore.filter((sk) => sk.id !== id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete skill record" }, { status: 400 });
  }
}
