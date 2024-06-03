import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_historypost.scss";

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import basic_profile from "../../assets/images/users/basic_profile.png";
import like from "../../assets/images/logos/like.png";
import comment from "../../assets/images/logos/comment.png";
import more from "../../assets/images/logos/more.png";
import comment_more from "../../assets/images/logos/comment_more.png";

const PreviewHistory = ({ postId, userProfileimg }) => {
     // null 체크를 위해 미리 초기화
     const [post, setPost] = useState([]);
     const token = localStorage.getItem("accessToken");
     const userNickname = localStorage.getItem("userNickname");
     const Server_IP = process.env.REACT_APP_Server_IP;

    //  "postId": 4,
    //  "writerNickname": null,
    //  "writerProfileImageUrl": null,
    //  "title": "인천 바닷가",
    //  "bodyHtmlUrl": "https://way-bucket-s3.s3.ap-northeast-2.amazonaws.com/history_body/a72d9141-2d92-457f-b0b2-ea962638963a",
    //  "bodyPreview": "여기 넘 좋네요.\n어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고\n어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고\n어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고\n\n어쩌고 저쩌고\n\n\n강아지 귀엽네요",
    //  "isLiked": false,
    //  "likesCount": 4,
    //  "commentsCount": 0,
    //  "isOwned": true,
    //  "createdAt": "2024-05-27T03:06:41.334138"

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
<div style={{border: "3px solid red"}}className="history-con">
  <div style={{border: "3px solid yellow"}} className="history-frame">

      {/* -------------게시글------------ */}
      <div>
        <span className="intro-postType">
          History
        </span>
        <span className="intro-title">
          {post.title}
        </span>
        <span className="intro-createAt" style={{left:"80px"}}>
            {formattedTime}
        </span>
          <div style={{border: "3px solid red"}} id='작성자 정보' className="intro-writer">
            <div className="intro-writer-profileimg">
              <img
                src={userProfileimg || basic_profile}
                className="profileimg"
              />
            </div>
            <span className="intro-writer-nickname">
              <span>{userNickname}</span>
            </span>
            <button className="intro-follow" >
                <span style={{ color: "#404DF2"}}>팔로우</span>
            </button>
          </div>

        {/* -------------게시글 내용------------ */}    
        <div style={{border: "3px solid red"}} className="frame-content">
         
            <Viewer initialValue={post.body} />
           
          
          {/* -------------해시태그------------ */}
          {/* <div style={{border: "3px solid red"}} id='해시태그' className="frame-hashtag">
              <span className="frame-hashtag-text"> #짱구 </span>
          </div> */}

          {/* -------------게시글 좋아요수, 댓글수------------ */}
          <div className='frame-like-and-comment'>
            <div style={{border: "3px solid red"}} className="frame-like">
              <img
                src={like}
                alt="게시글 좋아요"
                className="frame-like-img"
              />
              <span id='좋아요 수' className="frame-like-text">
                {post.likesCount}
              </span>
            </div>
            <div style={{border: "3px solid red"}} className="frame-comment">
              <img
                src={comment}
                alt="게시글 댓글"
                className="frame-like-img"
              />
              <span id='댓글 수' className="frame-like-text">
                {post.commentsCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      
  </div>
</div>
    
  );
};

export default PreviewHistory;
