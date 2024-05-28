import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../../assets/scss/layout/_modi_profile.scss";

const Modi_profile = (props) => {
  const [nickname, setNickname] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [onelineIntro, setOnelineIntro] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [password, setPassword] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [profileImg, setProfileImg] = useState("기본 프로필 이미지 URL");
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "nickname":
        setNickname(value);
        break;
      case "onelineIntro":
        setOnelineIntro(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "passwordConfirmation":
        setPasswordConfirmation(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="Modi-profile-container">
      <div className="left-side">
        <div className="profile-card">
          <img src={profileImg} alt="프로필 이미지" className="profile-image" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-text" onClick={triggerFileInput}>
          프로필 이미지 수정
        </div>
      </div>
      <div className="right-side">
        <div className="Modi-profile">
          <div className="title-div">
            <span className="title-text">
              <span>프로필 수정</span>
            </span>
          </div>

          <form action="/profile-edit" method="post">
            <div className="nickname-edit">
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="edit-value"
                value={nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요."
              ></input>
              <span className="edit-element">
                <span>닉네임 변경</span>
              </span>
              <Button className="duplicate-btn" variant="outline-secondary">
                중복 확인
              </Button>{" "}
            </div>
            <div className="one-line-edit">
              <input
                id="onelineIntro"
                name="onelineIntro"
                type="text"
                className="edit-value"
                value={onelineIntro}
                onChange={handleChange}
                placeholder="한줄소개를 입력하세요."
              ></input>
              <span className="edit-element">
                <span>한줄소개 변경</span>
              </span>
            </div>
            <div className="password-edit">
              <input
                id="password"
                name="password"
                type="password"
                className="edit-value"
                value={password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요."
              ></input>
              <span className="edit-element">
                <span>비밀번호 변경</span>
              </span>
            </div>
            <div className="passwordConfirmation">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                className="edit-value"
                value={passwordConfirmation}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요."
              ></input>
              <span className="edit-element">
                <span>비밀번호 확인</span>
              </span>
            </div>
            <div className="agreement">
              <div className="agreement-check">
                <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                />
              </div>

              <span className="edit-element">
                <span>마케팅 수신동의</span>
              </span>
            </div>
            <div className="password-conditions">
              <span className="password-conditions1">
                <span>
                  ・ 최소 8자 이상, 대문자, 소문자, 숫자 및 기호의 혼합 포함
                </span>
              </span>
              <span className="password-conditions2">
                <span>・ 기호(예: !”$%^*&amp;)</span>
              </span>
              <span className="password-conditions3">
                <span>・ 대문자(A~Z), 소문자(a~z)</span>
              </span>
            </div>
          </form>
          <div className="edit-div">
            <span>
              <Button size="lg" variant="primary">
                수정하기
              </Button>{" "}
            </span>
          </div>
          <div className="close-div">
            <span>
              <Button size="lg" variant="danger">
                닫기
              </Button>{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modi_profile;
