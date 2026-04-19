'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from "motion/react"
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { AppDispatch } from '@/store/redux'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decrementQuantity, incremetnQuantity } from '@/store/cartSlice'
import { RootState } from '@/store/redux'
import { IGrocery } from '@/app/types/models'

const CartItemCard = ({ item }: { item: IGrocery }) => {

  const dispatch= useDispatch<AppDispatch>()
  const {cartData}=useSelector((state:RootState)=>state.cart)
  const cartItem=cartData.find(i=>i._id==item._id)
  const [newItem,setNewItem]=useState('')

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="
        group
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        hover:shadow-lg
        transition-all duration-300
        overflow-hidden
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
          className="
            object-contain px-3 py-3 rounded-2xl
            transition-transform duration-500
            group-hover:scale-105
          "
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
          {item.category}
        </span>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {item.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {item.unit}
          </span>

          <span className="text-green-600 font-bold text-base">
            ₹{item.price}
          </span>
        </div>

        {/* Button */}
     {!cartItem ? (
  <motion.button
    onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
    whileTap={{ scale: 0.96 }}
    className="
      mt-4
      flex items-center justify-center gap-2
      rounded-full
      bg-green-500
      py-2 px-4
      text-sm
      font-medium
      text-white
      hover:bg-green-600
      focus:outline-none
      focus:ring-2 focus:ring-green-400 focus:ring-offset-2
      transition-all
    "
  >
    <ShoppingCart size={16} />
    Add to cart
  </motion.button>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="
      mt-4
      flex items-center justify-between
      gap-4
      rounded-full
      border
      border-gray-200
      px-3 py-1
    "
  >
    <motion.button
        onClick={()=>dispatch(decrementQuantity(item._id))}
      whileTap={{ scale: 0.9 }}
      
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        bg-gray-100
        hover:bg-gray-200
      "
    >
      <Minus size={14} />
    </motion.button>

    <span className="min-w-20px text-center text-sm font-medium">
      {cartItem.quantity}
    </span>

    <motion.button
    onClick={()=>dispatch(incremetnQuantity(item._id))}
      whileTap={{ scale: 0.9 }}
      
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        bg-gray-100
        hover:bg-gray-200
      "
    >
      <Plus size={14} />
    </motion.button>
  </motion.div>
)}

      </div>
    </motion.div>
  )
}

export default CartItemCard
