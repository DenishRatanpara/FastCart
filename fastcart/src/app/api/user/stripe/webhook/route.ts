import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/models/order.model";
import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Payment success for order:", session.metadata?.orderId);

    await connectDb();

    const updatedOrder = await Order.findByIdAndUpdate(
      session.metadata?.orderId,
      { isPaid: true },
      { new: true }
    ).populate("user assignedDeliveryBoy");

    console.log("Updated order:", updatedOrder);

    if (updatedOrder) {
      await emitEventHandler("order-updated", updatedOrder);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
