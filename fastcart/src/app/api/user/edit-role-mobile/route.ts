import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth";
import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";

export  async function POST(req:NextRequest){
      await connectDb();
     try {
       
    const {role,mobile}= await req.json();

    const session= await auth();
   const user = await User.findOneAndUpdate(
  { email: session?.user?.email },
  { role, mobile },             
  { new: true }                
);

    if(!user){
        return NextResponse.json({message:"User not found with this email"},{status:400})

    }
     return NextResponse.json(user,{status:200})
     } catch (error) {
        console.log(`server error is ${error}`)
         return NextResponse.json({message:"server errorr"},{status:500})
         
        
     }



}