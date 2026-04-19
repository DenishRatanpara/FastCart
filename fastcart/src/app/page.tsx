
import React from "react";
import connectDb from "./lib/db";
import { auth } from "@/auth";
import User from "./models/user.model";
import { redirect } from "next/navigation";

import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import GeoUpdater from "@/components/GeoUpdater";

/**
 * IMPORTANT:
 * This forces Next.js to always fetch fresh session data
 */
export const dynamic = "force-dynamic";

const Home = async () => {
  await connectDb();

  // 1️⃣ Get session
  const session = await auth();
  console.log(session)

  // 2️⃣ If not logged in → login page
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 3️⃣ Fetch user from DB
  const dbUser = await User.findOne({
    email: session.user.email,
  }).lean();

  if (!dbUser) {
    redirect("/login");
  }

  // 4️⃣ Serialize MongoDB document
  const user = {
    ...dbUser,
    _id: dbUser._id.toString(),
    createdAt: dbUser.createdAt?.toISOString(),
    updatedAt: dbUser.updatedAt?.toISOString(),
  };

  // 5️⃣ Check incomplete profile
  const isIncompleteProfile = !user.mobile || !user.role;

  if (isIncompleteProfile) {
    return <EditRoleMobile />;
  }

  // 6️⃣ Render dashboards
  return (
    <>
      <Nav user={user} />
      <GeoUpdater userId={user._id}></GeoUpdater>

      {user.role === "admin" && <AdminDashboard />}
      {user.role === "user" && <UserDashboard />}
      {user.role === "deliveryBoy" && <DeliveryBoy />}
    </>
  );
};

export default Home;
