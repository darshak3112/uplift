import mongoose from "mongoose";
import Task from "@/models/task/taskModel";
import Tester from "@/model/testerModel";
import App from "@/models/task/apptaskModel";
import Marketing from "@/models/task/marketingtaskModel";
import { NextResponse } from "next/server";

export async function POST(req){
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const reqBody = req.json();
        if(!reqBody)
        {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({message : "Invalid Body",reqBody},{status : 400})
        }
         
        const { testerId } = reqBody ;

        if(!testerId){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({message : "Invalid body",reqBody},{status : 400})
        }

        
    } catch (error) {
        
    }
}