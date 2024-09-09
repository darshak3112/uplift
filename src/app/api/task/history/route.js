import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Youtube from "@/model/Task/youtubetaskModel";
import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import Task from "@/model/taskModel";
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
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const { id, role } = reqBody;

        if (!id || !role) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        if (role !== 'tester' && role !== 'creator') {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Invalid role', role }, { status: 400 });
        }

        let history = [];
        const heading = [];

        if (role === 'tester') {
            const tester = await Tester.findById(id).session(session);
            if (!tester) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: 'Tester not found' }, { status: 404 });
            }

            history = tester.taskHistory;
        } else {
            const creator = await Creator.findById(id).session(session);
            if (!creator) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json({ message: 'Creator not found' }, { status: 404 });
            }

            history = creator.taskHistory;
        }

        for (const taskId of history) {
            let task;
            if (role === 'tester') {
                task = await Task.findById(taskId).session(session);
            } else {
                task = await Task.findById(taskId.task).session(session);
            }
            if (task) {
                if (task.type === 'survey') {
                    const survey = await Survey.findById(task.survey).session(session);
                    if (survey) {
                        heading.push({
                            id: survey.id,
                            type: "survey",
                            heading: survey.heading,
                            instruction: survey.instruction
                        });
                    }
                } else if (task.type === 'youtube') {
                    const youtube = await Youtube.findById(task.youtube).session(session);
                    if (youtube) {
                        heading.push({
                            id: youtube.id,
                            type: "youtube",
                            heading: youtube.heading,
                            instruction: youtube.instruction
                        });
                    }
                } else if (task.type === 'app') {
                    const app = await App.findById(task.app).session(session);
                    if (app) {
                        heading.push({
                            id: app.id,
                            type: "app",
                            heading: app.heading,
                            instruction: app.instruction
                        });
                    }
                }
            }
        }

        heading.reverse();

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: 'History', history: heading }, { status: 200 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
