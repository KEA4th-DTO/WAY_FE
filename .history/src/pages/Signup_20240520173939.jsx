import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "../assets/style/signup.css";
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [encryptedData, setEncryptedData] = useState("");

  const handleSignUp = () => {
    // 회원가입 정보 객체 생성
    const signUpData = {
      name: name,
      email: email,
      password: password,
      passwordCheck: confirmPassword,
      phone: phone,
      nickname: nickname,
      agreement: agreement,
    };
    // const secretKey = CryptoJS.lib.WordArray.random(32).toString();
    // const encryptedData = CryptoJS.AES.encrypt(
    //   JSON.stringify(signUpData),
    //   secretKey
    // ).toString();

    console.log(signUpData);

    if (!email || !password || !confirmPassword || !name || !nickname || !phone || !agreement) {
      console.error("All fields are required.");
      return;
    }
  
    if (password !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "http://61.109.239.63:50001/member-service/signup",
        signUpData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("회원가입이 완료되었습니다.", response.data);
        window.location.href = "http://localhost:3000/#/login";
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Error request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const handleEmailCheck = () => {
    // 이메일 중복 확인 처리 로직을 추가합니다.
    console.log("Email checked!");
    setEmailCheck(true); // 예시에서는 무조건 true로 설정합니다.
  };

  const handleNicknameCheck = () => {
    // 닉네임 중복 확인 처리 로직을 추가합니다.
    console.log("Nickname checked!");
    setNicknameCheck(true); // 예시에서는 무조건 true로 설정합니다.
  };

  return (
    <div id="signup">
      <div className="parent-container">
        <div className="signup">
          <h2>회원가입</h2>
        </div>
        <div className="signup-info">
          <p>필수입력사항</p>
        </div>
        <div className="horizontal-divider"></div>
        <div className="signup-contatiner">
          <div className="email">
            <label>이메일</label>
            <input
              type="email"
              className="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
            <button className="btn-duplicate" onClick={handleEmailCheck}>
              중복확인
            </button>
            {emailCheck && <p>이메일을 사용할 수 있습니다.</p>}
          </div>
          <div id="signup-pwd" className="password">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <div className="re-pwd">
            <label>비밀번호 재확인</label>
            <input
              type="password"
              className="signup-repassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>
          <div className="phoneNum">
            <label>핸드폰 번호</label>
            <input
              type="tel"
              className="signup-phoneNum"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              required
            />
          </div>
          <div className="name">
            <label>이름</label>
            <input
              type="text"
              value={name}
              className="signup-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="nickName">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              className="signup-nickname"
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
            />
            <button onClick={handleNicknameCheck} className="btn-duplicate">
              중복확인
            </button>

            {nicknameCheck && <p>사용할 수 있는 닉네임입니다.</p>}
          </div>
          <div className="agree">
            <label>
              <span>개인정보 동의</span>
              <input
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <div className="signup-panel">
          <button className="btn-signup" onClick={handleSignUp}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
