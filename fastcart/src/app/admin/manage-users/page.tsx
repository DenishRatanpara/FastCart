"use client";

import React, { useEffect, useState } from "react";
import { Users, Truck, ShieldCheck, Search, MapPin, User as UserIcon, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from '@/app/lib/socket';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    const socket = getSocket();
    if (!socket) return;
    
    // Real-time listener for user online/offline status
    const statusHandler = ({ userId, isOnline }: any) => {
      setUsers((prevUsers: any) => 
        prevUsers.map((u: any) => 
          u._id === userId ? { ...u, isOnline } : u
        )
      );
    };

    socket.on("user-status-changed", statusHandler);

    return () => {
       socket.off("user-status-changed", statusHandler);
    };
  }, []);

  const filteredUsers = users.filter((user: any) => {
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "customer" ? user.role === "user" :
      activeTab === "delivery" ? user.role === "deliveryBoy" :
      activeTab === "admin" ? user.role === "admin" : true;
      
    const matchesSearch = 
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.mobile && user.mobile.includes(searchQuery));

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Users", count: users.length },
    { id: "customer", label: "Customers", count: users.filter((u:any) => u.role === 'user').length },
    { id: "delivery", label: "Delivery Staff", count: users.filter((u:any) => u.role === 'deliveryBoy').length },
    { id: "admin", label: "Admins", count: users.filter((u:any) => u.role === 'admin').length }
  ];

  const getRoleBadge = (role: string) => {
    if (role === 'admin') return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold tracking-wider uppercase border border-purple-200 shadow-sm flex items-center gap-1 w-fit"><ShieldCheck size={12} /> Admin</span>;
    if (role === 'deliveryBoy') return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-200 shadow-sm flex items-center gap-1 w-fit"><Truck size={12} /> Courier</span>;
    return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider uppercase border border-blue-200 shadow-sm flex items-center gap-1 w-fit"><UserIcon size={12} /> Customer</span>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      {/* Header */}
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-200 rotate-3">
               <Users size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Users</h1>
               <p className="text-gray-500 mt-1 font-medium text-sm">
                  View and manage all registered accounts in the fastcart platform
               </p>
            </div>
        </div>
      </motion.div>

      {/* Constraints and Filters Container */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 overflow-hidden">
         {/* Top Bar for Search and Tabs */}
         <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-center bg-gray-50/50">
            {/* Tabs */}
            <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto shadow-inner">
               {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                       activeTab === tab.id 
                       ? "bg-white text-blue-600 shadow-md transform scale-[1.02]" 
                       : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                 >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                       {tab.count}
                    </span>
                 </button>
               ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
               </div>
               <input 
                  type="text"
                  placeholder="Search name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder-gray-400"
               />
            </div>
         </div>

         {/* Table container */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white border-b border-gray-100">
                     <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 first:rounded-tl-2xl">User Details</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Contact Info</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Role</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Status</th>
                     <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Joined</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 cursor-default">
                  {loading ? (
                     [1,2,3,4,5].map(i => (
                        <tr key={i}>
                           <td colSpan={5} className="px-6 py-4">
                              <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                           </td>
                        </tr>
                     ))
                  ) : filteredUsers.length > 0 ? (
                     <AnimatePresence>
                        {filteredUsers.map((user: any, index: number) => (
                           <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              key={user._id} 
                              className="hover:bg-blue-50/30 transition-colors group"
                           >
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold uppercase shadow-sm">
                                       {user.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{user.name}</p>
                                       <p className="text-[11px] text-gray-400 font-mono mt-0.5">ID: {user._id.slice(-6)}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center text-sm text-gray-600 font-medium">
                                       <Mail size={14} className="mr-2 text-gray-400" /> {user.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                       <Phone size={14} className="mr-2 text-gray-400" /> {user.mobile || <span className="italic text-gray-300">Not provided</span>}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 {getRoleBadge(user.role)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 {user.isOnline ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
                                       <span className="relative flex h-2.5 w-2.5">
                                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                       </span>
                                       Online
                                    </span>
                                 ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                       <span className="h-2.5 w-2.5 rounded-full bg-gray-300"></span>
                                       Offline
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                 {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                 })}
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  ) : (
                     <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Users size={32} className="text-gray-300" />
                           </div>
                           <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
                           <p className="text-gray-500">Try adjusting your search criteria or tabs.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
