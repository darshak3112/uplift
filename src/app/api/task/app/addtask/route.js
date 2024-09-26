import mongoose from "mongoose";
import { Creator, Task, AppTask } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await req.json();
    if (!reqBody) {
      throw new Error("Invalid request body");
    }

    const {
      creator,
      post_date,
      end_date,
      tester_no,
      tester_age,
      tester_gender,
      country,
      heading,
      instruction,
    } = reqBody;

    if (
      !creator ||
      !post_date ||
      !end_date ||
      !tester_no ||
      !tester_age ||
      !tester_gender ||
      !country ||
      !heading ||
      !instruction
    ) {
      throw new Error("Missing required fields");
    }

    const creatorExists = await Creator.findById(creator).session(session);
    if (!creatorExists) {
      throw new Error("Creator not found");
    }

    const p_date = new Date(post_date);
    const e_date = new Date(end_date);
    const current_date = new Date();

    let task_flag = "Pending";
    if (current_date >= p_date && current_date <= e_date) {
      task_flag = "Open";
    } else if (current_date > e_date) {
      task_flag = "Closed";
    }

    const appTask = new AppTask({
      taskId: new mongoose.Types.ObjectId(),
    });

    const task = new Task({
      type: "AppTask",
      creator: new mongoose.Types.ObjectId(creator),
      post_date: p_date,
      end_date: e_date,
      tester_no,
      tester_age,
      tester_gender,
      country,
      heading,
      instruction,
      task_flag,
      specificTask: appTask._id,
    });

    appTask.taskId = task._id;

    await Promise.all([
      appTask.save({ session }),
      task.save({ session }),
      Creator.findByIdAndUpdate(
        creator,
        { $push: { taskHistory: { task: task._id } } },
        { session, new: true }
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "Task added successfully", task },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
