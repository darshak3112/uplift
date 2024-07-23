import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Create a response
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

        // Clear the authentication token cookie
        response.cookies.delete("authorizeToken")

        return response;
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
