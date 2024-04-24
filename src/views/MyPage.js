import React, { useState } from "react";
import profileImg from "../assets/img/profile_img.jpeg";
import "../assets/style/myPage.css";
// import Posts from "../components/PostsList";
import Followers from "../components/Followers";
import Followings from "../components/Followings";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");

  // 가상 데이터
  const profile = {
    imageUrl: profileImg,
    name: "신짱구",
    nickName: "Crayon",
    bio: "빙글빙글 돌아가는 하루",
    postsCount: 120,
    followersCount: 80,
    followingsCount: 72,
  };

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
              width: "300px",
              height: "300px",
              borderRadius: "13px",
              top: "15",
              left: "15%",
            }}
          />
          <h1 className="userName">{profile.name}</h1>
          <p className="nickName">{profile.nickName}</p>
          <p className="bio">{profile.bio}</p>
          <div className="btn-container">
            <button
              className="btn-post"
              onClick={() => handleTabClick("posts")}
            >
              <span className="tab-count">{profile.postsCount}</span>
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
