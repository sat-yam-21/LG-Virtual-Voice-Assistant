import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { SlSettings } from "react-icons/sl";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [ham, setHam] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => startRecognition(), 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    const query = encodeURIComponent(userInput.trim());

    const routes = {
      'google-search': `https://www.google.com/search?q=${query}`,
      'calculator-open': `https://www.google.com/search?q=calculator`,
      'instagram-open': `https://www.instagram.com/`,
      'facebook-open': `https://www.facebook.com/`,
      'weather-show': `https://www.google.com/search?q=weather`,
      'youtube-search': `https://www.youtube.com/results?search_query=${query}`,
      'youtube-play': `https://www.youtube.com/results?search_query=${query}`,
      'lg-search': `https://www.lg.com/in/search?search=${query}`,
    };

    if (routes[type]) {
      window.open(routes[type], "_blank");
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try { recognition.start(); } catch (e) { if (e.name !== "InvalidStateError") console.error(e); }
      }
    }, 1000);

    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true); };
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { if (e.name !== "InvalidStateError") console.error(e); }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { if (e.name !== "InvalidStateError") console.error(e); }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center flex-col gap-4 overflow-hidden relative'>

      {/* Mobile Hamburger */}
      <CgMenuRight className='lg:hidden text-black absolute top-4 right-4 w-6 h-6' onClick={() => setHam(true)} />

      {/* Mobile Sidebar */}
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-6 items-start z-50 ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white absolute top-4 right-4 w-6 h-6' onClick={() => setHam(false)} />

        <button className='w-full py-3 text-white font-semibold bg-black hover:bg-gray-900 rounded-full flex items-center gap-2 px-4' onClick={handleLogOut}><FiLogOut /> Log Out</button>
        <button className='w-full py-3 text-white font-semibold bg-black hover:bg-gray-900 rounded-full flex items-center gap-2 px-4' onClick={() => navigate("/customize")}><SlSettings /> Customize Assistant</button>

        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-lg'>History</h1>
        <div className='w-full max-h-[400px] overflow-y-auto flex flex-col gap-3'>
          {userData.history?.map((his, index) => (
            <div key={index} className='text-gray-200 text-base truncate'>{his}</div>
          ))}
        </div>
      </div>

      {/* Desktop Controls */}
      <div className='hidden lg:flex flex-col gap-4 absolute top-4 right-4 items-end'>
        <button className='min-w-[180px] py-3 px-4 text-white font-semibold bg-black hover:bg-gray-900 rounded-full flex items-center gap-2' onClick={handleLogOut}><FiLogOut /> Log Out</button>
        <button className='min-w-[180px] py-3 px-4 text-white font-semibold bg-black hover:bg-gray-900 rounded-full flex items-center gap-2' onClick={() => navigate("/customize")}><SlSettings /> Customize Assistant</button>
        <button className='min-w-[180px] py-3 px-4 text-white font-semibold bg-black hover:bg-gray-900 rounded-full flex items-center gap-2' onClick={() => setShowInstructions(true)}>ℹ️ How to Use</button>
      </div>

      <div className='w-[300px] h-[400px] flex justify-center items-center rounded-4xl shadow-lg bg-white'>
        <img src={userData?.assistantImage} alt="assistant" className='max-h-full max-w-full object-contain' />
      </div>

      {showInstructions && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative'>
            <button onClick={() => setShowInstructions(false)} className='absolute top-3 right-4 text-black text-xl font-bold'>×</button>
            <h2 className='text-2xl font-bold mb-4'>How to Use This Virtual Assistant</h2>
            <ol className='list-decimal list-inside text-gray-700 space-y-2'>
              <li>Sign up using your username, email, and password.</li>
              <li>Choose or upload an image for your assistant.</li>
              <li>Give your assistant a custom name.</li>
              <li>Say your assistant’s name to activate it and give voice instructions.</li>
              <li>You can search on LG's website, Google, YouTube, and more.</li>
              <li>Enjoy voice-powered browsing and automation!</li>
            </ol>
          </div>
        </div>
      )}

      <h1 className='text-black text-lg font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="user" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="ai" className='w-[200px]' />}
      <h1 className='text-black text-lg font-semibold text-wrap text-center px-4'>{userText || aiText}</h1>
    </div>
  );
}

export default Home;
