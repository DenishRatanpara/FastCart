'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";



const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [Loading,setLoading]=useState(false);
  const router=useRouter();
const { data: session, status } = useSession();




  const validateForm =
     email.trim() !== "" && password.trim() !== "";

   const handleSubmit=async (e: React.FormEvent)=>{
    e.preventDefault()
    setLoading(true);
    try {
       const data =  await signIn("credentials",{
            email,password,redirect:false
        })
        setLoading(false);
        console.log(data)
        router.push("/");

        
    } catch (error) {
        console.log(error)
        setLoading(false);
        
    }

   }

    
  return (
    <>
      {/* Back button */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-1">
        {/* Heading */}
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-green-600 font-bold text-3xl mb-6"
        >
          Welcome Back
        </motion.h1>

        <motion.form
        onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-white shadow-xl p-8 rounded-2xl border border-gray-200"
        >
         

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>

            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1 bg-gray-50 focus-within:bg-white transition">
              <Mail className="text-gray-500" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>

            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1 bg-gray-50 focus-within:bg-white transition relative">
              <Lock className="text-gray-500" size={20} />

              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-500 hover:text-black transition absolute right-3"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <motion.button
            whileTap={validateForm ? { scale: 0.95 } : {}}
            whileHover={validateForm ? { scale: 1.03 } : {}}
            disabled={!validateForm}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center
              ${
                validateForm
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }
            `}
          >
           {Loading? <Loader2 className="w-4 h-5 animate-spin"></Loader2>:"Login"}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* Google Auth */}
          <motion.button
           onClick={()=>signIn("google",{callbackUrl:"/"})}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl font-semibold bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <FcGoogle size={24} />
            Continue with Google
          </motion.button>

          {/* Already have account */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Create A New Account?{" "}
            <span
              className="text-green-600 font-semibold cursor-pointer hover:underline"
              onClick={() => router.push('/register')}
            >
              Sign up
            </span>
          </p>
        </motion.form>
      </div>
    </>
  );
};

export default Login;
