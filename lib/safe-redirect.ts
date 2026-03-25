/**
 * Restricts post-login navigation to same-app relative paths only.
 * Prevents open redirects via `?from=https://evil.com` or `?from=//evil.com`.
 */
export function sanitizeRedirectPath(
    raw: string | null | undefined,
    fallback = "/"
): string {
    if (raw == null || typeof raw !== "string") {
        return fallback
    }

    const t = raw.trim()
    if (!t) {
        return fallback
    }

    if (t.includes("\0")) {
        return fallback
    }

    if (!t.startsWith("/") || t.startsWith("//")) {
        return fallback
    }

    // Reject paths that look like a scheme (e.g. "/http://...", "/https:...")
    const firstSeg = t.split(/[/?#]/)[0] ?? ""
    if (firstSeg.includes(":")) {
        return fallback
    }

    return t
}
