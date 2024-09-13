import mongoose from "mongoose";
import Tester from "@/model/testerModel";
import App from "@/model/Task/apptaskModel";
import Task from "@/model/taskModel";
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

    const { testerId } = reqBody;
    if (!testerId) {
      return NextResponse.json(
        { message: "Tester ID is required", reqBody },
        { status: 400 }
      );
    }

    
    const tester = await Tester.findById(testerId);
    if (!tester) {
      return NextResponse.json(
        { message: "Tester not found", testerId },
        { status: 404 }
      );
    }

    const appliedTasks = tester.taskHistory.filter(
      (task) => task.status === "pending"
    );

    if (appliedTasks.length === 0) {
      return NextResponse.json(
        { message: "No applied tasks found", testerId },
        { status: 404 }
      );
    }
    
    // Step 3: Extract the task IDs from the filtered task history
    const taskIds = appliedTasks.map((task) => task.taskId);
    
    // Step 4: Query the Task model using those task IDs
    const tasks = await Task.find({ _id: { $in: taskIds } });
    console.log(tasks)
    // Step 5: Filter the tasks that reference the App tasks and retrieve the relevant App task documents
    const appTaskIds = tasks
      .filter((task) => task.app) // Only take tasks that have an 'app' field (i.e., are app tasks)
      .map((task) => task.app); // Get the app task IDs

    // Step 6: Fetch the corresponding app tasks from the App task model
    const appTasks = await App.find({ _id: { $in: appTaskIds } });

    // Step 7: Return the app tasks in the response
    return NextResponse.json({ appTasks }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
