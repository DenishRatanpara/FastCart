import connectDb from "@/app/lib/db";
import { NextResponse } from "next/server";
import User from "@/app/models/user.model";
import Order from "@/app/models/order.model";
import { auth } from "@/auth";

export async function GET(req:NextResponse){
  await connectDb()
  try {
    const session= await auth();
    const orders= await Order.find({user:session?.user?.id}).populate('user assignedDeliveryBoy').sort({createdAt:-1})
    if(!orders){
      return NextResponse.json({message:"orders not found"},{status:400})
    }
     return NextResponse.json(orders,{status:200})
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:"server error in route"},{status:500})
  }
}