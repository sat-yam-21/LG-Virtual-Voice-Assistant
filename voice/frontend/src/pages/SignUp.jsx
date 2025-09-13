import React, { useContext, useState } from 'react'
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { userDataContext } from '../context/UserContext'
import axios from "axios"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("")
    setLoading(true)

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center px-4'>
      <form
        onSubmit={handleSignUp}
        className='w-full max-w-md bg-gray-100 text-black p-8 rounded-2xl shadow-xl flex flex-col gap-6'
      >
        <h1 className='text-2xl font-semibold text-center'>
          Register to <span className='text-blue-600'>LG Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder='Enter your Name'
          className='w-full h-12 px-4 rounded-full border border-gray-300 bg-white text-black placeholder-gray-500 outline-none'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder='Email'
          className='w-full h-12 px-4 rounded-full border border-gray-300 bg-white text-black placeholder-gray-500 outline-none'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className='w-full h-12 relative border border-gray-300 rounded-full bg-white'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full px-4 pr-12 rounded-full bg-transparent text-black placeholder-gray-500 outline-none'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!showPassword ? (
            <IoEye className='absolute top-3 right-4 w-6 h-6 text-gray-600 cursor-pointer' onClick={() => setShowPassword(true)} />
          ) : (
            <IoEyeOff className='absolute top-3 right-4 w-6 h-6 text-gray-600 cursor-pointer' onClick={() => setShowPassword(false)} />
          )}
        </div>

        {err && <p className='text-red-500 text-sm text-center'>{err}</p>}

        <button
          type="submit"
          className='w-full h-12 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className='text-sm text-center'>
          Already have an account?{" "}
          <span
            className='text-blue-600 font-medium cursor-pointer'
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
