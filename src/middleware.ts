import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE:", request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("admin_token")?.value;

  const isLoggedIn = token === "logged-in";
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};