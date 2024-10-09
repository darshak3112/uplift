import mongoose from "mongoose";
import { Creator, Task, AppTask } from "@/models";
import { NextResponse } from "next/server";
import { z } from "zod";

const createAppTaskSchema = z.object({
  creator: z.string(),
  post_date: z.string().transform((val) => new Date(val)),
  end_date: z.string().transform((val) => new Date(val)),
  tester_no: z.number().positive(),
  tester_age: z.number().positive(),
  tester_gender: z.enum(["Male", "Female", "Any"]),
  country: z.string().min(2),
  heading: z.string().min(1),
  instruction: z.string().min(1),
});

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parsedData = createAppTaskSchema.safeParse(await req.json());
    if (!parsedData.success) {
      throw new Error(parsedData.error.message);
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
    } = parsedData.data;

    const creatorExists = await Creator.findById(creator).session(session);
    if (!creatorExists) {
      throw new Error("Creator not found");
    }

    const current_date = new Date();
    const task_flag =
      current_date >= post_date && current_date <= end_date
        ? "Open"
        : current_date > end_date
        ? "Closed"
        : "Pending";

    const appTask = await AppTask.create(
      [
        {
          applied_testers: [],
          selected_testers: [],
          rejected_testers: [],
        },
      ],
      { session }
    );

    const task = await Task.create(
      [
        {
          type: "AppTask",
          creator,
          post_date,
          end_date,
          tester_no,
          tester_age,
          tester_gender,
          country,
          heading,
          instruction,
          task_flag,
          specificTask: appTask[0]._id,
        },
      ],
      { session }
    );

    appTask[0].taskId = task[0]._id;
    await appTask[0].save({ session });

    await Creator.findByIdAndUpdate(
      creator,
      { $push: { taskHistory: { task: task[0]._id } } },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Task added successfully",
        task: task[0],
        appTask: appTask[0],
      },
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
