/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { auth } from "./auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};