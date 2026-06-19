import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import { type NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await query(
          "SELECT * FROM users WHERE email = $1",
          [credentials.email]
        );

        const user = result.rows[0];

        if (!user) {
          return null;
        }

        const validPassword = await compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
           phone: user.phone,
        };
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }: any) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
       token.phone = user.phone;
    }

    return token;
  },

  async session({ session, token }: any) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
       session.user.phone =
        token.phone as string;
    }

    return session;
  },
},

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
};