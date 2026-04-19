import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model";
import MessageRoom from "@/app/models/message.model";
import emitEventHandler from "@/app/lib/emitEventHandler";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();

    const { id: orderId } = await params;
    const body = await req.json();
    const otp = body?.otp;

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.assignedDeliveryBoy.toString() !== deliveryBoyId) {
       return NextResponse.json({ message: "Unauthorized for this order" }, { status: 403 });
    }

    if (order.status === "delivered") {
       return NextResponse.json({ message: "Order already delivered" }, { status: 400 });
    }

    if (order.deliveryOtp && order.deliveryOtp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    order.status = "delivered";
    order.deliveryOtp = undefined;
    await order.save();

    if (order.assignment) {
       const assignment = await DeliveryAssignment.findById(order.assignment);
       if (assignment) {
         assignment.status = "completed";
         await assignment.save();
       }
    } else {
       const assignment = await DeliveryAssignment.findOne({ order: orderId, assignedTo: deliveryBoyId });
       if (assignment) {
         assignment.status = "completed";
         await assignment.save();
       }
    }

    const populatedOrder = await Order.findById(order._id).populate("user assignedDeliveryBoy");
    if (populatedOrder) {
      await emitEventHandler("order-updated", populatedOrder);
      await emitEventHandler("order-status-update", { orderId: order._id, status: "delivered" }); 
    }

    // Automatically delete chat between delivery boy and customer after delivery
    await MessageRoom.deleteMany({ roomId: order._id });

    return NextResponse.json({ message: "Delivery verified successfully", success: true }, { status: 200 });

  } catch (error: any) {
    console.error("OTP Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
