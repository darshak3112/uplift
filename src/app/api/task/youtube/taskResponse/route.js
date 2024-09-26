import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Tester, Task, YoutubeTask, YoutubeResponse } from "@/models";


export async function POST(req) {
    try {
        const reqBody = await req.json();
        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { taskId, testerId, response } = reqBody;

        if (!taskId || !testerId || !response) {
            return NextResponse.json({ message: 'Missing required fields', reqBody }, { status: 400 });
        }

        const task = await Task.findOne({ type: "YoutubeTask", _id: taskId });
        if (!task) {
            return NextResponse.json({ message: 'Associated task not found', taskId }, { status: 404 });
        }

        const taskExists = await YoutubeTask.findById(task.specificTask);
        if (!taskExists) {
            return NextResponse.json({ message: 'YouTube task not found', taskId }, { status: 404 });
        }

        if (task.tester_no <= task.tester_ids.length) {
            task.task_flag = "Closed";
            await task.save();
            return NextResponse.json({ message: 'Task is already full', taskId }, { status: 400 });
        }

        const testerExists = await Tester.findById(testerId);
        if (!testerExists) {
            return NextResponse.json({ message: 'Tester not found', testerId }, { status: 404 });
        }

        if(task.tester_ids.includes(testerId)) {
            return NextResponse.json({ message: 'Tester already responded to this task', testerId }, { status: 400 });
        }
        
        const youtubeResponse = new YoutubeResponse({
            taskId: new mongoose.Types.ObjectId(taskId),
            testerId: new mongoose.Types.ObjectId(testerId),
            response
        });

        const result = await youtubeResponse.save();
        task.tester_ids.push(testerId);
        await task.save();

        testerExists.taskHistory.push({
            taskId: taskId,
            status: "success"
            
        });
        await testerExists.save();

        if (task.tester_no === task.tester_ids.length) {
            task.task_flag = "Closed";
            await task.save();
        }

        return NextResponse.json({ message: 'Response added successfully', result }, { status: 201 });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
