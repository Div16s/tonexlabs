import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET 
  });
  
  const path = request.nextUrl.pathname;
  const isAuthRoute = path === "/app/sign-in" || path === "/app/sign-up";
  const isProtectedRoute = path.startsWith("/app/") && !isAuthRoute;

  console.log("Middleware - Token:", token);

  // If user is authenticated and tries to access auth pages
  if (token && isAuthRoute) {
    // Check if there's a callbackUrl in the query params
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    
    if (callbackUrl) {
      // Redirect to the callback URL
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    
    // Otherwise redirect to default page
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", request.url)
    );
  }

  // If user is not authenticated and tries to access protected pages
  if (!token && isProtectedRoute) {
    const signInUrl = new URL("/app/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};