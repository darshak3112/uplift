import { Ticket } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
    const tickets = await Ticket.find();
    return NextResponse.json({ tickets });
}
