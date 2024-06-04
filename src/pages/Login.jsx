import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../assets/style/_login.scss";
import CryptoJS from "crypto-js";
import { SHA256 } from "crypto-js";
import kakaoImg from "../assets/img/kakao.png";
import googleImg from "../assets/img/google_login.png";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";

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
  // const { setUser } = useUserContext();

  function kakaoLoginHandler() {
    const Rest_api_key = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const redirect_uri = "http://localhost:3000/auth";

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    const popup = window.open(kakaoURL, "Kakao Login", "width=600,height=600");

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        // 팝업이 닫힌 후 추가적인 작업을 여기서 수행할 수 있습니다.
      }
    }, 500);

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, data } = event.data;

      if (type === "kakaoLogin") {
        clearInterval(checkPopupClosed);
        window.location.href = "/localmap";
      }
    });
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
    const encryptedPassword = SHA256(password, secretKey).toString();
    event.preventDefault();
    const url = `${Server_IP}/auth-service/login`;
    const data = {
      email: email,
      password: encryptedPassword,
    };

    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const responseData = response.data;
          if (responseData.isSuccess) {
            const { grantType, accessToken, refreshToken } =
              responseData.result.jwtToken;
            const { name, email, nickname } = responseData.result;
            localStorage.setItem("grantType", grantType);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userNickname", nickname);
            axios.defaults.headers.common[
              "Authorization"
            ] = `${grantType} ${accessToken}`;
            console.log(data);
            navigate("/localmap");
          } else {
            alert("아이디나 비밀번호를 확인해주세요");
          }
        } else {
          console.error("서버 응답 오류: ", response.status);
        }
      })
      .catch((error) => {
        console.error("서버 통신 오류: ", error);
      });
    console.log(data);
    // console.log("Remember Me:", rememberMe); // 만약 사용한다면
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
          <div className="button-container">
            <Link to="/findidpw">
              <button className="find-btn">E-mail/PW 찾기</button>
            </Link>
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
