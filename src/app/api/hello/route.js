
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request) {
    console.log(1);
  // Do whatever you want
  return NextResponse.json({ message: "Hello World from hello route" }, { status: 200 });
}
