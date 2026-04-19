import connectDb from "@/app/lib/db";
import { NextRequest,NextResponse } from "next/server";
import Order from "@/app/models/order.model";
import User from "@/app/models/user.model";
import Stripe from "stripe";


const stripe= new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req:NextRequest){
    await connectDb()
    try {
            const { userId, paymentMethod, totalAmount, address, items } =
              await req.json();
        
            const user = await User.findById(userId);
        
            if (!user || !paymentMethod || !totalAmount || !address || !items) {
              return NextResponse.json({ message: "user not found" }, { status: 400 });
            }
        
            const newOrder = await Order.create({
              user: userId,
              items,
              address,
              paymentMethod,
              totalAmount,
            });

            // Map actual cart items to Stripe line items
            const stripeLineItems = items.map((item: any) => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${item.name} (${item.unit})`,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity
            }));

            // Calculate and add delivery fee if applicable
            const calculatedSubTotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            const deliveryFee = totalAmount - calculatedSubTotal;

            if (deliveryFee > 0) {
                stripeLineItems.push({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Delivery/Shipping Fee',
                        },
                        unit_amount: Math.round(deliveryFee * 100),
                    },
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                customer_email: user.email,
                success_url: `${process.env.NEXT_BASE_URL}/user/order-success?orderId=${newOrder._id.toString()}`,
                cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel?orderId=${newOrder._id.toString()}`,
                line_items: stripeLineItems,
                metadata: {
                    orderId: newOrder._id.toString()
                }
            })
            return NextResponse.json({ url: session.url }, { status: 201 })
        
    } catch (error) {
         console.log(error);
            return NextResponse.json({ message: "internal server error" },{status:500});
        
    }
}