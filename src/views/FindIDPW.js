import React, { useState } from "react";
import "../assets/scss/layout/_findidpw.scss";

const FindEmailComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailFound, setEmailFound] = useState(false);

  const handleSendVerificationCode = () => {
    // 휴대폰 번호를 이용하여 인증번호를 전송하는 로직을 구현
    // 여기서는 간단히 alert를 통해 가짜 인증번호를 표시
    const fakeVerificationCode = Math.floor(1000 + Math.random() * 9000);
    alert(`인증번호: ${fakeVerificationCode}`);
  };

  const handleVerifyCode = () => {
    // 사용자가 입력한 인증번호를 검증하는 로직을 구현
    // 여기서는 간단히 미리 정의된 가짜 인증번호와 비교하여 인증 성공 여부를 결정
    const correctCode = "1234"; // 가짜 인증번호
    if (verificationCode === correctCode) {
      // 인증 성공 시 이메일을 찾았다고 표시
      setEmailFound(true);
    } else {
      // 인증 실패 시 메시지 표시
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleEmailFind = () => {
    // 이메일을 찾는 로직을 구현
    // 여기서는 간단히 alert로 이메일을 표시
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
    // 이메일로 인증번호를 전송하는 로직을 구현
    // 여기서는 간단히 alert를 통해 가짜 인증번호를 표시
    const fakeVerificationCode = Math.floor(1000 + Math.random() * 9000);
    alert(`인증번호: ${fakeVerificationCode}`);
  };

  const handleVerifyCode = () => {
    // 사용자가 입력한 인증번호를 검증하는 로직을 구현
    // 여기서는 간단히 미리 정의된 가짜 인증번호와 비교하여 인증 성공 여부를 결정
    const correctCode = "1234"; // 가짜 인증번호
    if (verificationCode === correctCode) {
      // 인증 성공 시 비밀번호를 찾았다고 표시
      setPasswordFound(true);
    } else {
      // 인증 실패 시 메시지 표시
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handlePasswordFind = () => {
    // 비밀번호를 찾는 로직을 구현
    // 여기서는 간단히 alert로 임시 비밀번호를 표시
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
          className="btn-findEmail"
          onClick={() => setShowEmailFinder(true)}
        >
          이메일 찾기
        </button>
        <button
          className="btn-findPW"
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
