import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Tester from "@/model/testerModel";
import Task from "@/model/taskModel";
import Youtube from "@/model/Task/youtubetaskModel";
import App from "@/model/Task/apptaskModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const reqBody = await req.json();
        if (!reqBody) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Invalid request body", reqBody }, { status: 400 });
        }

        const { testerId } = reqBody;

        const tester = await Tester.findById(testerId).session(session);
        if (!tester) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "Tester not found", testerId }, { status: 404 });
        }

        const today = new Date();
        const tester_dob = new Date(tester.dob);
        const diffInMs = today - tester_dob;
        const tester_age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

        const tasks = await Task.find({ task_flag: "Open" }).session(session);
        if (!tasks || tasks.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: "No task available", tasks }, { status: 404 });
        }

        const allSurveys = await Promise.all(
            tasks.map(async (task) => {
                if (task.type === "survey") {
                    const survey = await Survey.findById(task.survey).session(session);
                    if (
                        survey &&
                        survey.tester_age <= tester_age &&
                        survey.post_date <= today &&
                        survey.end_date >= today &&
                        survey.tester_no > survey.tester_ids.length &&
                        survey.country === tester.country &&
                        !survey.tester_ids.some((id) => id.equals(testerId)) &&
                        (survey.tester_gender === "Both" || survey.tester_gender === tester.gender)
                    ) {
                        return survey;
                    }
                }
            })
        );

        const allYoutube = await Promise.all(
            tasks.map(async (task) => {
                if (task.type === "youtube") {
                    const youtube = await Youtube.findById(task.youtube).session(session);
                    if (
                        youtube &&
                        youtube.tester_age <= tester_age &&
                        youtube.post_date <= today &&
                        youtube.end_date >= today &&
                        youtube.tester_no > youtube.tester_ids.length &&
                        youtube.country === tester.country &&
                        !youtube.tester_ids.some((id) => id.equals(testerId)) &&
                        (youtube.tester_gender === "Both" || youtube.tester_gender === tester.gender)
                    ) {
                        return youtube;
                    }
                }
            })
        );

        const allApp = await Promise.all(
            tasks.map(async (task) => {
                if (task.type === "app") {
                    const app = await App.findById(task.app).session(session);
                    if (
                        app &&
                        app.tester_age <= tester_age &&
                        app.post_date <= today &&
                        app.end_date >= today &&
                        app.tester_no > app.selected_tester.length &&
                        app.country === tester.country &&
                        !app.selected_tester.some((id) => id.equals(testerId)) &&
                        (app.tester_gender === "Both" || app.tester_gender === tester.gender)
                    ) {
                        return app;
                    }
                }
            })
        );

        const filteredSurveys = allSurveys.filter((survey) => survey !== undefined);
        const filteredYoutube = allYoutube.filter((youtube) => youtube !== undefined);
        const filteredApp = allApp.filter((app) => app !== undefined);

        await session.commitTransaction();
        session.endSession();

        const response = {
            message: "All Tasks",
            surveys: filteredSurveys,
            youtube: filteredYoutube,
            app: filteredApp,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error:", error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
