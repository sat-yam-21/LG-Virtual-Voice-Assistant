import React, { useContext, useState } from 'react'
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { userDataContext } from '../context/UserContext';
import axios from "axios"

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    } catch (error) {
      setUserData(null)
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center px-4'>
      <form
        className='w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6'
        onSubmit={handleSignIn}
      >
        <h1 className='text-2xl font-semibold text-center text-gray-800'>
          Sign In to <span className='text-blue-600'>LG Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder='Email'
          className='w-full h-12 px-4 rounded-full border border-gray-300 bg-white text-black placeholder-gray-500 outline-none'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className='w-full h-12 border border-gray-300 rounded-full bg-white relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full px-4 pr-12 rounded-full bg-transparent text-black placeholder-gray-500 outline-none'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          {showPassword ? (
            <IoEyeOff
              className='absolute top-3 right-4 w-6 h-6 text-gray-600 cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className='absolute top-3 right-4 w-6 h-6 text-gray-600 cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && <p className='text-red-500 text-sm text-center'>{err}</p>}

        <button
          className='w-full h-12 mt-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className='text-gray-700 text-sm'>
          Don't have an account?{" "}
          <span
            className='text-blue-600 font-medium cursor-pointer'
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignIn
