import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";
import "../assets/scss/layout/_localmap.scss";
import back from "../assets/images/logos/back.png";

const Localmap = () => {
  const [post, setPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentMyLocation, setCurrentMyLocation] = useState(null);
  const [bounds, setBounds] = useState({
    ne: { lat: 0, lng: 0 },
    sw: { lat: 0, lng: 0 }
  });
  const token = localStorage.getItem("accessToken");

  // 현재 위치 가져오기
  useEffect(() => {
    const success = (location) => {
      setCurrentMyLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    };
    const error = () => {
      setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  // 현재 위치를 기반으로 경계 계산
  useEffect(() => {
    if (currentMyLocation) {
      const ne_bound = {
        lat: currentMyLocation.lat + 0.0408919,
        lng: currentMyLocation.lng + 0.0514984
      };
      const sw_bound = {
        lat: currentMyLocation.lat - 0.0408696,
        lng: currentMyLocation.lng - 0.0514984
      };
      setBounds({
        ne: ne_bound,
        sw: sw_bound
      });
    }
  }, [currentMyLocation]);

  // 경계를 기반으로 게시글 데이터 가져오기
  useEffect(() => {
    if (bounds.ne.lat && bounds.sw.lat) {
      const { ne, sw } = bounds;
      const url = `http://210.109.55.124/post-service/posts/list/range?latitude1=${sw.lat}&longitude1=${sw.lng}&latitude2=${ne.lat}&longitude2=${ne.lng}`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok " + res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          if (data.isSuccess) {
            setPost(data.result.postResultDtoList); // API 응답 형식에 맞게 데이터 설정
          } else {
            console.error("Error in API response:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching pin data:", error));
    }
  }, [bounds, token]);

  // 게시글 클릭 처리
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  // 뒤로가기 버튼 클릭 처리
  const handleBackClick = () => {
    setSelectedPost(null);
  };

  return (
    <div id="local-con" style={{ border: "5px solid red", display: "flex", width: "950px" }}>
      {/* 지도 및 핀 */}
      <div id="map-con" style={{ border: "3px solid blue" }}>
        <div>
          <span className="initial-main-page-text">로컬맵</span>
          <MapInformation />
        </div>
      </div>

      {/* 게시글 */}
      <div className="initial-main-page-frame" style={{ border: "3px solid green", marginLeft: "20px" }}>
        <span className="initial-main-page-text">게시글</span>
        <button
          style={{ display: selectedPost && selectedPost.postType === "DAILY" ? "block" : "none" }}
          className="dailypost-frame8"
          onClick={handleBackClick}
        >
          {selectedPost && selectedPost.postType === "DAILY" && (
            <img alt="뒤로가기" src={back} className="dailypost-vector3" />
          )}
        </button>
        <div
          style={{
            display: selectedPost && selectedPost.postType === "DAILY" ? "block" : "none",
            border: "3px solid yellow",
            overflow: "auto",
            marginTop: "10%",
            width: "410px",
            height: "640px"
          }}
        >
          {selectedPost && selectedPost.postType === "DAILY" && (
            <DailyPost
              postId={selectedPost.postId}
              writerNickname={selectedPost.writerNickname}
              writerProfileImageUrl={selectedPost.writerProfileImageUrl}
            />
          )}
        </div>
        <div
          id="list"
          style={{
            display: selectedPost && selectedPost.postType === "DAILY" ? "none" : "block",
            border: "3px solid yellow",
            overflow: "auto",
            marginTop: "10%",
            width: "410px",
            height: "640px"
          }}
        >
          {post && post.length > 0 ? (
            post.map((item) => (
              <button style={{ border: "none" }} key={item.postId} onClick={() => handlePostClick(item)}>
                {item.postType === "DAILY" ? <DailyList data={item} /> : <HistoryList data={item} />}
              </button>
            ))
          ) : (
            <div>No posts available</div>
          )}
        </div>
      </div>
      {selectedPost && selectedPost.postType === "HISTORY" && (
        <div className="historyPost-con">
          <HistoryPost
            postId={selectedPost.postId}
            writerNickname={selectedPost.writerNickname}
            writerProfileImageUrl={selectedPost.writerProfileImageUrl}
            onClose={handleBackClick}
          />
        </div>
      )}
    </div>
  );
};

export default Localmap;
