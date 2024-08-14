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
    try {
        const reqBody = await req.json();
        
        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { id, type } = reqBody;

        if (!id || !type) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }
       
        let task, responseModel, formattedResults;
        
        switch (type) {
            case 'survey':
                task = await Survey.findById(id);
                responseModel = SurveyResponse;
                break;
            case 'youtube':
                task = await Youtube.findById(id);
                responseModel = YoutubeResponse;
                break;
            case 'app':
                task = await App.findById(id);
                responseModel = AppResponse;
                break;
            case 'marketing':
                task = await Marketing.findById(id);
                responseModel = MarketingResponse;
                break;
            case 'web':
                task = await Web.findById(id);
                responseModel = WebResponse;
                break;
            default:
                return NextResponse.json({ message: 'Invalid task type', type }, { status: 400 });
        }

        if (!task) {
            return NextResponse.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} task not found` }, { status: 404 });
        }

        // Fetch responses and process analytics
        const taskResponses = await responseModel.find({ taskId: task._id });
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
            const options = task.youtube_thumbnails.map((thumbnail) => thumbnail.link);
            taskResponses.forEach((response) => {
                const answer = response.response;
                console.log('answer:', answer);
                console.log('options:', options);
                console.log(options.includes(answer));
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
            // Implement analytics for 'app' type tasks
            // Example implementation
            formattedResults = { message: 'App analytics not implemented yet.' };

        } else if (type === 'marketing') {
            // Implement analytics for 'marketing' type tasks
            // Example implementation
            formattedResults = { message: 'Marketing analytics not implemented yet.' };

        } else if (type === 'web') {
            // Implement analytics for 'web' type tasks
            // Example implementation
            formattedResults = { message: 'Web analytics not implemented yet.' };

        }

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
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
