import mongoose from "mongoose";
import Creator from "@/model/creatorModel";
import { NextResponse } from "next/server";
import Youtube from "@/model/Task/youtubetaskModel"; 
import taskModel from "@/model/taskModel";


export async function POST(req) {
    try {
        const reqBody = await req.json();
        if (!reqBody) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }
        const { creator, post_date, end_date, tester_no, tester_age, tester_gender,country, heading, instruction,youtube_thumbnails,web_link } = reqBody;

        if (!creator || !post_date || !end_date || !tester_no || !tester_age || !tester_gender || !country || !heading || !instruction || !youtube_thumbnails) {
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const creatorExists = await Creator.findById(creator);
        if (!creatorExists) {
            return NextResponse.json({ message: 'Creator not found', creator }, { status: 404 });
        }

        const p_date = new Date(post_date)
        const e_date = new Date(end_date)

        const youtube= new Youtube({
            creator : new mongoose.Types.ObjectId(creator),
            post_date : p_date,
            end_date : e_date,
            tester_no,
            tester_age,
            tester_gender,
            country,
            heading,
            instruction,
            youtube_thumbnails,
            web_link
        });
        const current_date = new Date();
        let task_flag = "Pending";
        if (current_date >= p_date && current_date <= e_date) {
            task_flag = "Open";
        }
        else if (current_date <= p_date) {
            task_flag = "Pending";
        }
        else {
            task_flag = "Closed";
        }
        const result = await youtube.save();
        const task = new taskModel({
            type: 'youtube',
            youtube: result._id,
            task_flag
        });
        await task.save();

        creatorExists.taskHistory.push({
            task: task._id,
        });
        await creatorExists.save();

        return NextResponse.json({ message: 'Success', result }, { status: 201 });


    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}