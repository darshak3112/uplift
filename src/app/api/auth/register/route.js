import { dbConnect } from '@/_lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from 'zod';

dbConnect();

const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    mobileNo: z.string().min(10), // Adjust minimum length as needed
    gender: z.enum(['Male', 'Female', 'Others']),
    password: z.string().min(6), // Adjust minimum length as needed
    dob: z.string().date(), // Ensures valid ISO 8601 date format
    country: z.string().min(2), // Adjust minimum length as needed
    role: z.enum(['tester', 'creator']),
    pincode: z.string().optional(), // Optional pincode with minimum length
});

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const parsedData = userSchema.safeParse(reqBody);
        if (!parsedData.success) {
            return NextResponse.json({ message: 'Invalid request body', errors: parsedData.error.issues }, { status: 400 });
        }
        const { firstName, lastName, email, mobileNo, gender, password, dob, country, role, pincode } = parsedData.data;

        const DOB = new Date(dob);
        let existingUserByEmail;
        let existingUserByMobile;

        if (role === "tester") {
            existingUserByEmail = await Tester.findOne({ email });
            existingUserByMobile = await Tester.findOne({ mobileNo });
            if (existingUserByEmail) {
                return NextResponse.json({ message: "Email already registerd." }, { status: 409 });
            } else if (existingUserByMobile) {
                return NextResponse.json({ message: "Mobile no already registerd." }, { status: 409 });
            } else {
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(password, salt);
                const newTester = new Tester({
                    firstName,
                    lastName,
                    email,
                    mobileNo,
                    gender,
                    password: hashedPassword,
                    pincode,
                    dob: DOB,
                    country
                });
                await newTester.save();
                return NextResponse.json({ message: "Tester registered successfully" }, { status: 201 });
            }
        } else {
            existingUserByEmail = await Creator.findOne({ email });
            existingUserByMobile = await Creator.findOne({ mobileNo });
            if (existingUserByEmail) {
                return NextResponse.json({ message: "Email already registerd." }, { status: 409 });
            } else if (existingUserByMobile) {
                return NextResponse.json({ message: "Mobile no already registerd." }, { status: 409 });
            } else {
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(password, salt);
                const newCreator = new Creator({
                    firstName,
                    lastName,
                    email,
                    mobileNo,
                    gender,
                    password: hashedPassword,
                    dob: DOB,
                    country
                });
                await newCreator.save();
                return NextResponse.json({ message: "Creator registered successfully" }, { status: 201 });
            }
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "An error occurred", error: err.message }, { status: 500 });
    }
}
