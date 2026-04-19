"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, MapPin, CheckCircle, Navigation, MessageSquare, 
  Phone, MoreHorizontal, User, Key, ChevronUp, UserCircle, 
  Wallet, Clock, X, BadgeIndianRupee, History 
} from "lucide-react";
import { getSocket } from "@/app/lib/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/redux";
import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });
import DeliveryChat from "./DeliveryChat";

interface Address {
  fullAddress: string;
}

interface Order {
  _id: string;
  address: Address;
  totalAmount?: number;
}

interface Assignment {
  _id: string;
  order: Order;
  acceptAt?: string;
}
interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Profile & History State
  const [showProfile, setShowProfile] = useState(false);
  const [history, setHistory] = useState<Assignment[]>([]);

  // Default to a default location to unblock map loading if GPS takes time
  const [userLocation, setUserLocation] = useState<ILocation | null>(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 28.6139,
    longitude: 77.2090
  });

  const { userData } = useSelector((state: RootState) => state.user);

  // Request Notification Permissions on Mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket?.on("new-assignment", (assignment: Assignment) => {
      setAssignments((prev) =>
        prev.some((a) => a._id === assignment._id)
          ? prev
          : [...prev, assignment]
      );

      // Fire OS Level Push Notification alert if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Delivery Request!", {
          body: `Drop-off at ${assignment.order?.address?.fullAddress || 'nearby'}`,
          icon: "/icon-192x192.png", // Assuming PWA icon exists or fallback standard
        });
      }
    });

    return () => {
      socket?.off("new-assignment");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    socket.emit("identity", userData?._id);
  }, [userData?._id]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/delivery/get-assignments");
      setAssignments(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fatchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("/api/delivery/history");
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    let socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setDeliveryBoyLocation({ latitude: lat, longitude: lon });

      socket.emit("update-location", {
        userId: userData?._id,
        latitude: lat,
        longitude: lon
      });
    }, (error) => {
      console.log(error);
    }, { enableHighAccuracy: true });

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect(() => {
    if (userData?._id) {
      fetchAssignments();
      fatchCurrentOrder();
      fetchHistory(); // Fetch initial history on load
    }
  }, [userData?._id]);

  const handleAccept = async (id: string) => {
    try {
      const res = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
      await fatchCurrentOrder();
      setLoading(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Could not accept order. Another delivery partner may have accepted it.");
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/reject-assignment`);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Please enter OTP");
    setIsVerifying(true);
    try {
      const res = await axios.post(`/api/delivery/order/${activeOrder?.order?._id}/verify-otp`, { otp });
      if (res.data.success) {
        alert("Delivery marked as completed!");
        setActiveOrder(null);
        setUserLocation(null);
        setOtp("");
        fetchAssignments();
        fetchHistory(); // refresh history upon completion
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Invalid OTP or error verifying");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!userData || userData.role !== "deliveryBoy") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Please log in as a delivery boy.</p>
      </div>
    );
  }

  // Calculate earnings (assuming flat rate 50 ₹ per delivery)
  const FLAT_RATE_PER_DELIVERY = 50;
  const totalEarnings = history.length * FLAT_RATE_PER_DELIVERY;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 font-sans flex flex-col">
      {/* Map Layer (Z-0) */}
      <div className="absolute inset-0 z-0 pt-[80px]">
        <LiveMap 
          userLocation={activeOrder ? userLocation : null} 
          deliveryBoyLocation={deliveryBoyLocation} 
          fullScreen={true} 
        />
        {/* Map Gradient overlay to ensure text visibility on bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
      </div>

      {/* Top Status HUD */}
      <div className="absolute top-[90px] md:top-[100px] inset-x-0 z-20 px-4 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto relative"
        >
           <div className={`w-3 h-3 rounded-full animate-pulse ${assignments.length > 0 || activeOrder ? 'bg-green-400' : 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]'}`}></div>
           <span className="font-bold text-white tracking-widest text-xs uppercase">
             {activeOrder ? "On Delivery" : assignments.length > 0 ? "New Request" : "Online & Searching"}
           </span>
        </motion.div>
      </div>
      
      {/* Profile Button (Floating Top Right) */}
      <div className="absolute top-[80px] md:top-[90px] right-4 z-20">
         <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowProfile(true)}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] flex justify-center items-center text-gray-800 border border-white/40"
         >
            <UserCircle className="w-7 h-7" />
         </motion.button>
      </div>

      {/* ---------------- PROFILE & EARNINGS DRAWER (Slide over map) ---------------- */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/40 backdrop-blur-xs z-40"
               onClick={() => setShowProfile(false)}
            />
            <motion.div
               initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.2)]"
            >
               <div className="flex-1 overflow-y-auto">
                 <div className="p-6 bg-gray-50 border-b flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Driver Profile</h2>
                    <button onClick={() => setShowProfile(false)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="p-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-[2rem] p-6 shadow-xl shadow-green-500/20 text-white mb-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl flex items-center justify-center"></div>
                       <Wallet className="w-8 h-8 text-white/80 mb-4 relative z-10" />
                       <p className="text-green-50 font-medium uppercase tracking-widest text-xs relative z-10">Lifetime Earnings</p>
                       <h3 className="text-4xl font-black mt-1 mb-2 relative z-10">₹{totalEarnings}</h3>
                       <p className="text-xs text-white/80 relative z-10 font-medium">From {history.length} completed deliveries</p>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                       <History className="w-5 h-5 text-gray-400" /> Recent Deliveries
                    </h3>

                    {history.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                         <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                         <p className="font-semibold text-gray-500">No deliveries yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {history.map((h, i) => (
                           <div key={h._id} className="bg-white border rounded-2xl p-4 shadow-sm relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
                              <div className="flex justify-between items-start mb-2 pl-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order #{h.order?._id?.slice(-5)}</p>
                                <span className="flex items-center gap-1 font-black text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded text-center">
                                  +₹{FLAT_RATE_PER_DELIVERY}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-700 mb-2 pl-2 line-clamp-1">{h.order?.address?.fullAddress || "Address Unavailable"}</p>
                              <p className="text-[10px] uppercase font-bold text-gray-400 pl-2 tracking-widest">
                                 {h.acceptAt ? new Date(h.acceptAt).toLocaleString() : "Completed"}
                              </p>
                           </div>
                        ))}
                      </div>
                    )}
                 </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ---------------- END PROFILE DRAWER ---------------- */}

      {/* Overlay Controllers (Z-30) */}
      <div className="absolute bottom-0 inset-x-0 z-30 pb-6 px-4 md:px-8 flex justify-center pointer-events-none">
        <div className="w-full max-w-lg flex flex-col gap-4 pointer-events-auto">

          {/* ACTIVE ORDER BOTTOM SHEET */}
          <AnimatePresence>
            {activeOrder && (
              <motion.div 
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto border border-gray-200"
              >
                {/* Drag handle hint */}
                <div className="w-full flex justify-center pt-4 pb-2">
                   <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Dropoff</h2>
                    <div className="bg-gray-100 px-3 py-1 rounded-lg">
                      <span className="text-xs font-bold text-gray-500 font-mono">#{activeOrder.order._id.slice(-5)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start mb-6 bg-gray-50 p-4 rounded-2xl">
                     <div className="mt-0.5 bg-black rounded-full p-2">
                        <MapPin className="text-white w-4 h-4" />
                     </div>
                     <p className="text-gray-700 font-medium leading-snug">{activeOrder.order.address.fullAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                     <button 
                       onClick={() => setShowChat(!showChat)}
                       className="flex items-center justify-center gap-2 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-bold transition-colors"
                     >
                        <MessageSquare className="w-5 h-5" /> Chat
                     </button>
                     <button className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-colors">
                        <Phone className="w-5 h-5" /> Call
                     </button>
                  </div>

                  <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl mb-4 shadow-inner">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-5 h-5 text-gray-400" />
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Security PIN</p>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="Enter 6-Digit PIN" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-center text-xl font-mono focus:ring-2 focus:ring-black outline-hidden font-bold tracking-widest text-gray-900 w-full"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={verifyOtp}
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 rounded-2xl font-black text-lg transition-transform shadow-[0_10px_20px_rgba(34,197,94,0.3)]"
                  >
                    {isVerifying ? "Verifying..." : "Swipe to Complete"}
                  </button>
                </div>

                {/* Popover Chat embedded */}
                <AnimatePresence>
                  {showChat && userData?._id && (
                    <motion.div 
                      className="absolute inset-x-0 bottom-0 bg-white z-40 rounded-t-[32px] shadow-2xl border-t border-gray-200 max-h-[80vh] overflow-hidden flex flex-col"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                      <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-bold text-lg">Contact Customer</h3>
                        <button onClick={() => setShowChat(false)} className="p-2 bg-gray-100 rounded-full font-bold text-gray-500 hover:bg-gray-200">
                           Close
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <DeliveryChat orderId={activeOrder.order._id} senderId={userData._id} title="" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INCOMING ASSIGNMENTS */}
          <AnimatePresence>
            {!activeOrder && assignments.length > 0 && (
              <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                className="w-full relative"
              >
                {assignments.map((a, index) => (
                  <div key={a._id} className="bg-black text-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col mb-4 ring-1 ring-white/10">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-3xl rounded-full"></div>
                     <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                           <span className="text-xs font-bold text-green-400 tracking-widest uppercase">New Request</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">#{a.order?._id?.slice(-5)}</span>
                     </div>

                     <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                        <Navigation className="w-8 h-8 text-green-400" />
                        Delivery
                     </h3>

                     <div className="flex gap-4 items-start mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                       <MapPin className="text-gray-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                       <p className="font-medium text-gray-300 leading-relaxed text-sm">{a.order?.address?.fullAddress || "N/A"}</p>
                     </div>

                     <div className="flex gap-3">
                       <button
                         onClick={() => handleAccept(a._id)}
                         className="flex-1 bg-green-500 hover:bg-green-400 text-black py-4 rounded-2xl font-black text-lg transition-colors"
                       >
                         Tap to Accept
                       </button>
                       <button
                         onClick={() => handleReject(a._id)}
                         className="bg-white/10 hover:bg-white/20 text-white w-16 flex items-center justify-center rounded-2xl font-bold transition-colors"
                       >
                         X
                       </button>
                     </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
