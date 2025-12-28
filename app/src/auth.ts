import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// For development, use a fallback secret
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-do-not-use-in-production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Optional: Email/Password credentials
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For demo purposes - in production, verify against a database
        if (credentials?.email && credentials?.password) {
          // Demo user for testing
          if (
            credentials.email === "demo@dataforge.app" &&
            credentials.password === "demo123"
          ) {
            return {
              id: "demo-user",
              name: "Demo User",
              email: "demo@dataforge.app",
              image: null,
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // signUp: "/auth/signup", // Custom sign up page
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});

