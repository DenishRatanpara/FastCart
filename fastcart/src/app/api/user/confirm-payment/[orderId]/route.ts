import connectDb from "@/app/lib/db";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import emitEventHandler from "@/app/lib/emitEventHandler";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDb();

    const { orderId } = await params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true },
      { new: true }
    ).populate("user assignedDeliveryBoy");

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    await emitEventHandler("order-updated", updatedOrder);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

