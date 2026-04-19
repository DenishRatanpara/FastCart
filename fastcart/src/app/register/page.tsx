'use client'
import React, { useState } from 'react'
import Welcome from '@/components/Welcome'
import RegisterForm from '@/components/RegisterForm'

const Register = () => {
  const [stape, setStape] = useState(1)

  const nextPrev = (value: number) => {
    setStape(value)
  }

  return (
    <div>
      {stape === 1
        ? <Welcome nextStape={setStape} />
        : <RegisterForm nextPrev={nextPrev} />
      }
    </div>
  )
}

export default Register
