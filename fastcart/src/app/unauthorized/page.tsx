import React from 'react'

const Unauthorized = () => {
  return (
    <div className='flex flex-col h-screen justify-center items-center'>
        <h1 className='text-2xl text-red-600 fond-bold' >Access Denied 🚫
        </h1>
        <p className='text-gray-700 mt-2 capitalize'>You Can not access this page</p></div>
  )
}

export default Unauthorized