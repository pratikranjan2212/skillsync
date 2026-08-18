import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Check if user has a linked GitHub account
    const githubAccount = user.accounts?.find((a) => a.provider === "github");
    const accessToken = githubAccount?.access_token;

    // If we have an access token with GitHub permissions
    if (accessToken) {
      try {
        const ghRes = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100&type=all", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "SkillSync-Platform",
          },
        });

        if (ghRes.ok) {
          const repoData = await ghRes.json();
          const repos = Array.isArray(repoData)
            ? repoData.map((r) => ({
                id: r.id,
                name: r.name,
                fullName: r.full_name,
                htmlUrl: r.html_url,
                description: r.description || "",
                language: r.language || "Code",
                stars: r.stargazers_count || 0,
                isPrivate: Boolean(r.private),
                updatedAt: r.updated_at,
              }))
            : [];

          return NextResponse.json({
            success: true,
            connected: true,
            hasPermissions: true,
            username: githubAccount.providerAccountId || user?.name,
            repos,
          });
        }
      } catch (ghErr) {
        console.warn("GitHub API token fetch error:", ghErr.message);
      }
    }

    // If user has a githubUrl in profile, attempt public repo fetch
    let githubUsername = null;
    if (user?.githubUrl) {
      const match = user.githubUrl.match(/github\.com\/([^/]+)/);
      if (match) githubUsername = match[1];
    } else if (session?.user?.name) {
      const cleaned = session.user.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleaned) githubUsername = cleaned;
    }

    if (githubUsername) {
      try {
        const publicRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=50`, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "SkillSync-Platform",
          },
        });

        if (publicRes.ok) {
          const publicRepos = await publicRes.json();
          if (Array.isArray(publicRepos) && publicRepos.length > 0) {
            const repos = publicRepos.map((r) => ({
              id: r.id,
              name: r.name,
              fullName: r.full_name,
              htmlUrl: r.html_url,
              description: r.description || "",
              language: r.language || "Code",
              stars: r.stargazers_count || 0,
              isPrivate: Boolean(r.private),
              updatedAt: r.updated_at,
            }));

            return NextResponse.json({
              success: true,
              connected: true,
              hasPermissions: true,
              username: githubUsername,
              repos,
            });
          }
        }
      } catch (publicErr) {
        console.warn("GitHub public repos fetch error:", publicErr.message);
      }
    }

    // If no GitHub account or permissions granted yet
    return NextResponse.json({
      success: true,
      connected: false,
      hasPermissions: false,
      message: "GitHub account not connected or repository permissions not granted.",
      repos: [],
    });
  } catch (err) {
    console.error("GitHub Repos API route error:", err);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        hasPermissions: false,
        error: err.message,
        repos: [],
      },
      { status: 500 }
    );
  }
}
