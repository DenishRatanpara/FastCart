import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model";
import User from "@/app/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Allowed order statuses
const ORDER_STATUS = ["pending", "out_for_delivery"];

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDb();

    /* -------------------- VALIDATE PARAMS -------------------- */
    const { orderId } =await params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;
    console.log(status)

    if (!ORDER_STATUS.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    /* -------------------- FIND ORDER -------------------- */
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    let deliveryBoyPayload: any[] = [];

    /* -------------------- ASSIGN DELIVERY BOY -------------------- */
    if (status === "out_for_delivery" && !order.assignment) {
      const { latitude, longitude } = order.address || {};

      if (latitude == null || longitude == null) {
        return NextResponse.json(
          { message: "Order location not available" },
          { status: 400 }
        );
      }

      // Find nearby delivery boys
      const nearbyDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000, // 10 km
          },
        },
      });

      if (!nearbyDeliveryBoys.length) {
        return NextResponse.json(
          {
            updated: false,
            message: "No delivery boys nearby",
            status: order.status,
            assignment: order.assignment || null,
            availableDeliveryBoys: [],
          },
          { status: 200 }
        );
      }

      const nearbyIds = nearbyDeliveryBoys.map((b) => b._id);

      // Busy delivery boys
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearbyIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busySet = new Set(busyIds.map(String));

      const availableDeliveryBoys = nearbyDeliveryBoys.filter(
        (b) => !busySet.has(String(b._id))
      );

      if (!availableDeliveryBoys.length) {
        return NextResponse.json(
          {
            updated: false,
            message: "No delivery boys available right now",
            status: order.status,
            assignment: order.assignment || null,
            availableDeliveryBoys: [],
          },
          { status: 200 }
        );
      }

      /* -------------------- CREATE ASSIGNMENT -------------------- */
      const assignedBoy = availableDeliveryBoys[0];
      const assignment = await DeliveryAssignment.create({
        order: order._id,
        assignedTo: null,
        brodcastedTo: availableDeliveryBoys.map((b) => b._id),
        status: "brodcasted",
      });

      await assignment.populate("order");
    
      for(const  boyId of availableDeliveryBoys){
        const boy= await User.findById(boyId);
        if(boy.socketId){
          await emitEventHandler("new-assignment",assignment,boy.socketId)
        }
      }

      order.assignment = assignment._id;
      order.status = "out_for_delivery";

      deliveryBoyPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
    } else {
      // Normal status update (pending)
      order.status = status;
    }

    await order.save();
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });
    return NextResponse.json(
      {
        updated: true,
        message: "Order updated successfully",
        status: order.status,
        assignment: order.assignment || null,
        availableDeliveryBoys: deliveryBoyPayload,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ORDER UPDATE ERROR:", error.message);
    console.error(error.stack);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
