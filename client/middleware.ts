import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path.startsWith("/auth")

    try {
        const response = await fetch("http://localhost:5000/api/auth/check", {
            credentials: "include",
            headers: {
                Cookie: request.headers.get("cookie") || "",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
        })

        if (response.ok) {
            if (isPublicPath) {
                return NextResponse.redirect(new URL("/", request.url))
            }
            return NextResponse.next()
        } else {
            if (!isPublicPath) {
                return NextResponse.redirect(new URL("/auth/login", request.url))
            }
            return NextResponse.next()
        }
    } catch (error) {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL("/auth/login", request.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
} 