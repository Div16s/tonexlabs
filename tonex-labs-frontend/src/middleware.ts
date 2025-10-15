import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import { auth } from "~/server/auth";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/app/sign-in", "/app/sign-up"];

export async function middleware(req: NextRequest) {
    // const hasSession = await auth();

    // const path = request.nextUrl.pathname;

    // const isAuthRoute = path === "/app/sign-in" || path === "/app/sign-up";

    // const isProtectedRoute = path.startsWith("/app/") && !isAuthRoute;

    // if(hasSession && isAuthRoute) {
    //     return NextResponse.redirect(new URL("/app/speech-synthesis/text-to-speech", request.url))
    // }

    // if(!hasSession && isProtectedRoute){
    //     const signInUrl = new URL("/app/sign-in", request.url);
    //     signInUrl.searchParams.set("callbackUrl", request.url);

    //     return NextResponse.redirect(signInUrl);
    // }

    // return NextResponse.next();

    const path = req.nextUrl.pathname;

  // Use next-auth's lightweight edge-compatible token check
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware token", token);

  const isPublic = PUBLIC_PATHS.includes(path);
  const isProtected = path.startsWith("/app/") && !isPublic;

  // Redirect authenticated users away from login/signup
  if (token && isPublic) {
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", req.url)
    );
  }

  // Redirect unauthenticated users away from protected pages
  if (!token && isProtected) {
    const signInUrl = new URL("/app/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        "/app/:path*"
    ],
}