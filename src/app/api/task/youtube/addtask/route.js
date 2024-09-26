import mongoose from "mongoose";
import { Creator, Task, YoutubeTask } from "@/models";
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
      youtube_thumbnails,
      web_link,
    } = reqBody;

    // Validate required fields
    const requiredFields = [
      "creator",
      "post_date",
      "end_date",
      "tester_no",
      "tester_age",
      "tester_gender",
      "country",
      "heading",
      "instruction",
      "youtube_thumbnails",
      "web_link",
    ];
    const missingFields = requiredFields.filter((field) => !reqBody[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const creatorExists = await Creator.findById(creator).session(session);
    if (!creatorExists) {
      throw new Error("Creator not found");
    }

    // Validate dates
    const p_date = new Date(post_date);
    const e_date = new Date(end_date);
    if (isNaN(p_date.getTime()) || isNaN(e_date.getTime())) {
      throw new Error("Invalid date format");
    }

    // Determine task flag
    const current_date = new Date();
    let task_flag = "Pending";
    if (current_date >= p_date && current_date <= e_date) {
      task_flag = "Open";
    } else if (current_date > e_date) {
      task_flag = "Closed";
    }

    // Create main Task document first
    const task = new Task({
      type: "YoutubeTask",
      creator,
      post_date: p_date,
      end_date: e_date,
      tester_no,
      tester_age,
      tester_gender,
      country,
      heading,
      instruction,
      task_flag,
    });

    // Create YoutubeTask document with taskId
    const youtubeTask = new YoutubeTask({
      taskId: task._id,
      youtube_thumbnails: youtube_thumbnails.map((thumbnail) => ({
        title: thumbnail.title,
        link: thumbnail.link,
      })),
      web_link,
    });

    // Set the specificTask field in the Task document
    task.specificTask = youtubeTask._id;

    // Save both documents
    await task.save({ session });
    await youtubeTask.save({ session });

    // Update creator's task history
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
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
