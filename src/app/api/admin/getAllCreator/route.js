import { Creator } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
    const creators = await Creator.find();
    return NextResponse.json({ creators });
}
