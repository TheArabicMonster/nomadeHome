import { compare } from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SESSION_COOKIE = "nerv-session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7 // 7 days

export async function POST(req: Request) {
  const { password } = await req.json()

  const hashedPassword = process.env.HASHED_PASSWORD
  const sessionSecret = process.env.SESSION_SECRET

  if (!hashedPassword || !sessionSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const valid = await compare(password, hashedPassword)

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const secret = new TextEncoder().encode(sessionSecret)
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  })

  return NextResponse.json({ ok: true })
}
