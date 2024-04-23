import React, { useEffect, useState } from "react";
import "../../assets/scss/layout/_localmap.scss";

import sky from "../../assets/images/bg/sky.png";
import like from "../../assets/images/logos/like.png";
import dailyPin from "../../assets/images/icons/dailyPin.png";
import full_dailyPin from "../../assets/images/icons/full_dailyPin.png";

import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

import { formatDate, formatPeriod } from "../../utils/changeFormat";

const DailyList = ({ data }) => {
  if (!data) {
    return null; // Return null or any fallback content if there are no posts
  }
  return (
    <div
      className="frame4-container"
      style={{ overflowY: "auto", maxHeight: "80vh" }}
    >
      <button className="frame4-frame4">
        <div className="frame4-post1full">
          <img
            src={data.image || sky} // 게시글 이미지가 없을 때 기본 이미지 사용
            alt="게시글 이미지"
            className="frame4-image"
          />
          <div className="frame4-frame">
            <img
              src={data.useImage || user1} // 사용자 프로필 이미지, 순환 사용
              alt="사용자 프로필 이미지"
              className="frame4-profileimage"
            />
            <span className="frame4-text08 text-ellipsis1">
              <span>{data.title}</span>
            </span>
            <img
              src={dailyPin}
              alt="포스트 타입, 핀 이미지"
              className="frame4-daily-pin-filled"
            />
            <span className="frame4-text04">
              <span>{data.memberId}</span>
            </span>
            <span className="frame4-text06 text-ellipsis2">
              <span>{data.body}</span>
            </span>
            <span className="frame4-text02">
              <span>{formatPeriod(data.period)}</span>
            </span>
            <div className="frame4-frame1">
              <img src={like} alt="좋아요" className="frame4-svg" />
              <span className="frame4-text">
                <span>{data.likeNum}</span>
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default DailyList;
