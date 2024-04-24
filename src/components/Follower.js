// Follower.js
import React from "react";
import "../assets/style/follower.css";
import user4 from "../assets/images/users/user4.jpg";

function Follower({ name, nickName, history, daily, image, isFollow }) {
  const handleFollowClick = () => {
    console.log(`Current follow state for ${name}: ${isFollow}`); // 현재 팔로우 상태 로그 출력
  };
  return (
    <div className="follower-container">
      <img src={user4} alt={name} className="follower-image" />
      <div className="follower-info">
        <h3 className="follower-name">{name}</h3>
        <p className="follower-nickname">{nickName}</p>
      </div>
      <div className="follower-stats">
        <div>
          <span className="post-type">History</span>
          <span className="post-count">{history}</span>
        </div>
        <div>
          <span className="post-type">Daily</span>
          <span className="post-count">{daily}</span>
        </div>
      </div>
      <div className="follower-actions">
        <button
          className={isFollow ? "btn-unfollow" : "btn-follow"}
          onClick={handleFollowClick}
        >
          {isFollow ? "언팔로우" : "팔로우"}
        </button>
        <button className="btn-visit">지도 방문</button>
      </div>
    </div>
  );
}
export default Follower;
