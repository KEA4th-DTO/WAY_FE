import React, { useState, useEffect } from "react";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import UserMapinfo from "../components/main/UserMapinfo";
import back from "../assets/images/logos/back.png";
import HistoryPost from "../components/main/HistoryPost";
import DailyPost from "../components/main/DailyPost";

const Mymap = () => {
  //데이터 가져오기
  const [userPost, setUserPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 추가: 선택된 게시글 상태
  const token = localStorage.getItem("accessToken");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      
      fetch(`http://61.109.239.42:50005/post-service/posts/list/${userEmail}`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
      })
      .then(data => {
        if (data.isSuccess) {
          setUserPost(data.result.postResultDtoList);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
    }
  }, [userEmail, token]);

  console.log(userPost);

   // 포스트 클릭 시 선택된 포스트 업데이트
   const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  // 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    setSelectedPost(null); // 선택된 포스트 초기화
  };

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">
            마이맵
          </span>
          <UserMapinfo userEmail={userEmail} />
        </div>
      </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글  {userPost.length}개
          </span>
      
          <button style={{display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none"}} className="dailypost-frame8" onClick={handleBackClick}>
          {selectedPost && selectedPost.postType === 'DAILY' &&
          <img
            alt="뒤로가기"
            src={back}
            className="dailypost-vector3"
          />}
        </button>
        <div style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {selectedPost && selectedPost.postType === 'DAILY' && <DailyPost postId={selectedPost.postId} />}
        </div>
        <div id="list" style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "none" : "block", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {userPost.map(item => (
            <button style={{border:"none"}} key={item.postId} onClick={() => handlePostClick(item)}>
              {item.postType === 'DAILY' ? <DailyList data={item} /> : <HistoryList data={item} />}
            </button>
          ))}
        </div>
      </div>
      {selectedPost && selectedPost.postType === 'HISTORY' && (
        <div className="historyPost-con">
          <HistoryPost data={selectedPost} onClose={handleBackClick} />
        </div>
      )}
    </div>
  );
};
export default Mymap;


