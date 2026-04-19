import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roleQuery = searchParams.get("role");

    const query = roleQuery ? { role: roleQuery } : {};
    
    // Sort by most recently generated first
    const users = await User.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
