import mongoose from "mongoose";

interface IMessage {
  _id?: mongoose.Types.ObjectId;
  clientId?: string;
  roomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  time?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    clientId: {
      type: String,
      index: true,
    },
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageRoom =
  mongoose.models.MessageRoom ||
  mongoose.model<IMessage>("MessageRoom", MessageSchema);

export default MessageRoom;
