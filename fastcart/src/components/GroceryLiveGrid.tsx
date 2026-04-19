"use client";

import React, { useEffect, useState } from "react";
import { IGrocery } from "@/app/types/models";
import CartItemCard from "./CartItemCard";
import { getSocket } from "@/app/lib/socket";

const GroceryLiveGrid = ({ initialItems }: { initialItems: any[] }) => {
  const [items, setItems] = useState<IGrocery[]>(initialItems);

  useEffect(() => {
    const socket = getSocket();

    const onNewGrocery = (grocery: IGrocery) => {
      setItems((prev) => {
        if (prev.some((g) => g._id === grocery._id)) return prev;
        return [grocery, ...prev];
      });
    };

    socket.on("new-grocery", onNewGrocery);

    return () => {
      socket.off("new-grocery", onNewGrocery);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {items.map((item: IGrocery) => (
        <CartItemCard key={item._id?.toString()} item={item} />
      ))}
    </div>
  );
};

export default GroceryLiveGrid;

