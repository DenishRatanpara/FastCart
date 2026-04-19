"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Wallet, ArrowLeft, MapPin, Phone, User as UserIcon, Search, SearchCheck, CheckCircle2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux";
import axios from "axios";
import { useRouter } from "next/navigation";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2875/2875433.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const RecenterMap = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => { map.setView(position, 15, { animate: true }); }, [position, map]);
  return null;
};

const CheckOutForm = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart);
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: "", mobile: "", city: "", state: "", pincode: "", fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log("Location error:", err)
    );
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (error) => alert("Unable to fetch location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCod = async () => {
    if (!position || isProcessing) return;
    setIsProcessing(true);
    try {
      await axios.post('/api/user/order', {
        userId: userData?._id,
        items: cartData.map(item => ({ grocery: item._id, name: item.name, price: item.price, unit: item.unit, quantity: item.quantity, image: item.image })),
        totalAmount: finalTotal,
        address: { ...address, latitude: position[0], longitude: position[1] },
        paymentMethod
      });
      router.push('/user/order-success');
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!position || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await axios.post('/api/user/payment', {
        userId: userData?._id,
        items: cartData.map(item => ({ grocery: item._id, name: item.name, price: item.price, unit: item.unit, quantity: item.quantity, image: item.image })),
        totalAmount: finalTotal,
        address: { ...address, latitude: position[0], longitude: position[1] },
        paymentMethod
      });
      window.location.href = result.data.url;
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData.name || "", mobile: String(userData.mobile || "") }));
    }
  }, [userData]);

  useEffect(() => {
    if (!position) return;
    const fetchAddress = async () => {
      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", { params: { lat: position[0], lon: position[1], format: "json" } });
        const addr = res.data.address || {};
        setAddress((prev) => ({ ...prev, city: addr.city || addr.state_district || "", state: addr.state || "", pincode: addr.postcode || "", fullAddress: res.data.display_name || "" }));
      } catch (err) { console.log(err); }
    };
    fetchAddress();
  }, [position]);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", { params: { q: searchQuery, format: "json", limit: 1 } });
      if (res.data.length > 0) setPosition([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
    } catch (err) {} finally { setSearchLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/user/cart" className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="h-2 w-8 bg-green-500 rounded-full"></div>
             <div className="h-2 w-8 bg-green-500 rounded-full"></div>
             <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           
          {/* Left: Input Wizard */}
          <div className="flex-1 space-y-6">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                    <UserIcon size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Contact Information</h2>
                    <p className="text-sm font-medium text-gray-500">We'll use this to communicate about your delivery.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">Full Name</label>
                    <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold outline-hidden focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white" placeholder="John Doe" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2">Mobile Number</label>
                    <input value={address.mobile} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 10) setAddress({ ...address, mobile: v }); }} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold outline-hidden focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white" placeholder="9876543210" />
                 </div>
               </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
               <div className="flex items-center gap-4 mb-8 relative z-10">
                 <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Delivery Address</h2>
                    <p className="text-sm font-medium text-gray-500">Pinpoint your exact location for the driver.</p>
                 </div>
               </div>

               <div className="space-y-4 relative z-10">
                 <div className="flex bg-gray-50 rounded-2xl border-2 border-gray-100 p-1 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                   <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent px-4 py-3 font-semibold outline-hidden rounded-xl text-gray-800" placeholder="Search landmark or area..." />
                   <button onClick={handleSearchLocation} disabled={searchLoading} className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
                     {searchLoading ? "..." : <Search size={18} />} 
                   </button>
                 </div>

                 <div className="h-[250px] rounded-2xl overflow-hidden border-2 border-gray-100 relative bg-gray-50">
                    {!position ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 font-medium">
                        <MapPin className="w-8 h-8 mb-2 animate-bounce opacity-50" />
                        Obtaining GPS Logic...
                      </div>
                    ) : (
                      <>
                        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <RecenterMap position={position} />
                          <Marker position={position} icon={markerIcon} draggable eventHandlers={{ dragend: (e) => { setPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]); } }} />
                        </MapContainer>
                        <button onClick={handleUseCurrentLocation} className="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-2xl shadow-lg border border-gray-100 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 transition">
                           <SearchCheck size={20} /> Locate Me
                        </button>
                      </>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                   <input value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} className="md:col-span-2 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold outline-hidden focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="Complete Street Address" />
                   <div className="flex gap-4 md:col-span-2">
                     <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="flex-1 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold outline-hidden focus:border-blue-500 bg-gray-50 focus:bg-white" placeholder="City" />
                     <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-1/3 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold outline-hidden focus:border-blue-500 bg-gray-50 focus:bg-white text-center tracking-widest" placeholder="ZIP/PIN" />
                   </div>
                 </div>
               </div>
             </motion.div>
          </div>

          {/* Right: Summary & Order Execution */}
          <div className="lg:w-[420px] w-full flex-shrink-0">
             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 lg:sticky lg:top-10 flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Payment Method</h2>

                <div className="space-y-4 mb-8">
                  <div onClick={() => setPaymentMethod("online")} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all ${paymentMethod === "online" ? "border-green-500 bg-green-50 shadow-sm shadow-green-100" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                         Pay Online {paymentMethod === "online" && <CheckCircle2 size={16} className="text-green-600 fill-green-100" />}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 mt-1">UPI, Credit/Debit, Net Banking</p>
                    </div>
                    <CreditCard className={paymentMethod === "online" ? "text-green-600 w-8 h-8" : "text-gray-300 w-8 h-8"} />
                  </div>

                  <div onClick={() => setPaymentMethod("cod")} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all ${paymentMethod === "cod" ? "border-green-500 bg-green-50 shadow-sm shadow-green-100" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                         Cash on Delivery {paymentMethod === "cod" && <CheckCircle2 size={16} className="text-green-600 fill-green-100" />}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 mt-1">Pay when order arrives directly</p>
                    </div>
                    <Wallet className={paymentMethod === "cod" ? "text-green-600 w-8 h-8" : "text-gray-300 w-8 h-8"} />
                  </div>
                </div>

                <div className="space-y-4 text-[15px] pt-6 border-t border-gray-100 mb-8">
                  <div className="flex justify-between font-semibold text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-500" : "text-gray-900"}>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed border-gray-200">
                     <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Total</span>
                     <span className="text-4xl font-black text-green-600 tracking-tight">₹{finalTotal}</span>
                  </div>
                </div>

                <button 
                  disabled={isProcessing || !position || String(address.mobile).length < 10 || !address.fullAddress}
                  onClick={() => paymentMethod === "cod" ? handleCod() : handleOnlinePayment()}
                  className="w-full rounded-2xl bg-green-600 py-5 font-black text-lg text-white hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30 transition-all focus:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:hover:scale-100"
                >
                  {isProcessing ? "Processing Securely..." : `Pay ₹${finalTotal}`}
                </button>
                <p className="text-center font-semibold text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
                   <CreditCard size={12} /> Secure Checkout 100% Encrypted
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckOutForm;
