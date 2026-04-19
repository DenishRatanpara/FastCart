import connectDb from "@/app/lib/db";
import Grocery from "@/app/models/grocery.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const grocery = await Grocery.findByIdAndDelete(id);
    
    if (!grocery) {
      return NextResponse.json({ message: "Grocery not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Grocery deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete grocery error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
