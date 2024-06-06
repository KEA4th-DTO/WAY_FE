import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const KAKAO_CODE = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    const kakaoLogin = async () => {
      const Server_IP = process.env.REACT_APP_Server_IP;
      const url = `${Server_IP}/auth-service/oauth/kakao/callback`;
      // console.log("kakao", KAKAO_CODE);

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        // console.log(response);

        if (response.status === 200) {
          localStorage.setItem("name", response.data.account.kakaoName);
          navigate("/localmap");
        } else {
          // console.error("로그인 실패:", response);
          alert("로그인에 실패했습니다.");
        }
      } catch (error) {
        // console.error("로그인 요청 중 에러 발생:", error);
        alert("로그인 요청 중 에러가 발생했습니다.");
      }
    };

    kakaoLogin();
  }, [KAKAO_CODE, navigate]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Auth;
