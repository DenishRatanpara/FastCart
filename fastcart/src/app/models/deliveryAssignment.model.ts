import { timeStamp } from "console";
import mongoose from "mongoose";

 export interface IDeliveryAssignment {
  _id?: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  brodcastedTo: mongoose.Types.ObjectId[];
  assignedTo: mongoose.Types.ObjectId | null;
  status: "brodcasted" | "assigned" | "completed";
  acceptAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
const DeliverAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>(
  {
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    brodcastedTo: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default:null
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const DeliveryAssignment =
  mongoose.models.DeliveryAssignment ||
  mongoose.model("DeliveryAssignment", DeliverAssignmentSchema);

export default DeliveryAssignment
