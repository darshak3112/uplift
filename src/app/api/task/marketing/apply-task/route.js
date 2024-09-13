import mongoose from "mongoose";
import Tester from "@/model/testerModel";
import Task from "@/model/taskModel";
import App from "@/model/Task/apptaskModel";
import { NextResponse } from "next/server";
import Marketing from "@/model/Task/marketingtaskModel";


export async function POST(req)
{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const reqBody = req.json();
        if(!reqBody)
        {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({message : "Invalid body",reqBody} ,{status : 400})
        }
        const { testerId , taskId} = reqBody;
        
        if(!testerId || !taskId)
        {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({message : "Invalid body",reqBody},{status : 400})
        }

        const task = Marketing.findById(taskId);
        const tester = Tester.findById(testerId);

        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse({message : "Server error :",error},{status : 500})
    }
}