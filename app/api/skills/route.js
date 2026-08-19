import { NextResponse } from "next/server";
import { STUDENT_INTERN_SKILLS, searchSkills, SKILL_CATEGORIES, SKILLS_BY_CATEGORY } from "@/app/data/studentInternSkills";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";

export async function GET(request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(
      `skills-api:${clientIp}`,
      RATE_LIMIT_PRESETS.GENERAL_API.maxRequests,
      RATE_LIMIT_PRESETS.GENERAL_API.windowMs
    );
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit.resetTime);
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (query) {
      const results = searchSkills(query, limit);
      return NextResponse.json({
        success: true,
        count: results.length,
        skills: results,
      });
    }

    if (category) {
      const filtered = STUDENT_INTERN_SKILLS.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      ).slice(0, limit);
      return NextResponse.json({
        success: true,
        count: filtered.length,
        skills: filtered,
      });
    }

    return NextResponse.json({
      success: true,
      total: STUDENT_INTERN_SKILLS.length,
      categories: SKILL_CATEGORIES,
      skillsByCategory: SKILLS_BY_CATEGORY,
      skills: STUDENT_INTERN_SKILLS.slice(0, limit),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills taxonomy" }, { status: 500 });
  }
}
