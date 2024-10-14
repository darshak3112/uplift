import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Creator, Ticket } from "@/models";

export async function POST(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {userId, role}= await req.json();

    if(role==="tester"){
        const tickets = await Ticket.find
        ({
            testerId: userId,
        }).session(session);
        await session.commitTransaction();
        session.endSession();
        return NextResponse.json({ tickets }, { status: 200 });
    }
    else if(role==="creator"){
        const creator = await Creator.findById(userId);
        const task = creator.taskHistory.map((id)=>id.task)
        await session.commitTransaction();
        session.endSession();
        const tickets = await Ticket.find({
            taskId: {$in : task}
        })

        return NextResponse.json({ tickets }, { status: 200 });
    }
    await session.commitTransaction();
    session.endSession();
    return NextResponse.json({ message: "Role not found" }, { status: 400 });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
