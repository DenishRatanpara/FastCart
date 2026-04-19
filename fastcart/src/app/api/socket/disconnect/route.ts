import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { socketId } = await req.json();
    console.log("DISCONNECT ROUTE HIT:", socketId);

    if (socketId) {
      await User.findOneAndUpdate(
        { socketId },
        {
          $set: {
            isOnline: false,
            socketId: null,
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API ERROR [Disconnect]:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
