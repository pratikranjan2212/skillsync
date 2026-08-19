import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";
import prisma from "@/lib/prisma";
import { fetchLinkedInJobs } from "@/lib/ingestion/linkedin";
import { fetchRemotiveJobs } from "@/lib/ingestion/remotive";
import { fetchArbeitnowJobs } from "@/lib/ingestion/arbeitnow";
import { fetchJobicyJobs } from "@/lib/ingestion/jobicy";

export async function GET(request) {
  // Check authorization via CRON_SECRET header if provided
  const authHeader = request.headers.get("authorization");
  if (
    env.cronSecret &&
    env.isProduction &&
    authHeader !== `Bearer ${env.cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 });
  }

  try {
    const [linkedInRes, remotiveRes, arbeitnowRes, jobicyRes] = await Promise.allSettled([
      fetchLinkedInJobs("software developer intern", "India"),
      fetchRemotiveJobs(),
      fetchArbeitnowJobs(),
      fetchJobicyJobs(),
    ]);

    const allJobs = [
      ...(linkedInRes.status === "fulfilled" ? linkedInRes.value : []),
      ...(remotiveRes.status === "fulfilled" ? remotiveRes.value : []),
      ...(arbeitnowRes.status === "fulfilled" ? arbeitnowRes.value : []),
      ...(jobicyRes.status === "fulfilled" ? jobicyRes.value : []),
    ];

    let persistedCount = 0;
    try {
      for (const job of allJobs) {
        if (!job.externalId) continue;
        await prisma.opportunity.upsert({
          where: { externalId: job.externalId },
          update: {
            title: job.title,
            company: job.company,
            location: job.location,
            stipend: job.stipend,
            type: job.type,
            description: job.description,
            requiredSkills: job.requiredSkills,
            source: job.source,
            url: job.linkedinUrl || job.url,
          },
          create: job,
        });
        persistedCount++;
      }
    } catch (dbErr) {
      console.warn("DB Ingestion fallback (offline mode):", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      ingested: allJobs.length,
      persisted: persistedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cron ingestion error:", err);
    return NextResponse.json({ error: "Job ingestion failed" }, { status: 500 });
  }
}
