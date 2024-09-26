import mongoose from "mongoose";
import {
  Task,
  SurveyTask,
  YoutubeTask,
  AppTask,
  MarketingTask,
  SurveyResponse,
  YoutubeResponse,
  AppResponse,
  MarketingResponse,
} from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, type } = await req.json();

    if (!id || !type) {
      throw new Error("Invalid request body");
    }

    const task = await Task.findById(id)
      .populate("specificTask")
      .session(session);

    if (!task) {
      throw new Error(`Task not found`);
    }

    let responseModel, formattedResults;

    switch (type) {
      case "SurveyTask":
        responseModel = SurveyResponse;
        formattedResults = await processSurveyAnalytics(
          task,
          responseModel,
          session
        );
        break;
      case "YoutubeTask":
        responseModel = YoutubeResponse;
        formattedResults = await processYoutubeAnalytics(
          task,
          responseModel,
          session
        );
        break;
      case "AppTask":
        responseModel = AppResponse;
        formattedResults = await processAppAnalytics(
          task,
          responseModel,
          session
        );
        break;
      case "MarketingTask":
        responseModel = MarketingResponse;
        formattedResults = await processMarketingAnalytics(
          task,
          responseModel,
          session
        );
        break;
      default:
        throw new Error("Invalid task type");
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Analytics",
        task: {
          id: task._id,
          type: type,
          heading: task.heading,
          instruction: task.instruction,
          answers: formattedResults,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in POST request:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

async function processSurveyAnalytics(task, responseModel, session) {
  const taskResponses = await responseModel
    .find({ taskId: task._id })
    .session(session);
  const results = {};

  task.specificTask.questions.forEach((question) => {
    results[question.questionId] = {};
    if (question.answer_type === "multiple_choice") {
      question.options.forEach((option) => {
        results[question.questionId][option] = 0;
      });
    }
  });

  taskResponses.forEach((response) => {
    response.responses.forEach(({ questionId, answer }) => {
      if (results[questionId]) {
        if (typeof results[questionId][answer] === "number") {
          results[questionId][answer]++;
        } else {
          results[questionId][answer] = 1;
        }
      }
    });
  });

  return task.specificTask.questions.map(
    ({ questionId, title, answer_type, options }) => ({
      question: title,
      answerType: answer_type,
      answers:
        answer_type === "multiple_choice"
          ? options.map((option) => ({
              option,
              count: results[questionId][option] || 0,
            }))
          : Object.entries(results[questionId]).map(([answer, count]) => ({
              answer,
              count,
            })),
    })
  );
}

async function processYoutubeAnalytics(task, responseModel, session) {
  const taskResponses = await responseModel
    .find({ taskId: task._id })
    .session(session);
  const results = {};
  const options = task.specificTask.youtube_thumbnails.map(
      (thumbnail) => thumbnail.link
    );

  options.forEach((option) => {
    results[option] = 0;
  });

  taskResponses.forEach((response) => {
    if (response.response && options.includes(response.response)) {
      results[response.response]++;
    }
  });

  return {
    question: task.heading,
    answers: options.map((option) => ({
      option,
      count: results[option],
    })),
  };
}


async function processAppAnalytics(task, responseModel, session) {
  const taskResponses = await responseModel
    .find({ taskId: task._id })
    .session(session);

  // Implement app-specific analytics logic here
  // For example, you might want to analyze the text responses
  const textResponses = taskResponses.flatMap((response) =>
    response.responses.map((r) => r.text)
  );

  return {
    totalResponses: taskResponses.length,
    // Add more app-specific analytics here
  };
}

async function processMarketingAnalytics(task, responseModel, session) {
  const taskResponses = await responseModel
    .find({ taskId: task._id })
    .session(session);

  // Implement marketing-specific analytics logic here
  // For example, you might want to analyze order dates and review submission times
  const orderDates = taskResponses.map((response) => response.order.orderDate);
  const reviewSubmissionDates = taskResponses.map(
    (response) => response.liveReview.submittedAt
  );

  return {
    totalOrders: taskResponses.length,
    averageTimeBetweenOrderAndReview: calculateAverageTimeDifference(
      orderDates,
      reviewSubmissionDates
    ),
    // Add more marketing-specific analytics here
  };
}

function calculateAverageTimeDifference(dates1, dates2) {
  const timeDifferences = dates1.map((date, index) =>
    Math.abs(new Date(date) - new Date(dates2[index]))
  );
  const averageTimeDifference =
    timeDifferences.reduce((sum, diff) => sum + diff, 0) /
    timeDifferences.length;
  return Math.round(averageTimeDifference / (1000 * 60 * 60)); // Convert to hours
}
