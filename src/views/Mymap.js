import React, { useState, useEffect } from "react";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import UserMapinfo from "../components/main/UserMapinfo";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";
import back from "../assets/images/logos/back.png";

const Mymap = () => {
  //데이터 가져오기
  const [userPost, setUserPost] = useState([]);
  const userId = "id_222"; //임시로 아이디 지정
  const [selectedPost, setSelectedPost] = useState(null); // 추가: 선택된 게시글 상태

  useEffect(()=>{
      fetch('http://localhost:3001/post') //API경로 적어주기
      .then(res => {
          return res.json() //json으로 변환됨
      })
      .then(data => {
          // memberId가 userId와 일치하는 경우에만 해당 게시물을 저장
          const userPosts = data.filter(post => post.memberId === userId);
          setUserPost(userPosts);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  // 포스트 클릭 시 선택된 포스트 업데이트
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  // 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    setSelectedPost(null); // 선택된 포스트 초기화
  };

  return ( 
    <div id="local-con" style={{ display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      <div id="map-con">
        <div>
          <span className="initial-main-page-text">
            마이맵
          </span>
          <UserMapinfo userId={userId} />
        </div>
      </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글  {userPost.length}
          </span>
      
          <button style={{display: selectedPost && selectedPost.postType === 'daily' ? "block" : "none"}} className="dailypost-frame8" onClick={handleBackClick}>
          {selectedPost && selectedPost.postType === 'daily' &&
          <img
            alt="뒤로가기"
            src={back}
            className="dailypost-vector3"
          />}
        </button>
        <div style={{ display: selectedPost && selectedPost.postType === 'daily' ? "block" : "none", border: "3px solid #EEEEEE", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {selectedPost && selectedPost.postType === 'daily' && <DailyPost data={selectedPost} />}
        </div>
        <div id="list" style={{ display: selectedPost && selectedPost.postType === 'daily' ? "none" : "block", border: "3px solid #EEEEEE", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {userPost.map(item => (
            <button style={{border:"none"}} key={item.id} onClick={() => handlePostClick(item)}>
              {item.postType === 'daily' ? <DailyList data={item} /> : <HistoryList data={item} />}
            </button>
          ))}
        </div>
      </div>
      {selectedPost && selectedPost.postType === 'history' && (
        <div className="historyPost-con">
          <HistoryPost data={selectedPost} onClose={handleBackClick} />
        </div>
      )}
    </div>
  );
};
export default Mymap;


