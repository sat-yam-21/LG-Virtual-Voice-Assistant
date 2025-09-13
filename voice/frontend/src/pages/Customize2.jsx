import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io"
import { userDataContext } from '../context/UserContext'

function Customize2() {
  const {
    setUserData, userData,
    setAssistantName, assistantName,
    setAssistantImage, frontendImage,
    backendImage, serverUrl
  } = useContext(userDataContext)

  const navigate = useNavigate()

  const handleFinish = async () => {
    if (!assistantName || (!frontendImage && !userData?.assistantImage)) return

    try {
      const formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      }

      const response = await fetch(`${serverUrl}/api/user/update`, {

        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await response.json()
      setUserData(data)
      navigate("/")
    } catch (err) {
      console.error("Error updating assistant:", err)
    }
  }

  return (
    <div className='w-full min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8 relative'>

      <IoMdArrowRoundBack
        className='absolute top-6 left-6 text-black w-7 h-7 cursor-pointer'
        onClick={() => navigate("/customize")}
      />

      <h1 className='text-3xl font-semibold text-black mb-6 text-center'>
        Give a <span className='text-blue-600'>Name</span> to Your Assistant
      </h1>

      <input
        type="text"
        placeholder='Assistant Name'
        className='w-full max-w-md h-[55px] px-5 text-black placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      <div className='w-[300px] h-[400px] mt-10 flex justify-center items-center rounded-3xl shadow-lg bg-white border'>
        {frontendImage || userData?.assistantImage ? (
          <img
            src={frontendImage || userData.assistantImage}
            alt="Assistant"
            className='max-w-full max-h-full object-contain'
          />
        ) : (
          <p className='text-gray-400'>No image selected</p>
        )}
      </div>

      <button
        className='min-w-[150px] h-[50px] mt-10 px-6 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all disabled:opacity-50'
        onClick={handleFinish}
        disabled={!assistantName}
      >
        Finish
      </button>
    </div>
  )
}

export default Customize2
