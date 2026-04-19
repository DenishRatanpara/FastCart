"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, ListOrdered, PlusCircle, ArrowRight, Boxes, ShieldCheck, Truck, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/redux";

const StatCard = ({ title, value, icon: Icon, color, shadow, loading }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow border border-gray-50 flex items-center justify-between"
  >
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
      {loading ? (
        <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg"></div>
      ) : (
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
      )}
    </div>
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg ${shadow}`}>
      <Icon size={24} className="text-white" strokeWidth={2.5} />
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const { userData } = useSelector((state: RootState) => state.user);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalDeliveryBoys: 0,
    totalGroceries: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    { 
       title: "Manage Orders", 
       description: "View, update and assign delivery for all customer orders.",
       href: "/admin/manage-orders", 
       icon: ListOrdered, 
       color: "from-blue-500 to-indigo-600",
       shadow: "shadow-blue-200"
    },
    { 
       title: "Add Grocery", 
       description: "Add new products to the catalog with high-quality images.",
       href: "/admin/add-grocery", 
       icon: PlusCircle, 
       color: "from-emerald-500 to-green-600",
       shadow: "shadow-green-200"
    },
    { 
       title: "View Groceries", 
       description: "Manage existing products, update prices and stock availability.",
       href: "/admin/view-groceries", 
       icon: Boxes, 
       color: "from-orange-500 to-red-500",
       shadow: "shadow-orange-200"
    },
    { 
       title: "Manage Users", 
       description: "View and manage system users and delivery staff members.",
       href: "/admin/manage-users", 
       icon: Users, 
       color: "from-cyan-500 to-blue-500",
       shadow: "shadow-cyan-200"
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col py-2 w-full max-w-7xl mx-auto">
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-gray-200 rotate-3">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Admin Overview</h1>
               <p className="text-gray-500 mt-1 font-medium text-lg">
                  Welcome back, <span className="text-gray-900 font-bold">{userData?.name || 'Administrator'}</span>
               </p>
            </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="from-blue-500 to-blue-600" shadow="shadow-blue-200/50" loading={loading} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="from-indigo-500 to-indigo-600" shadow="shadow-indigo-200/50" loading={loading} />
        <StatCard title="Products" value={stats.totalGroceries} icon={Boxes} color="from-purple-500 to-purple-600" shadow="shadow-purple-200/50" loading={loading} />
        <StatCard title="Delivery Staff" value={stats.totalDeliveryBoys} icon={Truck} color="from-emerald-500 to-emerald-600" shadow="shadow-emerald-200/50" loading={loading} />
        {/* Note: changed to ₹ because previous conversations have been using INR format usually, or default $ */}
        <StatCard title="Revenue" value={`₹${stats.totalRevenue.toFixed(0)}`} icon={DollarSign} color="from-amber-500 to-amber-600" shadow="shadow-amber-200/50" loading={loading} />
      </div>

      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quick Modules</h2>
         <div className="h-[2px] flex-1 bg-gray-100 ml-6 rounded-full"></div>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {navCards.map((card, index) => (
          <Link href={card.href} key={index}>
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
               whileHover={{ y: -6, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className={`bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-50 group relative overflow-hidden h-full flex flex-col`}
             >
               {/* Decorative background blur */}
               <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${card.color} opacity-[0.08] rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
               
               <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${card.shadow} group-hover:rotate-6 transition-transform duration-300`}>
                  <card.icon size={28} strokeWidth={2.5} />
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
               <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1 text-[15px]">
                 {card.description}
               </p>
               
               <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest mt-auto bg-gray-50/50 py-3 px-4 rounded-xl w-fit">
                  <span>Open Module</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
               </div>
             </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
