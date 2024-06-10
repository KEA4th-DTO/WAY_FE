import React, { useEffect, useState } from "react";
import axios from "axios";
import Follower from "./Following";
import "../assets/style/_follower.scss";
import { useNavigate } from "react-router-dom";

function Followings() {
  const [followings, setFollowings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const nickName = localStorage.getItem("userNickname");
    const url = `${Server_IP}/member-service/follow/${nickName}/following-list`;

    const fetchFollowings = async () => {
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
            const followingsData = data.result.map((following) => ({
              id: following.memberInfoResponseDTO.memberId,
              name: following.memberInfoResponseDTO.name,
              nickname: following.memberInfoResponseDTO.nickname,
              image: following.memberInfoResponseDTO.profileImageUrl,
              isFollow: following.isFollowing,
              history: following.memberInfoResponseDTO.historyCount,
              daily: following.memberInfoResponseDTO.dailyCount,
            }));
            setFollowings(followingsData); // result 배열을 상태에 저장
            // console.log(followingsData);
          } else {
            // console.log(response.status);
            throw new Error("Unexpected response structure");
          }
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        // console.error("Error fetching followers:", error);
      }
    };

    fetchFollowings();
  }, []);

  const handleFollowingClick = (nickName) => {
    navigate(`/profile/${nickName}`);
  };

  return (
    <div className="post-title">
      <p className="follower-label">팔로잉 목록</p>
      <div className="post-list">
        {followings.map((following) => (
          <Follower
            key={following.id}
            name={following.name}
            nickName={following.nickname}
            image={following.image}
            isFollow={following.isFollow}
            onClick={handleFollowingClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Followings;
