import Survey from "@/model/Task/surveytaskModel";
import Tester from "@/model/testerModel";
import Task from "@/model/taskModel";
import Youtube from "@/model/Task/youtubetaskModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      return NextResponse.json(
        { message: "Invalid request body", reqBody },
        { status: 400 }
      );
    }

    const { testerId } = reqBody;

    const tester = await Tester.findById(testerId);
    if (!tester) {
      return NextResponse.json(
        { message: "Tester not found", testerId },
        { status: 404 }
      );
    }

    const today = new Date();
    const tester_dob = new Date(tester.dob);
    const diffInMs = today - tester_dob;
    const tester_age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

    const tasks = await Task.find({
      task_flag: "Open",
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { message: "No task available", tasks },
        { status: 404 }
      );
    }

    const allSurveys = await Promise.all(
      tasks.map(async (task) => {
        if (task.type === "youtube") {
          {
            const survey = await Survey.findById(task.survey);
            if (
              survey &&
              survey.tester_age <= tester_age &&
              survey.post_date <= today &&
              survey.end_date >= today &&
              survey.tester_no > survey.tester_ids.length &&
              survey.country === tester.country &&
              !survey.tester_ids.some((id) => id.equals(testerId)) &&
              (survey.tester_gender === "Both" ||
                survey.tester_gender === tester.gender)
            ) {
              return survey;
            }
          }
        }
      })
    );

    const allYoutube = await Promise.all(
        tasks.map(async (task) => {
            if (task.type === "youtube") {
            {
                const youtube = await Youtube.findById(task.youtube);
                if (
                youtube &&
                youtube.tester_age <= tester_age &&
                youtube.post_date <= today &&
                youtube.end_date >= today &&
                youtube.tester_no > youtube.tester_ids.length &&
                youtube.country === tester.country &&
                !youtube.tester_ids.some((id) => id.equals(testerId)) &&
                (youtube.tester_gender === "Both" || 
                    youtube.tester_gender ===  tester.gender
                ))
                {
                    return youtube;
                }
            }
        }
    }
    ));

    const filteredSurveys = allSurveys.filter((survey) => survey !== undefined);
    const filteredYoutube = allYoutube.filter((youtube) => youtube !== undefined);

    const response = {
        message: "All Tasks",
        surveys: filteredSurveys,
        youtube: filteredYoutube,
        };
    
    return NextResponse.json(
      response ,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
