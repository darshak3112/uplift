import mongoose from "mongoose";
import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const reqBody = await req.json();

        if (!reqBody) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Invalid request body", reqBody }, { status: 401 });
        }

        const { id, role } = reqBody;

        if (!id || !role) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Invalid request body", reqBody }, { status: 401 });
        }

        if (role === "tester") {
            const tester = await Tester.findById(id);
            if (!tester) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: "Tester not found", id }, { status: 404 });
            }

            const { firstName, lastName, email, mobileNo, gender, dob, country, role, pincode, taskHistory } = tester;
            const response = {
                firstName,
                lastName,
                email,
                mobileNo,
                gender,
                dob,
                country,
                role,
                pincode,
                total_task: taskHistory.length,
            };

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json(response, { status: 201 });
        } else if (role === "creator") {
            const creator = await Creator.findById(id);
            if (!creator) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: "Creator not found", id }, { status: 404 });
            }

            const { firstName, lastName, email, mobileNo, gender, dob, country, role, pincode, taskHistory } = creator;
            const response = {
                firstName,
                lastName,
                email,
                mobileNo,
                gender,
                dob,
                country,
                role,
                pincode,
                total_task: taskHistory.length,
            };

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json(response, { status: 201 });
        }

        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: "Role is not valid", role }, { status: 400 });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
