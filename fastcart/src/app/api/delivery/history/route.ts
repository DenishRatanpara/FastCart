import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model"; // Ensure Order is registered for population
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId || session?.user?.role !== "deliveryBoy") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const history = await DeliveryAssignment.find({
      assignedTo: deliveryBoyId,
      status: "completed",
    })
      .populate({
        path: "order",
        select: "totalAmount paymentMethod address status createdAt",
      })
      .sort({ acceptAt: -1, _id: -1 })
      .lean();

    return NextResponse.json({ success: true, history }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch history error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
