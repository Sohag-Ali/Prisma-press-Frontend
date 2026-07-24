import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log("pathname", pathname);
    console.log("request", request.nextUrl);
    console.log("proxy");
//   return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
    // '/dashboard/:path*',
    // '/admin-dashboard/:path*',
    // '/author-dashboard/:path*',
    '/((?!api|_next/static|/favicon.ico|_next/image|.*\\.png$).*)',
  ]
}