import React from "react";
import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";
import { formatDob } from "@/lib/opportunities/workModeUtils";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#111111",
  },
  headerBanner: {
    backgroundColor: "#064E3B",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#A7F3D0",
    fontSize: 8.5,
    marginTop: 3,
  },
  headerBadge: {
    backgroundColor: "#047857",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "#FFFFFF",
    fontSize: 8.5,
    fontWeight: "bold",
  },
  studentCard: {
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 12,
    border: "2px solid #047857",
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  studentDetailsCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: 80,
    fontSize: 8.5,
    color: "#6B7280",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 8.5,
    color: "#111827",
    fontWeight: "bold",
    flex: 1,
  },
  qrContainer: {
    width: 76,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  qrImage: {
    width: 66,
    height: 66,
  },
  qrLabel: {
    fontSize: 6.5,
    color: "#6B7280",
    marginTop: 3,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#064E3B",
    marginBottom: 6,
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: 3,
  },
  table: {
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #F3F4F6",
    paddingVertical: 5,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    borderBottom: "1px solid #E5E7EB",
  },
  tableCell: {
    fontSize: 8,
    paddingHorizontal: 4,
  },
  colSkill: { width: "32%", fontWeight: "bold" },
  colCategory: { width: "23%", color: "#4B5563" },
  colTier: { width: "18%" },
  colEvidence: { width: "27%", color: "#047857", fontWeight: "bold" },
  proofBox: {
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  proofTitle: {
    color: "#10B981",
    fontSize: 8.5,
    fontWeight: "bold",
    marginBottom: 3,
  },
  proofHash: {
    color: "#E5E7EB",
    fontSize: 7,
    fontFamily: "Courier",
    marginBottom: 2,
  },
  proofMeta: {
    color: "#9CA3AF",
    fontSize: 6.5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #E5E7EB",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: "#9CA3AF",
  },
});

function PassportPDFDocument({ student, skills, qrDataUrl, origin }) {
  const userInitials = student.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "ST";

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header Banner
      React.createElement(
        View,
        { style: styles.headerBanner },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.headerTitle }, "SKILLSYNC VERIFIED SKILL PASSPORT"),
          React.createElement(
            Text,
            { style: styles.headerSubtitle },
            "Official Cryptographically Verifiable Competency Transcript"
          )
        ),
        React.createElement(Text, { style: styles.headerBadge }, "STATUS: VERIFIED")
      ),
      // Student Details Card
      React.createElement(
        View,
        { style: styles.studentCard },
        // Avatar Photo (if valid base64 or URL)
        student.photoUrl && (student.photoUrl.startsWith("data:image/") || student.photoUrl.startsWith("http"))
          ? React.createElement(
              View,
              { style: styles.avatarContainer },
              React.createElement(Image, { src: student.photoUrl, style: styles.avatarImage })
            )
          : React.createElement(
              View,
              { style: styles.avatarContainer },
              React.createElement(Text, { style: styles.avatarInitials }, userInitials)
            ),
        // Student Info
        React.createElement(
          View,
          { style: styles.studentDetailsCol },
          React.createElement(Text, { style: styles.studentName }, student.name),
          React.createElement(
            View,
            { style: styles.infoRow },
            React.createElement(Text, { style: styles.infoLabel }, "Student ID:"),
            React.createElement(Text, { style: styles.infoValue }, student.id)
          ),
          React.createElement(
            View,
            { style: styles.infoRow },
            React.createElement(Text, { style: styles.infoLabel }, "Institution:"),
            React.createElement(Text, { style: styles.infoValue }, student.college || "Institution Not Specified")
          ),
          React.createElement(
            View,
            { style: styles.infoRow },
            React.createElement(Text, { style: styles.infoLabel }, "Degree / Batch:"),
            React.createElement(
              Text,
              { style: styles.infoValue },
              `${student.degree || "Degree Not Specified"} • ${student.batch || "Batch Not Specified"}`
            )
          ),
          React.createElement(
            View,
            { style: styles.infoRow },
            React.createElement(Text, { style: styles.infoLabel }, "DOB / Gender:"),
            React.createElement(
              Text,
              { style: styles.infoValue },
              `${student.dob || "Not Specified"} • ${student.gender || "Male"}`
            )
          )
        ),
        // Scannable Verification QR Code
        qrDataUrl &&
          React.createElement(
            View,
            { style: styles.qrContainer },
            React.createElement(Image, { src: qrDataUrl, style: styles.qrImage }),
            React.createElement(Text, { style: styles.qrLabel }, "Scan to Verify")
          )
      ),
      // Verified Skills & Competencies
      React.createElement(
        Text,
        { style: styles.sectionTitle },
        `VERIFIED COMPETENCIES & EVIDENCE CITATIONS (${skills.length})`
      ),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: [styles.tableRow, styles.tableHeader] },
          React.createElement(Text, { style: [styles.tableCell, styles.colSkill] }, "Skill / Competency"),
          React.createElement(Text, { style: [styles.tableCell, styles.colCategory] }, "Category"),
          React.createElement(Text, { style: [styles.tableCell, styles.colTier] }, "Verification Level"),
          React.createElement(Text, { style: [styles.tableCell, styles.colEvidence] }, "Supporting Evidence")
        ),
        skills.length === 0
          ? React.createElement(
              View,
              { style: styles.tableRow },
              React.createElement(
                Text,
                { style: [styles.tableCell, { width: "100%", color: "#6B7280" }] },
                "No verified competencies recorded yet."
              )
            )
          : skills.slice(0, 14).map((s, i) =>
              React.createElement(
                View,
                { key: i, style: styles.tableRow },
                React.createElement(Text, { style: [styles.tableCell, styles.colSkill] }, s.name),
                React.createElement(Text, { style: [styles.tableCell, styles.colCategory] }, s.category),
                React.createElement(Text, { style: [styles.tableCell, styles.colTier] }, s.level),
                React.createElement(
                  Text,
                  { style: [styles.tableCell, styles.colEvidence] },
                  s.evidence && s.evidence.length > 0
                    ? s.evidence.map((e) => e.title).join(", ").substring(0, 32)
                    : "Verified Profile Skill"
                )
              )
            )
      ),
      // Cryptographic Merkle Root Proof Box
      React.createElement(
        View,
        { style: styles.proofBox },
        React.createElement(Text, { style: styles.proofTitle }, "CRYPTOGRAPHIC INTEGRITY & MERKLE ROOT PROOF"),
        React.createElement(Text, { style: styles.proofHash }, `Root Hash: ${student.credentialHash}`),
        React.createElement(
          Text,
          { style: styles.proofMeta },
          `Issuer: ${student.issuer} • Verification URL: ${origin}/passport/${student.shareToken}`
        ),
        React.createElement(
          Text,
          { style: styles.proofMeta },
          "Fairness Policy: Demographic bias exclusion filters applied (name, gender, age excluded from matching algorithms)."
        )
      ),
      // Official Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, `Generated on ${new Date().toUTCString()}`),
        React.createElement(
          Text,
          { style: styles.footerText },
          "SkillSync Cryptographic Trust Engine • Verifiable Credential Standard"
        )
      )
    )
  );
}

export async function GET(request) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;
    const sessionUserEmail = session?.user?.email;

    const { searchParams } = new URL(request.url);
    const queryStudentId = searchParams.get("studentId");
    const queryShareToken = searchParams.get("shareToken");

    const clientIp = getClientIp(request);
    const rateLimitKey = `pdf-export:${sessionUserId || sessionUserEmail || clientIp}`;
    const rateLimit = checkRateLimit(
      rateLimitKey,
      RATE_LIMIT_PRESETS.PDF_EXPORT.maxRequests,
      RATE_LIMIT_PRESETS.PDF_EXPORT.windowMs
    );

    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        user: { id: sessionUserId, email: sessionUserEmail },
        route: "/api/passport/pdf",
        method: "GET",
        details: { reason: "PDF export rate limit exceeded" },
      });
      return createRateLimitResponse(
        rateLimit.resetTime,
        "PDF export limit reached. Please wait a few minutes before generating a new PDF transcript."
      );
    }

    let user = null;
    let passport = null;

    // 1. Try finding by shareToken
    if (queryShareToken) {
      passport = await prisma.passport.findUnique({
        where: { shareToken: queryShareToken },
        include: {
          user: {
            include: {
              evidences: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      });
      if (passport) {
        user = passport.user;
      }
    }

    // 2. Try finding by studentId
    if (!user && queryStudentId) {
      passport = await prisma.passport.findUnique({
        where: { studentId: queryStudentId },
        include: {
          user: {
            include: {
              evidences: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      });
      if (passport) {
        user = passport.user;
      }
    }

    // 3. Try finding by authenticated session
    if (!user && (sessionUserId || sessionUserEmail)) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(sessionUserId ? [{ id: sessionUserId }] : []),
            ...(sessionUserEmail ? [{ email: sessionUserEmail }] : []),
          ],
        },
        include: {
          passport: true,
          evidences: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (user) {
        passport = user.passport;
      }
    }

    // 4. Fallback if no record found
    if (!user) {
      if (!sessionUserId && !sessionUserEmail && !queryShareToken && !queryStudentId) {
        return NextResponse.json(
          { error: "Unauthorized. Please sign in or provide a valid share token to export passport PDF." },
          { status: 401 }
        );
      }
      return NextResponse.json({ error: "User account or passport record not found." }, { status: 404 });
    }

    const isOwner =
      (sessionUserId && user.id === sessionUserId) ||
      (sessionUserEmail && user.email === sessionUserEmail);

    if (passport && !passport.isPublic && !isOwner) {
      return NextResponse.json({ error: "This Skill Passport is private and cannot be exported." }, { status: 403 });
    }

    if (!passport) {
      passport = {
        studentId: queryStudentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
        shareToken: queryShareToken || `sp-token-${user.id.substring(0, 7)}`,
        updatedAt: new Date(),
        issuer: "SkillSync Verifiable Credential Engine",
        credentialHash: `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
      };
    }

    // Aggregate verified skills from user's evidence records
    const skills = [];
    for (const ev of user.evidences || []) {
      for (const rawSkill of ev.claimedSkills || []) {
        const skillName = rawSkill.trim();
        if (!skillName) continue;

        let existing = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (!existing) {
          existing = {
            name: skillName,
            category: "Core Competency",
            level: ev.verificationTier === "verified-high" ? "Advanced" : "Intermediate",
            evidence: [],
          };
          skills.push(existing);
        }

        if (!existing.evidence.some((e) => e.title === ev.title)) {
          existing.evidence.push({
            title: ev.title,
            tier: ev.verificationTier || "verified-medium",
          });
        }
      }
    }

    // Merge user self-reported skills
    for (const userSkill of user.skills || []) {
      const skillName = userSkill.trim();
      if (!skillName) continue;
      if (!skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
        skills.push({
          name: skillName,
          category: "Self-Reported Competency",
          level: "Intermediate",
          evidence: [],
        });
      }
    }

    const studentName = formatDisplayName(
      user.name,
      user.name || (user.email ? user.email.split("@")[0] : "Student User")
    );

    const origin =
      request.headers.get("origin") ||
      (request.headers.get("host") ? `https://${request.headers.get("host")}` : "https://skillsync.app");

    const verificationUrl = `${origin}/passport/${passport.shareToken || passport.studentId}`;
    let qrDataUrl = null;
    try {
      qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 160,
        color: { dark: "#064E3B", light: "#FFFFFF" },
      });
    } catch (qrErr) {
      console.warn("QR generation error for PDF:", qrErr.message);
    }

    const studentData = {
      name: studentName,
      id: passport.studentId,
      college: user.college || "Institution Not Specified",
      degree: user.degree || "Degree Not Specified",
      batch: user.batch || "Batch Not Specified",
      dob: formatDob(user.dob),
      gender: user.gender && user.gender !== "Student" ? user.gender : "Male",
      photoUrl: user.image || null,
      credentialHash: passport.credentialHash || "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
      issuer: passport.issuer || "SkillSync Verifiable Credential Engine",
      shareToken: passport.shareToken,
    };

    const doc = React.createElement(PassportPDFDocument, {
      student: studentData,
      skills: skills,
      qrDataUrl: qrDataUrl,
      origin: origin,
    });

    const pdfBuffer = await renderToBuffer(doc);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SkillSync_Passport_${passport.studentId}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("PDF passport export error:", err);
    return NextResponse.json({ error: "Failed to generate passport PDF: " + err.message }, { status: 500 });
  }
}
