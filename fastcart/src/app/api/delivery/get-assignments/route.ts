import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

    try {
        await connectDb()
        
        const session= await auth()
        const assignment= await DeliveryAssignment.find({
            brodcastedTo:session?.user?.id,
            status:"brodcasted"

        }).populate('order')
        if(!assignment){
            return NextResponse.json({message:"Assignments not found"},{status:400})
        }
           return NextResponse.json(
            assignment,
            {status:200})

        
    } catch (error) {
        console.log(error)
           return NextResponse.json({message:"internal server error"},{status:500})
        
    }
}