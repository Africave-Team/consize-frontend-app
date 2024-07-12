import { NextRequest, NextResponse } from "next/server"
import { COOKIE_AUTH_KEY } from './utils/tools'

export async function middleware (req: NextRequest) {
  const accessToken = req.cookies.get(COOKIE_AUTH_KEY)?.value
  console.log(req.headers.get('host'))
  const url = req.nextUrl.clone()
  const hostname = url.hostname
  const pathName = url.pathname
  console.log(hostname, url)
  if (pathName === "/") {
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
    // Check if user is at the root path
    // // Make API call based on subdomain (replace with your actual logic)
    // const response = await fetch(`your-api-endpoint/${subdomain}`);
    // const data = await response.json();

    // if (data.redirectTo === 'page1') {
    //   return NextResponse.redirect(new URL('/page1', req.url));
    // } else if (data.redirectTo === 'page2') {
    //   return NextResponse.redirect(new URL('/page2', req.url));
    // } else {
    //   // Handle unexpected API response (optional)
    //   console.warn('Unexpected API response, not redirecting');
    //   return NextResponse.next();
    // }
  } else {
    // Handle other routes as before (existing logic for authenticated/unauthenticated users)
    // // Handle redirects based on authentication status and path
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
  }

  // No redirect needed, continue with the request
  return NextResponse.next() // Explicitly signal no redirect
}
export const config = {
  matcher: [
    "/",
    "/auth/login",
  ],
}
