'use client'
import { RootState } from '@/store/redux';
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {ArrowLeft, CheckCircle, Navigation, ShieldCheck} from "lucide-react"
import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });
import { getSocket } from '@/app/lib/socket';
import DeliveryChat from '@/components/DeliveryChat';
import { IOrder, IUser } from '@/app/types/models';
import { motion } from "framer-motion";

interface ILocation{
  latitude:number
  longitude:number
}

const TrackOrder = () => {
  const {userData}=useSelector((state:RootState)=>state.user)
  const {orderId}=useParams()
  const router=useRouter()

  const [order,setOrder]=useState<any>()
  const [userLocation,setUserLocation]=useState<ILocation>({
      latitude:0,
      longitude:0
    })
    const [deliveryBoyLocation,setDeliveryBoyLocation]=useState<ILocation>({
      latitude:0,
      longitude:0
    })

  useEffect(()=>{
    const getCurrentOrder= async ()=>{
      try {
        const result= await axios.get(`/api/user/get-order/${orderId}`)
      console.log(result)
      setOrder(result.data)
        setUserLocation({
        latitude:result.data.address.latitude,
          longitude:result.data.address.longitude,
        })
        const coords = result.data?.assignedDeliveryBoy?.location?.coordinates
        if (Array.isArray(coords) && coords.length === 2) {
          setDeliveryBoyLocation({
            latitude:coords[1],
            longitude:coords[0],
          })
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    if (orderId) {
      getCurrentOrder()
    }

  },[orderId])

  useEffect(()=>{

    const socket=getSocket()
    const onLocation=(data:any)=>{
      if (data?.orderId && String(data.orderId) !== String(orderId)) return;
      setDeliveryBoyLocation({
        latitude:data.location?.coordinates?.[1] ?? data.location?.latitude ?? 0,
        longitude:data.location?.coordinates?.[0] ?? data.location?.longitude ?? 0
      })
    }

    const onOrderUpdated=(updatedOrder:any)=>{
      if (String(updatedOrder?._id) !== String(orderId)) return;
      setOrder(updatedOrder);
      if (updatedOrder?.address?.latitude != null && updatedOrder?.address?.longitude != null) {
        setUserLocation({
          latitude: updatedOrder.address.latitude,
          longitude: updatedOrder.address.longitude,
        })
      }
      const coords = updatedOrder?.assignedDeliveryBoy?.location?.coordinates
      if (Array.isArray(coords) && coords.length === 2) {
        setDeliveryBoyLocation({
          latitude: coords[1],
          longitude: coords[0],
        })
      }
    }

    const onOrderStatusUpdate=(data:any)=>{
      if (String(data?.orderId) !== String(orderId)) return;
      setOrder((prev:any)=> prev ? ({...prev, status: data.status}) : prev)
    }

    socket.on("update-deliveryBoy-location", onLocation)
    socket.on("order-updated", onOrderUpdated)
    socket.on("order-status-update", onOrderStatusUpdate)

   return ()=>{
    socket.off("update-deliveryBoy-location", onLocation)
    socket.off("order-updated", onOrderUpdated)
    socket.off("order-status-update", onOrderStatusUpdate)
   }
  },[orderId])

  if (!order) {
     return (
       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full mb-4"
        />
        <p className="text-gray-500 font-medium">Locating your order...</p>
      </div>
     )
  }

  return (
    <div className='w-full min-h-screen bg-gray-50/50 pb-24'>
       {/* HEADER HERO */}
       <div className="bg-white border-b border-gray-100 px-4 py-6 md:py-8 shadow-sm relative overflow-hidden z-[99]">
        {/* Subtle decorative background detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-all hover:-translate-x-1 text-gray-700 shadow-sm border border-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-3 mt-1 md:mt-0">
                 <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                   Track Order
                 </h1>
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' : 
                    'bg-amber-100 text-amber-700'
                 }`}>
                   {order.status.replace(/_/g, ' ')}
                 </span>
              </div>
              <p className="text-gray-500 mt-1 font-medium font-mono text-sm">#{order._id.toString().slice(-8)}</p>
            </div>
          </div>

          {order?.deliveryOtp && order.status !== "delivered" && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4"
            >
              <div className="p-2 bg-indigo-100 rounded-full text-indigo-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-0.5">Delivery OTP</p>
                <div className="text-2xl font-mono font-black text-indigo-700 tracking-widest leading-none">{order.deliveryOtp}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className='max-w-6xl mx-auto mt-6 px-4'>
        {order?.status === "delivered" ? (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-12 bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100 max-w-2xl mx-auto"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                 <CheckCircle size={48} strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Order Delivered!</h3>
              <p className="text-gray-500 font-medium text-lg">Your groceries have successfully arrived at your location.</p>
              
              <button 
                onClick={() => router.push('/user/my-orders')}
                className="mt-8 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl text-sm font-bold transition shadow-lg hover:shadow-xl"
              >
                Back to My Orders
              </button>
           </motion.div>
        ) : (
          <div className='grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-140px)]'>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='bg-white p-2 rounded-3xl overflow-hidden border border-gray-100 shadow-xl min-h-[400px] lg:min-h-full lg:h-full relative flex flex-col'
            >
              <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
                 <Navigation size={18} className="text-blue-500" />
                 <span className="font-bold text-gray-800 text-sm">Live Location Tracking</span>
              </div>
              <div className="w-full flex-1 rounded-2xl overflow-hidden shadow-inner">
                <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
              </div>
            </motion.div>
            
            {userData?._id && order?._id && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className='bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl min-h-[400px] lg:min-h-full lg:h-full flex flex-col'
              >
                <DeliveryChat
                  orderId={order._id.toString()}
                  senderId={userData._id}
                  title="Delivery Agent Chat"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

export default TrackOrder