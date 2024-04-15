import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "../assets/style/signup.css";

const SignUpForm = () => {
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
      email: email,
      password: password,
      phone: phone,
      name: name,
      birthdate: birthdate,
      nickname: nickname,
      agreement: agreement,
    };

    const secretKey = "mySecretKey";

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(signUpData),
      secretKey
    ).toString();

    // fetch를 사용하여 서버로 POST 요청을 보냅니다.
    fetch("http://example.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("회원가입이 완료되었습니다.", data);
        // 회원가입 성공 후 추가적인 처리를 할 수 있습니다.
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        // 에러 발생 시 처리
      });
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
        <div className="email">
          <label>이메일</label>
          <input
            type="email"
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
            className="passwordInput"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div className="re-pwd">
          <label>비밀번호 재확인</label>
          <input
            type="password"
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
            <span className="agree">개인정보 동의</span>
            <input
              type="checkbox"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
            />
          </label>
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

export default SignUpForm;
