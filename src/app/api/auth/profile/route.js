import mongoose from "mongoose";
import {Tester , Creator} from "@/models"
import { NextResponse } from "next/server";
import { z } from "zod";

const userDetailsSchema = z.object({
  id: z.string(),
  role: z.enum(["tester", "creator"]),
});

export async function GET(req) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");

    const parsedData = userDetailsSchema.safeParse({ id, role });

    if (!parsedData.success) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Invalid request parameters", errors: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { id: userId, role: userRole } = parsedData.data;

    if (userRole === "tester") {
      const tester = await Tester.findById(userId)
        .session(session)
        .select("firstName lastName email mobileNo gender dob country role pincode taskHistory");

      if (!tester) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: "Tester not found", id: userId }, { status: 404 });
      }

      const response = {
        ...tester.toObject(),
        total_task: tester.taskHistory.length,
      };

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(response, { status: 200 });
    } else if (userRole === "creator") {
      const creator = await Creator.findById(userId)
        .session(session)
        .select("firstName lastName email mobileNo gender dob country role pincode taskHistory");

      if (!creator) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: "Creator not found", id: userId }, { status: 404 });
      }

      const response = {
        ...creator.toObject(),
        total_task: creator.taskHistory.length,
      };

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(response, { status: 200 });
    }

    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: "Role is not valid", role: userRole }, { status: 400 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}