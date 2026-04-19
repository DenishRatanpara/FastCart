"use client";

import React, { useState } from "react";
import { IUser, IOrder } from "@/app/types/models";

import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
  ChevronUp,
  ChevronDown,
  Truck,
} from "lucide-react";
import axios from "axios";

type UpdateStatusResponse =
  | {
      updated: true;
      message: string;
      status: IOrder["status"];
      assignment: any | null;
      availableDeliveryBoys: any[];
    }
  | {
      updated: false;
      message: string;
      status: IOrder["status"];
      assignment: any | null;
      availableDeliveryBoys: any[];
    };

const statusOptions: IOrder["status"][] = ["pending", "out_for_delivery"];

const AdminOrderCart = ({ order }: { order: any }) => {
  const orderId = order._id?.toString();
  const assignedDeliveryBoy = order.assignedDeliveryBoy as unknown as IUser | null;

  const [openOrder, setOpenOrder] = useState<string | null>(null);

  // ✅ LOCAL STATUS STATE (MAIN FIX)
  const [status, setStatus] = useState<IOrder["status"]>(order.status);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateStatus = async (newStatus: IOrder["status"]) => {
  const prevStatus = status;

  try {
    setLoading(true);
    setErrorMsg(null);
    setStatus(newStatus);

    const res = await axios.post<UpdateStatusResponse>(
      `/api/admin/update-order-status/${orderId}`,
      { status: newStatus }
    );
    if (!res.data.updated) {
      setStatus(prevStatus);
      setErrorMsg(res.data.message || "Status update failed");
    }
  } catch (error) {
    console.error(error);
    setStatus(prevStatus); // 
    setErrorMsg("Status update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* LEFT: Customer & Order Details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-green-50 rounded-xl">
               <Package size={20} className="text-green-600" />
            </div>
            <p className="text-lg font-extrabold text-gray-900 tracking-tight">
              Order #{orderId?.slice(-6)}
            </p>
          </div>

          <p className="text-xs font-semibold text-gray-400 mb-6 pl-12">
            {new Date(order.createdAt!).toLocaleString(undefined, {
               weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Info</p>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <User size={16} className="text-gray-400" /> {order.address.fullName }
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <Phone size={16} className="text-gray-400" /> {order.address.mobile}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-gray-700 leading-snug">
                    <MapPin size={16} className="text-gray-400 shrink-0" /> {order.address.fullAddress}
                  </p>
                </div>
             </div>
             
             <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 flex flex-col justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment</p>
                   <p className="flex items-center gap-3 text-sm font-bold text-gray-800">
                     <CreditCard size={16} className={order.paymentMethod === "online" ? "text-blue-500" : "text-green-500"} />
                     {order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment"}
                   </p>
                </div>
                
                {assignedDeliveryBoy && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Driver Assigned</p>
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="font-semibold text-gray-800 text-sm">{assignedDeliveryBoy.name}</p>
                           <p className="text-xs text-gray-500 font-mono">+91 {assignedDeliveryBoy.mobile}</p>
                        </div>
                        <a className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2.5 rounded-full transition-colors border border-indigo-100" href={`tel:${assignedDeliveryBoy.mobile}`} title="Call Driver">
                           <Phone size={16} className="fill-indigo-600/20" />
                        </a>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT: Status Control */}
        <div className="flex flex-col items-start lg:items-end gap-4 min-w-[200px]">
          <div className="bg-white border rounded-2xl p-4 shadow-sm w-full lg:w-auto text-left lg:text-right">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
             <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                status === "pending" ? "bg-yellow-100 text-yellow-700" :
                status === "out_for_delivery" ? "bg-indigo-100 text-indigo-700" :
                "bg-green-100 text-green-700"
             }`}>
               {status.replaceAll("_", " ")}
             </span>
             
             {errorMsg && (
               <p className="text-xs font-semibold text-red-500 mt-3 bg-red-50 p-2 rounded-lg border border-red-100">
                 {errorMsg}
               </p>
             )}

             <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Update Status:</p>
                <select
                  value={status}
                  disabled={loading}
                  onChange={(e) => updateStatus(e.target.value as IOrder["status"])}
                  className="w-full lg:w-48 border border-gray-200 rounded-xl px-4 py-2 font-semibold text-sm bg-gray-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-hidden disabled:opacity-50"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st.replaceAll("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
             </div>
          </div>
          
          <div className="mt-auto w-full">
             <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
                <p className="text-xs font-bold text-green-800 uppercase tracking-widest mb-1 flex items-center justify-between">
                   Total Amount
                   <Truck className="text-green-600/50 w-4 h-4" />
                </p>
                <p className="text-2xl font-black text-green-700">
                  ₹{order.totalAmount}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* ITEMS ACCORDION TOGGLE */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
         <button
           onClick={() => setOpenOrder(openOrder === orderId ? null : orderId!)}
           className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-green-600 transition-colors py-2 px-4 bg-gray-50 hover:bg-green-50 rounded-full border border-transparent hover:border-green-100"
         >
           {openOrder === orderId ? "Hide Items" : "View Items"}
           {openOrder === orderId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         </button>
      </div>

      {/* ITEMS LISTING (Collapsible) */}
      <AnimatePresence>
        {openOrder === order._id.toString() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-inner">
               <div className="bg-gray-50 px-6 py-3 border-b flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Product Details</span>
                  <span>Amount</span>
               </div>
              <div className="p-4 space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm group-hover:shadow transition-shadow flex-shrink-0">
                         <img
                           src={item.image || "/placeholder.png"}
                           alt={item.name}
                           className="w-full h-full object-cover p-1"
                         />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          {item.quantity} × ₹{item.price} <span className="text-gray-300">•</span> {item.unit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-gray-700">
                      ₹{item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminOrderCart;
