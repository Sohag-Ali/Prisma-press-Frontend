
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from './utils/jwt';
import { cookies } from 'next/headers';
import { getNewAccessToken } from './service/refreshToken';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value || null;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    if(!decodedAccessToken?.success && decodedRefreshToken?.success) {
        //access token has expired but refresh token is valid, so we can refresh the access token
        const result = await getNewAccessToken();

        if(result.success) {
            const newAccessToken = result.data.accessToken;

            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: "lax",
            });
            accessToken = newAccessToken;

            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    let userRole = null;

    if(!decodedAccessToken?.success) {
        //token has expired or invalid, so we can clear the cookies
        cookieStore.delete("accessToken");
        // return NextResponse.redirect(new URL('/login', request.url));

    }

    if(decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    if(accessToken && AUTH_ROUTES.includes(pathname)){
        if(userRole === "USER"){
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        else if(userRole === "AUTHOR"){
            return NextResponse.redirect(new URL('/author-dashboard', request.url));
        }
        else if(userRole === "ADMIN"){
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }
        else{
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

    if(!accessToken && !isPublic && !isAuthRoute){
        return NextResponse.redirect(new URL('/login', request.url));

    }
    

    if(pathname.startsWith("/dashboard") && userRole !== "USER"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if(pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if(pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }


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