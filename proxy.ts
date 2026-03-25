import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(_request: NextRequest) {
    // Auth is client-managed via localStorage + AuthGuard.
    // Keep proxy pass-through to avoid stale legacy cookies causing redirects.
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|avatar.png|.*\\.svg$).*)"],
}
