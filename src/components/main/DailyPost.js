import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import user7 from "../../assets/images/users/user7.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";

import { shareKakao } from '../../utils/shareKakaoLink';
import { formatDate2, formatPeriod } from '../../utils/changeFormat';

const DailyPost = ({ postId, writerNickname, writerProfileImageUrl }) => {
        // null 체크를 위해 미리 초기화
        const [post, setPost] = useState([]);
        const [likeNum, setLikeNum] = useState(0);
        const [liked, setLiked] = useState(false);
        const [followed, setFollowed] = useState(false);
        const token = localStorage.getItem("accessToken");
        const userNickname = localStorage.getItem("userNickname");
        
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours()); // 현재 시간에서 3시간을 빼기

        console.log('시간: ', currentTime);
        
        useEffect(() => {
          if (postId) {
            
            fetch(`http://210.109.55.124/post-service/daily/${postId}`, {
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
                setPost(data.result);
              } else {
                console.error("Error in API response:", data.message);
              }
            })
            .catch(error => console.error("Error fetching data:", error));
          }
        }, [userNickname, token]);
      
        console.log(post);
        console.log('만료: ',post.expiredAt);

        // useEffect(() => {
        //     // 데이터의 초기 좋아요 상태에 따라 liked 상태 설정
        //     setLiked(post.likesCount);
        // }, [data]);

        const handleLikeClick = () => {
          // 좋아요 취소 로직 추가
          fetch(`http://210.109.55.124/post-service/posts/like/${postId}`, {
              method: "POST",
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
                  setLikeNum(data.result.likesCount);
                  setLiked(!liked);
                  console.log("Successfully liked post:", data);
              } else {
                  console.error("Error unliking post:", data.message);
              }
          })
          .catch(error => console.error("Error unliking post:", error));
          };

        const handleFollowClick = () => {
            if (followed) {
                setFollowed(false);
            } else {
                setFollowed(true);
            }
        };

        // useEffect(() => {
        //     const script = document.createElement("script");
        //     script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        //     script.async = true;
        //     document.body.appendChild(script);
        //     return () => document.body.removeChild(script);
        //     }, []);

    return(
      <div style={{border: "3px solid red"}} className="dailypost-frame">
        <div style={{border: "3px solid red"}} className="dailypost-frame1"> 
        <div style={{border: "3px solid orange"}} className="dailypost-frame3">
            <div className="dailypost-frame4">
              <img 
                alt="사용자 프로필 이미지" 
                src={writerProfileImageUrl || user7} 
                className="dailypost-profileimage" />
              <span className="dailypost-text10">
                <span>{writerNickname}</span>
              </span>
            </div>
            <img
              alt="postType, 핀 이미지"
              src={full_dailyPin}
              className="dailypost-daily-pin-filled"
            />
            <button className="dailypost-text12" onClick={handleFollowClick} >
                <span style={{ color: followed ? "#404DF2" : "#000" }}>팔로우</span>
            </button>
            <button style={{border: "none"}}>
            <img
              alt="더보가"
              src={more}
              className="dailypost-menubutton"
            />
            </button>
          </div>
        </div>
          <div style={{border: "3px solid orange"}} className="dailypost-post1-history">
            <img alt="게시글 이미지" src={post.imageUrl} className="dailypost-image" />
          </div>

          <div style={{border: "3px solid yellow"}} className="dailypost-frame2">
            <span style={{border: "3px solid yellow"}} className="dailypost-text08">
              <span>{post.title}</span>
            </span>
            <span style={{border: "3px solid yellow"}} className="dailypost-text02">
              <span>{post.postType}</span>
            </span>
            <span style={{border: "3px solid yellow"}} className="dailypost-text04">
              <span>
                {post.body}
              </span>
            </span>
            <span style={{border: "3px solid green"}} className="dailypost-text">
              <span>
                {formatDate2(post.createdAt, post.expiredAt)} {formatPeriod(currentTime, post.expiredAt)}남았습니다.
              </span>
              </span>
          </div>
         
        <div style={{border: "3px solid green"}} className="dailypost-group99">
          
          <div className="dailypost-frame7">
            <button style={{ border: "none" }} onClick={handleLikeClick}>
                <img
                    alt="좋아요"
                    src={liked ? full_like : like}
                    className="dailypost-svg"
                />
            </button>
           
            <span className="dailypost-text16">
              <span>{post.likesCount}</span>
            </span>
          </div>
          <button className="dailypost-frame6" onClick={() => shareKakao()}>
            <img
              alt="공유하기"
              src={share}
              className="dailypost-vector"
            />
          </button>
          <button className="dailypost-frame5">
            <span className="dailypost-text14">
              실시간 채팅하기
            </span>
          </button>
        </div>
        
      </div>
    
    );
    
};

export default DailyPost;