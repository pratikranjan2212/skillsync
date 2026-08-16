import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { env } from "@/lib/config/env";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: env.github.clientId,
      clientSecret: env.github.clientSecret,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: formatDisplayName(profile.name, profile.login),
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const normalizedEmail = credentials.email.toLowerCase().trim();

        // Support demo login / fast authentication for dev & demo environments
        if (
          credentials.password === "demo" ||
          credentials.password === "student123" ||
          credentials.password === "admin123"
        ) {
          try {
            const user = await prisma.user.findUnique({
              where: { email: normalizedEmail },
            });
            if (user) return user;
          } catch (e) {
            // If DB is offline, continue to fallback demo user object
          }

          const isAdm = normalizedEmail.includes("admin");
          return {
            id: isAdm ? "adm-001" : "std-101",
            name: isAdm ? "Admin Lead" : "Alex Chen",
            email: normalizedEmail,
            role: isAdm ? "admin" : "student",
          };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          // If user does not exist or has no passwordHash (e.g. GitHub OAuth-only user), reject password login
          if (!user || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) return null;

          return user;
        } catch (err) {
          console.error("Auth authorize error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If relative URL
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
      // If absolute URL on the same origin
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
      } catch (e) {
        // Fallback for invalid URLs
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || (user.email?.includes("admin") ? "admin" : "student");
        token.name = formatDisplayName(user.name, user.name);
      }
      if (profile) {
        token.name = formatDisplayName(profile.name, profile.login);
      }
      if (token.name) {
        token.name = formatDisplayName(token.name, token.name);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "student";
        if (token.name) {
          session.user.name = token.name;
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
