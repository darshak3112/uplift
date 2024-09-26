import mongoose from "mongoose";
import { AppResponse, Task, Tester, AppTask } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  let session;
  let retries = 3; // Retry limit for transient errors

  try {
    const { testerId, text, taskId } = await req.json();

    if (!testerId || !text || !taskId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Retry logic for handling transient transaction errors
    while (retries > 0) {
      try {
        // Start the session and transaction
        session = await mongoose.startSession();
        session.startTransaction();

        const [task, tester] = await Promise.all([
          Task.findById(taskId).session(session),
          Tester.findById(testerId).session(session),
        ]);

        if (!task) {
          await session.abortTransaction();
          return NextResponse.json(
            { message: "Task not found" },
            { status: 404 }
          );
        }

        if (!tester) {
          await session.abortTransaction();
          return NextResponse.json(
            { message: "Tester not found" },
            { status: 404 }
          );
        }

        const appTask = await AppTask.findById(task.specificTask).session(
          session
        );

        if (!appTask) {
          await session.abortTransaction();
          return NextResponse.json(
            { message: "App task not found" },
            { status: 404 }
          );
        }

        const isTesterSelected = appTask.selected_testers.some(
          (selected) => selected._id.toString() === testerId
        );

        if (!isTesterSelected) {
          await session.abortTransaction();
          return NextResponse.json(
            { message: "You are not selected for testing this app" },
            { status: 403 }
          );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingResponse = await AppResponse.findOne({
          taskId,
          testerId,
          "responses.date": { $gte: today },
        }).session(session);

        if (existingResponse) {
          await session.abortTransaction();
          return NextResponse.json(
            { message: "A response for today has already been added" },
            { status: 409 }
          );
        }

        const newResponse = {
          text,
          date: new Date(),
        };

        const appResponse = await AppResponse.findOneAndUpdate(
          { taskId, testerId },
          { $push: { responses: newResponse } },
          { new: true, upsert: true, session }
        );

        await session.commitTransaction();

        return NextResponse.json(
          { message: "Response added successfully", result: appResponse },
          { status: 201 }
        );
      } catch (error) {
        if (session && session.inTransaction()) {
          await session.abortTransaction();
        }

        if (
          error.errorLabels &&
          error.errorLabels.includes("TransientTransactionError")
        ) {
          retries -= 1; // Decrement retry count on transient error
        } else {
          console.error("Error in transaction:", error);
          return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
      } finally {
        if (session) {
          await session.endSession();
        }
      }
    }

    // If retries exhausted
    return NextResponse.json(
      { message: "Failed after multiple retries" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
