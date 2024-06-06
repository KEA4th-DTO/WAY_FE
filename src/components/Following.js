import React, { useState, useEffect } from "react";
import "../assets/style/_follower.scss";
import axios from "axios";

function Following({ name, nickName, image, isFollow, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(isFollow);

  // 아래 useEffect는 디버깅을 위해 추가했습니다. 초깃값 설정 확인을 위해 추가하였습니다.
  useEffect(() => {
    // console.log(`Initial isFollowing state for ${nickName}:`, isFollowing);
  }, [isFollowing, nickName]);

  const handleFollowClick = () => {
    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;
    const url = isFollowing
      ? `${Server_IP}/member-service/follow/following-list/${nickName}`
      : `${Server_IP}/member-service/follow/${nickName}`;

    axios({
      method: isFollowing ? "DELETE" : "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setIsFollowing(!isFollowing);
          onFollowChange("followings", !isFollowing);
        } else {
          // console.error(`Follow ${name} failed: ${response.status}`);
        }
      })
      .catch((error) => {
        // console.error(`Error: ${error}`);
      });
  };

  return (
    <div className="follower-container">
      <img src={image} alt={name} className="follower-image" />
      <div className="follower-info">
        <h3 className="follower-name">{name}</h3>
        <p className="follower-nickname">{nickName}</p>
      </div>
      <div className="follower-actions">
        <button
          className={isFollowing ? "btn-unfollow" : "btn-follow"}
          onClick={handleFollowClick}
        >
          {isFollowing ? "언팔로우" : "팔로우"}
        </button>
        <button className="btn-visit">지도 방문</button>
      </div>
    </div>
  );
}

export default Following;
