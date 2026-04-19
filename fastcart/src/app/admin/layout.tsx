"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/redux";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userData && userData.role !== "admin") {
       router.push("/");
    }
  }, [userData, router, isClient]);

  if (!isClient) {
      return null;
  }

  if (userData?.role !== "admin") {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[80px]">
           <p className="text-gray-600 font-medium">Checking authorization...</p>
         </div>
      );
  }

  return (
    <div className="flex bg-gray-50/50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0 pt-[80px] md:pt-[100px]">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
           {children}
        </div>
      </div>
    </div>
  );
}
