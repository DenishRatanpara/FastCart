import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

 try {
    await connectDb()
    const user= await User.findOne({role:"admin"})
    console.log(user)
 if (user) {
      return NextResponse.json({ adminExist: true }, { status: 200 });
    } else {
      return NextResponse.json({ adminExist: false }, { status: 200 });
    }
    
 } catch (error) {
    console.log(error)
     return NextResponse.json({message:"internal server error"},{status:500})
    
 }
}