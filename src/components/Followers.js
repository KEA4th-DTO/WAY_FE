import React, { useEffect, useState } from "react";
import axios from "axios";
import Follower from "./Follower";
import "../assets/style/_follower.scss";
import { useNavigate } from "react-router-dom";

function Followers({ nickname }) {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!nickname) return;

    const Server_IP = process.env.REACT_APP_Server_IP;
    const url = `${Server_IP}/member-service/follow/${nickname}/follower-list`;

    const fetchFollowers = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          const data = response.data;
          if (data.isSuccess && Array.isArray(data.result)) {
            const followersData = data.result.map((follower) => ({
              id: follower.memberInfoResponseDTO.memberId,
              name: follower.memberInfoResponseDTO.name,
              nickname: follower.memberInfoResponseDTO.nickname,
              image: follower.memberInfoResponseDTO.profileImageUrl,
              isFollow: follower.isFollowing,
              history: follower.memberInfoResponseDTO.historyCount,
              daily: follower.memberInfoResponseDTO.dailyCount,
            }));
            setFollowers(followersData);
          } else {
            throw new Error("Unexpected response structure");
          }
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error fetching followers: ${error}`);
      }
    };

    fetchFollowers();
  }, [nickname]);

  const handleFollowerClick = (nickName) => {
    navigate(`/profile/${nickName}`);
  };

  return (
    <div className="post-title">
      <p className="follower-label">팔로워 목록</p>
      <div className="post-list">
        {followers.map((follower) => (
          <Follower
            key={follower.id}
            name={follower.name}
            nickName={follower.nickname}
            image={follower.image}
            initialFollowState={follower.isFollow}
            onClick={handleFollowerClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
