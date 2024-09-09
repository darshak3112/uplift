import mongoose from "mongoose";
import Tester from '@/model/testerModel';
import Survey from "@/model/Task/surveytaskModel";
import { NextResponse } from "next/server";
import Youtube from "@/model/Task/youtubetaskModel";
import YoutubeResponse from "@/model/TaskResponse/youtubeTaskResponseModel";
import Task from "@/model/taskModel";
import SurveyResponse from "@/model/TaskResponse/surveyTaskResponseModel";

export async function POST(req) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const reqBody = await req.json();

        if (!reqBody) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { taskId, testerId, response } = reqBody;

        if (!taskId || !testerId || !response) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const taskExists = await Survey.findById(taskId).session(session);
        if (!taskExists) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Task not found', taskId }, { status: 404 });
        }

        if (taskExists.tester_no <= taskExists.tester_ids.length) {
            const task = await Task.findOne({
                type: "survey",
                survey: taskId
            }).session(session);
            if (task) {
                task.task_flag = "Closed";
                await task.save();
            }
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Task is already full', taskId }, { status: 400 });
        }

        const testerExists = await Tester.findById(testerId).session(session);
        if (!testerExists) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Tester not found', testerId }, { status: 404 });
        }

        const surveyResponse = new SurveyResponse({
            taskId: new mongoose.Types.ObjectId(taskId),
            testerId: new mongoose.Types.ObjectId(testerId),
            response: response, // Assuming you want to store the response here
        });

        const result = await surveyResponse.save({ session });
        taskExists.tester_ids.push(testerId);
        await taskExists.save({ session });

        const task = await Task.findOne({
            type: "survey",
            survey: taskId
        }).session(session);

        if (task) {
            testerExists.taskHistory.push(task._id);
            await testerExists.save({ session });
        }

        if (taskExists.tester_no <= taskExists.tester_ids.length) {
            task.task_flag = "Closed";
            await task.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: 'Response saved successfully', result }, { status: 201 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error:', error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
