import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { SHA256 } from "crypto-js";
import "../assets/style/_signup.scss";
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
  const Server_IP = process.env.REACT_APP_Server_IP;

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = e.target.value
      .replace(/[^\d]/g, "") // Remove any non-digit characters
      .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"); // Apply the desired format (010-0000-0000)

    setPhone(formattedPhoneNumber);
  };

  const handleSignUp = () => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const url = `${Server_IP}/auth-service/signup`;
    const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
    const encryptedPassword = SHA256(password, secretKey).toString();
    // 회원가입 정보 객체 생성
    const signUpData = {
      name: name,
      email: email,
      password: encryptedPassword,
      passwordCheck: encryptedPassword,
      nickname: nickname,
      phoneNumber: phone,
    };

    console.log(signUpData);
    axios
      .post(url, signUpData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          console.log(response.status);
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log("회원가입이 완료되었습니다.", data);
        window.location.href = `${Server_IP}/login`;
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        // 에러 발생 시 처리
      });
  };

  const handleNicknameCheck = () => {
    const url = `${Server_IP}/auth-service/check-nickname`;
    const data = {
      nickname: nickname,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 응답 데이터를 JSON 형식으로 파싱
      })
      .then((data) => {
        console.log(data);
        if (data.isSuccess === true) {
          alert("사용가능한 닉네임입니다");
          setNicknameCheck(true);
        } else {
          alert("사용불가능한 닉네임입니다", data);
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        // 에러 발생 시 처리
      });
    console.log("Email checked!");
  };

  const handleEmailCheck = () => {
    const url = `${Server_IP}/auth-service/check-email`;
    const data = {
      email: email,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // 응답 데이터를 JSON 형식으로 파싱
      })
      .then((data) => {
        if (data.isSuccess === true) {
          alert("사용가능한 이메일입니다");
          setEmailCheck(true);
        } else {
          alert("사용불가능한 이메일입니다", data);
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        // 에러 발생 시 처리
      });
    console.log("Email checked!");
    setEmailCheck(true);
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
              onChange={handlePhoneChange}
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
          </div>
          <div className="agree">
            <label>
              <span>개인정보 동의</span>
              <input
                type="checkbox"
                className="check-agree"
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
