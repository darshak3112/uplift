import mongoose from 'mongoose';
import { NextResponse } from "next/server";
import App from "@/model/Task/apptaskModel";
import Task from "@/model/taskModel";
import Tester from "@/model/testerModel";

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
        const { taskId, testerId } = reqBody;

        if (!taskId) {
            await session.abortTransaction(); // Rollback if taskId is missing
            session.endSession();
            return NextResponse.json({ message: "Task ID is required", reqBody }, { status: 400 });
        }

        if (!testerId) {
            await session.abortTransaction(); // Rollback if testerId is missing
            session.endSession();
            return NextResponse.json({ message: "Tester ID is required", reqBody }, { status: 400 });
        }

        const tester = await Tester.findById(testerId).session(session); // Use session for the query
        if (!tester) {
            await session.abortTransaction(); // Rollback if tester not found
            session.endSession();
            return NextResponse.json({ message: "Tester ID is wrong", reqBody }, { status: 400 });
        }

        const task = await App.findById(taskId).session(session); // Use session for the query
        if (!task) {
            await session.abortTransaction(); // Rollback if task not found
            session.endSession();
            return NextResponse.json({ message: "Task not found", taskId }, { status: 404 });
        }

        if (!task.applied_testers.includes(testerId)) {
            await session.abortTransaction(); // Rollback if tester has not applied
            session.endSession();
            return NextResponse.json({ message: "You have not applied for this task", task }, { status: 400 });
        }

        if (task.selected_tester.includes(testerId)) {
            await session.abortTransaction(); // Rollback if tester is already selected
            session.endSession();
            return NextResponse.json({ message: "This user is already selected", task }, { status: 400 });
        }

        task.selected_tester.push(testerId);
        await task.save({ session }); // Use session for the save operation

        const taskExists = await Task.findOne({ type: "app", app: taskId }).session(session); // Use session for the query
        if (taskExists) {
            if (task.selected_tester.length === task.tester_no) {
                taskExists.task_flag = "Closed";
                await taskExists.save({ session }); // Use session for the save operation
            }

            tester.taskHistory.push(taskExists._id);
            await tester.save({ session }); // Use session for the save operation
        }

        await session.commitTransaction(); // Commit the transaction if successful
        session.endSession();

        return NextResponse.json({ message: "Tester selected successfully", task }, { status: 200 });
    } catch (error) {
        await session.abortTransaction(); // Rollback in case of any error
        session.endSession();
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
