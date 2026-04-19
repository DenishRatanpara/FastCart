import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import emitEventHandler from "@/app/lib/emitEventHandler";
import Order from "@/app/models/order.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "assignment not found" },
        { status: 400 }
      );
    }

    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "assignment expired" },
        { status: 400 }
      );
    }

    // Remove this delivery boy from broadcast list
    assignment.brodcastedTo = assignment.brodcastedTo.filter(
      (b: any) => String(b) !== String(deliveryBoyId)
    );

    await assignment.save();

    const order = await Order.findById(assignment.order).populate(
      "user assignedDeliveryBoy"
    );
    if (order) {
      // Admin can react if needed (e.g. show "rejected by X" later)
      await emitEventHandler("order-updated", order);
    }

    return NextResponse.json({ message: "assignment rejected" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

