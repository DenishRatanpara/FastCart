import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const deliveryBoyId = new mongoose.Types.ObjectId(session.user.id);

    const activeAssignment = await DeliveryAssignment
      .findOne({
        assignedTo: deliveryBoyId,
        status: "assigned",
      })
      .populate({
        path: "order",
        populate: { path: "address" },
      })
      .lean();

    if (!activeAssignment) {
      return NextResponse.json({ active: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        active: true,
        assignment: activeAssignment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
