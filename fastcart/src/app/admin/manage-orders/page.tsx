'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IOrder } from '@/app/models/order.model'
import AdminOrderCart from '@/components/AdminOrderCart'
import { getSocket } from '@/app/lib/socket'

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get('/api/admin/get-orders')
        setOrders(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])
  useEffect(() => {
  const socket = getSocket()

  socket?.on("new-order", (newOrder) => {
    console.log("New order:", newOrder)
    setOrders((prev) => [newOrder, ...prev!])
  })

  socket?.on("order-updated", (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (String(o._id) === String(updatedOrder._id) ? updatedOrder : o))
    )
  })

  return () => {
    socket?.off("new-order")
    socket?.off("order-updated")
  }
}, [])

  return (
    <div className="min-h-screen bg-gray-50 w-full px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold">
          Manage Orders
        </h1>
      </div>

      <hr className="mb-4" />

      {/* Orders Section */}
      <div className="flex justify-center">
        <div
          className="
            w-full
            md:w-[80%]
            lg:w-[65%]
            max-h-[75vh]
            overflow-y-auto
            space-y-6
            pr-2
          "
        >
          {loading ? (
            <p className="text-center text-gray-500 mt-10">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No orders found
            </p>
          ) : (
            <AnimatePresence>
              {orders.map((order) => (
                <AdminOrderCart
                  key={order._id?.toString()}
                  order={order}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageOrders
