import mongoose from "mongoose";
import Survey from "@/model/Task/surveytaskModel";
import Creator from '@/model/creatorModel';
import taskModel from "@/model/taskModel";
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

        const { creator, post_date, end_date, tester_no, tester_age, tester_gender, country, heading, instruction, noOfQuestions, questions } = reqBody;

        if (!creator || !post_date || !end_date || !tester_no || !tester_age || !tester_gender || !country || !heading || !instruction || !noOfQuestions || !questions) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const creatorExists = await Creator.findById(creator).session(session);
        if (!creatorExists) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Creator not found', creator }, { status: 404 });
        }

        if (parseInt(noOfQuestions) !== questions.length) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Number of questions does not match', noOfQuestions, questions }, { status: 400 });
        }

        const p_date = new Date(post_date);
        const e_date = new Date(end_date);
        const survey = new Survey({
            creator: new mongoose.Types.ObjectId(creator),
            post_date: p_date,
            end_date: e_date,
            tester_no,
            tester_age,
            tester_gender,
            country,
            heading,
            instruction,
            noOfQuestions,
            questions
        });

        const current_date = new Date();
        let task_flag = "Pending";
        if (current_date >= p_date && current_date <= e_date) {
            task_flag = "Open";
        } else if (current_date <= p_date) {
            task_flag = "Pending";
        } else {
            task_flag = "Closed";
        }

        const result = await survey.save({ session });
        const task = new taskModel({
            type: 'survey',
            survey: result._id,
            task_flag
        });

        await task.save({ session });

        creatorExists.taskHistory.push({
            task: task._id,
        });
        await creatorExists.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: 'Survey created successfully', result }, { status: 201 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error:', error.message);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
