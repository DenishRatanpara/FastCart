'use client'
import React from 'react'
import { useState } from 'react'
import { motion, scale } from "motion/react"
import { ArrowRight, Bike, ShoppingCart } from 'lucide-react'
type propsType={
    nextStape:(s:number)=>void

}
const Welcome = ({nextStape}:propsType) => {
  
  return (
    <div className='flex flex-col items-center justify-center  min-h-screen text-center p-6'>
       <motion.div className='flex items-center gap-2'
       initial={{
        opacity:0,
        y:-40
       }}
       animate={{
        opacity:1,
        y:0
       }}
       transition={
        {
            duration:0.5,
            delay:0.3
        }
       }
       >    <ShoppingCart className='w-10 h-10'></ShoppingCart>
        <h1 className='text-4xl  mid:text-5xl text-green-500 font-extrabold'>FastCart</h1>
    
       </motion.div>
       <motion.p
       initial={{
        opacity:0,
        y:40
       }}
       animate={{
        opacity:1,
        y:0
       }}
       transition={
        {
            duration:0.5,
            delay:0.3
        }
       }
       className='mt-4 text-gray-700 md:text-xl max-w-lg'
       >Welcome to FastCart, your all-in-one online store.
Browse products, compare options, and shop confidently with our easy-to-use interface.

       </motion.p>
       <motion.div className='flex items-center justify-center gap-10 mt-5'
       initial={{
        opacity:0,
        scale:0.9
       }}
       
       animate={{
        opacity:1,
        scale:1
       }}
       transition={
        {
            duration:0.5,
            delay:0.3
        }
       }
       >
        <ShoppingCart className='w-24 h-24'></ShoppingCart>
        <Bike className='w-24 h-24 text-orange-400'></Bike>
       </motion.div>
       <motion.button
        initial={{
        opacity:0,
        scale:1,
       y:50
       }}
       whileHover={{
        scale:1.1
        
       }}
       animate={{
        opacity:1,
        y:0
       }}
       transition={
        {
            duration:0.3,
            delay:0.3
        }
       }
       onHoverStart={()=>{
        scale:100
       }
      
       }
       onHoverEnd={()=>{
        scale:0
       }}
      
      
       className='inline-flex gap-2 mt-10 bg-green-500  p-3  rounded-xl'
       onClick={()=>nextStape(2)}
       >Next <ArrowRight></ArrowRight></motion.button>
      
    </div>
  )
}

export default Welcome