"use client";

import React, { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";

const CheckOutForm = nextDynamic(() => import("@/components/CheckOutForm"), { ssr: false });

const CheckOutPage = () => {
  return <CheckOutForm />;
};

export default CheckOutPage;
