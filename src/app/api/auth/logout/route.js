import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    try {
        // Clear the authentication token and related cookies
        response.cookies.delete("authorizeToken", { path: '/', httpOnly: true, secure: true, sameSite: 'strict' });
        response.cookies.delete("authorizeId", { path: '/', httpOnly: true, secure: true, sameSite: 'strict' });
        response.cookies.delete("authorizeRole", { path: '/', httpOnly: true, secure: true, sameSite: 'strict' });

        return response;
    } catch (error) {
        console.error('Error while clearing cookies:', error.message);
        return NextResponse.json({ message: "An error occurred while clearing cookies", error: error.message }, { status: 500 });
    }
}
