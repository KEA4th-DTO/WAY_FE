import React, { useState, useEffect } from "react";
import MapInformation from "../components/main/Mapinformation";
import DailyList from "../components/main/DailyList";
import HistoryList from "../components/main/HistoryList";
import DailyPost from "../components/main/DailyPost";
import HistoryPost from "../components/main/HistoryPost";
import Loader from "../layouts/loader/Loader"
import "../assets/scss/layout/_localmap.scss";
import back from "../assets/images/logos/back.png";
import no_post from "../assets/images/icons/no_post.png";

const Localmap = () => {
  const [post, setPost] = useState([]); //초기 포스트

  const [selectedPost, setSelectedPost] = useState(null);
  const [dailyBounds, setDailyBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
  const [historyBounds, setHistoryBounds] = useState({ ne: { lat: '', lng: '' }, sw: { lat: '', lng: '' } });
  const [researchmode, setResearchMode] = useState(false); // 재검색 모드

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
  const fetchPostData = async () => {
    if (dailyBounds) {
      const { latitude1, longitude1, latitude2, longitude2 } = dailyBounds;
      const url = `${Server_IP}/post-service/posts/list/range?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;
      
      setLoading(true); // 로딩 시작
      setActive(null);
      setActiveId(null);

  
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
  
        const data = await res.json();
  
        if (data.isSuccess) {
          // console.log("success_post", data.result.postResultDtoList);
          setPost(data.result.postResultDtoList); // API 응답 형식에 맞게 데이터 설정
        } else {
          console.error("Error in API response:", data.message);
        }
      } catch (error) {
        console.error("Error fetching pin data:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };

  const fetchHistoryData = async () => {
    if (historyBounds) {
      const { latitude1, longitude1, latitude2, longitude2 } = historyBounds;
      const url = `${Server_IP}/post-service/history/list?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;
  
      setLoading(true); // 로딩 시작
      setActive(null);
      setActiveId(null);

  
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "accept": "*/*",
            "Authorization": `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
  
        const data = await res.json();
  
        if (data.isSuccess) {
          // console.log("범위의 히스토리 게시글 불러오기 성공", data.result.historyResultDtoList);
          setPost(data.result.historyResultDtoList);
        } else {
          console.error("Error in API response:", data.message);
        }
      } catch (error) {
        console.error("Error fetching pin data:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };
  
  useEffect(() => {
    if(researchmode === true){
      fetchHistoryData();
    }
    else{
      fetchPostData();
    }
  }, [dailyBounds, historyBounds, researchmode, selectedPost]);
  

  // useEffect(() => {
  //   // console.log('게시글//combinePost:', combinePost);
  // }, [combinePost]);

  // 게시글 클릭 처리
  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
    // console.log('selectedItem:', selectedItem);
  };

  // 뒤로가기 버튼 클릭 처리
  const handleBackClick = () => {
    setSelectedPost(null);
  };

  // Order posts so that the active post appears first
  const orderedPosts = activeId
    ? [post.find((item) => item.postId === activeId), ...post.filter((item) => item.postId !== activeId)]
    : post;

  
    // if(loading){
    //   return <Loader />;
    // }

  return (
    <div id="local-con" style={{ display: "flex", width: "950px" }}>
      {/* 지도 및 핀 */}
      <div id="map-con" >
      <span className="initial-main-page-text">로컬맵</span>
        <div>
          <MapInformation active={setActive} dailybound={setDailyBounds} historybound={setHistoryBounds}  setLoading={setLoading} researchmode={setResearchMode}/>
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

