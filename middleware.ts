import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "nerv-session"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const sessionSecret = process.env.SESSION_SECRET

  if (!sessionSecret) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  try {
    const secret = new TextEncoder().encode(sessionSecret)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/", req.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
