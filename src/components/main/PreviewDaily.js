import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import basic_profile from "../../assets/images/users/basic_profile.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";

import { shareKakao } from '../../utils/shareKakaoLink';
import { formatDate2, formatPeriod } from '../../utils/changeFormat';

const PreviewDaily = ({ postId, userProfileimg }) => {
        // null 체크를 위해 미리 초기화
        const [post, setPost] = useState([]);
      
        const token = localStorage.getItem("accessToken");
        const Server_IP = process.env.REACT_APP_Server_IP;
        const userNickname = localStorage.getItem("userNickname");
        
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours()); // 현재 시간에서 3시간을 빼기

        console.log('시간: ', currentTime);
        
        useEffect(() => {
          if (postId) {
            const url = `${Server_IP}/post-service/daily/${postId}`;

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
                setPost(data.result);
              } else {
                console.error("Error in API response:", data.message);
              }
            })
            .catch(error => console.error("Error fetching data:", error));
          }
        }, [userNickname, token]);
      
        console.log(post);
        // console.log('만료: ',post.expiredAt);

    return(
      <div className="dailypost-frame">
        <div className="dailypost-frame1"> 
        <div className="dailypost-frame3">
            <div className="dailypost-frame4">
              <img 
                alt="사용자 프로필 이미지" 
                src={userProfileimg || basic_profile} 
                // src={writerProfileImageUrl || user7} 
                className="dailypost-profileimage" />
              <span className="dailypost-text10">
                <span>{userNickname}</span>
              </span>
            </div>
            <img
              alt="postType, 핀 이미지"
              src={full_dailyPin}
              className="dailypost-daily-pin-filled"
            />
            <button className="dailypost-text12" >
                <span style={{ color: "#404DF2"}}>팔로우</span>
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
          <div className="dailypost-post1-history">
            <img alt="게시글 이미지" src={post.imageUrl} className="dailypost-image" />
          </div>

          <div className="dailypost-frame2">
            <span className="dailypost-text08">
              <span>{post.title}</span>
            </span>
            <span className="dailypost-text04">
              <span>
                {post.body}
              </span>
            </span>
            <span className="dailypost-text">
              <span>
                {formatDate2(post.createdAt, post.expiredAt)} {formatPeriod(currentTime, post.expiredAt)}남았습니다.
              </span>
              </span>
          </div>
         
        <div className="dailypost-group99">
          <div className="dailypost-frame7">
            <button style={{ border: "none" }}>
                <img
                    alt="좋아요"
                    src={like}
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
              채팅하기
            </span>
          </button>
        </div>
        
      </div>
    
    );
    
};

export default PreviewDaily;