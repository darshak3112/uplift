// app/api/route.js 👈🏽

import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request) {
    console.log(1);
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request) {
    // Do whatever you want
    console.log(2);
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
