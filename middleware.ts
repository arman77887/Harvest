import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production-min-32-chars";
const encodedKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "harvest_session";

interface JWTPayload {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: JWTPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, encodedKey);
      session = payload as unknown as JWTPayload;
    } catch (error) {
      session = null;
    }
  }

  // Protected Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protected Customer / User Account & Checkout Routes
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged in users from visiting /login or /register
  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout", "/login", "/register"],
};
