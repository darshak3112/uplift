import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Tester, Task, AppTask } from "@/models";

export async function POST(req) {
  const session = await mongoose.startSession(); // Start session for transaction
  session.startTransaction(); // Begin transaction

  try {
    const reqBody = await req.json();
    if (!reqBody) {
      await session.abortTransaction(); // Rollback if request body is invalid
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request body", reqBody },
        { status: 400 }
      );
    }

    const { testerId, taskId } = reqBody;

    if (!testerId || !taskId) {
      await session.abortTransaction(); // Rollback if testerId or taskId is missing
      session.endSession();
      return NextResponse.json(
        { message: "Tester ID and Task ID are required", reqBody },
        { status: 400 }
      );
    }

    const tester = await Tester.findById(testerId).session(session); // Use session for the query
    if (!tester) {
      await session.abortTransaction(); // Rollback if tester not found
      session.endSession();
      return NextResponse.json(
        { message: "Tester not found", testerId },
        { status: 404 }
      );
    }

    const taskExists = await Task.findOne({
      _id: taskId,
      type: "AppTask",
    }).session(session); // Use session for the query
    if (!taskExists) {
      await session.abortTransaction(); // Rollback if task not found
      session.endSession();
      return NextResponse.json(
        { message: "Task not found", taskId },
        { status: 404 }
      );
    }

    const specificTask = await AppTask.findById(
      taskExists.specificTask
    ).session(session); // Use session for the query
    if (!specificTask) {
      await session.abortTransaction(); // Rollback if specific task not found
      session.endSession();
      return NextResponse.json(
        { message: "Specific task not found", taskId },
        { status: 404 }
      );
    }

    if (specificTask.applied_testers.includes(testerId)) {
      await session.abortTransaction(); // Rollback if tester has already applied
      session.endSession();
      return NextResponse.json(
        { message: "You have already applied for this task", taskExists },
        { status: 400 }
      );
    }

    // Add tester to applied_testers
    specificTask.applied_testers.push(testerId);
    await specificTask.save({ session }); // Use session for the save operation

    // Add task to tester's task history
    tester.taskHistory.push({
      taskId: taskId, // Ensure taskId matches the schema field name
      status: "applied", // Ensure status is provided correctly
    });

    await tester.save({ session }); // Use session for the save operation

    await session.commitTransaction(); // Commit the transaction if successful
    session.endSession();

    return NextResponse.json(
      { message: "Task applied successfully", task: taskExists },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction(); // Rollback in case of any error
    session.endSession();
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
