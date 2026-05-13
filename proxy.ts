import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(_request: NextRequest) {
    // Auth is managed client-side: in-memory JWT + HttpOnly cookie refresh tokens.
    // AuthGuard handles route protection in the React tree.
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|avatar.png|.*\\.svg$).*)"],
}
