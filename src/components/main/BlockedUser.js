import React from "react";

import "../assets/style/block.css";
function Block({ name, nickName, history, daily, image, isBlock }) {
  const handleUnblockClick = () => {
    console.log(`Current follow state for ${name}: ${isBlock}`); // 현재 팔로우 상태 로그 출력
  };

  return (
    <div className="block-container">
      <img src={image} alt={name} className="blocked-image" />
      <div className="block-info">
        <h3 className="block-name">{name}</h3>
        <p className="block-nickname">{nickName}</p>
      </div>
      <div className="block-stats">
        <div>
          <span className="post-type">History</span>
          <span className="post-count">{history}</span>
        </div>
        <div>
          <span className="post-type">Daily</span>
          <span className="post-count">{daily}</span>
        </div>
      </div>
      <div className="block-actions">
        <button className="btn-unblock" onClick={handleUnblockClick}>
          차단해제
        </button>
        <button className="btn-visit">지도 방문</button>
      </div>
    </div>
  );
}
export default Block;
