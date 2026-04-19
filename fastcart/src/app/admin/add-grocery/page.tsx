"use client"
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Upload, PlusCircle, ShoppingBasket } from "lucide-react";
import axios from "axios";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Bakery",
  "Foodgrains, Oil & Masala",
  "Snacks & Branded Foods",
  "Beverages",
  "Chocolates & Confectionery",
  "Meat, Fish & Eggs",
  "Frozen Foods",
  "Personal Care",
  "Home Care",
  "Baby Care",
  "Household Essentials",
  "Pet Care",
  "Stationery",
];

const units = ["1 Kg", "500 g", "250 g", "1 Ltr", "500 ml", "1 Pc", "Pack"];

const AddGrocery = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");

  const [errors, setErrors] = useState<any>({});

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateFields = () => {
    const newErrors: any = {};

    if (!name) newErrors.name = "Product name is required";
    if (!category) newErrors.catogery = "Category is required";
    if (!price) newErrors.price = "Price is required";
    if (!unit) newErrors.unit = "Unit is required";
    if (!backendImage) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return; // ❌ Stop submission

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);

      if (backendImage) {
        formData.append("file", backendImage);
      }

      const result = await axios.post("/api/admin/add-grocery", formData);
      console.log(result);
      setName("");
      setPrice("")
      setUnit("")
      setBackendImage(null);
      setImagePreview("");
      setCategory("");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white-50 to-white py-16 px-4 relative">
      {/* BACK BUTTON */}
      <Link
        className="absolute top-6 left-6 flex gap-2 px-4 py-2 bg-white text-green-700 hover:shadow-lg rounded-full hover:bg-green-300 transition-all"
        href={"/"}
      >
        <ArrowLeft />
        <span className="hidden md:flex">Back To Home</span>
      </Link>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBasket className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Add Grocery Item
          </h1>
        </div>

        {/* HORIZONTAL FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SECTION */}
            <div className="space-y-5">

              {/* NAME */}
              <div>
                <label className="font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className={`w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-green-500"
                  }`}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 outline-none ${
                    errors.catogery
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-green-500"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.catogery && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.catogery}
                  </motion.p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <label className="font-medium text-gray-700">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className={`w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 outline-none ${
                    errors.price
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-green-500"
                  }`}
                />
                {errors.price && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.price}
                  </motion.p>
                )}
              </div>

              {/* UNIT (DROPDOWN) */}
              <div>
                <label className="font-medium text-gray-700">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 outline-none ${
                    errors.unit
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-green-500"
                  }`}
                >
                  <option value="">Select Unit</option>
                  {units.map((u, idx) => (
                    <option key={idx} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.unit}
                  </motion.p>
                )}
              </div>
            </div>

            {/* RIGHT SECTION: IMAGE UPLOAD */}
            <div className="flex flex-col items-center justify-start">
              <label className="font-medium text-gray-700">
                Product Image <span className="text-red-500">*</span>
              </label>

              <label
                className={`w-full mt-2 flex flex-col items-center justify-center p-6 border-dashed border-2 rounded-xl cursor-pointer transition ${
                  errors.image
                    ? "border-red-400 bg-red-50"
                    : "border-gray-400 hover:bg-gray-100"
                }`}
              >
                <Upload className="w-8 h-8 mb-2 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Click to upload image
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {errors.image && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.image}
                </motion.p>
              )}

              {/* IMAGE PREVIEW */}
              {imagePreview && (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-40 h-40 mt-3 rounded-xl shadow-lg object-cover"
                  src={imagePreview}
                  alt="preview"
                />
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-lg"
            type="submit"
          >
            <PlusCircle className="w-5 h-5" />
            Add Grocery
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
