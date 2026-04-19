import connectDb from "@/app/lib/db";
import Grocery from "@/app/models/grocery.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const groceries = await Grocery.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, groceries }, { status: 200 });
  } catch (error) {
    console.error("Fetch groceries error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
