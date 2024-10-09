import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  try {
    response.cookies.delete("authorizeToken", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    response.cookies.delete("authorizeId", {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "strict",
    });
    response.cookies.delete("authorizeRole", {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error while clearing cookies:", error.message);
    return NextResponse.json(
      {
        message: "An error occurred while clearing cookies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
