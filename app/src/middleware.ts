import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on all routes
// You can use it for authentication checks, redirects, etc.
export function middleware(request: NextRequest) {
  // For now, allow all routes
  // The session check happens client-side
  return NextResponse.next();
}

// Routes that trigger middleware
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
