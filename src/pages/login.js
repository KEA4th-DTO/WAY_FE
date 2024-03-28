import React, { useState } from "react";
import "../css/App.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 여기서 로그인 로직을 처리하거나 API 호출 등을 수행할 수 있습니다.
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
  };

  return (
    <div className="main">
      {/* 로고 들어갈 자리 */}
      <div className="logo"></div>
      {/* 로그인 폼 들어갈 자리 */}
      <div className="login"></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email"></label>
          <input
            type="email"
            placehoder="이메일"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            로그인 정보 저장
          </label>
        </div>
        <button type="submit">로그인</button>
        <div>
          <button>카카오 로그인</button>
          <button>구글 로그인</button>
        </div>
        <div>
          <button>이메일/비밀번호 찾기</button>
          <button>회원가입</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
