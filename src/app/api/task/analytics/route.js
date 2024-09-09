import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Youtube from "@/model/Task/youtubetaskModel";
import App from "@/model/Task/apptaskModel";
import Marketing from "@/model/Task/marketingtaskModel";
import Web from "@/model/Task/webtaskModel";
import SurveyResponse from "@/model/TaskResponse/surveyTaskResponseModel";
import YoutubeResponse from "@/model/TaskResponse/youtubeTaskResponseModel";
import AppResponse from "@/model/TaskResponse/appTaskResponseModel";
import MarketingResponse from "@/model/TaskResponse/marketingTaskResponseModel";
import WebResponse from "@/model/TaskResponse/webTaskResponseModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await mongoose.startSession(); // Start session for transaction
    session.startTransaction(); // Begin transaction

    try {
        const reqBody = await req.json();

        if (!reqBody) {
            await session.abortTransaction(); // Rollback if request body is invalid
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { id, type } = reqBody;

        if (!id || !type) {
            await session.abortTransaction(); // Rollback if id or type is missing
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        let task, responseModel, formattedResults;

        switch (type) {
            case 'survey':
                task = await Survey.findById(id).session(session); // Use session for the query
                responseModel = SurveyResponse;
                break;
            case 'youtube':
                task = await Youtube.findById(id).session(session); // Use session for the query
                responseModel = YoutubeResponse;
                break;
            case 'app':
                task = await App.findById(id).session(session); // Use session for the query
                responseModel = AppResponse;
                break;
            case 'marketing':
                task = await Marketing.findById(id).session(session); // Use session for the query
                responseModel = MarketingResponse;
                break;
            case 'web':
                task = await Web.findById(id).session(session); // Use session for the query
                responseModel = WebResponse;
                break;
            default:
                await session.abortTransaction(); // Rollback if type is invalid
                session.endSession();
                return NextResponse.json({ message: 'Invalid task type', type }, { status: 400 });
        }

        if (!task) {
            await session.abortTransaction(); // Rollback if task not found
            session.endSession();
            return NextResponse.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} task not found` }, { status: 404 });
        }

        // Fetch responses and process analytics
        const taskResponses = await responseModel.find({ taskId: task._id }).session(session); // Use session for the query
        const results = {};

        if (type === 'survey') {
            taskResponses.forEach((response) => {
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

            const questionMap = task.questions.map(({ title }, index) => ({
                id: index + 1,
                title: title
            }));

            formattedResults = questionMap.map(({ id, title }) => ({
                question: title,
                answers: results[id] ? results[id] : {}
            }));

        } else if (type === 'youtube') {
            const options = task.youtube_thumbnails.map((thumbnail) => thumbnail.title);
            taskResponses.forEach((response) => {
                const answer = response.response;
                if (answer && options.includes(answer)) {
                    if (!results[answer]) {
                        results[answer] = 0;
                    }
                    results[answer]++;
                }
            });

            formattedResults = {
                question: task.heading, // Assuming heading as the question
                answers: options.map((option) => ({
                    option,
                    count: results[option] || 0
                }))
            };

        } else if (type === 'app') {
            formattedResults = { message: 'App analytics not implemented yet.' };

        } else if (type === 'marketing') {
            formattedResults = { message: 'Marketing analytics not implemented yet.' };

        } else if (type === 'web') {
            formattedResults = { message: 'Web analytics not implemented yet.' };

        }

        await session.commitTransaction(); // Commit the transaction if successful
        session.endSession();

        return NextResponse.json({
            message: 'Analytics',
            task: {
                id: task.id,
                type: type,
                heading: task.heading,
                instruction: task.instruction,
                answers: formattedResults
            }
        }, { status: 200 });

    } catch (error) {
        await session.abortTransaction(); // Rollback in case of any error
        session.endSession();
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
