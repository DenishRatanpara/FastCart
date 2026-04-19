'use client'
import React, { useEffect, useRef } from 'react'
import { motion } from "motion/react"
import {
  Apple, Milk, Wheat, Cookie, CupSoda, Candy, Fish,
  IceCream, User, SprayCan, Baby, Home, Dog,
  BookOpen, Croissant, ChevronLeft, ChevronRight
} from "lucide-react";

const CategorySlider = () => {

  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: <Apple size={22} />, color: "bg-green-100 text-green-600" },
    { id: 2, name: "Dairy & Eggs", icon: <Milk size={22} />, color: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Bakery", icon: <Croissant size={22} />, color: "bg-amber-100 text-amber-700" },
    { id: 4, name: "Foodgrains, Oil & Masala", icon: <Wheat size={22} />, color: "bg-yellow-100 text-yellow-700" },
    { id: 5, name: "Snacks & Branded Foods", icon: <Cookie size={22} />, color: "bg-red-100 text-red-600" },
    { id: 6, name: "Beverages", icon: <CupSoda size={22} />, color: "bg-sky-100 text-sky-600" },
    { id: 7, name: "Chocolates & Confectionery", icon: <Candy size={22} />, color: "bg-purple-100 text-purple-600" },
    { id: 8, name: "Meat, Fish & Eggs", icon: <Fish size={22} />, color: "bg-pink-100 text-pink-600" },
    { id: 9, name: "Frozen Foods", icon: <IceCream size={22} />, color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Personal Care", icon: <User size={22} />, color: "bg-indigo-100 text-indigo-600" },
    { id: 11, name: "Home Care", icon: <SprayCan size={22} />, color: "bg-slate-100 text-slate-600" },
    { id: 12, name: "Baby Care", icon: <Baby size={22} />, color: "bg-pink-50 text-pink-500" },
    { id: 13, name: "Household Essentials", icon: <Home size={22} />, color: "bg-lime-100 text-lime-600" },
    { id: 14, name: "Pet Care", icon: <Dog size={22} />, color: "bg-orange-200 text-orange-700" },
    { id: 15, name: "Stationery", icon: <BookOpen size={22} />, color: "bg-gray-100 text-gray-600" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current

      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
      }
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: false, amount: 0.5 }}
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop by Category
      </h1>

      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-100"
      >
        <ChevronLeft />
      </button>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-12 pb-4 scrollbar-hide scroll-smooth"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            className={`min-w-[150px] md:min-w-[180px] rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer ${cat.color}`}
          >
            <div className="flex flex-col items-center justify-center p-5">
              {cat.icon}
              <p className="text-sm md:text-base font-semibold text-gray-700 mt-2 text-center">
                {cat.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-100"
      >
        <ChevronRight />
      </button>
    </motion.div>
  )
}

export default CategorySlider
