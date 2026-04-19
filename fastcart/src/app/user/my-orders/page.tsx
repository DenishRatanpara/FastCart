"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import UserOrderCard from "@/components/UserOrderCard";

interface Order {
  _id: string;
  createdAt: string;
  paymentMethod: "online" | "cod";
  totalAmount: number;
  status: string;
  isPaid: boolean;
  address?: {
    city: string;
    state: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get<Order[]>("/api/user/my-orders");
        // Sort orders by newest first
        const sortedOrders = (res.data || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full mb-4"
        />
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white max-w-sm w-full rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
             <Package className="text-emerald-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven’t placed any orders yet. Start exploring our catalogue!
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl text-sm font-bold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* HEADER HERO */}
      <div className="bg-white border-b border-gray-100 px-4 py-8 md:py-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-all hover:-translate-x-1 text-gray-700"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                My Orders
              </h1>
              <p className="text-gray-500 mt-1 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} in total</p>
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <UserOrderCard order={order} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
