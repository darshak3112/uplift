import { dbConnect } from '@/lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

dbConnect();

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { firstName, lastName, email, mobileNo, gender, password, dob, country, role, pincode } = reqBody;

        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!email) missingFields.push('email');
        if (!mobileNo) missingFields.push('mobileNo');
        if (!gender) missingFields.push('gender');
        if (!password) missingFields.push('password');
        if (!role) missingFields.push('role');
        if (!dob) missingFields.push('dob');
        if (!country) missingFields.push('country');

        if (missingFields.length > 0) {
            return NextResponse.json({ message: "The following fields are required: " + missingFields.join(', ') });
        }

        if (role !== "tester" && role !== "creator") {
            return NextResponse.json({ message: "Invalid Role" });
        }

        const DOB = new Date(dob);
        let existingUser;

        if (role === "tester") {
            existingUser = await Tester.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: "Tester already exists" });
            }
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
            return NextResponse.json({ message: "Tester registered successfully" });
        } else {
            existingUser = await Creator.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: "Creator already exists" });
            }
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
            return NextResponse.json({ message: "Creator registered successfully" });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "An error occurred", error: err.message });
    }
}
