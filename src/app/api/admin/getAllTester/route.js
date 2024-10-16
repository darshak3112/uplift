import { Tester } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
    const testers = await Tester.find();
    return NextResponse.json({ testers });
}