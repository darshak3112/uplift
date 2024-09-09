import mongoose from 'mongoose';
import App from "@/model/Task/apptaskModel";
import AppResponse from "@/model/TaskResponse/appTaskResponseModel";
import Tester from "@/model/testerModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const reqBody = await req.json();

        if (!reqBody) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Invalid request Body", reqBody }, { status: 400 });
        }

        const { testerId, response, taskId } = reqBody;

        if (!testerId || !response || !taskId) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "All fields are required", reqBody }, { status: 400 });
        }

        const taskExists = await App.findById(taskId).session(session);
        if (!taskExists) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Task not found", taskId }, { status: 404 });
        }

        const testerExists = await Tester.findById(testerId).session(session);
        if (!testerExists) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Tester not found", testerId }, { status: 404 });
        }

        // Ensure selected_tester is defined and is an array
        if (!Array.isArray(taskExists.selected_tester) || !taskExists.selected_tester.includes(testerId)) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({
                message: "You are not selected for testing this app, so you cannot send a response",
                testerId
            }, { status: 403 });
        }

        const newResponse = {
            text: response,
            date: new Date()
        };

        // Check if a response for the same date already exists
        const existingResponse = await AppResponse.findOne({
            taskId,
            testerId,
            "response.date": { $gte: new Date(new Date().setHours(0, 0, 0, 0)), $lt: new Date(new Date().setHours(24, 0, 0, 0)) }
        }).session(session);

        if (existingResponse) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({
                message: "A response for today has already been added.",
                existingResponse
            }, { status: 400 });
        }

        // Add or update the response for the tester
        const appResponse = await AppResponse.findOneAndUpdate(
            { taskId, testerId },
            { $push: { response: newResponse } },
            { new: true, upsert: true, session } // Create a new document if it doesn't exist
        );

        // Save the response document
        await appResponse.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: "Response added successfully", result: appResponse }, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // Return an error response in case something goes wrong
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
