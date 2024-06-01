import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/scss/layout/_search.scss";
import magnifier from "../assets/images/logos/magnifier.png";
import arrow from "../assets/images/logos/arrow.png";
import SearchList from "../components/main/SearchList"; 
import localmap_img from "../assets/images/bg/localmap_img.png";
import mymap_img from "../assets/images/bg/mymap_img.png";
import HistoryPost from "../components/main/HistoryPost";

const Search = () => {
  const [rpost, setRPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [filterToggle, setFilterToggle] = useState(false); // 토글 상태

  // useEffect(() => {
  //   fetch('http://localhost:3001/recomendPost') //API경로 적어주기
  //     .then(res => res.json())
  //     .then(data => setRPost(data))
  //     .catch(error => console.error("Error fetching data:", error));
  // }, []);

  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  const handleBackClick = () => {
    setSelectedPost(null); // 선택된 포스트 초기화
  };

  const toggleFilter = () => {
    setFilterToggle(!filterToggle);
  };

  return (
    <div className="group98-group98">
      {/* <div className="group98-frame"> */}
        {/* 검색창 */}
        <div className="group98-frame">
          {/* 검색창 내용 */}
        </div>
        {/* 토글 버튼 */}
        {/* <div className="group98-frame2" onClick={toggleFilter}>
          <div className="group98-svg" />
          <button style={{ border: "none" }}>
            <img
              src={arrow}
              alt="토글 화살표"
              className="group98-svg01"
            />
          </button>
          <span className="group98-text02">
            <span>필터</span>
          </span> */}
          {/* 토글된 상태일 때, 필터 목록 표시 */}
          {/* {filterToggle && (
            <div className="filter-buttons">
              <button className="filter-button">닉네임</button>
              <button className="filter-button">해시태그</button>
              <button className="filter-button">제목+내용</button>
            </div>
          )}
        </div> 
      </div> */}

      {/* 추천 게시글 목록 */}
      {/* <div className="group98-frame-profile">
        {rpost.map(item => (
          <button style={{ border: "none" }} key={item.id} onClick={() => handlePostClick(item)}>
            <SearchList data={item} />
          </button>
        ))}
      </div> */}

      {/* 선택된 포스트 표시 */}
      {/* {selectedPost && (
        <div className="historyPost-con">
          <HistoryPost data={selectedPost} onClose={handleBackClick} />
        </div>
      )} */}

      {/* 로컬맵, 마이맵 이동 버튼 */}
      {/* <div className="group98-group77">
        로컬맵 이동
        <Link to="/localmap" style={{ textDecoration: "none", color: "inherit" }}>
          <button style={{ border: "none" }}>
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

        <Link to="/mymap" style={{ textDecoration: "none", color: "inherit" }}>
          <button style={{ border: "none" }}>
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
      </div> */}
     
    </div>
  );
};

export default Search;
