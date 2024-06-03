import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../assets/scss/layout/_modi_profile.scss";
import axios from "axios";

const Modi_profile = (props) => {
  const [nickname, setNickname] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [onelineIntro, setOnelineIntro] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [password, setPassword] = useState(""); // 초기값을 빈 문자열로 설정합니다.
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [profileImg, setProfileImg] = useState("기본 프로필 이미지 URL");
  const fileInputRef = useRef();
  const [profileData, setProfileData] = useState({
    userNickname: "",
    introduce: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const Server_IP = process.env.REACT_APP_Server_IP;
      try {
        const response = await axios.get(
          `${Server_IP}/member-service/profile/${localStorage.getItem(
            "userNickname"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const profile = response.data.result;
        console.log(profile);
        setProfileData(profile);
        setNickname(profile.nickname);
        setOnelineIntro(profile.introduce);
        setProfileImg(profile.profileImageUrl);
      } catch (error) {
        console.error("프로필 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchProfile();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const Server_IP = process.env.REACT_APP_Server_IP;
  //   const token = localStorage.getItem("accessToken");

  //   const updateData = {
  //     nickname,
  //     // introduce,
  //   };
  // };

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

          <form>
            <div className="nickname-edit">
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="edit-value"
                // value={nickname}
                onChange={handleChange}
                placeholder={"닉네임을 입력하세요."}
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
                placeholder={"한줄소개를 입력하세요."}
              ></input>
              <span className="edit-element">
                <span>한줄소개 변경</span>
              </span>
            </div>
          </form>
        </div>
        <span>
          <button className="btn-edit">수정하기</button>{" "}
        </span>
      </div>
    </div>
  );
};

export default Modi_profile;
