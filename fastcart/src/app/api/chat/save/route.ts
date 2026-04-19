import connectDb from "@/app/lib/db";
import MessageRoom from "@/app/models/message.model";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
   
  console.log("🔥 /api/chat/save HIT");

  try {
    await connectDb();

    const { roomId, senderId, text, time, clientId } = await req.json();

    if (!roomId || !senderId || !text) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const room = await Order.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }

    const message = await MessageRoom.create({
      clientId,
      roomId,
      senderId,
      text,
      time
    });
    console.log("chat message",message)

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("MESSAGE CREATE ERROR:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
