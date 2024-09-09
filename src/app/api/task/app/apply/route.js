import mongoose from 'mongoose';
import { NextResponse } from "next/server";
import Tester from "@/model/testerModel";
import App from "@/model/Task/apptaskModel";

export async function POST(req) {
    const session = await mongoose.startSession(); // Start session for transaction
    session.startTransaction(); // Begin transaction

    try {
        const reqBody = await req.json();
        if (!reqBody) {
            await session.abortTransaction(); // Rollback if request body is invalid
            session.endSession();
            return NextResponse.json({ message: "Invalid request body", reqBody }, { status: 400 });
        }

        const { testerId, taskId } = reqBody;
        if (!testerId) {
            await session.abortTransaction(); // Rollback if testerId is missing
            session.endSession();
            return NextResponse.json({ message: "Tester ID is required", reqBody }, { status: 400 });
        }

        if (!taskId) {
            await session.abortTransaction(); // Rollback if taskId is missing
            session.endSession();
            return NextResponse.json({ message: "Task ID is required", reqBody }, { status: 400 });
        }

        const tester = await Tester.findById(testerId).session(session); // Use session for the query
        if (!tester) {
            await session.abortTransaction(); // Rollback if tester not found
            session.endSession();
            return NextResponse.json({ message: "Tester not found", testerId }, { status: 404 });
        }

        const taskExists = await App.findById(taskId).session(session); // Use session for the query
        if (!taskExists) {
            await session.abortTransaction(); // Rollback if task not found
            session.endSession();
            return NextResponse.json({ message: "Task not found", taskId }, { status: 404 });
        }

        if (taskExists.applied_testers.includes(testerId)) {
            await session.abortTransaction(); // Rollback if tester has already applied
            session.endSession();
            return NextResponse.json({ message: "You have already applied for this task", taskExists }, { status: 400 });
        }

        taskExists.applied_testers.push(testerId);
        await taskExists.save({ session }); // Use session for the save operation

        await session.commitTransaction(); // Commit the transaction if successful
        session.endSession();

        return NextResponse.json({ message: "Task applied successfully", taskExists }, { status: 200 });
    } catch (error) {
        await session.abortTransaction(); // Rollback in case of any error
        session.endSession();
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
