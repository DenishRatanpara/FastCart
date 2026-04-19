import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";
import Order from "@/app/models/order.model";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const { userId, paymentMethod, totalAmount, address, items } =
      await req.json();

    const user = await User.findById(userId);

    if (!user || !paymentMethod || !totalAmount || !address || !items) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      address,
      paymentMethod,
      totalAmount,
    });

    const populatedNewOrder = await Order.findById(newOrder._id).populate(
      "user assignedDeliveryBoy"
    );
    await emitEventHandler("new-order", populatedNewOrder || newOrder);
    return NextResponse.json(newOrder, {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "internal server error" });
  }
}
