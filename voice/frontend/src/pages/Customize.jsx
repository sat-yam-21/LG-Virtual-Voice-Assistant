import React, { useState, useRef, useContext } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import lg from "../assets/lg.png"
import { IoMdArrowRoundBack } from "react-icons/io"
import { RiImageAddFill } from "react-icons/ri"
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function Customize() {
  const {
    setBackendImage, setSelectedImage,
    setFrontendImage, frontendImage, selectedImage
  } = useContext(userDataContext)

  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center flex-col p-5 relative'>
      <IoMdArrowRoundBack className='absolute top-6 left-6 text-black w-7 h-7 cursor-pointer' onClick={() => navigate("/")} />

      <h1 className='text-3xl font-semibold text-black mb-6 text-center'>
        Select Your <span className='text-blue-600'>Assistant Image</span>
      </h1>

      <div className='w-full max-w-5xl flex justify-center items-center flex-wrap gap-4'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={lg} className="object-contain" />

        {/* Custom Upload Box */}
        <div
          className={`w-[80px] h-[150px] lg:w-[150px] lg:h-[250px] bg-blue-500 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200
          ${selectedImage === "input" ? "border-4 border-blue-800 shadow-2xl" : "border-blue-300"}
          hover:shadow-2xl hover:border-blue-700`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage ? (
            <RiImageAddFill className='text-white w-6 h-6' />
          ) : (
            <img src={frontendImage} alt="Uploaded" className='h-full w-full object-cover rounded-2xl' />
          )}
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
      </div>

      {selectedImage && (
        <button
          className='min-w-[150px] h-[50px] mt-10 px-6 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all'
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  )
}

export default Customize
