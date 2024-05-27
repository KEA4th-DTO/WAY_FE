import React, { useEffect, useState } from "react";
import axios from "axios";
import Follower from "./Follower";
import "../assets/style/follower.css";

function Followers() {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const Server_IP = process.env.REACT_APP_Server_IP;
    const nickName = localStorage.getItem("userNickname");
    const url = `${Server_IP}/member-service/follow/${nickName}/follower-list`;
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
            setFollowers(data.result); // result 배열을 상태에 저장
          } else {
            console.log(response.status);
            throw new Error("Unexpected response structure");
          }
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  });

  return (
    <div className="post-title">
      <p className="follower-label">팔로워 목록</p>
      <div className="post-list">
        {followers.map((follower) => (
          <Follower
            key={follower.id}
            name={follower.name}
            history={follower.history}
            daily={follower.daily}
            nickName={follower.nickname}
            image={follower.image}
            isFollow={follower.isFollow}
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
