import { dbConnect } from '@/lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dbConnect();

const JWT_SECRET = "your_jwt_secret_key";

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { email, password, role } = reqBody;

        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!role) missingFields.push('role');
        if (missingFields.length > 0) {
            return NextResponse.json({ message: "The following fields are required: " + missingFields.join(', ') });
        }
        if (role !== "tester" && role !== "creator") {
            return NextResponse.json({ message: "Invalid Role" });
        }

        let existingUser;
        if (role === "tester") {
            existingUser = await Tester.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: "Tester not found" });
            }
        } else {
            existingUser = await Creator.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: "Creator not found" });
            }
        }

        const isMatch = await bcryptjs.compare(password, existingUser.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hour
        );

        return NextResponse.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`, token });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "An error occurred", error: error.message });
    }
}
