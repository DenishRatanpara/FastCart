"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBasket,
  Apple,
  Truck,
  ShieldCheck,
  PercentCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";



const HeroSection = () => {



 const slides = [
  {
    id: 1,
    icon: <ShoppingBasket size={48} />,
    title: "Fresh Daily Essentials",
    subtitle: "Get the freshest groceries delivered to your home.",
    btnText: "Shop Now",
    bg: "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1500&q=80",
  },
  {
    id: 2,
    icon: <Apple size={48} />,
    title: "Fruits & Vegetables",
    subtitle: "Organic and hand-picked produce for your family.",
    btnText: "Explore",
    bg: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1500&q=80",
  },
  {
    id: 3,
    icon: <Truck size={48} />,
    title: "Fast Delivery",
    subtitle: "We deliver your groceries within minutes.",
    btnText: "Track Order",
    bg: "https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=1500&q=80",
  },
  {
    id: 4,
    icon: <ShieldCheck size={48} />,
    title: "Quality Guaranteed",
    subtitle: "We ensure premium quality in every product.",
    btnText: "Know More",
    bg: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1500&q=80",
  },
  {
    id: 5,
    icon: <PercentCircle size={48} />,
    title: "Best Offers & Deals",
    subtitle: "Save more on your daily grocery shopping.",
    btnText: "Grab Deals",
    bg: "https://images.unsplash.com/photo-1607082349566-1870e6a6b9d1?auto=format&fit=crop&w=1500&q=80",
  },
];


  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-[98%] h-[80vh] rounded-2xl shadow-2xl mt-32 overflow-hidden">

      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].bg}
            alt="slide-image"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 items-center bg-black/40 flex flex-col justify-center px-16 text-white">
        <div className="mb-4">{slides[current].icon}</div>

        <motion.h1
          key={slides[current].title}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-2"
        >
          {slides[current].title}
        </motion.h1>

        <motion.p
          key={slides[current].subtitle}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg mb-6"
        >
          {slides[current].subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold w-fit"
        >
          {slides[current].btnText}
        </motion.button>
        {/* Bottom Dots */}
<div className="absolute bottom-6 w-full flex justify-center gap-3">
  {slides.map((_, index) => (
    <motion.button
      key={index}
      onClick={() => setCurrent(index)}
      whileHover={{ scale: 1.2 }}
      animate={{
        backgroundColor: current === index ? "#ffffff" : "#ffffff80",
        width: current === index ? 28 : 12,
      }}
      transition={{ duration: 0.3 }}
      className="h-3 rounded-full"
    />
  ))}
</div>

      </div>
    </div>
  );
};

export default HeroSection;

