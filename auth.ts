import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyPassword } from "@/lib/password";
import { getUserByEmail } from "@/lib/cloudflare-db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const { email, password } = parsedCredentials.data;

          // Fetch user from D1 database
          const user = await getUserByEmail(email);
          
          if (!user) {
            return null;
          }

          // Verify password
          const passwordMatch = await verifyPassword(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          // Return user object
          console.log("Login successful for:", email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
