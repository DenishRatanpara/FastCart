import connectDb from "@/app/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/app/lib/cloudnary";
import Grocery from "@/app/models/grocery.model";
import emitEventHandler from "@/app/lib/emitEventHandler";

export async function POST(req:NextRequest){
    try {
        await connectDb();
        const session= await auth();
 
        if(session?.user?.role!=="admin"){
            return NextResponse.json({meassage:"You are not admin"},{status:400})
        }
        const formData= await req.formData()
        const name=formData.get("name") as string
          const category=formData.get("category") as string
            const unit=formData.get("unit") as string
              const price=formData.get("price") as string
                const file=formData.get("file") as Blob | null

                let imageUrl;
        if(file){
            imageUrl= await uploadOnCloudinary(file)
        }
        const grocery= await Grocery.create({
            name,category,price,unit,image:imageUrl
        })
        await emitEventHandler("new-grocery", grocery);
        return NextResponse.json(grocery,{
            status:200
        })
    } catch (error) {
        console.log(`grocery add error ${error}`)
        return NextResponse.json({message:"add grocery error"},{
            status:500
        })
        
    }

}