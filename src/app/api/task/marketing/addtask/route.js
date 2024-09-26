import mongoose from "mongoose";
import Marketing from "@/models/task/marketingtaskModel";
import Creator from "@/models/user/creatorModel";
import { NextResponse } from "next/server";
import Task from "@/models/task/taskModel";

export async function POST(req){
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const reqBody = await req.json();

        if(!reqBody)
        {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message : 'Invalid request body',reqBody},{status : 400})
        }

        const {creator , post_date , end_date , tester_no , tester_age , tester_gender , country , heading , instruction ,product_link , product_price , refund_percentage , product_details } = reqBody;

        if(!creator || !post_date || !end_date || !tester_no || !tester_age || !tester_gender || !country || !heading || !instruction || !product_link || !product_price || !refund_percentage || !product_details) 
        {
            
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message : 'Invalid request body',reqBody},{status : 400})
        }

        const creatorExists = await Creator.findById(creator).session(session);
        if(!creatorExists){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message : 'Creator not found',creator},{status : 404})
        }

        const p_date = new Date(post_date);
        const e_date = new Date(end_date);
        const marketing = new Marketing({
            creator : new mongoose.Types.ObjectId(creator),
            post_date : p_date,
            end_date : e_date,
            tester_no,
            tester_age,
            tester_gender,
            country,
            heading,
            instruction,
            product_link,
            product_price,
            refund_percentage,
            product_details
        });

        const current_date = new Date();
        let task_flag = "Pending";
        if(current_date >= p_date && current_date <= e_date){
            task_flag = "Open";
        }else if(current_date <= p_date){
            task_flag = "Pending";
        }else {
            task_flag = "Closed";
        }

        const result = await marketing.save({ session });
        const task = new Task({
            type: "marketing",
            marketing: result._id,
            task_flag,
        })

        await task.save({session})
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message : 'Task added successfully',task},{status : 201});
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error in POST request",error);
        return NextResponse.json({ message : "An error occurred",error:error.message},{status :500});
    }

}