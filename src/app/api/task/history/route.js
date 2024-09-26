import mongoose from "mongoose";
import { Tester, Creator, Task } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await req.json();

    if (!reqBody || !reqBody.id || !reqBody.role) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request. Missing id or role." },
        { status: 400 }
      );
    }

    const { id, role } = reqBody;

    if (role !== "tester" && role !== "creator") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    let user;
    if (role === "tester") {
      user = await Tester.findById(id).session(session);
    } else {
      user = await Creator.findById(id).session(session);
    }

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        {
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found`,
        },
        { status: 404 }
      );
    }

    const taskHistory = await Promise.all(
      user.taskHistory.map(async (historyItem) => {
        const task = await Task.findById(
          role === "tester" ? historyItem.taskId : historyItem.task
        ).session(session);

        if (!task) {
          return null;
        }

        return {
          id: task._id,
          type: task.type,
          heading: task.heading,
          instruction: task.instruction,
          status: role === "tester" ? historyItem.status : task.task_flag,
          date: role === "tester" ? historyItem.appliedAt : task.post_date,
        };
      })
    );

    const filteredTaskHistory = taskHistory.filter((item) => item !== null);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Task History Retrieved Successfully",
        history: filteredTaskHistory.reverse(),
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
