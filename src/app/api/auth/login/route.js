import { dbConnect } from '@/lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from 'zod';

dbConnect();

const JWT_SECRET = process.env.TOKEN_SECRET; // Replace this with your actual secret key, preferably stored in environment variables


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6), // Adjust min length as needed
    role: z.enum(['tester', 'creator']),
});

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const parsedData = loginSchema.safeParse(reqBody);
        if (!parsedData.success) {
            return NextResponse.json({ message: 'Invalid request body', errors: parsedData.error.issues }, { status: 400 });
        }
        const { email, password, role } = parsedData.data;

        let existingUser;

        if (role === "tester") {
            existingUser = await Tester.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: "Tester not found" }, { status: 404 });
            }
        } else if (role === "creator") {
            existingUser = await Creator.findOne({ email }, { status: 404 });
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
                role: existingUser.role
            }

            // Create a JWT token
            const token = jwt.sign(
                payload,
                JWT_SECRET,
                { expiresIn: '24h' } // Token expires in 24 hour
            );

            return NextResponse.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`, token }, { status: 200 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
