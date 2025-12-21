import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/dbConfig";
import { Users } from "@/lib/schema";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 0, // prevent silent refresh
  },

  jwt: {
    maxAge: 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await db
          .select()
          .from(Users)
          .where(eq(Users.email, credentials.email))
          .limit(1);

        if (result.length === 0) return null;

        const valid = await compare(credentials.password, result[0].password);
        if (!valid) return null;

        return {
          id: result[0].id.toString(),
          email: result[0].email,
          name: result[0].fullName,
        };
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login: attach expiry metadata
      if (user) {
        const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24h expiry
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.realExp = exp;
      }

      // Hard expiry check
      if (token.realExp && Date.now() / 1000 > token.realExp) {
        console.warn("MediCura JWT expired — clearing session");
        return {}; // clear token
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
        };

        session.realExpiry = new Date(token.realExp * 1000).toISOString();
      } else {
        session = null; // On expiration of token session drops
      }

      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: "medicura.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/" },
    },
    csrfToken: {
      name: "medicura.csrf-token",
      options: { httpOnly: true, sameSite: "lax", path: "/" },
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "medicura-dev-secret",
});

export { handler as GET, handler as POST };
