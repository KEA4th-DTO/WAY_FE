import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/scss/layout/_search.scss";
import magnifier from "../assets/images/logos/magnifier.png";
import arrow from "../assets/images/logos/arrow.png";
import SearchList from "../components/main/SearchList"; 
import localmap_img from "../assets/images/bg/localmap_img.png";
import mymap_img from "../assets/images/bg/mymap_img.png";
import HistoryPost from "../components/main/HistoryPost";

const Search= () => {

   //데이터 가져오기
   const [rpost, setRPost] = useState([]);
   const [selectedPost, setSelectedPost] = useState(null); // 추가: 선택된 게시글 상태
 
   
   useEffect(()=>{
       fetch('http://localhost:3001/recomendPost') //API경로 적어주기
       .then(res => {
           return res.json() //json으로 변환됨
       })
       .then(data => {
           setRPost(data);
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
      <div style={{border:"3px solid red"}} className="group98-group98">
        <div className="group98-frame">
          <div
            className="group98-image"
          />
          <span className="group98-text">
            <span>검색어 입력하세요</span>
          </span>
          <div className="group98-frame1">
            <img
              src={magnifier}
              alt="돋보기"
              className="group98-ellipse2"
            />
          </div>

          <div className="group98-frame2">
            <div
              className="group98-svg"
            />
            <button style={{border:"none"}}>
            <img
              src={arrow}
              alt="토글 화살표"
              className="group98-svg01"
            />
            </button>
            <span className="group98-text02">
              <span>닉네임</span>
            </span>
          </div>
        </div>

        <span className="group98-text44">
          <span>추천 게시글</span>
        </span>

        <div style={{border:"3px solid red", overflow: "auto"}} className="group98-frame-profile">
          {rpost.map(item => (
            <button style={{border:"none"}} key={item.id} onClick={() => handlePostClick(item)}>
              <SearchList data={item} />
            </button>
          ))}
        </div>
        {selectedPost && (
        <div className="historyPost-con">
          <HistoryPost data={selectedPost} onClose={handleBackClick} />
        </div>
      )}
        
        <div style={{border:"3px solid red"}}className="group98-group77">
           {/* 로컬맵 이동하기 */}
        <Link to="/localmap" style={{ textDecoration: "none", color: "inherit" }}>
          <button style={{border:"none"}}>
          <img
            src={localmap_img}
            alt="localmap"
            className="group98-localmap"
          />
          <span className="group98-text46">
            로컬맵으로 돌아가기
          </span>
          </button>
          </Link>

           {/* 마이맵 이동하기 */}
        <Link to="/mymap" style={{ textDecoration: "none", color: "inherit" }}>
          <button style={{border:"none"}}>
          <img
            src={mymap_img}
            alt="mymap"
            className="group98-mymap"
          />
          <span className="group98-text49">
            마이맵으로 이동하기
          </span>
          </button>
          </Link>
        </div>

      </div>
  );

};

export default Search;
