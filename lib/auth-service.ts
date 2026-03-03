/**
 * Stubbed Auth API Service
 * Replace these functions with real API calls when backend is ready.
 */

export interface AuthUser {
    id: string
    name: string
    email: string
    avatar: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}

// Simulates network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fake JWT token (expires in 24h)
function generateMockToken(email: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(
        JSON.stringify({
            sub: "1",
            email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
        })
    )
    const signature = btoa("mock-signature")
    return `${header}.${payload}.${signature}`
}

function createMockUser(email: string): AuthUser {
    return {
        id: "1",
        name: "Chad Notabledough",
        email,
        avatar: "/avatar.png",
    }
}

export const authApi = {
    async login(email: string, password: string): Promise<AuthResponse> {
        await delay(800)

        // Accept any email with password >= 8 chars for the stub
        if (password.length < 8) {
            throw new Error("Invalid credentials")
        }

        const user = createMockUser(email)
        const token = generateMockToken(email)
        return { token, user }
    },

    async register(email: string, password: string): Promise<AuthResponse> {
        await delay(1000)

        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters")
        }

        const user = createMockUser(email)
        const token = generateMockToken(email)
        return { token, user }
    },

    async verify(token: string): Promise<AuthUser> {
        await delay(300)

        if (!token) {
            throw new Error("No token provided")
        }

        // Decode the mock token to get the email
        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            if (payload.exp < Math.floor(Date.now() / 1000)) {
                throw new Error("Token expired")
            }
            return createMockUser(payload.email)
        } catch {
            throw new Error("Invalid token")
        }
    },

    async refresh(token: string): Promise<string> {
        await delay(400)

        if (!token) {
            throw new Error("No token to refresh")
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            return generateMockToken(payload.email)
        } catch {
            throw new Error("Invalid token")
        }
    },
}
