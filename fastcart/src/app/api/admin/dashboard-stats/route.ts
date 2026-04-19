import connectDb from "@/app/lib/db";
import Order from "@/app/models/order.model";
import User from "@/app/models/user.model";
import Grocery from "@/app/models/grocery.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDeliveryBoys = await User.countDocuments({ role: "deliveryBoy" });
    const totalGroceries = await Grocery.countDocuments();

    // Total revenue for all orders (can adjust to only include isPaid: true)
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalUsers,
        totalDeliveryBoys,
        totalGroceries,
        totalRevenue
      },
      recentOrders
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
