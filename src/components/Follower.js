// Follower.js
import React, { useState } from "react";
import "../assets/style/follower.css";
import axios from "axios";
function Follower({
  name,
  nickName,
  history,
  daily,
  profileImageUrl,
  initialFollowState,
}) {
  const [isFollow, setIsFollow] = useState(initialFollowState);
  const handleFollowClick = () => {
    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;
    console.log(`Current follow state for ${name}: ${isFollow}`); // 현재 팔로우 상태 로그 출력

    const url = !isFollow
      ? `${Server_IP}/member-service/follow/${nickName}`
      : `${Server_IP}/member-service/follow/follower-list/${nickName}`;

    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setIsFollow(!isFollow);
        } else {
          console.error(`Follow ${name} failed: ${response.status}`);
        }
      });
  };
  return (
    <div className="follower-container">
      <img src={profileImageUrl} alt={name} className="follower-image" />
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
