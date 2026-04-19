import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model";
import emitEventHandler from "@/app/lib/emitEventHandler";
import User from "@/app/models/user.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{id:string}}){
try {
    await connectDb()
    
    const {id}= await params;
    const session= await auth()

    const deliveryBoyId=session?.user?.id;

    if(!deliveryBoyId){
        return NextResponse.json({message:"unauthorized"},{status:400})
    }
    

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "boy is already assigned" },
        { status: 400 }
      );
    }

    // Atomic update to handle race conditions
    const assignment = await DeliveryAssignment.findOneAndUpdate(
      { _id: id, status: "brodcasted" },
      {
        $set: {
          assignedTo: deliveryBoyId,
          status: "assigned",
          acceptAt: new Date(),
        },
      },
      { new: true }
    );

    if (!assignment) {
      // If null, either it didn't exist or its status was no longer 'brodcasted'
      return NextResponse.json(
        { message: "assignment expired or already accepted" },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const order = await Order.findOneAndUpdate(
      { _id: assignment.order },
      {
        $set: {
          assignedDeliveryBoy: deliveryBoyId,
          status: "out_for_delivery",
          deliveryOtp: otp,
        },
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    const populatedOrder = await Order.findById(order._id).populate(
      "user assignedDeliveryBoy"
    );
    if (populatedOrder) {
      await emitEventHandler("order-updated", populatedOrder);
    }

    await DeliveryAssignment.updateMany({
        _id:{$ne:assignment._id},
        brodcastedTo:deliveryBoyId,
        status:"brodcasted"
    },
    {
        $pull:{brodcastedTo:deliveryBoyId}
    }
)
return NextResponse.json({message:"order accepted"},{status:200})
    
} catch (error) {
    return NextResponse.json({message:"internal server error"},{status:500})
    
    
}

}