import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/db";
import User from "@/app/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    try {
        await  connectDb();
        const {name,email,password}= await req.json();
        const existUser= await User.findOne({email})
        if(existUser){
            return NextResponse.json({message:"User already exist with this email"},{status:400})
        }
        if(password.length<6){
              return NextResponse.json({message:"Password must be 6 character long"},{status:400})

        }
        const hashPassword= await bcrypt.hash(password,10)

        const user= await User.create({
            name,email,password:hashPassword,
            
        })
          return NextResponse.json(user,{status:200})
        
    } catch (error) {
        console.log(error)
          return NextResponse.json({message:"server errorr"},{status:500});
        
        
    }
    
}