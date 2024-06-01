import React, { useState } from "react";
import "../assets/scss/layout/_findidpw.scss";

const FindEmailComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailFound, setEmailFound] = useState(false);

  const handleSendVerificationCode = () => {
    const fakeVerificationCode = Math.floor(1000 + Math.random() * 9000);
    alert(`인증번호: ${fakeVerificationCode}`);
  };

  const handleVerifyCode = () => {
    const correctCode = "1234";
    if (verificationCode === correctCode) {
      setEmailFound(true);
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleEmailFind = () => {
    const fakeEmail = "example@example.com";
    alert(`회원님의 이메일: ${fakeEmail}`);
  };

  return (
    <div>
      <div className="top-wrapper">
        <input
          className="find-password-input"
          type="text"
          placeholder="휴대폰 번호 입력"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="btn-send" onClick={handleSendVerificationCode}>
          인증번호 전송
        </button>
        <br />
      </div>
      <div className="top-wrapper">
        <input
          className="find-password-input"
          type="text"
          placeholder="인증번호 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className="btn-send" onClick={handleVerifyCode}>
          확인
        </button>
      </div>

      {emailFound ? (
        <div>
          회원님의 이메일은 이미 찾았습니다. <br />
          <button onClick={handleEmailFind}>이메일 찾기</button>
        </div>
      ) : null}
      <div className="btn-wrapper">
        <button className="btn-final">이메일 찾기</button>
      </div>
    </div>
  );
};

const FindPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordFound, setPasswordFound] = useState(false);

  const handleSendVerificationCode = () => {
    const fakeVerificationCode = Math.floor(1000 + Math.random() * 9000);
    alert(`인증번호: ${fakeVerificationCode}`);
  };

  const handleVerifyCode = () => {
    const correctCode = "1234";
    if (verificationCode === correctCode) {
      setPasswordFound(true);
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handlePasswordFind = () => {
    const tempPassword = "password123";
    alert(`임시 비밀번호: ${tempPassword}`);
  };

  return (
    <div>
      <div className="top-wrapper">
        <input
          className="find-password-input"
          type="text"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSendVerificationCode} className="btn-send">
          인증번호 전송
        </button>
      </div>
      <div className="top-wrapper">
        <input
          className="find-password-input"
          type="text"
          placeholder="인증번호 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className="btn-send" onClick={handleVerifyCode}>
          확인
        </button>
      </div>
      {passwordFound ? (
        <div>
          비밀번호를 재설정할 수 있습니다. <br />
          <button onClick={handlePasswordFind}>비밀번호 찾기</button>
        </div>
      ) : null}
      <div className="btn-wrapper">
        <button className="btn-final">비밀번호 찾기</button>
      </div>
    </div>
  );
};

const FindIDPW = () => {
  const [showEmailFinder, setShowEmailFinder] = useState(true);

  return (
    <div className="findIDPW">
      <div className="nav-findIDPW">
        <button
          className={`btn-findEmail ${showEmailFinder ? "active" : ""}`}
          onClick={() => setShowEmailFinder(true)}
        >
          이메일 찾기
        </button>
        <button
          className={`btn-findPW ${!showEmailFinder ? "active" : ""}`}
          onClick={() => setShowEmailFinder(false)}
        >
          비밀번호 찾기
        </button>
      </div>
      <hr className="horizontal-line" />
      {showEmailFinder ? <FindEmailComponent /> : <FindPasswordComponent />}
    </div>
  );
};

export default FindIDPW;
