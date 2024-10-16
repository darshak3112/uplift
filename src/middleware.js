import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const token = request.cookies.get('authorizeToken');

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(token.value, new TextEncoder().encode(process.env.TOKEN_SECRET));

    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/dashboard/:path*','/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
