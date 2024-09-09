import { NextResponse } from "next/server";
import App from "@/model/Task/apptaskModel";
import Tester from "@/model/testerModel";
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
    const { taskId } = reqBody;
    if (!taskId) {
      return NextResponse.json(
        { message: "TaskId is required", reqBody },
        { status: 400 }
      );
    }
    const task = await App.findById(taskId).session(session);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found", taskId },
        { status: 404 }
      );
    }
    const testers = task.applied_testers;
    const testerDetails = [];
    for (const testerId of testers) {
      const tester = await Tester.findById(testerId).session(session);
      const today = new Date();
        const tester_dob = new Date(tester.dob);
        const diffInMs = today - tester_dob;
        const tester_age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
      const data = {
        "name" : tester.firstName +' ' + tester.lastName,
        "email" : tester.email,
        "age" : tester_age,
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
