import mongoose from "mongoose";
import { Tester, Task, AppTask , Creator } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      return NextResponse.json(
        { message: "Invalid request body", reqBody },
        { status: 400 }
      );
    }

    const { id , role } = reqBody;
    if (!id || !role) {
      return NextResponse.json(
        { message: "Tester ID and role is required", reqBody },
        { status: 400 }
      );
    }

    if(role === "tester"){
        const tester = await Tester.findById(id);
        if (!tester) {
          return NextResponse.json(
            { message: "Tester not found", id },
            { status: 404 }
          );
        }
        console.log(tester.taskHistory);
        const appliedTasks = await Task.aggregate([
          {
            $match: {
              _id: { $in: tester.taskHistory.filter(task => task.status == 'pending')
                .map((task) => task.taskId)
               } // Match tasks based on IDs from taskHistory
            }
          }
        ]);

        if (appliedTasks.length === 0) {
          return NextResponse.json(
            { message: "No applied tasks found", id },
            { status: 404 }
          );
        }
        return NextResponse.json({ message: appliedTasks }, { status: 200 });
      }
      else if(role === "creator"){
        const creator = await Creator.findById(id);
        if (!creator) {
          return NextResponse.json(
            { message: "Creator not found", id },
            { status: 404 }
          );
        }
        const openTasks = await Task.aggregate([
          {
            $match: {
              task_flag: "Open", // Ensure the task status is "open"
              _id: { $in: creator.taskHistory.map((task) => task.task) } // Match tasks based on applied task IDs
            }
          }]);

        if (openTasks.length === 0) {
          return NextResponse.json(
            { message: "No applied tasks found", id },
            { status: 404 }
          );
        }
        return NextResponse.json({ message: openTasks }, { status: 200 });
      }
      return NextResponse.json(
        { message: "Invalid role", role },
        { status: 400 }
      );
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
