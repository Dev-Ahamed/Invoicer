import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db";
import { compare } from "bcrypt";

const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the credentials are not empty
        if (!credentials?.email || !credentials?.password) {
          console.log("No Inputs");
          return null;
        }

        // if user exist
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          console.log("No user found");
          throw new Error("No user found");
        }

        // check password
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          console.log("Password not matched");
          throw new Error("Password not matching");
        }

        return existingUser;
      },
    }),
  ],

  callbacks: {
    // Add user ID to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Add user ID to the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export { authOptions };
