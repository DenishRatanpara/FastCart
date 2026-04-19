import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/api/auth"," /api/user/stripe/webhook"];

  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  const role=token.role
  if(pathname.startsWith("/user") && role!=="user"){
    return NextResponse.redirect(new URL("/unauthorized",req.url))
  }
    if(pathname.startsWith("/admin") && role!=="admin"){
    return NextResponse.redirect(new URL("/unauthorized",req.url))
  }
    if(pathname.startsWith("/delivery") && role!=="deliveryBoy"){
    return NextResponse.redirect(new URL("/unauthorized",req.url))
  }

  return NextResponse.next();


}
 export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/user/stripe/webhook|api/socket|api/chat).*)",
  ],
};


