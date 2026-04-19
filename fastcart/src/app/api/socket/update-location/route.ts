import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, location } = await req.json();
    if (!userId || !location) {
      return NextResponse.json(
        { message: "userid or locationn not found" },
        { status: 400 }
      );
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        location,
      },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ message: "user  not found" }, { status: 400 });
    }
     return NextResponse.json({success:true},{status:200})
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
