import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { login } from "@/lib/api";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await login({
            email: credentials.email,
            password: credentials.password,
          });

          if (!response.success) {
            throw new Error(response.message);
          }

          const data = response.data;

          return {
            id: data._id,
            email: data.user?.email ?? credentials.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            role: data.role,
            _id: data._id,
            user: data.user,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.message ||
              error.message ||
              "Login failed";
            throw new Error(message);
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token._id = user._id;
        token.user = (user.user ?? {}) as Record<string, unknown>;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.role = token.role as string | undefined;
      session._id = token._id as string | undefined;
      session.user = {
        ...session.user,
        ...(token.user as Record<string, unknown>),
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
