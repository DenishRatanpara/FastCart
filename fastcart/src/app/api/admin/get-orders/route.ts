import { NextResponse } from "next/server";
import connectDb from "@/app/lib/db";
import Order from "@/app/models/order.model";

export async function GET(){
    try {
        await connectDb();

        const orders= await  Order.find({}).populate('user assignedDeliveryBoy').sort({createdAt:-1})
        if(!orders){
            return NextResponse.json({message:"orders not found"},{status:400});


        }
         return NextResponse.json(orders,{status:200});
        
        
    } catch (error) {
        console.log(error)
                 return NextResponse.json({message:"server error in route"},{status:500});
        
    }
}