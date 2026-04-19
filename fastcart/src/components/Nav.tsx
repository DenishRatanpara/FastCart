"use client";
import React, { useEffect, useRef, useState } from "react";
import mongoose from "mongoose";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Package,
  LogOut,
  X,
  Plus,
  PlusCircle,
  Boxes,
  ClipboardCheck,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { AnimatePresence, motion, spring } from "motion/react";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { sign } from "crypto";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux";

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Nav = ({ user }: { user: IUser }) => {
  const { cartData } = useSelector((state: RootState) => state.cart);

  const [open, setOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const cartItem = useSelector((state: RootState) => state.cart.cartData);
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };
  const sideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 18, stiffness: 120 }}
            className="fixed flex flex-col top-0 left-0 h-full w-[70%] sm:w-[60%] z-9999 bg-linear-to-b from-green-800 to-green-600 shadow-xl"
          >
            {/* 🌟 Add Sidebar Content Here */}
            <div className=" flex justify-between p-5 mb-2  text-white text-xl font-semibold">
              <h1 className="font-extrabold text-white tracking-wide text-2xl">
                Admin Panel{" "}
              </h1>
              <button
                className="text-white hover:text-red-500 transition text-2xl font-bold"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-8 h-8"></X>
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-all shadow-inner m-3 p-2 rounded-xl">
              <div className="w-12 h-12 p-2 relative rounded-full overflow-hidden border-2 shadow-lg border-green-400/60">
                {user.image ? (
                  <Image
                    className="object-cover rounded-full"
                    src={user.image}
                    fill
                    alt="user"
                  ></Image>
                ) : (
                  <User></User>
                )}
              </div>
              <div>
                <h2 className="text-lg text-white font-semibold">
                  {user.name}
                </h2>
                <p className="text-xs text-white font-semibold tracking-wide capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            {/*Link in next js*/}
            <div className="flex flex-col gap-3  font-midum mt-6 m-3">
              <Link
                href="/admin"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <LayoutDashboard className="w-5 h-5"></LayoutDashboard>
                Dashboard
              </Link>
              <Link
                href="/admin/add-grocery"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle className="w-5 h-5"></PlusCircle>
                Add Grocery
              </Link>
              <Link
                href="/admin/view-groceries"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes className="w-5 h-5"></Boxes>
                View Grocery
              </Link>
              <Link
                href="/admin/manage-orders"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardCheck className="w-5 h-5"></ClipboardCheck>
                Manage Orders
              </Link>
            </div>
            {/* border */}
            <div className="my-5 border-t border-white/20"></div>
            {/* logout button in bouttom */}

            <div
              onClick={async () => await signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 mt-auto p-3 text-red-300 font-semibold hover:bg-red-950 transition-all rounded-lg"
            >
              <LogOut className="w-8 h-8 text-red-3500"></LogOut>
              <button> Log Out</button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div className="w-[95%] fixed top-1 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
      {/* Logo */}
      <Link
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition"
        href="/"
      >
        FastCart
      </Link>

      {/* Mobile Search Icon */}
      {user.role == "user" && (
        <div className="bg-white w-10 h-10 rounded-full p-2 md:hidden flex justify-center items-center">
          <Search onClick={() => setSearchBarOpen((prev) => !prev)} />
        </div>
      )}

      {/* Desktop Search Bar */}
      {user.role === "user" && (
        <form className="hidden md:flex items-center bg-white rounded-full px-3 py-2 w-1/2 max-w-lg shadow-md">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            placeholder="Search Items..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            type="text"
          />
        </form>
      )}

      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* Cart */}
        {user.role == "user" && (
          <Link
            className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
            href="/user/cart"
          >
            <ShoppingCart className="w-6 h-6 text-green-600" />
            {cartData.length > 0 && (
              <span className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {cartItem.length}
              </span>
            )}
          </Link>
        )}

        {/* ADMIN MENU */}
        {user.role === "admin" && (
          <>
            <div className="hidden md:flex gap-4 text-white font-medium">
              <Link
                href="/admin"
                className="hover:bg-green-200 gap-2 font-semibold transition-all bg-white justify-center rounded-full text-gray-700 px-4 items-center flex py-2"
              >
                <LayoutDashboard className="w-5 h-5"></LayoutDashboard>
                Dashboard
              </Link>
              <Link
                href="/admin/add-grocery"
                className="hover:bg-green-200 gap-2 font-semibold transition-all bg-white  justify-center rounded-full text-gray-700 px-4 items-center flex py-2"
              >
                <PlusCircle className="w-5 h-5"></PlusCircle>
                Add Grocery
              </Link>
              <Link
                href="/admin/view-groceries"
                className="hover:bg-green-200 gap-2 font-semibold transition-all bg-white  justify-center rounded-full text-gray-700 px-4 items-center flex py-2"
              >
                <Boxes className="w-5 h-5"></Boxes>
                View Grocery
              </Link>
              <Link
                href="/admin/manage-orders"
                className="hover:bg-green-200 gap-2 font-semibold transition-all bg-white justify-center  rounded-full text-gray-700 px-4 items-center flex py-2"
              >
                <ClipboardCheck className="w-5 h-5"></ClipboardCheck>
                Manage Orders
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex items-center gap-2 bg-white px-2 py-2 rounded-full justify-center w-10 h-10 shadow-lg "
            >
              <Menu className="text-green-400 w-5 h-5 font-bold"></Menu>
            </div>
          </>
        )}

        {/* Profile Button */}
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="bg-white p-2px rounded-full overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
        >
          {user.image ? (
            <Image
              src={user.image}
              width={40}
              height={40}
              alt="user"
              className="rounded-full object-cover"
            />
          ) : (
            <User className="p-2 w-10 h-10" />
          )}
        </div>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl border p-3 z-999"
            >
              <div className="flex items-center gap-4 px-3 py-2 border-b">
                <div className="rounded-full bg-green-100 p-1 overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      width={40}
                      height={40}
                      alt="user"
                      className="rounded-full"
                    />
                  ) : (
                    <User className="p-2 w-10 h-10" />
                  )}
                </div>

                <div>
                  <p className="text-gray-800 font-semibold">{user.name}</p>
                  <p className="text-xs capitalize text-gray-600">
                    {user.role}
                  </p>
                </div>
              </div>

              {user.role == "user" && (
                <Link
                  onClick={() => setOpen(false)}
                  href="/user/my-orders"
                  className="flex gap-3 px-3 py-2 text-gray-800 border-b hover:bg-green-100 text-lg"
                >
                  <Package className="w-6 h-6 text-green-500" />
                  My Orders
                </Link>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex gap-3 px-3 py-2 w-full text-left text-lg text-gray-800 hover:bg-red-100"
              >
                <LogOut className="w-6 h-6 text-red-500" />
                Log Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Popup */}
        <AnimatePresence>
          {searchBarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg py-2 px-4 flex items-center"
            >
              <Search className="text-gray-500 w-5 h-5" />

              <input
                type="text"
                className="w-full outline-none ml-2 text-gray-700"
                placeholder="Search items..."
              />

              <button onClick={() => setSearchBarOpen(false)}>
                <X />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {sideBar}
      </div>
    </div>
  );
};

export default Nav;
