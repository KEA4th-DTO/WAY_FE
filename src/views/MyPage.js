import React, { useState, useEffect } from "react";
import profileImg from "../assets/img/profile_img.jpeg";
import "../assets/style/myPage.css";
// import Posts from "../components/PostsList";
import Followers from "../components/Followers";
import Followings from "../components/Followings";
import axios from "axios";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    imageUrl: "",
    name: "",
    nickName: "",
    bio: "",
    postsCount: 0,
    followersCount: 0,
    followingsCount: 0,
  });

  useEffect(() => {
    const fetchProfille = async () => {
      const Server_IP = process.env.REACT_APP_Server_IP;
      try {
        const response = await axios.get(
          `${Server_IP}/member-service/profile/${localStorage.getItem(
            "userNickname"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = response.data.result;
        setProfile({
          imageUrl: data.imageUrl,
          name: data.name,
          nickName: data.nickName,
          bio: data.introduce,
          dailyCount: data.dailyCount,
          historyCount: data.historyCount,
          followersCount: data.followerCount,
          followingsCount: data.followingCount,
        });
        console.log(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfille();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const Posts = () => <div>게시글 목록</div>;

  return (
    <div className="mypage-container">
      {/* left panel */}
      <div className="myPage-leftpanel">
        <div className="profile-background">
          <img
            src={profile.imageUrl}
            alt="프로필 사진"
            className="profile-img"
            style={{
              width: "70%",
              height: "auto",
              borderRadius: "13px",
              top: "15",
              left: "15%",
            }}
          />
          <h1 className="userName">{localStorage.getItem("userName")}</h1>
          <p className="nickName">{localStorage.getItem("userNickname")}</p>
          <p className="bio">{profile.bio}</p>
          <div className="btn-container">
            <button
              className="btn-post"
              onClick={() => handleTabClick("posts")}
            >
              <span className="tab-count">
                {profile.dailyCount + profile.historyCount}
              </span>
              <span className="tab-label">게시글</span>
            </button>
            <button
              className="btn-followers"
              onClick={() => handleTabClick("followers")}
            >
              <span className="tab-count">{profile.followersCount}</span>
              <span className="tab-label">팔로워</span>
            </button>
            <button
              className="btn-followings"
              onClick={() => handleTabClick("followings")}
            >
              <span className="tab-count">{profile.followingsCount}</span>
              <span className="tab-label">팔로잉</span>
            </button>
          </div>
        </div>
      </div>
      {/* right panel */}
      <div className="myPage-rightpanel">
        {/* {activeTab === "posts" && <Posts />} */}
        {activeTab === "followers" && <Followers />}
        {activeTab === "followings" && <Followings />}
      </div>
    </div>
  );
}

export default ProfilePage;
