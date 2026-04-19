"use client";

import React from "react";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-md w-full text-center"
      >
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 font-medium mb-8">
          Your payment was cancelled or failed. Your order has been saved as pending. You can try checking out again from your cart.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/user/cart">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition flex justify-center items-center gap-2">
              <RefreshCcw size={20} /> Try Again
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition flex justify-center items-center gap-2">
               <ArrowLeft size={20} /> Back to Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
