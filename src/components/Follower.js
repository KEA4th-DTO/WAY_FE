import React, { useState } from "react";
import "../assets/style/_follower.scss";
import axios from "axios";

function Follower({ name, nickName, image, initialFollowState }) {
  const [isFollow, setIsFollow] = useState(initialFollowState);
  console.log(initialFollowState);
  const handleFollowClick = () => {
    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;
    const url = isFollow
      ? `${Server_IP}/member-service/follow/following-list/${nickName}`
      : `${Server_IP}/member-service/follow/${nickName}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const request = axios({
      method: isFollow ? "DELETE" : "POST",
      url: url,
      ...config,
    });

    request
      .then((response) => {
        if (response.status === 200) {
          setIsFollow(!isFollow);
        } else {
          console.error(`Follow ${name} failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
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
