import React, { useEffect, useState } from "react";
import axios from "axios";
import Follower from "./Follower";
import "../assets/style/follower.css";

function Followers({ nickName }) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `http://61.109.239.63:50001/member-service/follow/${nickName}/follower-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

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
  }, [nickName]);

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
            nickName={follower.nickName}
            image={follower.image}
            isFollow={follower.isFollow}
          />
        ))}
      </div>
    </div>
  );
}

export default Followers;
