"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, ShieldUser, Motorbike, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EditRoleMobile = () => {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: ShieldUser },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery", icon: Motorbike },
  ]);

  const [selectrole, setSelectrole] = useState("");
  const [mobile, setMobile] = useState("");

  const { update } = useSession();
  const router = useRouter();

  // 🔐 Check if admin already exists
  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");

        if (result.data.adminExist === true) {
          setRoles(prev => prev.filter(role => role.id !== "admin"));
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkForAdmin();
  }, []);

  const handleEdit = async () => {
    if (!selectrole || mobile.length !== 10) return;

    try {
      await axios.post("/api/user/edit-role-mobile", {
        role: selectrole,
        mobile,
      });

      await update({ role: selectrole });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">

      <motion.h1
        className="text-green-400 font-extrabold text-3xl mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Select Your Role
      </motion.h1>

      {/* Roles */}
      <div className="flex gap-6">
        {roles.map(role => {
          const isSelected = selectrole === role.id;

          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectrole(role.id)}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: isSelected ? 1.15 : 1 }}
              className={`p-6 border rounded-xl cursor-pointer flex flex-col items-center
                ${isSelected ? "bg-green-300" : "bg-gray-300"}`}
            >
              <role.icon size={32} />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="mt-8">
        <input
          type="tel"
          maxLength={10}
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter mobile number"
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Button */}
      <motion.button
        onClick={handleEdit}
        disabled={mobile.length !== 10 || !selectrole}
        className="mt-6 px-6 py-3 rounded bg-gradient-to-b from-green-300 to-white disabled:opacity-50"
      >
        Go To Home <ArrowRight />
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
