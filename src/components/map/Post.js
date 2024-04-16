import React from 'react';
import sky from "../../assets/images/post/sky.png";

const Post = () => {
  return (
    <div>
      <img
        src={sky}
        alt="게시글 이미지"
        className="initial-main-page-image"
      />
      <div className="initial-main-page-image1" />
      <imgs
        src="/external/image1573-q9y1-200h.png"
        alt="IMAGE1573"
        className="initial-main-page-image1"
      />ß
      <div className="initial-main-page-daily-pin-filled"></div>
      <div className="initial-main-page-frame01">
        <span className="initial-main-page-text02">
          <span>놀러갔다옴</span>
        </span>
        <span className="initial-main-page-text04">
          <span>2024년 3월 20일</span>
        </span>
      </div>
      <span className="initial-main-page-text06">
        <span>id_123456</span>
      </span>
    </div>
  );
};

export default Post;