import React, { useState } from "react";
import "../assets/style/_follower.scss";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Follower({ name, nickName, image, initialFollowState, onClick }) {
  const navigate = useNavigate();
  const [isFollow, setIsFollow] = useState(initialFollowState);

  const handleFollowClick = (e) => {
    e.stopPropagation();
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

    axios({
      method: isFollow ? "DELETE" : "POST",
      url: url,
      ...config,
    })
      .then((response) => {
        if (response.status === 200) {
          setIsFollow(!isFollow);
        }
      })
      .catch((error) => {
        console.error(`Error ${isFollow ? "unfollowing" : "following"}: ${error}`);
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
        <p className="follower-nickname">@{nickName}</p>
      </div>
      <div className="follower-actions">
        <button
          className={isFollow ? "btn-unfollow" : "btn-follow"}
          onClick={handleFollowClick}
        >
          {isFollow ? "언팔로우" : "팔로우"}
        </button>
        <button className="btn-visit" onClick={handleMapClick}>지도 방문</button>
      </div>
    </div>
  );
}

export default Follower;
