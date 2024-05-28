import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // react-router-dom의 useLocation 훅 사용

const Auth = () => {
  const location = useLocation(); // 현재 URL 정보 가져오기
  useEffect(() => {
    // URLSearchParams를 사용하여 code 값을 추출
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");

    if (code) {
      const Server_IP = process.env.REACT_APP_Server_IP;
      const url = `${Server_IP}/oauth/kakao/callback`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
        }),
      })
        .then((response) => {
          const result = response.result;
          console.log(response);
          if (response.status === 200 && result.isSuccess) {
            localStorage.setItem("grantType", result.grantType);
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
          } else {
            // 로그인 실패 시 처리
            alert("실패");
          }
        })
        .catch((error) => {
          // 에러 처리
        });
    }
  }, [location.search]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Auth;
