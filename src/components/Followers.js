import React, { useEffect, useState } from "react";
import Follower from "./Follower";
import "../assets/style/follower.css";

function Followers() {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/followers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error!");
        }
        return response.json();
      })
      .then((data) => setFollowers(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

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
