'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ShoppingBasket, Plus, Minus, Trash, ShoppingBag, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '@/store/redux'
import {
  decrementQuantity,
  incremetnQuantity,
  removeCartItem
} from '@/store/cartSlice'
import { useRouter } from 'next/navigation'

const CartPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector((state: RootState) => state.cart)

  return (
    <div className="relative mx-auto w-[95%] sm:w-[90%] md:w-[85%] max-w-6xl py-12 min-h-[80vh]">
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-gray-600 hover:text-green-600 transition-colors shadow-sm border border-gray-100 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Continue Shopping</span>
        </Link>
        <motion.h2
          className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-2.5 bg-green-100 rounded-2xl">
             <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
          Your Cart
        </motion.h2>
      </div>

      {cartData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2.5rem] bg-white py-24 text-center shadow-lg border border-gray-100/50 max-w-2xl mx-auto flex flex-col items-center justify-center p-8"
        >
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
             <ShoppingBasket className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Your cart is empty</h3>
          <p className="text-gray-500 mb-10 font-medium max-w-md leading-relaxed">
            Looks like you haven't added anything yet. Discover our fresh groceries and start filling it up!
          </p>
          <Link
            href="/"
            className="rounded-full bg-green-600 px-10 py-4 font-bold text-lg text-white hover:bg-green-700 transition-transform active:scale-95 shadow-xl shadow-green-600/20"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          {/* ITEMS LIST */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {cartData.map((item, index) => (
                <motion.div
                  key={String(item._id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-3xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* IMAGE */}
                  <div className="relative h-24 w-28 flex-shrink-0 rounded-2xl bg-gray-50 border border-gray-100 p-2 z-10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1 mix-blend-multiply"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-center z-10">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-400">{item.unit}</p>
                    <p className="mt-2 text-xl font-black text-green-600 tracking-tight">
                      ₹{Number(item.price)} <span className="text-xs font-semibold text-gray-400">/item</span>
                    </p>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center gap-6 z-10 bg-gray-50/50 p-2 pr-4 rounded-full border border-gray-100 mt-2 sm:mt-0">
                    <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-100 p-1">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(decrementQuantity(item._id))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </motion.button>
                      <span className="w-10 text-center font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(incremetnQuantity(item._id))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(removeCartItem(item._id))}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY CARD (Sticky Layout) */}
          <div className="lg:w-[400px] w-full flex-shrink-0">
             <div className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100 lg:sticky lg:top-24 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -z-0 opacity-50"></div>
                
                <h3 className="mb-8 text-2xl font-black tracking-tight text-gray-900 relative z-10 flex items-center gap-3">
                   Order Summary
                </h3>

                <div className="space-y-4 text-[15px] relative z-10 pb-6 border-b border-gray-100">
                  <div className="flex justify-between font-semibold text-gray-500">
                    <span>Items Count</span>
                    <span className="text-gray-900">{cartData.length} items</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-500" : "text-gray-900"}>
                       {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <div className="flex justify-between items-end mb-8">
                     <div>
                       <span className="block text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">Total to Pay</span>
                       <span className="text-4xl font-black text-green-600 tracking-tight">₹{finalTotal}</span>
                     </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/user/checkOut')} 
                    className="w-full rounded-2xl bg-green-600 py-4 font-black text-lg text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
             </div>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default CartPage
