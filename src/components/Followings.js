import React, { useEffect, useState } from "react";
import axios from "axios";
import Follower from "./Follower";
import "../assets/style/follower.css";

function Followings({ nickname }) {
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    const fetchFollowings = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `http://61.109.239.63:50001/member-service/follow/${nickname}/following-list`,
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
            setFollowings(data.result); // result 배열을 상태에 저장
          } else {
            console.log(response.status);
            throw new Error("Unexpected response structure");
          }
        } else {
          console.log(response.status);
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    };
    fetchFollowings();
  }, [nickname]);

  return (
    <div className="post-title">
      <p className="following-label">팔로잉 목록</p>
      <div className="post-list">
        {followings.map((following) => (
          <Follower
            key={following.id}
            name={following.name}
            history={following.history}
            daily={following.daily}
            nickName={following.nickName}
            image={following.image}
            isFollow={following.isFollow}
          />
        ))}
      </div>
    </div>
  );
}

export default Followings;
