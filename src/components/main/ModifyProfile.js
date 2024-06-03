import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../assets/scss/layout/_modi_profile.scss";
import axios from "axios";

const ModifyProfile = ({ onProfileUpdate }) => {
  const [nickname, setNickname] = useState("");
  const [onelineIntro, setOnelineIntro] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [profileImg, setProfileImg] = useState("기본 프로필 이미지 URL");
  const [selectedFile, setSelectedFile] = useState(null); // Track the selected file
  const fileInputRef = useRef();
  const [profileData, setProfileData] = useState({
    userNickname: "",
    introduce: "",
    profileImageUrl: "",
  });

  const validateNickname = (nickname) => {
    const regex = /^[a-zA-Z]{5,}$/;
    if (!regex.test(nickname)) {
      setNicknameError(
        "닉네임은 영어로만 구성되어야 하며 최소 5글자 이상이어야 합니다."
      );
      return false;
    } else {
      setNicknameError("");
      return true;
    }
  };

  const handleNicknameCheck = () => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    if (!validateNickname(nickname)) {
      alert("닉네임은 영어로만 구성되어야 하며 최소 5글자 이상이어야 합니다.");
      return;
    }
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(URL.createObjectURL(e.target.files[0]));
      setSelectedFile(e.target.files[0]); // Save the selected file
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const Server_IP = process.env.REACT_APP_Server_IP;

    const formData = new FormData();
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    const updateProfileRequestDTO = {
      nickname,
      introduce: onelineIntro,
    };
    formData.append(
      "updateProfileRequestDTO",
      new Blob([JSON.stringify(updateProfileRequestDTO)], {
        type: "application/json",
      })
    );

    try {
      const response = await axios.post(
        `${Server_IP}/member-service/profile/${localStorage.getItem(
          "userNickname"
        )}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile updated successfully:", response.data);
      localStorage.setItem("userNickname", nickname);
      alert("프로필 수정에 성공했습니다");
      onProfileUpdate(); // Call the function to close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="Modi-profile-container">
      <Form onSubmit={handleSubmit}>
        <div className="profile-content">
          <div className="profile-img-container" onClick={triggerFileInput}>
            <img src={profileImg} alt="프로필 이미지" className="profile-img" />
            <div className="profile-img-overlay">프로필사진 수정하기</div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
          <div className="profile-details">
            <Form.Group controlId="formNickname">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="닉네임을 입력하세요"
                name="nickname"
                value={nickname}
                onChange={handleChange}
              />
              <Button
                variant="secondary"
                className="duplicate-check-btn"
                onClick={handleNicknameCheck}
              >
                중복확인
              </Button>
            </Form.Group>
            <Form.Group controlId="formOnelineIntro">
              <Form.Label>상태메시지</Form.Label>
              <Form.Control
                type="text"
                placeholder="상태메시지를 입력하세요"
                name="onelineIntro"
                value={onelineIntro}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>
        <Button type="submit" variant="primary" className="modify-btn">
          수정하기
        </Button>
      </Form>
    </div>
  );
};

export default ModifyProfile;
