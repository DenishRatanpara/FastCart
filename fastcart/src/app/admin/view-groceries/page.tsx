"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Search, Edit } from "lucide-react";

interface Grocery {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

export default function ViewGroceries() {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [filtered, setFiltered] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchGroceries = async () => {
    try {
      const res = await axios.get("/api/admin/get-groceries");
      if (res.data.success) {
        setGroceries(res.data.groceries);
        setFiltered(res.data.groceries);
      }
    } catch (error) {
      console.error("Failed to fetch groceries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(groceries);
    } else {
      setFiltered(
        groceries.filter((g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) || 
          g.category.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, groceries]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const res = await axios.delete(`/api/admin/grocery/${id}`);
      if (res.data.success) {
        setGroceries((prev) => prev.filter((g) => g._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete grocery", error);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return <div className="text-gray-500 font-medium animate-pulse">Loading groceries...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Manage Groceries</h1>
           <p className="text-gray-500 mt-1">View and manage all available products in your catalogue.</p>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-green-500 w-full md:w-64"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                     <th className="px-6 py-4 font-semibold">Image</th>
                     <th className="px-6 py-4 font-semibold">Product Name</th>
                     <th className="px-6 py-4 font-semibold">Category</th>
                     <th className="px-6 py-4 font-semibold">Price / Unit</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                           No groceries found matching your search.
                        </td>
                     </tr>
                  ) : (
                     filtered.map((g) => (
                        <tr key={g._id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                <img src={g.image} alt={g.name} className="object-cover w-full h-full" />
                              </div>
                           </td>
                           <td className="px-6 py-3">
                              <p className="font-semibold text-gray-800">{g.name}</p>
                           </td>
                           <td className="px-6 py-3">
                              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {g.category}
                              </span>
                           </td>
                           <td className="px-6 py-3 font-medium text-gray-700">
                              ₹{g.price} <span className="text-gray-400 font-normal">/ {g.unit}</span>
                           </td>
                           <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button title="Delete Item" onClick={() => handleDelete(g._id, g.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                   <Trash2 size={18} />
                                </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
