"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

const OrderSuccess = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [confirming, setConfirming] = useState<boolean>(!!orderId);
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear the cart reliably upon hitting the success page
    dispatch(clearCart());
    
    const confirm = async () => {
      if (!orderId) return;
      try {
        await axios.post(`/api/user/confirm-payment/${orderId}`);
      } catch (e) {
        console.error(e);
      } finally {
        setConfirming(false);
      }
    };
    confirm();
  }, [orderId]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -180}}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800"
        >
          Order Placed Successfully 🎉
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-gray-600 text-sm sm:text-base"
        >
          Thank you for shopping with us! Your grocery order has been confirmed
          and will be delivered soon.
        </motion.p>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center justify-center gap-2 text-green-600 font-medium"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>
            {confirming ? "Confirming your payment..." : "Fresh groceries on the way"}
          </span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/user/my-orders"
            className="w-full sm:w-1/2"
          >
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition">
              View Orders
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-1/2"
          >
            <button className="w-full rounded-xl border border-green-500 text-green-600 py-3 font-semibold hover:bg-green-50 transition">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
