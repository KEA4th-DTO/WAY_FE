import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_historypost.scss";

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import user3 from "../../assets/images/users/user3.jpg";
import like from "../../assets/images/logos/like.png";
import comment from "../../assets/images/logos/comment.png";
import more from "../../assets/images/logos/more.png";
import comment_more from "../../assets/images/logos/comment_more.png";
import sky from "../../assets/images/bg/sky.png";
import close from "../../assets/images/logos/close.png";
import img from "../../assets/images/bg/bg5.png";

const HistoryPost = ({ postId, writerNickname, writerProfileImageUrl, onClose }) => {
     // null 체크를 위해 미리 초기화
     const [post, setPost] = useState([]);
     const [likeNum, setLikeNum] = useState(0);
     const [liked, setLiked] = useState(false);
     const [followed, setFollowed] = useState(false);
     const token = localStorage.getItem("accessToken");
     const userNickname = localStorage.getItem("userNickname");

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
      fetch(`http://210.109.55.124/post-service/history/${postId}`, {
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

  const handleCloseClick = () => {
    onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
  };

  const handleFollowClick = () => {
    if (followed) {
        setFollowed(false);
    } else {
        setFollowed(true);
    }
};

  // console.log('html: ', post.bodyHtmlUrl);

  const formattedTime = new Date(post.createdAt).toLocaleString('ko-KR');

  
  return (
<div style={{border: "3px solid red"}}className="history-con">
  <div style={{border: "3px solid yellow"}} className="history-frame">
      <img
          src={close}
          alt="닫기"
          className="close"
          onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
      />

      {/* -------------게시글------------ */}
      <div>
        <img
          src={more}
          alt="더보기"
          className="more-img"
        />
        <span style={{border: "3px solid green"}} className="intro-postType">
          <span>History</span>
        </span>
        <span className="intro-title">
          {post.title}
        </span>
        <span className="intro-createAt">
            {formattedTime}
        </span>
          <div style={{border: "3px solid red"}} id='작성자 정보' className="intro-writer">
            <div className="intro-writer-profileimg">
              <img
                src={writerProfileImageUrl || user3}
                className="profileimg"
              />
            </div>
            <span className="intro-writer-nickname">
              <span>{writerNickname}</span>
            </span>
            <button className="intro-follow" onClick={handleFollowClick} >
                <span style={{ color: followed ? "#404DF2" : "#000" }}>팔로우</span>
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
      
      {/* ------------댓글------------- */}
      <div style={{border: "3px solid red"}} className="comment-con">
            <div style={{border: "3px solid red"}} className="floating-history-comment-frame02">
              <div style={{border: "3px solid orange"}} className="comment-like">
                  <img
                      src={like}
                      alt="좋아요"
                      className="comment-like-img"
                  />
                  <span className="comment-like-text">
                      <span>0</span>
                  </span>
              </div>
              <img
                src={comment_more}
                alt="댓글 더보기"
                className="comment-more-img"
              />
              <div style={{border: "3px solid orange"}} className="comment-writer">
              <img
                  src={user3}
                  alt="댓글 작성자 프로필이미지"
                  className="comment-writer-profileimg"
                />
                <span style={{border: "3px solid orange"}} className="comment-writer-nickname">
                  {post.memberNickname}
                </span>
              </div>
              <span style={{border: "3px solid orange"}}  className="comment-content">
                <span>댓글 내용</span>
              </span>
              <span className="comment-content-time">
                <span>댓글단 날짜</span>
              </span>
            </div> 

            {/* <div className="floating-history-comment-frame08">
              <div className="floating-history-comment-frame10">
                <span className="floating-history-comment-text026">
                  댓글 달기
                </span>
              </div>
              <div className="floating-history-comment-frame09">
                <span className="floating-history-comment-text024">
                  삭제하기
                </span>
              </div>
            </div> */}

          </div>

           {/* ------------답글------------- */}
          
          <div style={{border: "3px solid green"}} id='답글 컨테이너' className="floating-history-comment-frame19">
            <div style={{border: "3px solid orange"}} className="floating-history-comment-frame14">
                <img
                    src={like}
                    alt="좋아요"
                    className="floating-history-comment-image3"
                />
                <span className="floating-history-comment-text034">0</span>
                </div>
            <div style={{border: "3px solid green"}} id='답글 컨텐츠' className="floating-history-comment-frame12">
              <span className="floating-history-comment-text028">
                <span>답글 내용입니다!</span>
              </span>
              <span className="floating-history-comment-text030">
                <span>답글 작성 날짜</span>
              </span>
                <div className="floating-history-comment-frame13">
                <img
                  src={user3}
                  alt="댓글 작성자 프로필이미지"
                  className="floating-history-comment-freeiconuser1490711"
                />
                    <span className="floating-history-comment-text032">
                    <span>아이디</span>
                    </span>
                </div>
                <img
                    src={comment_more}
                    alt="더보기"
                    className="floating-history-comment-image2"
                />
            </div>
            <div className="floating-history-comment-frame08">
              <div className="floating-history-comment-frame10">
                <span className="floating-history-comment-text026">
                  <span>댓글 달기</span>
                </span>
              </div>
              <div className="floating-history-comment-frame09">
                <span className="floating-history-comment-text024">
                  <span>신고하기</span>
                </span>
              </div>
            </div>
          </div>

         {/* ------------댓글 작성칸------------- */}
   
          <div style={{border: "3px solid green"}} className="floating-history-comment-group45">
            <img
              src="/external/rectangle391351-s4js.svg"
              alt="Rectangle391351"
              className="floating-history-comment-rectangle39"
            />
            <div style={{border: "3px solid green"}} className="floating-history-comment-group36">
              <div className="floating-history-comment-group27">
                <span className="floating-history-comment-text059">
                  <span>10술집</span>
                </span>
              </div>
              <img
                src={user3}
                alt="작성자 프로필이미지"
                className="floating-history-comment-freeiconuser14907112"
              />
            </div>
            <img
            style={{border: "3px solid green"}}
              src="/external/rectangle401351-jkhk-200h.png"
              alt="Rectangle401351"
              className="floating-history-comment-rectangle40"
            />
            
                <div style={{border: "3px solid green"}} className="floating-history-comment-frame25">
                <span className="floating-history-comment-text061">
                    <span>등록</span>
                </span>
                </div>
                <span className="floating-history-comment-text063">
                <span>댓글을 입력해주세요.</span>
                </span>
          </div>
  </div>
</div>
    
  );
};

export default HistoryPost;
