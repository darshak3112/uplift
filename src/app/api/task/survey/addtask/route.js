import mongoose from "mongoose";
import { SurveyTask, Task, Creator } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request body" },
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
      noOfQuestions,
      questions,
    } = reqBody;
    
    // Validate required fields
    if (
      !creator ||
      !post_date ||
      !end_date ||
      !tester_no ||
      !tester_age ||
      !tester_gender ||
      !country ||
      !heading ||
      !instruction ||
      !noOfQuestions ||
      !questions
    ) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const creatorExists = await Creator.findById(creator).session(session);
    if (!creatorExists) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Creator not found" },
        { status: 404 }
      );
    }
    
    if (parseInt(noOfQuestions) !== questions.length) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Number of questions does not match" },
        { status: 400 }
      );
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
    
    // Prepare questions with proper structure
    const formattedQuestions = questions.map((q, index) => ({
      questionId: index + 1,
      title: q.title,
      answer_type: q.answer_type === 'multiple-choice' ? 'multiple_choice' : q.answer_type,
      options: q.options || []
    }));
    
    // Create a temporary Task document to get an _id
    const tempTask = new Task({
      type: "SurveyTask",
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
    });
    
    // Create SurveyTask with the temporary Task's _id
    const surveyTask = new SurveyTask({
      taskId: tempTask._id,
      noOfQuestions,
      questions: formattedQuestions,
    });
    
    const savedSurveyTask = await surveyTask.save({ session });
    
    // Update the temporary Task with the specificTask field and save it
    tempTask.specificTask = savedSurveyTask._id;
    const savedTask = await tempTask.save({ session });
    
    // Update creator's task history
    creatorExists.taskHistory.push({
      task: savedTask._id,
    });
    await creatorExists.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    return NextResponse.json(
      { message: "Survey task created successfully", task: savedTask },
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