"use client";
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
}

export default AdminDashboard