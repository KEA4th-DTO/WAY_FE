import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_localmap.scss";

import bg1 from "../../assets/images/bg/bg1.jpg";
import like from "../../assets/images/logos/like.png";
import comment from "../../assets/images/logos/comment.png";
import historyPin from "../../assets/images/icons/historyPin.png";
import full_historyPin from "../../assets/images/icons/full_historyPin.png";
import basic_profile from "../../assets/images/users/basic_profile.png";

import { formatDate, formatPeriod } from "../../utils/changeFormat";

const HistoryList = ({ data, isActive }) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => { 
    if (isActive && isActive.item) {
      console.log('isActive: ', isActive);
      setActiveId(isActive.item.postId);
    }
  }, [isActive]);

  // If there is no data, return null to avoid rendering the component
  if (!data) {
    return null; // Return null or any fallback content if there are no posts
  }

  return (
    <div
      id="historyList"
      className="frame4-container"
      style={{ overflowY: "auto", maxHeight: "80vh" }}
    >
      <button className={data.postId === activeId ? "frame4-frame4-active" :"frame4-frame4"}>
        <div className="frame4-post1full">
          <img
            src={data.imageUrl || bg1} // 게시글 이미지가 없을 때 기본 이미지 사용
            alt="게시글 이미지"
            className="frame4-image"
          />
          <div className="frame4-frame">
            <img
              src={data.writerProfileImageUrl || basic_profile} // 사용자 프로필 이미지, 순환 사용
              alt="사용자 프로필 이미지"
              className="frame4-profileimage"
            />
            <span className="frame4-text08 text-ellipsis1">
              <span>{data.title}</span>
            </span>
            <img
              src={data.postId === activeId ? full_historyPin : historyPin}
              alt="포스트 타입, 핀 이미지"
              className="frame4-daily-pin-filled"
            />
            <span className="frame4-text04">
              <span>{data.writerNickname}</span>
            </span>
            <span className="frame4-text06 text-ellipsis2">
              <span>{data.bodyPreview}</span>
            </span>
            <span className="frame4-text02">
              <span>{formatDate(data.createdAt)}</span>
            </span>
            <div className="frame4-frame1">
              <img src={like} alt="좋아요" className="frame4-svg" />
              <span className="frame4-text">
                <span>{data.likesCount || 0}</span>
              </span>
            </div>
            <div className="frame4-frame2">
              <img src={comment} alt="댓글" className="frame4-svg" />
              <span className="frame4-text">
                <span>{data.commentsCount || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default HistoryList;
