import React, { useEffect, useState } from "react";
import axios from "axios";
import Following from "./Following";
import "../assets/style/following.css";

function Followings({ nickname }) {
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    const fetchFollowings = async () => {
      const token = localStorage.getItem("accessToken");
      const Server_IP = process.env.REACT_APP_Server_IP;
      const url = `${Server_IP}/member-service/follow/${nickname}/following-list`;

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
      <p className="follower-label">팔로잉 목록</p>
      <div className="post-list">
        {followings.map((following) => (
          <Following
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
