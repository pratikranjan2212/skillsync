import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { env } from "@/lib/config/env";
import { verifyPassword } from "@/lib/security/password";
import { checkRateLimit, resetRateLimit } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export function formatDisplayName(name, login) {
  if (name && name.trim()) return name.trim();
  if (!login) return "Student User";

  let cleaned = login.replace(/\d+$/, "").replace(/[._-]+/g, " ").trim();
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");

  const common = {
    tonystark: "Tony Stark",
    peterparker: "Peter Parker",
    brucewayne: "Bruce Wayne",
    clarkkent: "Clark Kent",
    alexchen: "Alex Chen",
    pratikranjan: "Pratik Ranjan",
  };

  const key = cleaned.toLowerCase().replace(/\s+/g, "");
  if (common[key]) return common[key];

  return (
    cleaned
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ") || login
  );
}

import { extractOAuthAvatar } from "@/lib/integrations/linkedin";

export { extractOAuthAvatar };

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: env.github.clientId,
      clientSecret: env.github.clientSecret,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: formatDisplayName(profile.name, profile.login),
          email: profile.email,
          image: profile.avatar_url,
          githubUrl: `https://github.com/${profile.login}`,
          role: "student",
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    Google({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: formatDisplayName(profile.name, profile.given_name),
          email: profile.email,
          image: profile.picture,
          role: "student",
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    LinkedIn({
      clientId: env.linkedin.clientId,
      clientSecret: env.linkedin.clientSecret,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      profile(profile) {
        const photo = extractOAuthAvatar(profile);
        const resolvedName =
          profile.name ||
          [profile.given_name, profile.family_name].filter(Boolean).join(" ") ||
          [profile.localizedFirstName, profile.localizedLastName].filter(Boolean).join(" ");

        const rawVanity = profile?.vanityName || profile?.publicProfileUrl || profile?.vanity_name;
        const linkedinUrl = rawVanity ? (rawVanity.startsWith("http") ? rawVanity : `https://linkedin.com/in/${rawVanity}`) : undefined;

        return {
          id: profile.sub || profile.id,
          name: formatDisplayName(resolvedName, profile.given_name || profile.localizedFirstName),
          email: profile.email,
          image: photo || null,
          linkedinUrl,
          role: "student",
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = credentials.email.toLowerCase().trim();

        // Enforce rate limiting: 5 failed attempts per 15 minutes per email
        const rateLimitKey = `auth-login:${normalizedEmail}`;
        const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
        if (!rateLimit.success) {
          logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
            user: { email: normalizedEmail },
            details: { reason: "Login attempt rate limit exceeded" },
          });
          throw new Error("Too many failed login attempts. Please try again in 15 minutes.");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          // Reject if user does not exist or has no passwordHash (e.g. GitHub OAuth-only user)
          if (!user || !user.passwordHash) {
            logSecurityEvent(SecurityEvent.AUTH_SIGNIN_FAILURE, LogLevel.WARN, {
              user: { email: normalizedEmail },
              details: { reason: "User not found or password login not supported" },
            });
            return null;
          }

          const isValid = await verifyPassword(credentials.password, user.passwordHash);
          if (!isValid) {
            logSecurityEvent(SecurityEvent.AUTH_SIGNIN_FAILURE, LogLevel.WARN, {
              user: { email: normalizedEmail },
              details: { reason: "Invalid password supplied" },
            });
            return null;
          }

          // Successful login -> reset rate limit counter & log success
          resetRateLimit(rateLimitKey);
          logSecurityEvent(SecurityEvent.AUTH_SIGNIN_SUCCESS, LogLevel.INFO, {
            user: { id: user.id, email: user.email },
            details: { method: "credentials" },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "student",
            image: user.image,
            emailVerified: user.emailVerified,
          };
        } catch (err) {
          if (err.message && err.message.includes("Too many failed login")) {
            throw err;
          }
          console.error("Auth authorize error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours session expiration
    updateAge: 60 * 60,    // 1 hour sliding update window
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours JWT expiration
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider && user?.email) {
        try {
          const email = user.email.toLowerCase().trim();
          const existing = await prisma.user.findUnique({
            where: { email },
          });

          const oauthAvatar = extractOAuthAvatar(profile, user);

          if (existing) {
            const updateData = {};
            if (!existing.name && (profile?.name || profile?.login || user?.name)) {
              updateData.name = formatDisplayName(profile?.name || user?.name, profile?.login);
            }
            if (oauthAvatar && (!existing.image || existing.image.trim() === "" || account.provider === "linkedin")) {
              updateData.image = oauthAvatar;
            }
            if (account.provider === "github" && profile?.login) {
              if (!existing.githubUrl) {
                updateData.githubUrl = profile.html_url || `https://github.com/${profile.login}`;
              }
              if (!existing.bio && profile.bio) {
                updateData.bio = profile.bio;
              }
            }
            if (account.provider === "linkedin") {
              const rawVanity = profile?.vanityName || profile?.publicProfileUrl || profile?.vanity_name;
              if (rawVanity && !existing.linkedinUrl) {
                updateData.linkedinUrl = rawVanity.startsWith("http") ? rawVanity : `https://linkedin.com/in/${rawVanity}`;
              }
            }
            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { id: existing.id },
                data: updateData,
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.warn("OAuth auto-sync error on signIn:", err.message);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        if (
          url === "/" ||
          url === "/signin" ||
          url === "/signup" ||
          url.startsWith("/api/auth")
        ) {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          if (
            parsedUrl.pathname === "/" ||
            parsedUrl.pathname === "/signin" ||
            parsedUrl.pathname === "/signup" ||
            parsedUrl.pathname.startsWith("/api/auth")
          ) {
            return `${baseUrl}/dashboard`;
          }
          return url;
        }
      } catch (e) {}
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "student";
        token.name = formatDisplayName(user.name, user.name);
        token.emailVerified = user.emailVerified;
        if (user.image && typeof user.image === "string" && !user.image.startsWith("data:")) {
          token.picture = user.image;
        }
      }
      if (profile) {
        if (!token.name) {
          token.name = formatDisplayName(profile.name, profile.login);
        }
        const profilePhoto = extractOAuthAvatar(profile);
        if (profilePhoto && typeof profilePhoto === "string" && !profilePhoto.startsWith("data:")) {
          token.picture = profilePhoto;
        }
      }
      if (token.name) {
        token.name = formatDisplayName(token.name, token.name);
      }

      // If token.picture is a large base64 data URI, strip it to prevent HTTP 431 headers
      if (typeof token.picture === "string" && token.picture.startsWith("data:")) {
        delete token.picture;
      }
      delete token.image;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "student";
        session.user.emailVerified = token.emailVerified;
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.picture && typeof token.picture === "string" && !token.picture.startsWith("data:")) {
          session.user.image = token.picture;
        }
        if (session.user.image && session.user.image.startsWith("data:")) {
          delete session.user.image;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        const studentTag = `SS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;
        await prisma.passport.create({
          data: {
            userId: user.id,
            studentId: studentTag,
            isPublic: true,
            shareToken,
            credentialHash: `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
            issuer: "SkillSync Verifiable Credential Engine",
          },
        });
      } catch (err) {
        console.warn("Could not auto-create passport on OAuth user creation:", err.message);
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: env.nextAuthSecret,
});
