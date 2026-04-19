'use client'

import { AppDispatch } from '@/store/redux'
import { setUserData } from '@/store/userSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetMe = () => {
    const dispatch=useDispatch<AppDispatch>()
    useEffect(()=>{
        const getMe=async ()=>{
            try {
                const result = await axios.get('/api/me')
                dispatch(setUserData(result.data))
            } catch (error) {
                
            }
        }
     getMe()
    },[])
 
}

export default useGetMe