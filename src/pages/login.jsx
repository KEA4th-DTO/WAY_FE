import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../assets/style/login.css";
import kakaoImg from "../assets/img/kakao.png";
import googleImg from "../assets/img/google_login.png";

function Login() {
  const navigate = useNavigate();

  const [isEmailClicked, setisEmailClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordClicked, setisPasswordClicked] = useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  function kakaoLoginHandler() {
    console.log("카카오 로그인");
    const Rest_api_key = "	a636a1c4c0b845384ca75dd034081a1b";
    const redirect_uri = "http://localhost:3000/auth";

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    window.open(kakaoURL, "Kakao Login", "width=600,height=600");

    // 카카오 로그인 후에도 로컬맵 페이지로 이동합니다.
    navigate('/localmap');
  }

  

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = "서버url";

    const data = {
      email: email,
      password: password,
      rememberMe: rememberMe,
    };

    // TODO: 서버로 데이터 전송

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("서버 응답 데이터", responseData);

        // 로그인이 성공하면 로컬맵 페이지로 리다이렉션합니다.
        navigate('/localmap');

      } else {
        console.error("서버 응답 오류: ", response.status);
      }
    } catch (error) {
      console.error("서버 통신 오류: ", error);
    }

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
  };

  return (
    <div id="login">
      <div className="main">
        {/* 왼쪽 패널 */}
        <div className="left-panel" style={{ width: "60%", float: "left" }}>
          {/* 로고 들어갈 자리 */}
          <div className="logo"></div>
        </div>
        {/* 오른쪽 패널 */}
        <div className="right-panel" style={{ width: "40%", float: "left" }}>
          {/* 상단 */}
          <div className="top-section" style={{ height: "20%" }}>
            {/* 빈 공간 */}
          </div>

          {/* 중간 */}
          <div className="middle-section" style={{ height: "60%" }}>
            {/* 로그인 폼 */}
            <div className="login">로그인</div>
            <form onSubmit={handleSubmit}>
              <div className="form">
                <label htmlFor="email"></label>
                <input
                  //클릭이 됐을 때
                  onFocus={() => {
                    setisEmailClicked(true);
                  }}
                  // 다른데 클릭
                  onBlur={() => {
                    setisEmailClicked(false);
                  }}
                  type="email"
                  placeholder={isEmailClicked === true ? "" : "이메일"}
                  id="email"
                  className="email-input"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password"></label>
                <input
                  onFocus={() => {
                    setisPasswordClicked(true);
                  }}
                  onBlur={() => {
                    setisPasswordClicked(false);
                  }}
                  type="password"
                  id="password"
                  className="password-input"
                  placeholder={isPasswordClicked === true ? "" : "비밀번호"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="login-info-container">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                </label>
                <span className="login-info">로그인 정보 저장</span>
              </div>
              <button className="login-btn" type="submit">
                로그인
              </button>
            </form>
          </div>

          {/* 하단 */}
          <div className="bottom-section" style={{ height: "20%" }}>
            <div className="main-bottom">
              <button className="kakao-btn" onClick={kakaoLoginHandler}>
                <img
                  className="kakaoImg"
                  src={kakaoImg}
                  alt="이미지"
                  width="20px"
                  height="auto"
                />
                <span>카카오 로그인</span>
              </button>
            </div>
            <div>
              <button className="google-btn">
                <img
                  className="googleImg"
                  src={googleImg}
                  width="20px"
                  height="auto"
                  alt="구글이미지"
                />
                구글 로그인
              </button>
            </div>
          </div>
          <div>
            <button className="find-btn">E-mal/PW 찾기</button>
            <Link to="/signup">
              <button className="signUp-btn">회원가입</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
