import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("authToken")?.value;

    try {
        if (token && token.length > 0) {
            if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
                return NextResponse.redirect(new URL("/home", request.url));
            }
        } else {
            if (request.nextUrl.pathname.startsWith("/home") || request.nextUrl.pathname.startsWith("/profile")) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Apply middleware to these routes
export const config = {
    matcher: ["/home/:path*", "/profile/:path*", "/login", "/register"],
};
