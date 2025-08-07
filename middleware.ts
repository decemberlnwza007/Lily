// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// SECRET ที่ใช้ใน next-auth config
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
console.log(token)
  if (token && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
