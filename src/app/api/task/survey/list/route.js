import Survey from "@/model/Task/surveytaskModel";
import mongoose from "mongoose";
import Tester from "@/model/testerModel";
import Task from "@/model/taskModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const reqBody = await req.json();

    if (!reqBody) {
        return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
    }

    const { testerId } = reqBody;

    const tester = await Tester.findById(testerId);
    if (!tester) {
        return NextResponse.json({ message: 'Tester not found', testerId }, { status: 404 });
    }

    const today = new Date();
    const tester_dob = new Date(tester.dob);
    const diffInMs = today - tester_dob;
    const tester_age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

    const tasks = await Task.find({
        task_flag: "Open"
    });

    if (!tasks || tasks.length === 0) {
        return NextResponse.json({ message: 'No task available', tasks }, { status: 404 });
    }

    const allSurveys = await Promise.all(tasks.map(async (task) => {
        const survey = await Survey.findById(task.survey);
        if (
            survey &&
            survey.tester_age <= tester_age &&
            survey.post_date <= today &&
            survey.end_date >= today &&
            survey.tester_no > survey.tester_ids.length &&
            survey.country === tester.country &&
            !survey.tester_ids.some(id => id.equals(testerId)) &&
            (
                survey.tester_gender === "Both" ||
                survey.tester_gender === tester.gender
            )
        ) {
            return survey;
        }
    }));

    const filteredSurveys = allSurveys.filter(survey => survey !== undefined);

    return NextResponse.json({ message: 'All Surveys', surveys: filteredSurveys }, { status: 200 });
}
