import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import Grocery from '@/app/models/grocery.model'
import { IGrocery } from '@/app/types/models'
import connectDb from '@/app/lib/db'
import GroceryLiveGrid from './GroceryLiveGrid'

const  UserDashboard = async () => {
  await connectDb();

  const grocery= await Grocery.find({})
  const planItem = JSON.parse(JSON.stringify(grocery));


  return (
    <div className="min-h-screen bg-gray-50/30">
      <HeroSection></HeroSection>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 -mt-6 md:-mt-10">
        <CategorySlider></CategorySlider>
      </div>
      
      <div className='w-full max-w-7xl mx-auto mt-16 mb-24 px-4 md:px-8'>
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize'>Popular Grocery Items</h2>
            <p className='text-gray-500 mt-2 font-medium'>Fresh quality ingredients curated just for you.</p>
          </div>
        </div>
        <GroceryLiveGrid initialItems={planItem} />
      </div>
    </div>
  )
}

export default UserDashboard