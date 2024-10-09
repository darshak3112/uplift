import mongoose from "mongoose";
import { Creator, Task, YoutubeTask } from "@/models";
import { NextResponse } from "next/server";
import { z } from "zod";

const youtubeTaskSchema = z.object({
  creator: z.string(),
  post_date: z.string().transform((val) => new Date(val)),
  end_date: z.string().transform((val) => new Date(val)),
  tester_no: z.number().min(1),
  tester_age: z.number().min(1),
  tester_gender: z.enum(["Male", "Female", "Any"]),
  country: z.string(),
  heading: z.string(),
  instruction: z.string(),
  youtube_thumbnails: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
    })
  ),
  web_link: z.string(),
});

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parsedData = youtubeTaskSchema.safeParse(await req.json());
    if (!parsedData.success) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request body", errors: parsedData.error.issues },
        { status: 400 }
      );
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
      youtube_thumbnails,
      web_link,
    } = parsedData.data;

    const creatorExists = await Creator.findById(creator).session(session);
    if (!creatorExists) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Creator not found" },
        { status: 404 }
      );
    }

    const current_date = new Date();
    let task_flag = "Pending";
    if (current_date >= post_date && current_date <= end_date) {
      task_flag = "Open";
    } else if (current_date > end_date) {
      task_flag = "Closed";
    }

    const task = new Task({
      type: "YoutubeTask",
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
    });

    const youtubeTask = new YoutubeTask({
      taskId: task._id,
      youtube_thumbnails,
      web_link,
    });

    task.specificTask = youtubeTask._id;

    await task.save({ session });
    await youtubeTask.save({ session });

    creatorExists.taskHistory.push({
      task: task._id,
      createdAt: new Date(),
    });
    await creatorExists.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "YouTube task created successfully",
        task: task,
        youtubeTask: youtubeTask,
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
