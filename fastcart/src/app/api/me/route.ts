import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import User from "@/app/models/user.model"

export  async function GET(req:NextRequest){

   try {
    const session= await auth()
    if(!session || !session.user){
        return NextResponse.json({message:"user is not authenticated"},{status:400})
    }
    const user= await User.findOne({email:session.user.email}).select("-password")
    if(!user){
           return NextResponse.json({message:"user is not found"},{status:400})
    }
       return NextResponse.json(user,{status:200})
    
   } catch (error) {
    console.log(error)
       return NextResponse.json({message:"internal server error chhe bhai"},{status:500})
   }

}