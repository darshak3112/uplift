import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Youtube from "@/model/Task/youtubetaskModel";
import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import taskModel from "@/model/taskModel";
import { NextResponse } from "next/server";

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
                            id: survey.id,
                            type: "survey",
                            heading: survey.heading,
                            instruction: survey.instruction 
                        });
                    }
                } else if(task && task.type === 'youtube'){
                    const youtube = await Youtube.findById(task.youtube);
                    if(youtube){
                        heading.push({
                            id: youtube.id,
                            type: "youtube",
                            heading: youtube.heading,
                            instruction: youtube.instruction
                        });
                    }
                }
            }
            
            // Reverse the heading array
            heading.reverse();
            
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
                        heading.push({
                            id: survey.id,
                            type: "survey",
                            heading: survey.heading,
                            instruction: survey.instruction
                        });
                    }
                }
                else if(task && task.type === 'youtube'){
                    const youtube = await Youtube.findById(task.youtube);
                    if(youtube){
                        heading.push({
                            id: youtube.id,
                            type: "youtube",
                            heading: youtube.heading,
                            instruction: youtube.instruction
                        });
                    }
                }
            }
            
            // Reverse the heading array
            heading.reverse();
            
            return NextResponse.json({ message: 'History', history: heading }, { status: 200 });
        }
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
