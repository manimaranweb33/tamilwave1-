import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const USER_PROTECTED = ["/profile", "/settings", "/watchlist", "/ratings"];
const USER_AUTH_PAGES = ["/login", "/register", "/forgot-password"];

async function getUserToken(req: NextRequest) {
  return getToken({ req, secret: process.env.AUTH_SECRET });
}

async function getEditorToken(req: NextRequest) {
  return getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "editor-auth.session-token",
    salt: "editor-auth.session-token"
  });
}

async function getAdminToken(req: NextRequest) {
  return getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "admin-auth.session-token",
    salt: "admin-auth.session-token"
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    const token = await getAdminToken(req);
    if (token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = await getAdminToken(req);
    if (!token || token.role !== "ADMIN") {
      const login = new URL("/admin/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/editor/login")) {
    const token = await getEditorToken(req);
    if (token && (token.role === "EDITOR" || token.role === "ADMIN")) {
      return NextResponse.redirect(new URL("/editor", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/editor")) {
    const token = await getEditorToken(req);
    if (!token || (token.role !== "EDITOR" && token.role !== "ADMIN")) {
      const login = new URL("/editor/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (USER_AUTH_PAGES.some((p) => pathname === p)) {
    const token = await getUserToken(req);
    if (token?.role === "USER") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const token = await getUserToken(req);
    if (!token || token.role !== "USER") {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/editor/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/settings/:path*",
    "/watchlist",
    "/watchlist/:path*",
    "/ratings",
    "/ratings/:path*"
  ]
};
