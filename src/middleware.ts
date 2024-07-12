import { NextRequest, NextResponse } from "next/server"
import { COOKIE_AUTH_KEY } from './utils/tools'

export async function middleware (req: NextRequest) {
  const accessToken = req.cookies.get(COOKIE_AUTH_KEY)?.value
  const url = req.nextUrl.clone()
  const pathName = url.pathname
  if (accessToken) {
    if (pathName.startsWith("/auth")) {
      // User is authenticated but trying to access auth pages, redirect to app
      url.pathname = "/dashboard/courses"
      return NextResponse.redirect(url)
    }
  } else {
    if (pathName.startsWith("/dashboard")) {
      // User is not authenticated and trying to access app pages, redirect to login
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  // No redirect needed, continue with the request
  return NextResponse.next() // Explicitly signal no redirect
}
export const config = {
  matcher: [
    "/auth/login",
  ],
}
