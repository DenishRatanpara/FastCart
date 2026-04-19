"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PlusCircle, ListOrdered, Users } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Orders", href: "/admin/manage-orders", icon: ListOrdered },
    { label: "View Groceries", href: "/admin/view-groceries", icon: ShoppingBag },
    { label: "Add Grocery", href: "/admin/add-grocery", icon: PlusCircle },
    { label: "Manage Users", href: "/admin/manage-users", icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen fixed sticky top-0 flex flex-col pt-[80px] shadow-sm hidden md:flex shrink-0">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <ul className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Overview</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200" 
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <item.icon size={20} className={`${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
