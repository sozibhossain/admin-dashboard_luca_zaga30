import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    user?: DefaultSession["user"] & {
      _id?: string;
      role?: string;
      avatar?: { url?: string };
      verificationInfo?: { verified?: boolean };
    };
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    user?: Record<string, unknown>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    user?: Record<string, unknown>;
  }
}
