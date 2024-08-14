import mongoose from "mongoose";
import Tester from '@/model/testerModel';
import Survey from "@/model/Task/surveytaskModel";
import { NextResponse } from "next/server";
import SurveyResponse from "@/model/TaskResponse/surveyTaskResponseModel";
import Task from "@/model/taskModel";

export async function POST(req, res) {
    try {

        const reqBody = await req.json();

        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { taskId, testerId, response } = reqBody;

        if (!taskId || !testerId || !response) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const taskExists = await Survey.findById(taskId);
        if (!taskExists) {
            return NextResponse.json({ message: 'Task not found', taskId }, { status: 404 });
        }

        if (taskExists.tester_no <= taskExists.tester_ids.length) {
            const task = await Task.findOne({
                type: "survey",
                survey: taskId
            });
            task.task_flag = "Closed";
            return NextResponse.json({ message: 'Task is already full', taskId }, { status: 400 });
        }

        const testerExists = await Tester.findById(testerId);
        if (!testerExists) {
            return NextResponse.json({ message: 'Tester not found', testerId }, { status: 404 });
        }

        const surveyResponse = new SurveyResponse({
            taskId: new mongoose.Types.ObjectId(taskId),
            testerId: new mongoose.Types.ObjectId(testerId),
            response
        });

        const result = await surveyResponse.save();
        taskExists.tester_ids.push(testerId);
        await taskExists.save();

        const task = await Task.findOne({
            type: "survey",
            survey: taskId
        });

        if (task) {
            testerExists.taskHistory.push(task._id);
            await testerExists.save();
        }

        if (taskExists.tester_no <= taskExists.tester_ids.length) {
            task.task_flag = "Closed";
            await task.save();
        }
        return NextResponse.json({ message: 'Response saved successfully', result }, { status: 201 });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}