import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_localmap.scss";

import sky from "../../assets/images/bg/sky.png";
import like from "../../assets/images/logos/like.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";
import user1 from "../../assets/images/users/user1.jpg";

import { formatDate2, formatPeriod } from "../../utils/changeFormat";

const DailyList = ({ data, isActive }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const current = new Date();
    current.setHours(current.getHours() + 9); // 현재 시간에서 9시간을 더하기
    setCurrentTime(current.toISOString());
  }, []);

  const [activeId, setActiveId] = useState(null);
  
  useEffect(() => { 
    if (isActive && isActive.item) {
      setActiveId(isActive.item.postId);
      console.log('액티브 ', isActive.item.postId);
    }
  }, [isActive]);

  if (!data) {
    return null; // Return null or any fallback content if there are no posts
  }

  return (
    <div
      className="frame4-container"
      style={{ overflowY: "auto", maxHeight: "80vh" }}
    >
      <button className={(data.postId === activeId) ? "frame4-frame4-active" :"frame4-frame4"}>
        <div className="frame4-post1full">
          <img
            src={data.imageUrl || sky} // 게시글 이미지가 없을 때 기본 이미지 사용
            alt="게시글 이미지"
            className="frame4-image"
          />
          <div className="frame4-frame">
            <img
              src={data.writerProfileImageUrl || user1} // 사용자 프로필 이미지, 순환 사용
              alt="사용자 프로필 이미지"
              className="frame4-profileimage"
            />
            <span className="frame4-text08 text-ellipsis1">
              <span>{data.title}</span>
            </span>
            <img
              src={(data.postId === activeId) ? full_dailyPin : dailyPin}
              alt="포스트 타입, 핀 이미지"
              className="frame4-daily-pin-filled"
            />
            <span className="frame4-text04">
              <span>{data.writerNickname}</span>
            </span>
            <span className="frame4-text06 text-ellipsis2">
              <span>{data.bodyPreview}</span>
            </span>
            <span className="frame4-text02-daily">
              {new Date(data.expiredAt) > new Date(currentTime) ? (
                <span>{formatPeriod(currentTime, data.expiredAt)} 남았습니다.</span>
              ) : (
                <span>{formatDate2(data.createdAt, data.expiredAt)}</span>
              )}
            </span>

            <div className="frame4-frame1">
              <img src={like} alt="좋아요" className="frame4-svg" />
              <span className="frame4-text">
                <span>{data.likesCount || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default DailyList;
