import { dbConnect } from '@/_lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from 'jose';
import { z } from 'zod';

dbConnect();

// Ensure the JWT secret key is properly encoded
const JWT_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);// Replace this with your actual secret key, preferably stored in environment variables


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8), // Adjust min length as needed
    role: z.enum(['tester', 'creator']),
});

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const parsedData = loginSchema.safeParse(reqBody);

        if (!parsedData.success) {
            return NextResponse.json({ message: 'Invalid request body', errors: parsedData?.error?.issues }, { status: 400 });
        }
        const { email, password, role } = parsedData.data;

        let existingUser;

        if (role === "tester") {
            existingUser = await Tester.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: "Tester not found" }, { status: 404 });
            }
        } else if (role === "creator") {
            existingUser = await Creator.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: "Creator not found" }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: "Invalid Role" }, { status: 401 });
        }
        const isMatch = await bcryptjs.compare(password, existingUser.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        } else {
            const payload = {
                id: existingUser._id,
                email: existingUser.email,
                role
            }
            // Create a JWT token
            const token = await new SignJWT(payload)
                .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
                .setExpirationTime('30d')
                .sign(JWT_SECRET);

            const response = NextResponse.json({
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
                role,
                id: existingUser._id
            }, { status: 200 });

            // Set the token in an HTTP-only cookie
            response.cookies.set('authorizeToken', token, { httpOnly: false, secure: true, path: '/' })
            response.cookies.set('authorizeRole', role, { httpOnly: false, secure: true, path: '/' })
            response.cookies.set('authorizeId', existingUser._id, { httpOnly: false, secure: true, path: '/' })

            return response;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
