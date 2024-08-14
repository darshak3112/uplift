import mongoose from "mongoose";
import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import { NextResponse } from "next/server";
import Youtube from "@/model/Task/youtubetaskModel";
import YoutubeResponse from "@/model/TaskResponse/youtubeTaskResponseModel";
import Task from "@/model/taskModel";

export async function POST(req) {
    try {
        const reqBody = await req.json();
        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }
        const { taskId, testerId, response } = reqBody;

        if (!taskId || !testerId || !response) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const taskExists = await Youtube.findById(taskId);
        if (!taskExists) {
            return NextResponse.json({ message: 'Task not found', taskId }, { status: 404 });
        }

        if (taskExists.tester_no <= taskExists.tester_ids.length) {
            const task = await Task.findOne({
                type: "youtube",
                youtube: taskId
            });

            if (task) {
                task.task_flag = "Closed";
                await task.save();
            }

            return NextResponse.json({ message: 'Task is already full', taskId }, { status: 400 });
        }

        const testerExists = await Tester.findById(testerId);
        if (!testerExists) {
            return NextResponse.json({ message: 'Tester not found', testerId }, { status: 404 });
        }

        const youtubeResponse = new YoutubeResponse({
            taskId: new mongoose.Types.ObjectId(taskId),
            testerId: new mongoose.Types.ObjectId(testerId),
            response
        });

        const result = await youtubeResponse.save();
        taskExists.tester_ids.push(testerId);
        await taskExists.save();

        const task = await Task.findOne({
            type: "youtube",
            youtube: taskId
        });
       
        if (task) {
            
            testerExists.taskHistory.push(task._id);
            await testerExists.save();

            if (taskExists.tester_no === taskExists.tester_ids.length) {
                task.task_flag = "Closed";
                await task.save();
            }
        }

        return NextResponse.json({ message: 'Response added successfully', result }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}
