import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backend, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [assistantName, setAssistantName] = useState(""); // ✅ Add this

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoAssistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backend,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    frontendImage,
    setFrontendImage,
    assistantName,            
    setAssistantName,         
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
