import React, { useState, useEffect } from "react";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import UserMapinfo from "../components/main/UserMapinfo";
import back from "../assets/images/logos/back.png";
import HistoryPost from "../components/main/HistoryPost";
import DailyPost from "../components/main/DailyPost";
import { useLocation } from 'react-router-dom';
import Loader from "../layouts/loader/Loader"
import no_post from "../assets/images/icons/no_post.png";

const OthersMap = () => {
  const location = useLocation();
  const  nickname  = location.state || {};
  const [userPost, setUserPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const token = localStorage.getItem("accessToken");
  const Server_IP = process.env.REACT_APP_Server_IP;

  const [active, setActive] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    if (active && active.item) {
      setActiveId(active.item.postId);
    }
  }, [active]);

  useEffect(() => {
    if (nickname) {
      const url = `${Server_IP}/post-service/posts/list/${nickname}`;
      setLoading(true); // 로딩 시작

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
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false)); // Stop loading

    }
  }, [nickname, token, selectedPost]);

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
    <div style={{ display: "flex", width: "950px" }}>
      {/* 지도 & 핀 */}
      <div id="map-con">
        <span className="initial-main-page-text">"{nickname}"의 맵</span>
        <div>
          <UserMapinfo userNickname={nickname} active={setActive} setLoading={setLoading} />
        </div>
      </div>

      {/* 게시글 */}
      <div className="initial-main-page-frame">
        <span className="initial-main-page-text">게시글 {userPost.length}개</span>

        <button style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none" }} className="dailypost-frame8" onClick={handleBackClick}>
          {selectedPost && selectedPost.postType === 'DAILY' &&
            <img alt="뒤로가기" src={back} className="dailypost-vector3" />
          }
        </button>
        <div style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "block" : "none", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
          {selectedPost && selectedPost.postType === 'DAILY' && <DailyPost postId={selectedPost.postId} writerNickname={selectedPost.writerNickname} writerProfileImageUrl={selectedPost.writerProfileImageUrl} onDelete={handleDelete} />}
        </div>

        <div className="list-con" style={{ display: selectedPost && selectedPost.postType === 'DAILY' ? "none" : "block", overflow: "auto", marginTop: "10%", width: "410px", height: "640px" }}>
        {loading ? (
            <Loader />
          ) : (
          orderedPosts && orderedPosts.length > 0 ? (
            orderedPosts.map((item) => (
              <div key={item.postId} onClick={() => handlePostClick(item)}>
                {item.postType === "DAILY" ? <DailyList data={item} isActive={active} /> : <HistoryList data={item} isActive={active} />}
              </div>
            ))
          ) : (
            <div>
            <img 
              src={no_post} 
              alt="no_post" 
              className="no-post-img"
             />
            <span className="no-post-text">게시글이 없습니다.</span>
            </div>
          )
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
            onClose={handleBackClick}
          />
        </div>
      )}
    </div>
  );
};

export default OthersMap;
