import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./lib/dbConfig";
import { Users } from "./lib/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
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
});
