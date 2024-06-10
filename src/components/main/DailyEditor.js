import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/layout/_upload.scss";
import UploadMap from "./UploadMap";
import { addHours } from "../../utils/changeFormat";

const DailyEditor = () => {
  // const [memberId] = useState('id_222');
  //props로 받아오기

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [current, setCurrent] = useState(new Date().toISOString());
  const [expired, setExpired] = useState(""); // 만료 시간   //포맷: 2024-05-20T08:58:40.848Z
  // 로컬 시간으로 생성 시간 설정
  const [createdAt, setCreatedAt] = useState(addHours(current)); // 생성 시간
  const [expiredAt, setExpiredAt] = useState(""); // 만료 시간   //포맷: 2024-05-20T08:58:40.848Z
  const [address, setAddress] = useState("");
  const [hour, setHour] = useState("1"); // 시간
  const [minute, setMinute] = useState("00"); // 분

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [latitude, setLatitude] = useState(""); // [위도, 경도
  const [longitude, setLongitude] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // 추가된 상태 변수

  const navigate = useNavigate();
  const { naver } = window;

  const token = localStorage.getItem("accessToken");
  const Server_IP = process.env.REACT_APP_Server_IP;

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 한 번 실행
    const interval = setInterval(() => {
      // 매 초마다 현재 시간을 업데이트
      setCurrent(new Date().toISOString());
      setCreatedAt(addHours(current));
    }, 1000);

    // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 메모리 누수를 방지
    return () => clearInterval(interval);
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

  const onSave = async () => {
    try {
      if (!image) {
        alert("이미지를 선택해주세요.");
        return;
      }

      if (title.trim() === '' || isSubmitting) {
        return;
      }
      setIsSubmitting(true);  // 제출 시작

      const formData = new FormData();
      formData.append("image", image); // Add the image file
      formData.append(
        "createDailyDto",
        new Blob(
          [
            JSON.stringify({
              title,
              body,
              expiredAt,
              address,
              latitude,
              longitude,
            }),
          ],
          { type: "application/json" }
        )
      );

      const url = `${Server_IP}/post-service/daily`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' // REMOVE this line
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("저장되었습니다.");
        // 페이지 이동
        navigate("/uptomy", { state: data });
        console.log("Success:", data);
      } else {
        console.error("Error:", data);
        alert("저장에 실패했습니다.");
      }
      setIsSubmitting(false);  // 제출 완료

    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);  // 제출 완료
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  console.log("생성: ", createdAt);
  console.log("만료: ", expiredAt);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const formattedTime = new Date(current).toLocaleString("ko-KR");
  const formattedTime2 = new Date(expired).toLocaleString("ko-KR");

  const calculateExpiredAt = () => {
    const createdAtDate = new Date(current);
    createdAtDate.setHours(createdAtDate.getHours() + Number(hour));
    createdAtDate.setMinutes(createdAtDate.getMinutes() + Number(minute));
    setExpired(createdAtDate.toISOString());
    setExpiredAt(addHours(createdAtDate.toISOString()));
  };

  const clickMap = () => {
    setShowMap(!showMap);
  };

  const handlePostPositionChange = (position) => {
    setLatitude(position.lat());
    setLongitude(position.lng());
    naver.maps.Service.reverseGeocode(
      {
        location: new naver.maps.LatLng(position.lat(), position.lng()),
      },
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          return alert("Something Wrong!");
        }

        const result = response.result;
        setAddress(result.items[0].address);
      }
    );
  };

  return (
    <div className="edit_wrap" style={{ position: "relative" }}>
      <div>
        <h2>
          제목:
          <input
            style={{ marginLeft: "10px", border: "none", width: "400px" }}
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={onChangeTitle}
          />
        </h2>
        <span>
          주소:
          <input
            style={{ marginLeft: "10px", border: "none", width: "400px" }}
            type="text"
            placeholder="지도로 주소를 설정해주세요."
            value={address}
            readOnly
          />
          <br />
          <button onClick={clickMap}>{showMap ? "완료" : "지도 보기"}</button>
          {showMap && (
            <div>
              <UploadMap setPostPosition={handlePostPositionChange} />
            </div>
          )}
        </span>

        <div style={{ marginTop: "5px" }}>
          <br />
          현재 시간: {formattedTime}
        </div>
        <div style={{ marginTop: "5px", position: "relative" }}>
          유효 시간:
          <select
            style={{ marginLeft: "5px" }}
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          >
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
          시
          <select
            style={{ marginLeft: "5px" }}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          >
            {[...Array(6)].map((_, i) => (
              <option key={i * 10} value={i * 10}>
                {String(i * 10).padStart(2, "0")}
              </option>
            ))}
          </select>
          분
          <button style={{ marginLeft: "10px" }} onClick={calculateExpiredAt}>
            적용
          </button>
          <div style={{ marginTop: "5px" }}>
            만료 시간: {expiredAt && formattedTime2}
          </div>
        </div>
        <br />
        <br />
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="이미지 미리보기"
            style={{ marginTop: "10px", maxWidth: "100%", height: "auto" }}
          />
        )}
        <br />
        <br />
        <textarea
          placeholder="내용을 입력하세요."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ marginTop: "10px", width: "100%", height: "200px" }}
        />
      </div>
      <br />
      <button className="save" onClick={onSave} disabled={isSubmitting}>
      {isSubmitting ? '저장 중' : '저장'}
      </button>
    </div>
  );
};

export default DailyEditor;
