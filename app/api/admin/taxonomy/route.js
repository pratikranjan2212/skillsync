import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_SKILL_TAXONOMY } from "@/app/data/mockData";

let taxonomyStore = [...INITIAL_SKILL_TAXONOMY];

export async function GET(request) {
  try {
    const dbSkills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });

    if (dbSkills && dbSkills.length > 0) {
      return NextResponse.json({ success: true, taxonomy: dbSkills });
    }
  } catch (err) {
    console.warn("DB Taxonomy GET fallback:", err.message);
  }

  return NextResponse.json({ success: true, taxonomy: taxonomyStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    let created = null;

    try {
      created = await prisma.skill.create({
        data: {
          name: name.trim(),
          category: category || "General",
          description: description || "",
        },
      });
    } catch (dbErr) {
      console.warn("DB Taxonomy POST fallback:", dbErr.message);
    }

    const newSkill = created || {
      id: `sk-${Date.now()}`,
      name: name.trim(),
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

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    try {
      await prisma.skill.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("DB Taxonomy DELETE fallback:", dbErr.message);
    }

    taxonomyStore = taxonomyStore.filter((sk) => sk.id !== id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete skill record" }, { status: 400 });
  }
}
