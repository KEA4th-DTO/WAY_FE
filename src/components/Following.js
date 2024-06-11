import React, { useState } from "react";
import "../assets/style/_follower.scss";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Following({ name, nickName, image, isFollow, onFollowChange, onClick }) {
  
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(isFollow);

  const handleFollowClick = (event) => {
    event.stopPropagation();
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
          console.error(`Follow ${name} failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const handleMapClick = (event) => {
    event.stopPropagation();
    navigate('/othersmap', { state: nickName });
  };

  return (
    <div className="follower-container" onClick={() => onClick(nickName)}>
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
        <button className="btn-visit" onClick={handleMapClick}>지도 방문</button>
      </div>
    </div>
  );
}

export default Following;
