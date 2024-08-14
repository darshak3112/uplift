import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import taskModel from "@/model/taskModel";
import { NextResponse } from "next/server";
import SurveyResponse from "@/model/TaskResponse/surveyTaskResponseModel";

export async function POST(req) {
    try {
        const reqBody = await req.json();

        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { id, role } = reqBody;

        if (!id || !role) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        if (role !== 'tester' && role !== 'creator') {
            return NextResponse.json({ message: 'Invalid role', role }, { status: 400 });
        }

        if (role === 'tester') {
            const tester = await Tester.findById(id);
            if (!tester) {
                return NextResponse.json({ message: 'Tester not found' }, { status: 404 });
            }

            const history = tester.taskHistory;
            const heading = [];
            for (const taskId of history) {
                const task = await taskModel.findById(taskId);
                if (task && task.type === 'survey') {
                    const survey = await Survey.findById(task.survey);
                    if (survey) {
                        heading.push({
                            heading: survey.heading,
                            instruction: survey.instruction // Ensure this field exists
                        });
                    }
                }
            }
            return NextResponse.json({ message: 'History', history: heading }, { status: 200 });
        } else {
            const creator = await Creator.findById(id);
            if (!creator) {
                return NextResponse.json({ message: 'Creator not found' }, { status: 404 });
            }

            const history = creator.taskHistory;
            const heading = [];
            for (const taskId of history) {
                const task = await taskModel.findById(taskId.task);
                if (task && task.type === 'survey') {
                    const survey = await Survey.findById(task.survey);
                    if (survey) {
                        const surveyResponses = await SurveyResponse.find({ taskId: survey._id });
                        const results = {};

                        surveyResponses.forEach((response) => {
                            response.response.forEach(({ questionId, answer }) => {
                                if (!results[questionId]) {
                                    results[questionId] = {};
                                }
                                if (!results[questionId][answer]) {
                                    results[questionId][answer] = 0;
                                }
                                results[questionId][answer]++;
                            });
                        });

                        const questionMap = survey.questions.map(({ title }, index) => ({
                            id: index + 1,  // assuming 1-based index for results
                            title: title
                        }));

                        const formattedResults = questionMap.map(({ id, title }) => {
                            return {
                                question: title,
                                answers: results[id] ? results[id] : {}
                            };
                        });

                        heading.push({
                            heading: survey.heading,
                            instruction: survey.instruction,
                            answers: formattedResults
                        });
                    }
                }
            }
            return NextResponse.json({ message: 'History', history: heading }, { status: 200 });
        }
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
