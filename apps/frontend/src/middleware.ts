import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // const auth = request.cookies.get("adminAuth");
  // const isLoginPage =
  //   request.nextUrl.pathname.startsWith("/admin/super") ||
  //   request.nextUrl.pathname.startsWith("/admin/staff") ||
  //   request.nextUrl.pathname === "/";

  // if (!auth && !isLoginPage) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // if (auth && isLoginPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
