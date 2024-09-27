import { NextResponse } from "next/server";
import { Task, AppTask, Creator, Tester } from "@/models";
import mongoose from "mongoose";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await req.json();
    if (!reqBody) {
      return NextResponse.json(
        { message: "Body should not be empty", reqBody },
        { status: 400 }
      );
    }
    const { taskId, creatorId } = reqBody;
    if (!taskId) {
      return NextResponse.json(
        { message: "TaskId is required", reqBody },
        { status: 400 }
      );
    }
    if (!creatorId) {
      return NextResponse.json(
        { message: "CreatorId is required", reqBody },
        { status: 400 }
      )
    }

    const creator = await Creator.findById(creatorId).session(session);
    if (!creator) {
      return NextResponse.json(
        { message: "Creator not found", creatorId },
        { status: 404 }
      );
    }

    const task = await Task.findById(taskId).session(session);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found", taskId },
        { status: 404 }
      );
    }

    if (task.creator.toString() !== creatorId) {
      return NextResponse.json(
        { message: "Creator not authorized to view this task" },
        { status: 401 }
      );
    }

    const specificTask = await AppTask.findById(task.specificTask).session(session);
    if (!specificTask) {
      return NextResponse.json(
        { message: "Specific task not found", taskId },
        { status: 404 }
      );
    }

    const testers = specificTask.applied_testers;
    const testerDetails = [];
    for (const testerId of testers) {
      const tester = await Tester.findById(testerId).session(session);
      const today = new Date();
      const tester_dob = new Date(tester.dob);
      const diffInMs = today - tester_dob;
      const tester_age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
      const data = {
        "name": tester.firstName + ' ' + tester.lastName,
        "email": tester.email,
        "age": tester_age,
        "testerId": tester._id
      }
      testerDetails.push(data);
    }
    await session.commitTransaction();
    session.endSession();
    return NextResponse.json({ message: "Success", testerDetails }, { status: 200 });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { message: "Error in request body", error },
      { status: 400 }
    );
  }
}
