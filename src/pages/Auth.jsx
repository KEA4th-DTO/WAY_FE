import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";

const Auth = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const sendCodeToServer = async () => {
      try {
        const response = await axios.post(`${Server_IP}/auth/kakao/callback`, {
          code: code,
        });

        if (response.status === 200) {
          // Assuming you want to navigate to a home page or dashboard after successful login
          navigate("/home");
        } else {
          console.error("Failed to send code to the server:", response.status);
        }
      } catch (error) {
        console.error("Error sending code to the server:", error);
      }
    };

    if (code) {
      sendCodeToServer();
    }
  }, [code, navigate]);

  return null;
};

export default Auth;
