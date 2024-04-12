import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";

import "./Modi_profile.css";

const Modi_profile = (props) => {
  const [nickname, setNickname] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [onelineIntro, setOnelineIntro] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [password, setPassword] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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
      <Helmet>
        <title>exported project</title>
      </Helmet>
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
          <div className="group95-frame5">
            <span className="group95-text20">
              <span>중복확인</span>
            </span>
          </div>
          <div className="group95-frame6">
            <span className="group95-text22">
              <span>
                ・ 최소 8자 이상, 대문자, 소문자, 숫자 및 기호의 혼합 포함
              </span>
            </span>
            <span className="group95-text24">
              <span>・ 기호(예: !”$%^*&amp;)</span>
            </span>
            <span className="group95-text26">
              <span>・ 대문자(A~Z), 소문자(a~z)</span>
            </span>
          </div>

          {/* <span className="group95-text32">
            <span>동의</span>
          </span>
          <span className="group95-text34">
            <span>미동의</span>
          </span> */}
        </form>
        <div className="group95-frame7">
          <span className="group95-text28">
            <span>수정하기</span>
          </span>
        </div>
        <div className="group95-frame8">
          <span className="group95-text30">
            <span>닫기</span>
          </span>
        </div>

        {/* <div className="group95-checked-circle">
          <img
            src="/external/image9512-2mgi-200h.png"
            alt="IMAGE9512"
            className="group95-image3"
          />
          <img
            src="/external/image9512-ozr-200h.png"
            alt="IMAGE9512"
            className="group95-image4"
          />
        </div>
        <img
          src="/external/uncheckedcircle9512-ds9c-200h.png"
          alt="UncheckedCircle9512"
          className="group95-unchecked-circle"
        /> */}
      </div>
    </div>
  );
};

export default Modi_profile;
