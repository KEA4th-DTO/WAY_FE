import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";
import "../assets/scss/layout/_localmap.scss";

const Localmap = () => {
  //데이터 가져오기
  const [post, setPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 추가: 선택된 게시글 상태

  
  useEffect(()=>{
      fetch('http://localhost:3001/post') //API경로 적어주기
      .then(res => {
          return res.json() //json으로 변환됨
      })
      .then(data => {
          setPost(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  // 포스트 클릭 시 선택된 포스트 업데이트
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  return ( 
    <div id="local-con" style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀*/}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">
            로컬맵
          </span>
          <MapInformation />
        </div>
      </div>
        
        {/* 게시글*/}
        <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
          <span className="initial-main-page-text" >
            게시글
          </span>
      
          <div style={{ display: selectedPost && selectedPost.postType === 'daily' ? "block" : "none", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {selectedPost && selectedPost.postType === 'daily' && <DailyPost data={selectedPost} />}
        </div>
        <div id="list" style={{ display: selectedPost && selectedPost.postType === 'daily' ? "none" : "block", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {post.map(item => (
            <button key={item.id} onClick={() => handlePostClick(item)}>
              {item.postType === 'daily' ? <DailyList data={item} /> : <HistoryList data={item} />}
            </button>
          ))}
        </div>
      </div>
      {selectedPost && selectedPost.postType === 'history' && (
        <div className="historyPost-con">
          <HistoryPost data={selectedPost} />
        </div>
      )}
    </div>
  );
};
export default Localmap;


