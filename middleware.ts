import { NextRequest, NextResponse } from 'next/server'
import config from "./config";
import { cookies } from "next/headers";
import { encrypt, decrypt, updateSession } from "./lib";

let clerkMiddleware: (arg0: (auth: any, req: any) => any) => { (arg0: any): any; new(): any; }, createRouteMatcher;

if (config.auth.enabled) {
  try {
    ({ clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server"));
  } catch (error) {
    console.warn("Clerk modules not available. Auth will be disabled.");
    config.auth.enabled = false;
  }
}

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/sign-in', '/auth/signup', '/']

const isProtectedRouteClerk = config.auth.enabled
? createRouteMatcher(["/dashboard(.*)"])
: () => false;

export default async function middleware(req: NextRequest) {// 2. Check if the current route is protected or public

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  if (config.auth.enabled ) {
    return clerkMiddleware(async (auth, req) => {
      const resolvedAuth = await auth();

      if (!resolvedAuth.userId && isProtectedRouteClerk(req)) {
        return resolvedAuth.redirectToSignIn();
      } else {
        return NextResponse.next();
      }
    })(req);
    
  } else if(config.authNextAuth.enabled) {
    
    const { pathname } = req.nextUrl;
    const authToken = 'next-auth.session-token';
    const secureAuthToken = '__Secure-next-auth.session-token';
    // console.log(request.cookies.get(authToken))
    if (req.cookies.get(authToken) || req.cookies.get(secureAuthToken)) {
        if ((pathname == '/') || (pathname == '/sign-in') || (pathname == '/sign-up')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        } else {
            return NextResponse.next();
        }
    } else {
        const secureRoutes = [ '/dashboard', '/dashboard/*', '/users', '/surfers'];
        const isSecureRoute = secureRoutes.some((route) =>
            pathname.startsWith(route)
            // pathname == route
        );
        if (isSecureRoute) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        } else {
            return NextResponse.next();
        }
    }

  } else if(config.authCustom.enabled){
    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
     // 4. Redirect to /auth/login if the user is not authenticated
     if (isProtectedRoute && !session?.userId) {
    //  if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
      isPublicRoute &&
      session?.userId &&
      // session &&
      !req.nextUrl.pathname.startsWith('/dashboard')
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

  }
  
  return NextResponse.next();
  
}

export const middlewareConfig = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};