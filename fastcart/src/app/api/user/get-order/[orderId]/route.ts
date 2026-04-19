import connectDb from "@/app/lib/db";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDb();

    const { orderId } = await params;
    
   
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error); // ALWAYS log for debugging
    return NextResponse.json(
      { message: "route error in backend" },
      { status: 500 }
    );
  }
}
