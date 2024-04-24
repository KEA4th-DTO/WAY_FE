import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_dailypost.scss";
import user7 from "../../assets/images/users/user7.png";
import sky from "../../assets/images/bg/sky.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import more from "../../assets/images/logos/more.png";
import share from "../../assets/images/logos/share.png";
import like from "../../assets/images/logos/like.png";
import full_like from "../../assets/images/logos/full_like.png";

import { shareKakao } from '../../utils/shareKakaoLink';
import { formatDate, formatPeriod } from '../../utils/changeFormat';

const DailyPost = ({ data }) => {
        // null 체크를 위해 미리 초기화
        const [likeNum, setLikeNum] = useState(data ? data.likeNum : 0);
        const [liked, setLiked] = useState(false);
        const [followed, setFollowed] = useState(false);

        // 데이터가 없는 경우 null을 반환하므로 조건문을 사용하지 않음
        useEffect(() => {
            if (!data) {
                return;
            }
            // 데이터의 초기 좋아요 상태에 따라 liked 상태 설정
            setLiked(data.liked);
        }, [data]);

        const handleLikeClick = () => {
            if (liked) {
                setLikeNum(prevNum => prevNum - 1);
            } else {
                setLikeNum(prevNum => prevNum + 1);
            }
            setLiked(!liked);
        };

        const handleFollowClick = () => {
            if (followed) {
                setFollowed(false);
            } else {
                setFollowed(true);
            }
        };
        
        // const onBackClick = () => { 
        //     return(
        //       <div>
        //         <MainList />
        //       </div>
        //     );
        // };

        // useEffect(() => {
        //     const script = document.createElement("script");
        //     script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        //     script.async = true;
        //     document.body.appendChild(script);
        //     return () => document.body.removeChild(script);
        //     }, []);

    return(
      <div className="dailypost-frame">
        <div className="dailypost-frame1"> 
        <div className="dailypost-frame3">
            <div className="dailypost-frame4">
              <img alt="사용자 프로필 이미지" src={user7} className="dailypost-profileimage" />
              <span className="dailypost-text10">
                <span>{data.memberId}</span>
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
          <div className="dailypost-post1-history">
            <img alt="게시글 이미지" src={sky} className="dailypost-image" />
          </div>

          <div className="dailypost-frame2">
            <span className="dailypost-text08">
              <span>{data.title}</span>
            </span>
            <span className="dailypost-text02">
              <span>{data.postType}</span>
            </span>
            <span className="dailypost-text04">
              <span>
                {data.body}
              </span>
            </span>
            <span className="dailypost-text">
              <span>{formatDate(data.createdAt)} {formatPeriod(data.period)}</span>
            </span>
          </div>
         
        <div className="dailypost-group99">
          
          <div className="dailypost-frame7">
            <button style={{ border: "none" }} onClick={handleLikeClick}>
                <img
                    alt="좋아요"
                    src={liked ? full_like : like}
                    className="dailypost-svg"
                />
            </button>
           
            <span className="dailypost-text16">
              <span>{likeNum}</span>
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