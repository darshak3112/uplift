import mongoose from "mongoose";
import { Tester, Task, SurveyTask, SurveyResponse } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await req.json();

    if (!reqBody || !reqBody.taskId || !reqBody.testerId || !reqBody.response) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request body or missing required fields" },
        { status: 400 }
      );
    }

    const { taskId, testerId, response } = reqBody;

    const task = await Task.findById(taskId)
      .populate("specificTask")
      .session(session);
    if (!task || task.type !== "SurveyTask") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Survey task not found" },
        { status: 404 }
      );
    }

    if (task.tester_ids.length >= task.tester_no) {
      task.task_flag = "Closed";
      await task.save({ session });
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Task is already full" },
        { status: 400 }
      );
    }

    const tester = await Tester.findById(testerId).session(session);
    if (!tester) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Tester not found" },
        { status: 404 }
      );
    }

    const surveyResponse = new SurveyResponse({
      taskId: task._id,
      testerId: tester._id,
      responses: response,
    });

    const savedResponse = await surveyResponse.save({ session });

    // Update task's tester_ids
    // Update task's tester_ids with testerId and status if schema allows objects
    if (!task.tester_ids.some((entry) => entry.testerId.equals(tester._id))) {
      task.tester_ids.push(testerId);
      await task.save({ session });
    }

    // Update tester's taskHistory
    const existingTaskEntry = tester.taskHistory.find((entry) =>
      entry.taskId.equals(task._id)
    );

    if (existingTaskEntry) {
      existingTaskEntry.status = "success";
      existingTaskEntry.appliedAt = new Date();
    } else {
      tester.taskHistory.push({
        taskId: task._id,
        status: "success",
        appliedAt: new Date(),
      });
    }

    await tester.save({ session });

    if (task.tester_ids.length >= task.tester_no) {
      task.task_flag = "Closed";
      await task.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Survey response saved successfully",
        response: savedResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
