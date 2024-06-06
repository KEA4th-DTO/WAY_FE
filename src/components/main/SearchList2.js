import React, { useState, useEffect } from 'react';
import "../../assets/scss/layout/_search.scss";
import { formatDate_time } from '../../utils/changeFormat';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SearchList2 = ({ data }) => { 
  const navigate = useNavigate();
  const [isFollow, setIsFollow] = useState(false);

  if (!data) return null;
  const nickName = data.nickname;

  // console.log(initialFollowState);

  const handleFollowClick = () => {
    const token = localStorage.getItem("accessToken");
    const Server_IP = process.env.REACT_APP_Server_IP;
    const url = isFollow
      ? `${Server_IP}/member-service/follow/follower-list/${nickName}`
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
          // console.error(`Follow ${name} failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };


  const handleMapClick = () => {
    navigate('/othersmap', { state: nickName });
  };

  return (
    <div className="searchlist2-container">
      <img src={data.profileImageUrl} className="searchlist2-image" />
      <div className="searchlist2-info">
        <h3 className="searchlist2-name">{data.nickname}</h3>
        <p className="searchlist2-nickname">{data.introduce}</p>
      </div>
      <div className="searchlist2-actions">
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
export default SearchList2;