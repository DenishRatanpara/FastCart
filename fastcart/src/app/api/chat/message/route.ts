import connectDb from "@/app/lib/db";
import MessageRoom from "@/app/models/message.model";
import Order from "@/app/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()

        const {roomId}= await req.json()

        if(!roomId){
            console.log("Room id not found ")
        }
 const room= await Order.findById(roomId)
  if(!room){
            return NextResponse.json({message:"room not found"},{status:400})
        }
        const message= await MessageRoom.find({roomId:room._id})

         if(!message){
            return NextResponse.json({message:"message not found"},{status:400})
        }

       

        

  
 return NextResponse.json(message,{status:200})



    } catch (error) {
        console.log(error)
          return NextResponse.json({message:"internal server error"},{status:500})
        
    }
}