"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  Phone,
  CheckCircle2,
  Clock,
  Navigation
} from "lucide-react";
import { getSocket } from "@/app/lib/socket";
import { useRouter } from "next/navigation";

/* =====================
   CLIENT-SAFE TYPES
===================== */

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Address {
  city: string;
  state: string;
}

interface AssignedDeliveryBoy {
  name: string;
  mobile: string;
}

interface Order {
  _id: string;
  createdAt: string;
  paymentMethod: "online" | "cod";
  totalAmount: number;
  status: string;
  isPaid: boolean;
  address?: Address;
  items: OrderItem[];
  assignedDeliveryBoy?: AssignedDeliveryBoy;
}

/* =====================
   COMPONENT
===================== */

const statusConfig: Record<string, any> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200"
  },
  cancelled: {
    label: "Cancelled",
    icon: Package,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200"
  }
};

const UserOrderCard = ({ order }: { order: Order }) => {
  const [openOrder, setOpenOrder] = useState(false);
  const [status, setStatus] = useState<string>(order.status);
  const [isPaid, setIsPaid] = useState<boolean>(order.isPaid);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: {
      orderId: string;
      status: string;
    }) => {
      if (data.orderId === order._id) {
        setStatus(data.status);
      }
    };

    const handleOrderUpdated = (updatedOrder: any) => {
      if (String(updatedOrder?._id) !== String(order._id)) return;
      if (updatedOrder?.status) {
        setStatus(updatedOrder.status);
      }
      if (typeof updatedOrder?.isPaid === "boolean") {
        setIsPaid(updatedOrder.isPaid);
      }
    };

    socket.on("order-status-update", handleStatusUpdate);
    socket.on("order-updated", handleOrderUpdated);

    return () => {
      socket.off("order-status-update", handleStatusUpdate);
      socket.off("order-updated", handleOrderUpdated);
    };
  }, [order._id]);

  const currentStatus = statusConfig[status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${currentStatus.bg} ${currentStatus.color}`}>
            <StatusIcon size={24} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">Order #{order._id.slice(-6)}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.color} border ${currentStatus.border}`}>
                {status.replace(/_/g, ' ').toUpperCase() || currentStatus.label.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute:'2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
           <span
            className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 ${
              isPaid
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}
          >
            {isPaid ? <CheckCircle2 size={14} /> : <CreditCard size={14} />}
            {isPaid ? "Paid" : "Unpaid"}
          </span>
         
          <button
            onClick={() => setOpenOrder(!openOrder)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            {openOrder ? "Hide Details" : "View Details"}
            {openOrder ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ITEMS DETAILS */}
      <AnimatePresence>
        {openOrder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-gray-50/50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Order Items</h4>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                          <span>Qty: {item.quantity}</span> <span className="w-1 h-1 rounded-full bg-gray-300"></span> <span>₹{item.price} each</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER INFO - PAYMENT & DELIVERY */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
           {/* PAYMENT */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <CreditCard size={18} className="text-gray-600" />
            </div>
            <div className="pt-0.5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Payment Method</p>
              <p className="text-sm font-bold text-gray-800 capitalize">
                 {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
              </p>
            </div>
          </div>
          
           {/* ADDRESS */}
          {order.address && (
           <div className="flex items-start gap-3">
             <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <MapPin size={18} className="text-gray-600" />
            </div>
             <div className="pt-0.5">
               <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Delivery Address</p>
               <p className="text-sm font-bold text-gray-800">
                  {order.address.city}, {order.address.state}, India
               </p>
             </div>
           </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          {/* DELIVERY BOY */}
          {order.assignedDeliveryBoy ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm h-full">
              <div className="flex flex-col h-full justify-center">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Truck size={12}/> Delivery Agent</span>
                <span className="text-base font-bold text-gray-900">{order.assignedDeliveryBoy.name}</span>
                <span className="text-sm font-semibold text-gray-600 mt-0.5 flex items-center gap-1"><Phone size={12}/> +91 {order.assignedDeliveryBoy.mobile}</span>
              </div>
              <div className="flex sm:flex-col gap-2">
                <a
                  href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  <Phone size={16} /> Call
                </a>
                <button
                  onClick={() => router.push(`/user/treck-order/${order._id.toString()}`)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_2px_10px_rgb(37,99,235,0.2)] hover:shadow-[0_4px_15px_rgb(37,99,235,0.3)]"
                >
                  <Navigation size={16} /> Track
                </button>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-center">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                   <Clock size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-bold">Assigning Agent...</p>
                <p className="text-xs text-gray-400 font-medium mt-1">We'll update you shortly.</p>
             </div>
          )}
        </div>
      </div>
      
      {/* TOTAL BAR */}
      <div className="px-6 py-4 bg-gray-900 text-white flex justify-between items-center mt-auto">
        <span className="font-semibold text-gray-300 uppercase tracking-widest text-xs">Total Amount</span>
        <span className="text-2xl font-bold tracking-tight">₹{order.totalAmount}</span>
      </div>

    </motion.div>
  );
};

export default UserOrderCard;
