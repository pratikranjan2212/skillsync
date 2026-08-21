import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractLinkedInUsername, extractGitHubUsername } from "@/lib/integrations/linkedin";
import { sanitizeUrl } from "@/lib/security/validator";

export const dynamic = "force-dynamic";

/**
 * Endpoint to sync and fetch profile pictures from GitHub, LinkedIn, or external image URLs.
 * Converts fetched images into safe, optimized base64 data URLs to eliminate CORS errors in canvas croppers.
 */
export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const { provider, identifier, url } = body || {};

    let targetUrl = null;
    let resolvedUsername = null;
    const providerName = provider ? String(provider).toLowerCase() : "url";

    // 1. GitHub Avatar Sync
    if (providerName === "github") {
      let username = extractGitHubUsername(identifier);

      if (!username) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              ...(userId ? [{ id: userId }] : []),
              ...(userEmail ? [{ email: userEmail }] : []),
            ],
          },
        });
        if (user?.githubUrl) {
          username = extractGitHubUsername(user.githubUrl);
        }
      }

      if (!username) {
        return NextResponse.json({
          success: false,
          error: "Please enter a valid GitHub username or profile link.",
        }, { status: 400 });
      }

      resolvedUsername = username;

      // Check GitHub User API first
      try {
        const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
          headers: {
            "User-Agent": "SkillSync-Avatar-Sync/1.0",
            "Accept": "application/vnd.github.v3+json",
          },
          next: { revalidate: 300 },
        });

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          if (ghData.avatar_url) {
            targetUrl = ghData.avatar_url;
          }
        }
      } catch (err) {
        console.warn("GitHub API user lookup warning:", err.message);
      }

      // Direct fallback URL
      if (!targetUrl) {
        targetUrl = `https://github.com/${encodeURIComponent(username)}.png?size=400`;
      }
    }

    // 2. LinkedIn Avatar Sync
    else if (providerName === "linkedin") {
      let username = extractLinkedInUsername(identifier);

      if (!username) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              ...(userId ? [{ id: userId }] : []),
              ...(userEmail ? [{ email: userEmail }] : []),
            ],
          },
        });
        if (user?.linkedinUrl) {
          username = extractLinkedInUsername(user.linkedinUrl);
        }
      }

      if (!username) {
        return NextResponse.json({
          success: false,
          error: "Please enter a valid LinkedIn username or profile link (e.g. linkedin.com/in/username).",
        }, { status: 400 });
      }

      resolvedUsername = username;

      // Use unavatar public service to resolve LinkedIn public profile picture
      targetUrl = `https://unavatar.io/linkedin/${encodeURIComponent(username)}`;
    }

    // 3. Direct Image URL Proxying (Prevents Canvas CORS errors)
    else if (providerName === "url" || url || identifier) {
      const candidateUrl = url || identifier;
      const sanitized = sanitizeUrl(candidateUrl);
      if (!sanitized.valid) {
        return NextResponse.json({
          success: false,
          error: "Invalid image URL. Please provide a valid http or https image link.",
        }, { status: 400 });
      }
      targetUrl = sanitized.url;
    } else {
      return NextResponse.json({
        success: false,
        error: "Missing provider or image URL.",
      }, { status: 400 });
    }

    // Fetch the target image and convert to base64 Data URL to bypass client-side CORS issues
    try {
      const imgRes = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
      });

      if (!imgRes.ok) {
        if (providerName === "linkedin") {
          return NextResponse.json({
            success: false,
            error: `Could not automatically fetch public photo for LinkedIn profile '${resolvedUsername}'. Private profiles may require uploading your photo directly.`,
          }, { status: 404 });
        }
        return NextResponse.json({
          success: false,
          error: `Could not retrieve image from ${providerName} (HTTP ${imgRes.status}).`,
        }, { status: 404 });
      }

      const contentType = imgRes.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
        return NextResponse.json({
          success: false,
          error: "The specified URL does not return a supported image file.",
        }, { status: 400 });
      }

      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        return NextResponse.json({
          success: false,
          error: "Received an empty image response from the server.",
        }, { status: 400 });
      }

      if (buffer.length > 8 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: "Image exceeds maximum allowed size of 8MB.",
        }, { status: 400 });
      }

      const mimeType = contentType.includes("png") 
        ? "image/png" 
        : (contentType.includes("webp") 
            ? "image/webp" 
            : (contentType.includes("gif") ? "image/gif" : "image/jpeg"));

      const base64DataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

      return NextResponse.json({
        success: true,
        avatarUrl: base64DataUrl,
        rawUrl: targetUrl,
        provider: providerName,
        username: resolvedUsername,
      });
    } catch (fetchErr) {
      console.error("Avatar download error:", fetchErr);
      return NextResponse.json({
        success: false,
        error: "Failed to download image from the remote server. Please check your internet connection or upload your file directly.",
      }, { status: 500 });
    }
  } catch (err) {
    console.error("Sync avatar endpoint general error:", err);
    return NextResponse.json({
      success: false,
      error: "Internal server error while processing avatar sync.",
    }, { status: 500 });
  }
}
