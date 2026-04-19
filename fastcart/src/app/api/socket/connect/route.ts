import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, socketId } = await req.json();
    console.log("ROUTE HIT:", userId, socketId);

      await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          socketId,
          isOnline: true,
        },
      },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
