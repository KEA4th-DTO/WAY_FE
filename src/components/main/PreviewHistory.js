import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_historypost.scss";
import close from "../../assets/images/logos/close.png";
import EditorViewer from './EditorViewer.tsx';

import like from "../../assets/images/logos/like.png";
import comment from "../../assets/images/logos/comment.png";
import more from "../../assets/images/logos/more.png";
import comment_more from "../../assets/images/logos/comment_more.png";
import bg1 from "../../assets/images/bg/bg1.jpg";

const PreviewHistory = ({ postId, userProfileimg }) => {
     // null 체크를 위해 미리 초기화
     const [post, setPost] = useState([]);
     const token = localStorage.getItem("accessToken");
     const userNickname = localStorage.getItem("userNickname");
     const Server_IP = process.env.REACT_APP_Server_IP;

  useEffect(() => {
    if (postId) {
      const url = `${Server_IP}/post-service/history/${postId}`;

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
          console.log('성공; ', data.result);
          setPost(data.result);
        } else {
          console.error("Error in API response:", data.message);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
    }
  }, [userNickname, token]);

  // console.log('html: ', post.bodyHtmlUrl);

  const formattedTime = new Date(post.createdAt).toLocaleString('ko-KR');

  
  return (

    <div className="history-con">
      <div>   
        <img
        src={close}
        alt="닫기"
        className="close-img"
      />
      </div>
        {/* -------------게시글------------ */}
       
        <div className="history-frame">
          <span className="intro-postType">
            <span>History</span>
          </span>
          <span className="intro-title">
            {post.title}
          </span>
            <div id='작성자 정보' className="intro-writer">
              <button className="intro-writer-profileimg">
                <img
                  src={userProfileimg}
                  className="profileimg"
                />
              </button>
              <span className="intro-writer-nickname">
                <span>{userNickname}</span>
              </span>
              <button className="intro-follow" >
                <span style={{ color: "#000" }}>팔로우</span>
              </button>
              <span className="intro-createAt">
                {formattedTime}
              </span>
            </div>
  
          {/* -------------게시글 내용------------ */}    
          <div className="frame-content">
          <div className="intro-thumbnail">
            <img
              src={bg1}
              alt="썸네일 이미지"
              className="thumbnail-img"
            />
          </div>
          {post.body ? <EditorViewer contents={post.body} /> : <div>Loading...</div>}
             
            
            {/* -------------해시태그------------ */}
            {/* <div style={{border: "3px solid red"}} id='해시태그' className="frame-hashtag">
                <span className="frame-hashtag-text"> #짱구 </span>
            </div> */}
  
            {/* -------------게시글 좋아요수, 댓글수------------ */}
            <div className='frame-like-and-comment'>
              <div className="frame-like">
                <button style={{ border: "none" }}>
                  <img
                      alt="좋아요"
                      src={like}
                      className="frame-like-img"
                  />
              </button>
             
                <span id='좋아요 수' className="frame-like-text">
                  0
                </span>
              </div>
              <div className="frame-comment">
              <button style={{border:"none", backgroundColor:"#fff"}}>
                <img
                  src={comment}
                  alt="게시글 댓글"
                  className="frame-like-img"
                />
                </button>
                <span id='댓글 수' className="frame-like-text">
                  0
                </span>
              </div>
            </div>
          </div>
        
  
      
    </div>
  </div>
    
  );
};

export default PreviewHistory;
