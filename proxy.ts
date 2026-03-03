import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/signup"]

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get("auth-token")?.value

    // Allow public paths
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        // If already authenticated, redirect away from login/signup
        if (token) {
            return NextResponse.redirect(new URL("/", request.url))
        }
        return NextResponse.next()
    }

    // Protect everything else
    if (!token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("from", pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|avatar.png|.*\\.svg$).*)"],
}
