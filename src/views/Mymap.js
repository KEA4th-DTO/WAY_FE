import React, { useState, useEffect, useRef } from "react";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import UserMapinfo from "../components/main/UserMapinfo";
import back from "../assets/images/logos/back.png";
import HistoryPost from "../components/main/HistoryPost";
import DailyPost from "../components/main/DailyPost";
import html2canvas from "html2canvas";

const Mymap = () => {
  // 데이터 가져오기
  
  const [userPost, setUserPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 추가: 선택된 게시글 상태
  const token = localStorage.getItem("accessToken");
  const userNickname = localStorage.getItem("userNickname");
  const Server_IP = process.env.REACT_APP_Server_IP;
  // const mapRef = useRef(null); // 추가: 지도를 캡처할 DOM 요소 참조

  const [active, setActive] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (active && active.item) {
      console.log("active: ", active);
      setActiveId(active.item.postId);
    }
  }, [active]);

  useEffect(() => {
    if (userNickname) {
      const url = `${Server_IP}/post-service/posts/list/${userNickname}`;
      fetch(url, {
        method: "GET",
        headers: {
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
  }, [userNickname, token, selectedPost]);

  console.log('userPost: ', userPost);

  // 포스트 클릭 시 선택된 포스트 업데이트
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  // 뒤로가기 버튼 클릭 시
  const handleBackClick = () => {
    setSelectedPost(null); // 선택된 포스트 초기화
  };

  const handleDelete = (deletedPostId) => {
    setUserPost(userPost.filter(post => post.postId !== deletedPostId));
    setSelectedPost(null);
  };

   // Order posts so that the active post appears first
   const orderedPosts = activeId
   ? [userPost.find((item) => item.postId === activeId), ...userPost.filter((item) => item.postId !== activeId)]
   : userPost;

  return ( 
    <div style={{border: "5px solid red", display: "flex", width: "950px"}}>
      {/* 지도 & 핀 */}
      <div id="map-con" style={{border: "3px solid blue"}}>
        <div>
          <span className="initial-main-page-text">마이맵</span>
          <div>
            <UserMapinfo userNickname={userNickname} capture={false} active={setActive}/>
          </div>
        </div>
      </div>
        
      {/* 게시글 */}
      <div className="initial-main-page-frame" style={{border: "3px solid green", marginLeft: "20px"}}>
        <span className="initial-main-page-text">게시글 {userPost.length}개</span>
      
        <button style={{display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none"}} className="dailypost-frame8" onClick={handleBackClick}>
          {selectedPost && selectedPost.postType === 'DAILY' &&
            <img alt="뒤로가기" src={back} className="dailypost-vector3" />
          }
        </button>
        <div style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {selectedPost && selectedPost.postType === 'DAILY' && <DailyPost postId={selectedPost.postId} writerNickname={selectedPost.writerNickname} writerProfileImageUrl={selectedPost.writerProfileImageUrl} onDelete={handleDelete}  />}
        </div>
        <div id="list" style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "none" : "block", border: "3px solid yellow", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {orderedPosts && orderedPosts.length > 0 ? (
            orderedPosts.map((item) => (
              <div key={item.postId} onClick={() => handlePostClick(item)}>
                {item.postType === "DAILY" ? <DailyList data={item} isActive={active} /> : <HistoryList data={item} isActive={active} />}
              </div>
            ))
          ) : (
            <div>No posts available</div>
          )}
        </div>
      </div>
      {selectedPost && selectedPost.postType === 'HISTORY' && (
        <div className="historyPost-con">
          <HistoryPost 
            postId={selectedPost.postId}  
            thumbnail={selectedPost.imageUrl} 
            writerNickname={selectedPost.writerNickname} 
            writerProfileImageUrl={selectedPost.writerProfileImageUrl} 
            onClose={handleBackClick} />
        </div>
      )}
    </div>
  );
};

export default Mymap;
