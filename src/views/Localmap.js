import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";
import Loader from "../layouts/loader/Loader"
import "../assets/scss/layout/_localmap.scss";
import back from "../assets/images/logos/back.png";

const Localmap = () => {
  const [post, setPost] = useState([]); //초기 포스트
  const [dailyPost, setDailyPost] = useState([]); //초기 포스트의 데일리
  const [combinePost, setCombinePost] = useState([]); //데일리와 히스토리를 합친 포스트 (업데이트)

  const [selectedPost, setSelectedPost] = useState(null);
  const [dailyBounds, setDailyBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
  const [historyBounds, setHistoryBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
  const [historyBoundsState, setHistoryBoundsState] = useState(false); // 히스토리 범위가 설정되었는지 여부
  
  const token = localStorage.getItem("accessToken");
  const Server_IP = process.env.REACT_APP_Server_IP;

  const [active, setActive] = useState(null);
  const [activeId, setActiveId] = useState(null);  
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    if (active && active.item) {
      // console.log("active: ", active);
      setActiveId(active.item.postId);
    }
  }, [active]);

  // useEffect(() => {
    
  // }, [selectedPost]);

  // 경계를 기반으로 게시글 데이터 가져오기
  useEffect(() => {
    if (dailyBounds) {
      const { latitude1, longitude1, latitude2, longitude2 } = dailyBounds;     
      const url = `${Server_IP}/post-service/posts/list/range?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;
      
      setLoading(true); // 로딩 시작

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
            console.log("success_post", data.result.postResultDtoList);
            const daily_p = data.result.postResultDtoList.filter(item => item.postType === 'DAILY');
            setDailyPost(daily_p);
            setCombinePost(data.result.postResultDtoList);
            setPost(data.result.postResultDtoList); // API 응답 형식에 맞게 데이터 설정
          } else {
            console.error("Error in API response:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching pin data:", error))
        .finally(() => setLoading(false)); // 로딩 종료
    }
  }, [dailyBounds, selectedPost]);

  useEffect(() => {
    if (historyBounds) {
      const { latitude1, longitude1, latitude2, longitude2 } = historyBounds;
      const url = `${Server_IP}/post-service/history/list?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;

      fetch(url, {
        method: "GET",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
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
            console.log("범위의 히스토리 게시글 불러오기 성공", data.result.historyResultDtoList);
            setCombinePost([...dailyPost, ...data.result.historyResultDtoList]);
          } else {
            console.error("Error in API response:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching pin data:", error));
    }
  }, [historyBounds, selectedPost]);

  // useEffect(() => {
  //   // console.log('게시글//combinePost:', combinePost);
  // }, [combinePost]);

  // 게시글 클릭 처리
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
    console.log('selectedItem:', selectedItem);
  };

  // 뒤로가기 버튼 클릭 처리
  const handleBackClick = () => {
    setSelectedPost(null);
  };

  // Order posts so that the active post appears first
  const orderedPosts = activeId
    ? [combinePost.find((item) => item.postId === activeId), ...combinePost.filter((item) => item.postId !== activeId)]
    : combinePost;

    // if(loading){
    //   return <Loader />;
    // }

  return (
    <div id="local-con" style={{ display: "flex", width: "950px" }}>
      {/* 지도 및 핀 */}
      <div id="map-con" >
      <span className="initial-main-page-text">로컬맵</span>
        <div>
          <MapInformation active={setActive} dailybound={setDailyBounds} historybound={setHistoryBounds} />
        </div>
      </div>

      {/* 게시글 */}
      <div className="initial-main-page-frame">
        <span className="initial-main-page-text">게시글 {orderedPosts.length}개</span>
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
        <div className="list-con"
          id="list"
          style={{
            display: selectedPost && selectedPost.postType === "DAILY" ? "none" : "block"
          }}
        >
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
      {selectedPost && selectedPost.postType !== "DAILY" && (
        <div className="historyPost-con">
          <HistoryPost
            postId={selectedPost.postId}
            thumbnail={selectedPost.imageUrl || selectedPost.thumbnailImageUrl}
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

