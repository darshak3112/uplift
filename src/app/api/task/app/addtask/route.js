import mongoose from 'mongoose';
import Creator from '@/model/creatorModel';
import { NextResponse } from 'next/server';
import Task from '@/model/taskModel';
import App from '@/model/Task/apptaskModel';

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

        const { creator, post_date, end_date, tester_no, tester_age, tester_gender, country, heading, instruction } = reqBody;

        if (!creator || !post_date || !end_date || !tester_no || !tester_age || !tester_gender || !country || !heading || !instruction) {
            await session.abortTransaction(); // Rollback if any required field is missing
            session.endSession();
            return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
        }

        const creatorExists = await Creator.findById(creator).session(session); // Use session for the query
        if (!creatorExists) {
            await session.abortTransaction(); // Rollback if creator not found
            session.endSession();
            return NextResponse.json({ message: 'Creator not found', creator }, { status: 404 });
        }

        const p_date = new Date(post_date);
        const e_date = new Date(end_date);
        const app = new App({
            creator: new mongoose.Types.ObjectId(creator),
            post_date: p_date,
            end_date: e_date,
            tester_no,
            tester_age,
            tester_gender,
            country,
            heading,
            instruction,
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

        const result = await app.save({ session }); // Use session for the save operation
        const task = new Task({
            type: 'app',
            app: result._id,
            task_flag,
        });

        await task.save({ session }); // Use session for the save operation

        creatorExists.taskHistory.push({
            task: task._id,
        });

        await creatorExists.save({session })
        await session.commitTransaction(); // Commit the transaction if successful
        session.endSession();

        return NextResponse.json({ message: 'Task added successfully', task }, { status: 200 });
    } catch (error) {
        await session.abortTransaction(); // Rollback in case of any error
        session.endSession();
        console.error('Error in POST request:', error);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
