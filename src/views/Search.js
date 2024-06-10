import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/scss/layout/_search.scss";
import magnifier from "../assets/images/logos/magnifier.png";
import SearchList from "../components/main/SearchList"; 
import SearchList2 from "../components/main/SearchList2"; 
import localmap_img from "../assets/images/bg/localmap_img.png";
import mymap_img from "../assets/images/bg/mymap_img.png";
import HistoryPost from "../components/main/HistoryPost";
import RecommendUser from '../components/main/RecommendUser';

const Search = () => {
  const token = localStorage.getItem("accessToken");
  const Server_IP = process.env.REACT_APP_Server_IP;
  const userNickname = localStorage.getItem("userNickname");

  const [word, setWord] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [post, setPost] = useState([]);
  const [selectedCate, setSelectedCate] = useState('필터'); // 선택된 게시글 상태
  const [check, setCheck] = useState(''); // 선택된 게시글 상태
  const [selectedUrl, setSelectedUrl] = useState('post-service/history/search/title');
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [filterToggle, setFilterToggle] = useState(false); // 토글 상태
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    handleSearch();
  }, [page]); // Re-fetch data whenever the page changes

  const handleSearch = () => {
    if(selectedCate === '필터'){
      // alert('필터를 선택해주세요.');
      return;
    }

    if(!word.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setCheck(selectedCate);
    setPost([]); // 검색 결과 초기화

    const url = `${Server_IP}/${selectedUrl}?keyword=${word}&page=${page}`;
    // console.log("url", url);
    fetch(url, {
      method: "GET",
      headers: {
        'accept': '*/*',
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
          console.log("search post, user: ", data);
          if(!data.result){alert(data.message);}
          setPost(data.result.list); // API 응답 형식에 맞게 데이터 설정
          setTotalPage(data.result.totalPage);
          setTotalElements(data.result.totalElements);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handlePostClick = (selectedItem) => {
    setSelectedPost(selectedItem);
  };

  const handleBackClick = () => {
    setSelectedPost(null); // 선택된 포스트 초기화
  };

  const toggleFilter = () => {
    setFilterToggle(!filterToggle);
  };

  const handleTitle = () => {
    setSelectedUrl('post-service/history/search/title');
    setSelectedCate('제목');
    setFilterToggle(!filterToggle);
  };

  const handleBody = () => {
    setSelectedUrl('post-service/history/search/body');
    setSelectedCate('내용');
    setFilterToggle(!filterToggle);
  };

  const handleNickname = () => {
    setSelectedUrl('member-service/search/body');
    setSelectedCate('닉네임');
    setFilterToggle(!filterToggle);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };
  
  useEffect(() => {
      const url = `${Server_IP}/member-service/search/recommend`;

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
          console.log("유저 추천 목록 불러오기 성공", data.result);
          setUsers(data.result);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch(error => console.error("Error fetching data:", error));

  }, [userNickname]);

  
  return (
    <div className="search-con">
      <div className="search-frame">
        {/* 검색창 */}
        <div className="search-frame2">
          <span className="search-arrow-text" onClick={toggleFilter}>
            {selectedCate}
          </span>
          {/* 토글된 상태일 때, 필터 목록 표시 */}
          {filterToggle && (
            <div className="filter-buttons">
              <button className="filter-button" onClick={handleTitle}>제목</button>
              <button className="filter-button" onClick={handleBody}>내용</button>
              <button className="filter-button" onClick={handleNickname}>닉네임</button>
            </div>
          )}
          <input
            className='search-input'
            type="text"
            placeholder="검색할 내용을 입력하세요."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button style={{ border: "none" }} onClick={handleSearch}>  
            <img
              src={magnifier}
              alt="돋보기"
              className='search-magnifier'
            />
          </button>
        </div>  
      </div>

     {/* 추천 게시글 목록 */}
      <div className="search-post">
        {post.length > 0 ? (
          <div>
            <span className='post-span'>검색 결과가 {totalElements}건 조회되었습니다.</span>
            <div className='post-br'/>
            {post.map(item => (
              check === '닉네임' ?
              (<button style={{ border: "none", backgroundColor:"#fff" }} key={item.id}>
                <SearchList2 data={item} />
              </button>)
              :
               (<button style={{ border: "none", backgroundColor:"#fff" }} key={item.id} onClick={() => handlePostClick(item) }>
               <SearchList data={item} />
             </button>)
            ))}
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={handlePreviousPage} disabled={page === 1} style={{border:"none"}}>Previous</button>
              <span> {page} / {totalPage} </span>
              <button onClick={handleNextPage} disabled={page === totalPage} style={{border:"none"}}>Next</button>
            </div>
          </div>
        ) : (
          <div className='post-span'>검색 결과가 없습니다.</div>
        )}
      </div>

      

      {selectedPost && (
        <div className="historyPost-con">
          <HistoryPost 
            postId={selectedPost.postId}
            thumbnail={selectedPost.imageUrl || selectedPost.thumbnailImageUrl}
            writerNickname={selectedPost.writerNickname}
            writerProfileImageUrl={selectedPost.writerProfileImageUrl}
            onClose={handleBackClick} />
        </div>
      )}

      {/* 유저 추천 목록 */}
      <div className="search-users">
      <span className="search-users-text">
        유저 추천 목록
      </span>
      <br />
      <br />
      {users.map(item => (
              <button style={{ border: "none", backgroundColor:"#fff" }} key={item.id}>
               <RecommendUser data={item} />
              </button>
            ))}
      </div>
    </div>
  );
};

export default Search;
