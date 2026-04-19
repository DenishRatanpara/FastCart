"use client"
import { getSocket } from '@/app/lib/socket'
import { error } from 'console'
import React, { useEffect } from 'react'

const GeoUpdater = ({userId}:{userId:string}) => {
    
  
    
    let socket=getSocket()
    useEffect(()=>{
           
        if(!userId){
            return
        }
        let socket=getSocket();
              socket.emit("identity",userId)
        if(!navigator.geolocation){
            return 
        }
      const watcher=  navigator.geolocation.watchPosition((pos)=>{
            const lat=pos.coords.latitude
            const lon=pos.coords.longitude

            socket.emit("update-location",{
                userId,
                latitude:lat,
                longitude:lon
            })

        },(error)=>{
            console.log(error)
        },{enableHighAccuracy:true})
        return ()=>navigator.geolocation.clearWatch(watcher)



    },[userId])
  return null
}
export default GeoUpdater