import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authPages = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

const isRoleAllowed = (role?: string | null) => {
  if (!role) return false;
  const normalized = role.toLowerCase();
  return (
    normalized === "admin" || normalized === "vendor" || normalized === "user"
  );
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const isAuthPage = authPages.some((path) => pathname.startsWith(path));

  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && pathname !== "/unauthorized" && !isRoleAllowed(token.role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/payments/:path*",
    "/properties/:path*",
    "/settings/:path*",
    "/login",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ],
};
