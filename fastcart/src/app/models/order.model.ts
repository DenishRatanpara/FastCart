import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  _id:mongoose.Types.ObjectId
 
  user: mongoose.Types.ObjectId;
  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }[];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: number;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out_for_delivery" | "delivered";
  assignment: mongoose.Types.ObjectId | null;
  assignedDeliveryBoy: mongoose.Types.ObjectId | null;
  deliveryOtp?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        grocery: {
          type: Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    isPaid: {
      type: Boolean,
      default: false,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    address: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: Number, required: true },
      fullAddress: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    status: {
      type: String,
      enum: ["pending", "out_for_delivery", "delivered"],
      default: "pending",
    },

    assignment: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },

    assignedDeliveryBoy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deliveryOtp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order= mongoose.models.Order || mongoose.model("Order",orderSchema)
export default Order
